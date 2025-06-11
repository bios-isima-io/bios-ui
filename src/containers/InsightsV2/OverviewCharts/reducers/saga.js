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
import moment from 'moment-timezone';
import {
  all,
  delay,
  fork,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import { alignOriginTime } from 'containers/InsightsV2/utils';
import {
  getDerivedMetricModifier,
  getSimpleMetricModifier,
} from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type/getMetricModifier';
import { getDimensionList } from 'containers/ReportV2/components/GroupBy/utils';
import {
  DEFAULT_GROUPBY_X_TOP_N,
  DEFAULT_GROUPBY_Y_TOP_N,
} from 'containers/ReportV2/components/ReportGraph/const';
import {
  getGraphDataNoGroupBy,
  getGroupByXAndYAxis,
  getGroupByXAxis,
  getGroupByYAxis,
} from 'containers/ReportV2/components/ReportGraph/dataProc';
import { fetchReportGraphDataSaga } from 'containers/ReportV2/components/ReportGraph/reducers/saga';
import { addDefaultGraphParam } from 'containers/ReportV2/components/ReportGraph/utils';
import { fetchReportInsights } from 'containers/ReportV2/components/ReportInsights/reducers/saga';
import {
  buildReportLoadMetrics,
  buildReportMap,
  getSignalsListFromMeasurement,
} from 'containers/ReportV2/utils';
import { handleAPIError } from 'containers/utils';

import {
  getFavReportsFromGridData,
  getFavReportsFromInsightsConfig,
} from '../utils';
import {
  FETCH_OVERVIEW_CHART_DATA,
  FETCH_OVERVIEW_CHART_REPORT,
} from './actionTypes';
import overViewChartActions from './actions';
import { getFunnelChartPlotData } from 'containers/ReportV2/components/ReportGraph/dataProc/groupByX/funnerChart';
import { getDonutXChartPlotData } from 'containers/ReportV2/components/ReportGraph/dataProc/groupByX/donutChart';
import { getDonutChartXYPlotData } from 'containers/ReportV2/components/ReportGraph/dataProc/groupByXY/donutChart';
import { getTreemapXChartPlotData } from 'containers/ReportV2/components/ReportGraph/dataProc/groupByX/treemapChart';
import { getTreemapXYChartPlotData } from 'containers/ReportV2/components/ReportGraph/dataProc/groupByXY/treemapChart';
import { checkGraphType } from 'containers/ReportV2/components/ReportGraph/utils';
import {
  getMapXChartPlotDataLevel1,
  getMapXChartPlotDataLevel2,
} from 'containers/ReportV2/components/ReportGraph/dataProc/groupByX/mapChart';

const respForOverviewChart = (resp, report) => {
  const [groupByX, groupByY] = report.dimensions;
  let response;
  if (groupByX !== '' && groupByY !== '') {
    response = getGroupByXAndYAxis({
      graphData: resp?.statementData,
      selectedMetrics: report.metrics,
      signalDataOrder: resp?.signalDataOrder,
      selectedSignals: resp?.selectedSignals,
      cyclicalComparisonStart: resp.cyclicalComparisonStart,
      cyclicalData: resp?.cyclicalData,
      duration: resp?.duration,
    });
    if (
      checkGraphType({ selectedMetrics: report.metrics, graphType: 'treemap' })
    ) {
      response = getTreemapXYChartPlotData({
        plotOptions: response,
        showCyclicalData: false,
      });
    } else if (
      checkGraphType({ selectedMetrics: report.metrics, graphType: 'donut' })
    ) {
      response = getDonutChartXYPlotData({
        plotOptions: response,
        showCyclicalData: false,
        groupByX,
        groupByY,
        selectedMetrics: report.metrics,
      });
    }
  } else if (groupByX !== '' && groupByY === '') {
    response = getGroupByXAxis({
      graphData: resp?.statementData,
      selectedMetrics: report.metrics,
      signalDataOrder: resp?.signalDataOrder,
      selectedSignals: resp?.selectedSignals,
      cyclicalData: resp?.cyclicalData,
      cyclicalComparisonStart: resp?.cyclicalComparisonStart,
      cyclicalComparisonCustom: resp?.cyclicalComparisonCustom,
      duration: resp?.duration,
    });
    if (
      checkGraphType({ selectedMetrics: report.metrics, graphType: 'funnel' })
    ) {
      response = getFunnelChartPlotData({
        plotOptions: response,
        selectedMetrics: report.metrics,
      });
    }
    if (
      checkGraphType({ selectedMetrics: report.metrics, graphType: 'donut' })
    ) {
      response = getDonutXChartPlotData({
        plotOptions: response,
        showCyclicalData: false,
      });
    }
    if (
      checkGraphType({ selectedMetrics: report.metrics, graphType: 'treemap' })
    ) {
      response = getTreemapXChartPlotData({
        plotOptions: response,
        showCyclicalData: false,
      });
    }

    if (checkGraphType({ selectedMetrics: report.metrics, graphType: 'map' })) {
      if (report?.map?.mapChartCountry === '') {
        response = getMapXChartPlotDataLevel1({
          graphData: resp?.statementData,
          selectedMetrics: report.metrics,
          cyclicalData: resp?.cyclicalData,
          signalDataOrder: resp?.signalDataOrder,
          selectedSignals: resp?.selectedSignals,
          showCyclicalData: false,
        });
      } else {
        response = getMapXChartPlotDataLevel2({
          graphData: resp?.statementData,
          cyclicalData: resp?.cyclicalData,
          topology: resp?.topologyMapChartLevel2,
          selectedMetrics: report.metrics,
          signalDataOrder: resp?.signalDataOrder,
          selectedSignals: resp?.selectedSignals,
          country: report?.map?.mapChartCountry,
          showCyclicalData: false,
        });
      }
    }
  } else if (groupByX === '' && groupByY !== '') {
    response = getGroupByYAxis({
      graphData: resp?.statementData,
      selectedMetrics: report.metrics,
      signalDataOrder: resp?.signalDataOrder,
      cyclicalData: resp?.cyclicalData,
      durationStart: resp?.queryStartTime,
      duration: report.duration,
      cyclicalComparisonStart: resp?.cyclicalComparisonStart,
      cyclicalComparisonCustom: resp?.cyclicalComparisonCustom,
      timezone: moment.tz.guess(),
      windowSize: report.windowSize,
      selectedSignals: resp?.selectedSignals,
    });
  } else if (groupByX === '' && groupByY === '') {
    response = getGraphDataNoGroupBy({
      graphData: resp?.statementData,
      selectedMetrics: report.metrics,
      signalDataOrder: resp?.signalDataOrder,
      cyclicalData: resp?.cyclicalData,
      durationStart: resp?.queryStartTime,
      duration: resp?.duration,
      windowSize: resp?.windowSize,
      cyclicalComparisonStart: resp?.cyclicalComparisonStart,
      cyclicalComparisonCustom: resp?.cyclicalComparisonCustom,
      selectedSignals: resp?.selectedSignals,
      forecast: report?.forecast,
      forecastDataset: resp?.forecastDataset,
      timezone: moment.tz.guess(),
    });
  }
  response = addDefaultGraphParam(response, true);
  if (groupByX === '') {
    response.time = {
      timezone: moment.tz.guess(),
    };
  }
  return response;
};

function* fetchOverviewChartReport(action) {
  const {
    report,
    signals,
    duration,
    windowSize,
    durationStart,
    metricsModifiers,
  } = action.payload;
  try {
    if (!report) {
      return;
    }

    const isMapChart = checkGraphType({
      selectedMetrics: report?.metrics,
      graphType: 'map',
    });
    const sig = report?.metrics?.map((metric) => {
      return getSignalsListFromMeasurement(metric.measurement, signals);
    });
    const reportSelectedSignalsFlat = [...new Set(sig?.flat(2))];
    const selectedSignals = signals.filter((sig) => {
      return reportSelectedSignalsFlat.includes(sig.signalName);
    });
    let {
      filters,
      cyclicalComparisonStart,
      dimensions,
      topX,
      topY,
      timezone,
      forecast,
    } = report;

    let reportCyclicalType = ['Hourly', 'Daily', 'Weekly'].includes(
      cyclicalComparisonStart,
    )
      ? 'fixed'
      : 'custom';
    let selectedMetrics = buildReportLoadMetrics(report.metrics);
    report.metrics = selectedMetrics;
    report.windowSize = windowSize;
    let durationType = 'fixed';
    let cyclicalComparisonOn = report?.cyclicalComparisonStart ? true : false;
    let cyclicalComparisonDisabled = false;

    const [groupByX, groupByY] = dimensions;
    let selectedFilters = filters ? filters : {};

    const dimensionsListAll = getDimensionList({
      selectedSignals,
      selectedMetrics,
      groupByX: '',
      groupByY: '',
      selectedFilters: {},
    });

    selectedFilters = dimensionsListAll.reduce((acc, dimension) => {
      if (filters?.hasOwnProperty(dimension)) {
        acc[dimension] = filters[dimension];
      }
      return acc;
    }, {});

    if (!filters) {
      selectedFilters = {};
    }

    if (selectedMetrics?.length !== 1) {
      cyclicalComparisonOn = false;
      cyclicalComparisonDisabled = true;
    }

    if (reportCyclicalType === 'custom' && report.cyclicalDelta) {
      cyclicalComparisonOn = true;
      cyclicalComparisonDisabled = false;
      cyclicalComparisonStart = moment().valueOf() - report.cyclicalDelta;
      cyclicalComparisonStart = alignOriginTime(
        cyclicalComparisonStart,
        300000,
        300000,
      );
    }

    selectedMetrics = selectedMetrics.map((metric) => {
      if (metric.type === 'simple') {
        const { unitDisplayName, unitDisplayPosition } =
          getSimpleMetricModifier(
            selectedSignals,
            metric.measurement,
            metricsModifiers,
          );
        if (
          unitDisplayName &&
          unitDisplayName !== '' &&
          !metric.unitDisplayName
        ) {
          metric.unitDisplayName = unitDisplayName;
          metric.unitDisplayPosition = unitDisplayPosition;
        }
        return metric;
      } else if (metric.type === 'derived') {
        const { unitDisplayName, unitDisplayPosition } =
          getDerivedMetricModifier(
            selectedSignals,
            metric.measurement,
            metricsModifiers,
          );
        if (unitDisplayName && unitDisplayName !== '') {
          metric.unitDisplayName = unitDisplayName;
          metric.unitDisplayPosition = unitDisplayPosition;
        }
        return metric;
      }
      return metric;
    });

    const action = {};
    action.payload = {
      signals,
      selectedSignals,
      selectedMetrics,
      durationType,
      duration,
      durationStart,
      timezone,
      cyclicalComparisonOn,
      cyclicalComparisonDisabled,
      cyclicalComparisonStart: cyclicalComparisonStart
        ? cyclicalComparisonStart
        : null,
      cyclicalComparisonCustom: reportCyclicalType === 'custom' ? true : false,
      windowSize,
      groupByX,
      groupByY,
      topX: topX ? topX : DEFAULT_GROUPBY_X_TOP_N,
      topY: topY ? topY : DEFAULT_GROUPBY_Y_TOP_N,
      selectedFilters,
      allFilters: {},
      forecast: forecast ?? false,
      calledFrom: 'insights-overview-chart',

      ...(isMapChart && {
        mapChartLevel: report?.map?.mapChartCountry === '' ? 1 : 2,
        map: report?.map,
      }),
    };
    const statementData = yield fetchReportGraphDataSaga(action);
    statementData.windowSize = windowSize;
    statementData.duration = duration;
    statementData.cyclicalComparisonStart = cyclicalComparisonStart
      ? cyclicalComparisonStart
      : null;
    statementData.cyclicalComparisonCustom =
      reportCyclicalType === 'custom' ? true : false;

    if (isMapChart) {
      statementData.map = report?.map;
    }

    // fetch insights data
    const actionReportInsights = {};
    actionReportInsights.payload = {
      selectedSignals,
      selectedMetrics,
      duration,
      durationStart: statementData.queryStartTime,
      timezone,
      windowSize,
      groupByX,
      topX: action.payload.topX,
      calledFrom: 'insights-overview-chart',
      cyclicalComparisonOn: true,
      cyclicalComparisonStart: action.payload.cyclicalComparisonStart,
      cyclicalComparisonCustom: action.payload.cyclicalComparisonCustom,
      cyclicalComparisonDisabled: false,
      selectedFilters,
      forecast: forecast ?? false,
    };

    statementData.datasketches = yield fetchReportInsights(
      actionReportInsights,
    );
    statementData.selectedSignals = selectedSignals;
    yield put(
      overViewChartActions.setOverviewChartData({
        [`${report.reportId}_${duration}`]: {
          graphPlotData: respForOverviewChart(statementData, report),
          queryApiResponse: statementData,
          report,
          duration,
        },
      }),
    );
  } catch (error) {
    handleAPIError(error);
  }
}

function* fetchOverviewChartData(action) {
  try {
    const { gridData, insightsConfig, allReports, signals } = action.payload;
    const reportMap = buildReportMap(allReports);
    let filteredFavReports = getFavReportsFromInsightsConfig({
      insightsConfig,
      reportMap,
    });

    if (gridData !== null) {
      filteredFavReports = getFavReportsFromGridData({
        gridData,
        reportMap,
      });
    }
    filteredFavReports = filteredFavReports.filter((ffr) => {
      return allReports?.some((rep) => ffr.reportId === rep.reportId);
    });
    const queryApiResponse = [];
    const graphPlotData = [];
    yield* filteredFavReports.map(function* (reportFav, reportIndex) {
      const report = reportFav.report;
      const sig = report?.metrics.map((metric) => {
        return getSignalsListFromMeasurement(metric.measurement, signals);
      });
      const reportSelectedSignalsFlat = [...new Set(sig.flat(2))];
      const selectedSignals = signals.filter((sig) => {
        return reportSelectedSignalsFlat.includes(sig.signalName);
      });

      let {
        filters,
        cyclicalComparisonStart,
        dimensions,
        topX,
        topY,
        timezone,
        forecast,
      } = report;

      let durationStart = reportFav.durationStart;
      let duration = reportFav.duration;
      let windowSize = reportFav.windowSize;

      let reportCyclicalType = ['Hourly', 'Daily', 'Weekly'].includes(
        cyclicalComparisonStart,
      )
        ? 'fixed'
        : 'custom';
      cyclicalComparisonStart = durationStart - parseInt(duration);
      let selectedMetrics = buildReportLoadMetrics(report.metrics);
      report.metrics = selectedMetrics;
      let durationType = 'fixed';

      let cyclicalComparisonOn = true;
      let cyclicalComparisonDisabled = false;

      const [groupByX, groupByY] = dimensions;
      let selectedFilters = filters ? filters : {};
      if (selectedMetrics?.length !== 1) {
        cyclicalComparisonOn = false;
        cyclicalComparisonDisabled = true;
      }

      if (reportCyclicalType === 'custom' && report.cyclicalDelta) {
        cyclicalComparisonOn = true;
        cyclicalComparisonDisabled = false;
        cyclicalComparisonStart = moment().valueOf() - report.cyclicalDelta;
        cyclicalComparisonStart = alignOriginTime(
          cyclicalComparisonStart,
          300000,
          300000,
        );
      }

      const action = {};
      action.payload = {
        signals,
        selectedSignals,
        selectedMetrics,
        durationType,
        duration,
        durationStart,
        timezone,
        cyclicalComparisonOn,
        cyclicalComparisonDisabled,
        cyclicalComparisonStart: cyclicalComparisonStart
          ? cyclicalComparisonStart
          : null,
        cyclicalComparisonCustom:
          reportCyclicalType === 'custom' ? true : false,
        windowSize,
        groupByX,
        groupByY,
        topX: topX ? topX : DEFAULT_GROUPBY_X_TOP_N,
        topY: topY ? topY : DEFAULT_GROUPBY_Y_TOP_N,
        selectedFilters,
        allFilters: {},
        forecast: forecast ?? false,
        calledFrom: 'insights-overview-chart',
      };
      const statementData = yield fetchReportGraphDataSaga(action);
      statementData.windowSize = windowSize;
      statementData.duration = duration;
      statementData.cyclicalComparisonStart = cyclicalComparisonStart
        ? cyclicalComparisonStart
        : null;
      statementData.cyclicalComparisonCustom =
        reportCyclicalType === 'custom' ? true : false;

      // fetch insights data
      const actionReportInsights = {};
      actionReportInsights.payload = {
        selectedSignals,
        selectedMetrics,
        duration,
        durationStart,
        timezone,
        windowSize,
        groupByX,
        topX: action.payload.topX,
        calledFrom: 'insights-overview-chart',
        cyclicalComparisonOn: true,
        cyclicalComparisonStart: action.payload.cyclicalComparisonStart,
        cyclicalComparisonCustom: action.payload.cyclicalComparisonCustom,
        cyclicalComparisonDisabled: false,
        selectedFilters,
        forecast: forecast ?? false,
      };
      statementData.datasketches = yield fetchReportInsights(
        actionReportInsights,
      );
      statementData.selectedSignals = selectedSignals;
      queryApiResponse.push(statementData);
      graphPlotData.push(
        respForOverviewChart(
          statementData,
          filteredFavReports[reportIndex].report,
        ),
      );
      yield put(
        overViewChartActions.setOverviewChartData({
          graphPlotData: [...graphPlotData],
          filteredFavReports,
          queryApiResponse: [...queryApiResponse],
        }),
      );
      yield delay(15000);
    });
  } catch (error) {
    handleAPIError(error);
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_OVERVIEW_CHART_DATA, fetchOverviewChartData);
  yield takeEvery(FETCH_OVERVIEW_CHART_REPORT, fetchOverviewChartReport);
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
