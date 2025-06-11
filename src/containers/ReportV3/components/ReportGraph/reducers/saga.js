/*
 * Copyright (C) 2025 Isima, Inc.
 *
 * # PolyForm Free Trial License 1.0.0
 *
 * <https://polyformproject.org/licenses/free-trial/1.0.0>
 *
 * ## Acceptance
 *
 * In order to get any license under these terms, you must agree
 * to them as both strict obligations and conditions to all
 * your licenses.
 *
 * ## Copyright License
 *
 * The licensor grants you a copyright license for the software
 * to do everything you might do with the software that would
 * otherwise infringe the licensor's copyright in it for any
 * permitted purpose.  However, you may only make changes or
 * new works based on the software according to [Changes and New
 * Works License](#changes-and-new-works-license), and you may
 * not distribute copies of the software.
 *
 * ## Changes and New Works License
 *
 * The licensor grants you an additional copyright license to
 * make changes and new works based on the software for any
 * permitted purpose.
 *
 * ## Patent License
 *
 * The licensor grants you a patent license for the software that
 * covers patent claims the licensor can license, or becomes able
 * to license, that you would infringe by using the software.
 *
 * ## Fair Use
 *
 * You may have "fair use" rights for the software under the
 * law. These terms do not limit them.
 *
 * ## Free Trial
 *
 * Use to evaluate whether the software suits a particular
 * application for less than 32 consecutive calendar days, on
 * behalf of you or your company, is use for a permitted purpose.
 *
 * ## No Other Rights
 *
 * These terms do not allow you to sublicense or transfer any of
 * your licenses to anyone else, or prevent the licensor from
 * granting licenses to anyone else.  These terms do not imply
 * any other licenses.
 *
 * ## Patent Defense
 *
 * If you make any written claim that the software infringes or
 * contributes to infringement of any patent, your patent license
 * for the software granted under these terms ends immediately. If
 * your company makes such a claim, your patent license ends
 * immediately for work on behalf of your company.
 *
 * ## Violations
 *
 * If you violate any of these terms, or do anything with the
 * software not covered by your licenses, all your licenses
 * end immediately.
 *
 * ## No Liability
 *
 * ***As far as the law allows, the software comes as is, without
 * any warranty or condition, and the licensor will not be liable
 * to you for any damages arising out of these terms or the use
 * or nature of the software, under any kind of legal claim.***
 *
 * ## Definitions
 *
 * The **licensor** is the individual or entity offering these
 * terms, and the **software** is the software the licensor makes
 * available under these terms.
 *
 * **You** refers to the individual or entity agreeing to these
 * terms.
 *
 * **Your company** is any legal entity, sole proprietorship,
 * or other kind of organization that you work for, plus all
 * organizations that have control over, are under the control of,
 * or are under common control with that organization.  **Control**
 * means ownership of substantially all the assets of an entity,
 * or the power to direct its management and policies by vote,
 * contract, or otherwise.  Control can be direct or indirect.
 *
 * **Your licenses** are all the licenses granted to you for the
 * software under these terms.
 *
 * **Use** means anything you do with the software requiring one
 * of your licenses.
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import bios from '@bios/bios-sdk';

import {
  checkGraphType,
  createWhereClauseWithFilters,
  handleFetchReportDataError,
} from 'containers/ReportV2/components/ReportGraph/utils';
import { mergeGrpByStatementData } from 'containers/ReportV2/components/ReportGraph/utils/mergeStatements';
import { buildAttributeTypeMapping } from 'containers/ReportV2/components/ReportGraph/utils/whereClause';
import { getSelectedMetricsMapping } from '../utils';
import { FETCH_REPORT_GRAPH_DATA } from './actionTypes';
import {
  buildQueryGroupByX,
  buildQueryGroupByXY,
  getDataGroupByY,
  getDataNoGroupBy,
} from './buildQuery';
import { reportGraphActions } from './index';
import { cloneDeep } from 'lodash';
import { getLatestTimeSegmentBoundary } from 'containers/ReportV2/utils';
import { getGraphDataNoGroupBy } from '../dataProc';
import {
  DURATION_1_DAY,
  DURATION_7_DAY,
} from '../../AdvanceSettings/Duration/TimeDuration/const';
import graphMapQuery from './buildQuery/graphMapQuery';

const HIGHCHART_DATA_URL = 'https://code.highcharts.com/mapdata/countries';

const forecastReportDuration = (duration) => {
  let newDuration = DURATION_7_DAY * 2;
  if (duration <= 3600000) {
    newDuration = DURATION_1_DAY;
  } else if (duration <= 86400000) {
    newDuration = DURATION_7_DAY;
  }

  return newDuration;
};

export function* fetchReportGraphDataSaga(action) {
  const requestParams = action.payload;
  const {
    selectedSignals,
    selectedMetrics,
    groupByX,
    groupByY,
    durationStart,
    durationType,
    duration,
    onTheFly,

    cyclicalComparisonOn,
    cyclicalComparisonStart,
    cyclicalComparisonDisabled,
    selectedFilters,
    forecast,
    windowSize,
    mapChartLevel,
    map,
    reportIndex,
  } = requestParams;

  const { calledFrom = 'report' } = requestParams;
  try {
    const signalMetricsMapping = getSelectedMetricsMapping(
      selectedMetrics,
      selectedSignals,
    );
    if (Object.keys(signalMetricsMapping).length === 0) {
      return;
    }

    let attributeTypeMapping = {};
    for (const signal of selectedSignals) {
      attributeTypeMapping = Object.assign(
        attributeTypeMapping,
        buildAttributeTypeMapping(signal),
      );
    }
    const filterWhereClause = createWhereClauseWithFilters(
      selectedFilters,
      {},
      attributeTypeMapping,
    );

    let statementData = [];
    let statements = [];
    let signalDataOrder = [];
    let resultData = [];
    let queryStartTime = durationStart;
    let topologyMapChartLevel2 = null;
    const isMapChart = checkGraphType({ selectedMetrics, graphType: 'map' });
    if (isMapChart) {
      let selectedFiltersTemp = cloneDeep(selectedFilters);
      const { mapChartCountry } = map;
      if (mapChartCountry !== '') {
        if (selectedFiltersTemp.hasOwnProperty('countryIsoCode')) {
          selectedFiltersTemp['countryIsoCode'].push(
            mapChartCountry.toUpperCase(),
          );
        } else {
          selectedFiltersTemp['countryIsoCode'] = [
            mapChartCountry.toUpperCase(),
          ];
        }

        const response = yield call(
          fetch,
          `${HIGHCHART_DATA_URL}/${mapChartCountry}/${mapChartCountry}-all.js`,
        );
        let topo = yield call([response, 'text']);
        topo = topo?.split(' = ')?.[1];
        if (topo && topo.endsWith(';')) {
          topo = topo.substring(0, topo.length - 1);
        }
        if (topo) {
          topologyMapChartLevel2 = JSON.parse(topo);
        }
      }

      const filterWhereClause = createWhereClauseWithFilters(
        selectedFiltersTemp,
        {},
        attributeTypeMapping,
      );

      ({ signalDataOrder, statements, queryStartTime } = yield* graphMapQuery({
        ...requestParams,
        signalMetricsMapping,
        filterWhereClause,
        level: mapChartLevel,
      }));
      if (statements?.length > 0) {
        statementData = yield bios.multiExecute(...statements);
      }
    } else if (groupByX === '' && groupByY === '') {
      ({ signalDataOrder, statementData, queryStartTime } =
        yield getDataNoGroupBy({
          ...requestParams,
          signalMetricsMapping,
          filterWhereClause,
        }));
    } else if (groupByX !== '' && groupByY === '') {
      ({ signalDataOrder, statements, resultData, queryStartTime } =
        yield* buildQueryGroupByX({
          ...requestParams,
          signalMetricsMapping,
          filterWhereClause,
        }));
      if (cyclicalComparisonOn) {
        statementData.push(...resultData);
        let queryResult = [];
        if (statements?.length > 0) {
          queryResult = yield bios.multiExecute(...statements);
        }
        statementData.push(...queryResult);
      } else {
        if (statements?.length > 0) {
          statementData = yield bios.multiExecute(...statements);
        }
      }

      if (onTheFly) {
        statementData = mergeGrpByStatementData(statementData);
      }
    } else if (groupByX === '' && groupByY !== '') {
      ({ signalDataOrder, statementData, queryStartTime } =
        yield* getDataGroupByY({
          ...requestParams,
          signalMetricsMapping,
          filterWhereClause,
        }));
    } else if (groupByX !== '' && groupByY !== '') {
      ({ signalDataOrder, statements, queryStartTime } =
        yield* buildQueryGroupByXY({
          ...requestParams,
          signalMetricsMapping,
          filterWhereClause,
        }));
      if (statements?.length > 0) {
        statementData = yield bios.multiExecute(...statements);
      }
      if (onTheFly) {
        statementData = mergeGrpByStatementData(statementData);
      }
    }

    let cyclicalData = null;
    if (
      cyclicalComparisonOn &&
      !cyclicalComparisonDisabled &&
      cyclicalComparisonStart
    ) {
      const isMultipleOf = (num, multipleOfNum) => {
        if (num === 0) return true;

        if (num < 0) return false;

        return isMultipleOf(num - multipleOfNum, multipleOfNum);
      };

      if (groupByX !== '' && groupByY !== '' && statementData.length === 4) {
        cyclicalData = statementData.slice(2, 4);
        statementData = statementData.slice(0, 2);
      } else {
        cyclicalData = statementData.filter((item, index) => {
          let divisor = groupByY !== '' ? 3 : 2;
          return isMultipleOf(index + 1, divisor);
        });
        statementData = statementData.filter((item, index) => {
          let divisor = groupByY !== '' ? 3 : 2;
          return !isMultipleOf(index + 1, divisor);
        });
      }
    }
    let forecastDataset;
    if (calledFrom === 'report' || calledFrom === 'insights-overview-chart') {
      if (
        selectedMetrics?.length === 1 &&
        selectedMetrics?.[0]?.defaultGraphType === 'line' &&
        groupByX === '' &&
        groupByY === '' &&
        durationType === 'fixed' &&
        forecast
      ) {
        const act = cloneDeep(action);
        const newDuration = forecastReportDuration(duration);
        const newDurationStart = getLatestTimeSegmentBoundary() - newDuration;
        const cyclicalComparisonOn = false;
        const onTheFly = false;
        const forecast = false;
        act.payload.forecast = forecast;
        act.payload.cyclicalComparisonOn = cyclicalComparisonOn;
        act.payload.durationStart = newDurationStart;
        act.payload.duration = newDuration;
        act.payload.onTheFly = onTheFly;
        act.payload.calledFrom = 'past14Day';
        const forecastData = yield fetchReportGraphDataSaga(act);
        let smTemp = cloneDeep(selectedMetrics);
        smTemp[0].showPercentage = false;
        const forecastResp = getGraphDataNoGroupBy({
          signalDataOrder,
          selectedMetrics: smTemp,
          graphData: forecastData.statementData,
          cyclicalData: null,
          durationStart: newDurationStart,
          duration: newDuration,
          windowSize,
          cyclicalComparisonStart,
          selectedSignals,
          endTimestamp:
            forecastData.statementData?.[0]?.dataWindows[
              forecastData.statementData?.[0]?.dataWindows?.length - 1
            ]?.['windowBeginTime'],
          onTheFly,
          forecast,
        });
        forecastDataset = forecastResp?.series?.[0]?.data?.reduce(
          (acc, item) => {
            if (item[0] && item[1]) {
              acc.push(item);
            }
            return acc;
          },
          [],
        );
      }
      if (calledFrom === 'report') {
        yield put(
          reportGraphActions.setReportGraphData({
            graphData: statementData,
            signalDataOrder,
            cyclicalData,
            queryStartTime,
            endTimestamp: onTheFly,
            forecastDataset,
            topologyMapChartLevel2,
            reportIndex,
          }),
        );
      }
    }

    if (calledFrom !== 'report') {
      return {
        statementData,
        signalDataOrder,
        queryStartTime,
        cyclicalData,
        forecastDataset,
        topologyMapChartLevel2,
      };
    }
  } catch (error) {
    if (calledFrom !== 'report') {
      return {
        statementData: [],
        signalDataOrder: [],
        cyclicalData: null,
        queryStartTime: durationStart,
      };
    }
    let graphDataError = handleFetchReportDataError(error);
    yield put(
      reportGraphActions.setReportGraphData({
        graphData: [],
        signalDataOrder: [],
        cyclicalData: null,
        graphDataError,
        queryStartTime: durationStart,
        reportIndex,
      }),
    );
  }
}

function* actionWatcher() {
  yield takeEvery(FETCH_REPORT_GRAPH_DATA, fetchReportGraphDataSaga);
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
