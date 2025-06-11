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
import bios from '@bios/bios-sdk';
import moment from 'moment-timezone';
import { all, fork, put, takeLatest } from 'redux-saga/effects';

import { reportGraphActions } from 'containers/ReportV2/components/ReportGraph/reducers';
import {
  buildQueryGroupByX,
  getDataNoGroupBy,
} from 'containers/ReportV2/components/ReportGraph/reducers/buildQuery';
import {
  getSelectedMetricsMapping,
  handleFetchReportDataError,
} from 'containers/ReportV2/components/ReportGraph/utils';
import {
  buildAttributeTypeMapping,
  createWhereClauseWithFilters,
} from 'containers/ReportV2/components/ReportGraph/utils/whereClause';
import { checkIfSpreadOrDC } from 'containers/ReportV2/utils';
import { handleAPIError } from 'containers/utils';
import { FETCH_REPORT_INSIGHTS } from './actionTypes';
import reportInsightsActions from './actions';

export function* fetchReportInsights(action) {
  let {
    selectedMetrics,
    selectedSignals,
    durationStart,
    duration,
    timezone,
    windowSize,
    groupByX,
    topX,
    calledFrom,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    selectedFilters,
    activeReportIndex,
  } = action.payload;

  // Choose one metric to show; default is the first one in the selectedMetrics array
  let filteredMetrics = selectedMetrics?.[0]
    ? { metrics: [selectedMetrics?.[0]] }
    : { metrics: [] };
  if (filteredMetrics?.metrics?.length === 0) {
    return {};
  }

  // Override if the metrics include median or distinct count
  const spreadOrDCMetric = selectedMetrics.find((sm) => {
    return checkIfSpreadOrDC(sm.measurement);
  });
  if (spreadOrDCMetric) {
    let metric = selectedMetrics.find(
      (sm) =>
        sm.measurement.includes('median') ||
        sm.measurement.includes('distinctcount'),
    );
    if (metric) {
      filteredMetrics.metrics = [metric];
    }
  }

  if (!cyclicalComparisonStart) {
    cyclicalComparisonStart = durationStart - duration;
    cyclicalComparisonCustom = true;
  }

  const signalMetricsMapping = getSelectedMetricsMapping(
    filteredMetrics?.metrics,
    selectedSignals,
  );

  if (Object.keys(signalMetricsMapping).length === 0) {
    return;
  }

  filteredMetrics = filteredMetrics?.metrics?.[0];

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

  for (const signal in signalMetricsMapping) {
    if (!signalMetricsMapping[signal].includes('count()')) {
      signalMetricsMapping[signal].push('count()');
    }
  }

  let signalDataOrder = [];
  let statements = [];
  let resultData = [];
  const queryObj = {};
  let queryData = [];
  let cyclicalData = [];
  let statementData = [];
  let queryStartTime = durationStart;

  try {
    if (groupByX === '') {
      ({ signalDataOrder, statementData, queryStartTime } =
        yield* getDataNoGroupBy({
          selectedSignals,
          duration,
          durationStart,
          windowSize,

          cyclicalComparisonOn: true,
          cyclicalComparisonDisabled: false,
          cyclicalComparisonCustom,
          cyclicalComparisonStart,

          signalMetricsMapping,
          filterWhereClause,
        }));
    } else {
      ({ signalDataOrder, statements, resultData, queryStartTime } =
        yield* buildQueryGroupByX({
          selectedSignals,
          signalMetricsMapping,
          groupByX,
          duration,
          durationStart,
          windowSize,
          filterWhereClause,
          topX,
          cyclicalComparisonStart,
          cyclicalComparisonCustom,
          cyclicalComparisonOn: true,
          cyclicalComparisonDisabled: false,
          selectedFilters,
        }));
      statementData.push(...resultData);
      let queryResult = [];
      if (statements?.length > 0) {
        queryResult = yield bios.multiExecute(...statements);
      }
      statementData.push(...queryResult);
      queryObj.topX = topX;
      queryObj.groupByX = groupByX;
    }

    const isMultipleOf = (num, multipleOfNum) => {
      if (num === 0) return true;
      if (num < 0) return false;
      return isMultipleOf(num - multipleOfNum, multipleOfNum);
    };

    queryData = statementData.filter((_, index) => {
      let divisor = 2;
      return !isMultipleOf(index + 1, divisor);
    });

    cyclicalData = statementData.filter((_, index) => {
      let divisor = 2;
      return isMultipleOf(index + 1, divisor);
    });

    queryObj.statements = statementData;
    queryObj.queryData = queryData;
    queryObj.cyclicalData = cyclicalData;
    queryObj.metric = filteredMetrics;
    queryObj.signalMetricsMapping = signalMetricsMapping;
    queryObj.selectedSignals = selectedSignals;
    queryObj.signalDataOrder = signalDataOrder;

    queryObj.duration = duration;
    queryObj.durationStart = queryStartTime ?? durationStart;
    queryObj.windowSize = windowSize;
    queryObj.cyclicalComparisonStart = cyclicalComparisonStart;
    queryObj.cyclicalComparisonCustom = cyclicalComparisonCustom;
    if (timezone === '') {
      queryObj.timezone = moment.tz.guess();
    } else {
      queryObj.timezone = timezone;
    }
    if (calledFrom === 'report') {
      yield put(
        reportInsightsActions.setReportInsights({
          [activeReportIndex]: queryObj,
        }),
      );
    }

    if (calledFrom === 'insights-overview-chart') {
      return queryObj;
    }
  } catch (error) {
    if (calledFrom === 'report') {
      yield put(reportInsightsActions.setReportInsights({}));
      const graphDataError = handleFetchReportDataError(error);
      yield put(
        reportGraphActions.setReportGraphData({
          graphData: [],
          signalDataOrder: [],
          cyclicalData: null,
          graphDataError,
        }),
      );
    } else {
      handleAPIError(error, 'Failed fetching data Sketches');
      if (calledFrom === 'insights-overview-chart') {
        return {};
      }
    }
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_REPORT_INSIGHTS, fetchReportInsights);
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
