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
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  alignOriginTime,
  buildPositiveIndicatorMap,
} from 'containers/InsightsV2/utils';
import {
  getDerivedMetricModifier,
  getSimpleMetricModifier,
} from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type/getMetricModifier';
import { getDimensionList } from 'containers/ReportV2/components/GroupBy/utils';
import { positionModifier } from 'containers/ReportV2/components/ReportGraph/dataProc/utils';
import { fetchReportGraphDataSaga } from 'containers/ReportV2/components/ReportGraph/reducers/saga';
import { reportActions } from 'containers/ReportV2/reducers';
import { reportHeaderActions } from 'containers/ReportV2/components/HeaderButtons/reducers';
import {
  getLatestTimeSegmentBoundary,
  getSignalsListFromMeasurement,
  handleMetricForSpreadAndDC,
} from 'containers/ReportV2/utils';
import { handleAPIError } from 'containers/utils';
import {
  actionChannel,
  all,
  call,
  fork,
  put,
  race,
  take,
  takeLatest,
  select,
} from 'redux-saga/effects';
import numberFormatter from 'utils/numberFormatter';
import {
  getGraphDataNoGroupBy,
  getGroupByXAxis,
} from '../../../ReportV2/components/ReportGraph/dataProc';
import {
  CANCEL_FETCH_INSIGHTS_GRID_DATA,
  FETCH_INSIGHTS_GRID_ALL_CARD_DATA,
  FETCH_INSIGHTS_GRID_DATA,
  FETCH_NEW_CARD,
  UPDATE_INSIGHTS_CONFIG,
} from './actionTypes';
import insightsGridActions from './actions';
import {
  generateCardDataError,
  generateDataForCardGroupByX,
  generateDataForCardNoGroupBy,
  generateReportInsightsMapping,
  getCardInsightAllReports,
  getCardInsightRow1,
  getCardInsightRow2,
  getInsightConfigTemplate,
} from './utils';
import { checkIfAllMetricPresent } from 'containers/ReportV2/utils/metricsRegex';
import {
  INSIGHT_NAME_SIGNAL,
  REPORT_PAGE_SAVE_TO_INSIGHTS,
  REPORT_PAGE_SAVE_TO_INSIGHTS_FAILURE,
  REPORT_PAGE_SAVE_TO_INSIGHTS_SUCCESS,
} from 'containers/ReportV2/components/HeaderButtons/SaveToInsights/const';

const getSignalIfPresent = (signals, signalToCheck) =>
  signals.filter((signal) => signal.signalName === signalToCheck);

const ROW_CONFIG = {
  '1-hr': {
    duration: 3600000,
    insightConfigIndex: 0,
  },
  '1-day': {
    duration: 86400000,
    insightConfigIndex: 1,
  },
};

const buildReportListQuery = ({
  insightsDetails,
  reportsDetails,
  reportDetailsMap,
  signals,
  row,
}) => {
  const rowCardNotFoundList = [];
  const { duration, insightConfigIndex } = ROW_CONFIG[row];

  const reportList = insightsDetails?.sections?.[
    insightConfigIndex
  ]?.insightConfigs.reduce((acc, element) => {
    const reportDetails1 = reportsDetails.reportConfigs.filter(
      (report) => report.reportId === element.reportId,
    );

    if (reportDetails1.length === 0) {
      return acc;
    }
    const NOT_FOUND = {
      id: element.insightId,
      title: reportDetailsMap[element.reportId].reportName,
      subtitle: 'Signal not found',
      indicator: 0,
      delta: '',
      reportId: element.reportId,
      cardType: 'invalidCardNoSignal',
    };

    if (reportDetails1[0]?.metrics?.length === 0) {
      rowCardNotFoundList.push(NOT_FOUND);
      return acc;
    }

    const signalList = getSignalsListFromMeasurement(
      reportDetails1[0].metrics[0].measurement,
      signals,
    );
    const signalName = signalList?.[0];

    const filteredSignal = getSignalIfPresent(signals, signalName);
    if (filteredSignal && filteredSignal.length === 0) {
      rowCardNotFoundList.push(NOT_FOUND);
      return acc;
    }

    const isMetricPresent = checkIfAllMetricPresent({
      entities: signals?.filter((sig) => signalList.includes(sig.signalName)),
      metric: reportDetails1[0].metrics[0].measurement,
      type: 'signal',
    });

    if (!isMetricPresent) {
      return acc;
    }

    acc.push({
      insightId: element.insightId,
      metric: `${signalName}.count()`,
      originTime: bios.time.now(),
      delta: -duration,
      snapStepSize: bios.time.minutes(5),
    });

    return acc;
  }, []);
  return {
    reportList,
    rowCardNotFoundList,
  };
};

const buildReportListQueryAllReports = ({
  reportsDetails,
  insightReportMap,
  reportInsightMap,
  reportDetailsMap,
  insightsDetails,
  signals,
}) => {
  let addedReport = new Set();
  const insightsList = insightsDetails?.sections?.[2]?.insightConfigs.reduce(
    (acc, element) => {
      const rd = reportsDetails.reportConfigs.find(
        (report) => report.reportId === element.reportId,
      );

      if (!rd) {
        return acc;
      }
      addedReport.add(rd.reportId);
      let insightId;
      do {
        insightId = uuidv4();
      } while (insightReportMap?.hasOwnProperty(insightId));
      insightReportMap[insightId] = rd.reportId;
      reportInsightMap[rd.reportId] = insightId;
      reportDetailsMap[rd.reportId] = rd;

      if (rd?.metrics?.length === 0) {
        return acc;
      }

      const signalList = getSignalsListFromMeasurement(
        rd?.metrics?.[0]?.measurement,
        signals,
      );
      const signalName = signalList?.[0];
      const filteredSignal = getSignalIfPresent(signals, signalName);

      if (filteredSignal && filteredSignal.length === 0) {
        return acc;
      }

      const isMetricPresent = checkIfAllMetricPresent({
        entities: signals?.filter((sig) => signalList.includes(sig.signalName)),
        metric: rd?.metrics?.[0]?.measurement,
        type: 'signal',
      });

      if (!isMetricPresent) {
        return acc;
      }

      acc.push({
        insightId: insightId,
        metric: `${signalName}.count()`,
        originTime:
          rd.defaultStartTime && rd.defaultStartTime !== 0
            ? rd.defaultStartTime
            : bios.time.now(),
        delta:
          rd.defaultTimeRange > 0 ? -rd.defaultTimeRange : rd.defaultTimeRange,
        snapStepSize: bios.time.minutes(5),
      });

      return acc;
    },
    [],
  );
  const reportsList = reportsDetails.reportConfigs.reduce((acc, rd) => {
    let insightId = uuidv4();
    insightReportMap[insightId] = rd.reportId;
    reportInsightMap[rd.reportId] = insightId;
    reportDetailsMap[rd.reportId] = rd;
    if (addedReport.has(rd.reportId)) {
      return acc;
    }

    if (rd?.metrics?.length === 0) {
      return acc;
    }

    const signalList = getSignalsListFromMeasurement(
      rd?.metrics?.[0]?.measurement,
      signals,
    );
    const signalName = signalList?.[0];
    const filteredSignal = getSignalIfPresent(signals, signalName);
    const isMetricPresent = checkIfAllMetricPresent({
      entities: signals?.filter((sig) => signalList.includes(sig.signalName)),
      metric: rd?.metrics?.[0]?.measurement,
      type: 'signal',
    });
    if ((filteredSignal && filteredSignal.length === 0) || !isMetricPresent) {
      return acc;
    }

    acc.push({
      insightId: insightId,
      metric: `${signalName}.count()`,
      originTime:
        rd.defaultStartTime && rd.defaultStartTime !== 0
          ? rd.defaultStartTime
          : bios.time.now(),
      delta:
        rd.defaultTimeRange > 0 ? -rd.defaultTimeRange : rd.defaultTimeRange,
      snapStepSize: bios.time.minutes(5),
    });

    return acc;
  }, []);

  return [
    ...(insightsList && Array.isArray(insightsList) ? insightsList : []),
    ...(reportsList && Array.isArray(reportsList) ? reportsList : []),
  ];
};

const isInsightFav = ({ insightsDetails, insightId, reportId }) => {
  let val = false;
  insightsDetails.sections.forEach((ic) => {
    ic.insightConfigs.forEach((insightsReport) => {
      if (
        insightsReport.insightId === insightId &&
        insightsReport.reportId === reportId &&
        insightsReport?.fav
      ) {
        val = true;
      }
    });
  });
  return val;
};

const buildCardsArray = ({
  rowInsightMetrics,
  insightReportMap,
  reportDetailsMap,
  insightsDetails,
  noFav,
}) => {
  const rowInsightMetricsData = rowInsightMetrics.map((elem) => {
    const reportId = insightReportMap[elem.insightId];
    const title = reportDetailsMap[reportId].reportName;
    let fav;
    if (noFav) {
      fav = false;
    } else {
      fav = isInsightFav({
        insightsDetails,
        insightId: elem?.insightId,
        reportId,
      });
    }
    return {
      id: uuidv4(),
      title,
      subtitle: '',
      indicator: '',
      delta: '',
      reportId,
      fav,
    };
  });
  return rowInsightMetricsData;
};

function* fetchInsightsGridDataSaga(action) {
  try {
    const { signals, avoidRefetchingReports } = action.payload;
    let insightsDetails = yield bios.getInsightConfigs(INSIGHT_NAME_SIGNAL);
    let reportsDetails;

    if (avoidRefetchingReports) {
      reportsDetails = yield select(
        (state) => state?.report?.reportDetails?.allReports,
      );
    } else {
      reportsDetails = yield bios.getReportConfigs({ detail: true });
      yield put(reportActions.setAllReports(reportsDetails));
    }
    yield put(insightsGridActions.setInsightsConfig(insightsDetails));

    const { insightReportMap, reportInsightMap, reportDetailsMap } =
      generateReportInsightsMapping({ insightsDetails, reportsDetails });
    const {
      reportList: reportList1,
      rowCardNotFoundList: rowCardNotFoundList1,
    } = buildReportListQuery({
      insightsDetails,
      reportsDetails,
      reportDetailsMap,
      signals,
      row: '1-hr',
    });

    const cardInsightDataRow1 = getCardInsightRow1();
    if (reportList1 && reportList1.length > 0) {
      const row1insightMetricsData = buildCardsArray({
        rowInsightMetrics: reportList1,
        insightReportMap,
        reportDetailsMap,
        insightsDetails,
      });
      cardInsightDataRow1.cards =
        row1insightMetricsData.concat(rowCardNotFoundList1);
    } else {
      cardInsightDataRow1.cards = rowCardNotFoundList1;
    }
    // end get row1 data

    // start get row2 data
    const {
      reportList: reportList2,
      rowCardNotFoundList: rowCardNotFoundList2,
    } = buildReportListQuery({
      insightsDetails,
      reportsDetails,
      reportDetailsMap,
      signals,
      row: '1-day',
    });

    const cardInsightDataRow2 = getCardInsightRow2();
    if (reportList2 && reportList2.length > 0) {
      const row2insightMetricsData = buildCardsArray({
        rowInsightMetrics: reportList2,
        insightReportMap,
        reportDetailsMap,
        insightsDetails,
      });
      cardInsightDataRow2.cards =
        row2insightMetricsData.concat(rowCardNotFoundList2);
    } else {
      cardInsightDataRow2.cards = rowCardNotFoundList2;
    }
    // end get col2 data

    // all reports
    const cardInsightAllData = getCardInsightAllReports();
    const reportsList = buildReportListQueryAllReports({
      reportsDetails,
      insightReportMap,
      reportInsightMap,
      reportDetailsMap,
      insightsDetails,
      signals,
    });

    if (reportsList && reportsList.length > 0) {
      cardInsightAllData.cards = buildCardsArray({
        rowInsightMetrics: reportsList,
        insightReportMap,
        reportDetailsMap,
        insightsDetails,
        noFav: true,
      });
    } else {
      cardInsightAllData.cards = [];
    }
    // end all reports

    yield put(
      insightsGridActions.setInsightsGridData([
        cardInsightDataRow1,
        cardInsightDataRow2,
        cardInsightAllData,
      ]),
    );
  } catch (error) {
    handleAPIError(error);
  }
}

function* updateInsightsConfig(action) {
  const { gridData, calledFrom } = action.payload;
  try {
    const insightConfigRow1 = gridData[0].cards.map((card) => {
      return { insightId: card.id, reportId: card.reportId, fav: card.fav };
    });
    const insightConfigRow2 = gridData[1].cards.map((card) => {
      return { insightId: card.id, reportId: card.reportId, fav: card.fav };
    });
    const insightConfigRow3 = gridData[2].cards.map((card) => {
      return { insightId: card.id, reportId: card.reportId, fav: card.fav };
    });
    const insightSection = getInsightConfigTemplate({
      insightConfigRow1,
      insightConfigRow2,
      insightConfigRow3,
    });
    yield bios.putInsightConfigs(INSIGHT_NAME_SIGNAL, insightSection);
    if (calledFrom === REPORT_PAGE_SAVE_TO_INSIGHTS) {
      yield put(
        reportHeaderActions.setSaveReportToInsights({
          saveReportToInsightsMessage: REPORT_PAGE_SAVE_TO_INSIGHTS_SUCCESS,
        }),
      );
    } else {
      yield put(insightsGridActions.setInsightsConfig(insightSection));
    }
  } catch (error) {
    if (calledFrom === REPORT_PAGE_SAVE_TO_INSIGHTS) {
      reportHeaderActions.setSaveReportToInsights({
        saveReportToInsightsMessage: REPORT_PAGE_SAVE_TO_INSIGHTS_FAILURE,
      });
    }
    handleAPIError(error);
  }
}

const getInsightGridDuration = (value) => {
  let insightGridDuration;
  if (value === '1-hr') {
    insightGridDuration = 3600000;
  } else if (value === '1-day') {
    insightGridDuration = 86400000;
  } else {
    insightGridDuration = '';
  }
  return insightGridDuration;
};

function* fetchInsightsAllCardsDataSaga(action) {
  const { signals, allReports, gridData, metricsModifiers } = action.payload;
  yield put(
    insightsGridActions.setFetchedInsightCyclicalChangeData({
      '1h': false,
      '1d': false,
    }),
  );
  const positiveIndicatorMap = buildPositiveIndicatorMap(signals);
  yield* gridData?.[0]?.cards?.map(function* (card, cardIndex) {
    if (cardIndex < 4) {
      yield fetchNewCardSaga({
        payload: {
          signals,
          metricsModifiers,
          allReports,
          reportId: card.reportId,
          insightGridDuration: getInsightGridDuration(gridData?.[0]?.id),
          positiveIndicatorMap,
        },
      });
    }
  });

  yield* gridData?.[1]?.cards?.map(function* (card, cardIndex) {
    if (cardIndex < 4) {
      yield fetchNewCardSaga({
        payload: {
          signals,
          metricsModifiers,
          allReports,
          reportId: card.reportId,
          insightGridDuration: getInsightGridDuration(gridData?.[1]?.id),
          positiveIndicatorMap,
        },
      });
    }
  });

  yield* gridData?.[2]?.cards?.map(function* (card, cardIndex) {
    if (cardIndex < 4) {
      yield fetchNewCardSaga({
        payload: {
          signals,
          metricsModifiers,
          allReports,
          reportId: card.reportId,
          insightGridDuration: getInsightGridDuration(gridData?.[2]?.id),
          positiveIndicatorMap,
        },
      });
    }
  });

  yield* gridData?.[0]?.cards?.map(function* (card, cardIndex) {
    if (cardIndex >= 4) {
      yield fetchNewCardSaga({
        payload: {
          signals,
          metricsModifiers,
          allReports,
          reportId: card.reportId,
          insightGridDuration: getInsightGridDuration(gridData?.[0]?.id),
          positiveIndicatorMap,
        },
      });
    }
  });

  yield* gridData?.[1]?.cards?.map(function* (card, cardIndex) {
    if (cardIndex >= 4) {
      yield fetchNewCardSaga({
        payload: {
          signals,
          metricsModifiers,
          allReports,
          reportId: card.reportId,
          insightGridDuration: getInsightGridDuration(gridData?.[1]?.id),
          positiveIndicatorMap,
        },
      });
    }
  });

  yield put(
    insightsGridActions.setFetchedInsightCyclicalChangeData({
      '1h': true,
      '1d': true,
    }),
  );
}

function* fetchNewCardSaga(action) {
  const {
    signals,
    reportId,
    insightGridDuration,
    allReports,
    metricsModifiers,
    positiveIndicatorMap,
  } = action.payload;
  try {
    const reportArr =
      Array.isArray(allReports?.reportConfigs) &&
      allReports?.reportConfigs?.filter(
        (report) => report.reportId === reportId,
      );
    if (reportArr?.length === 0) {
      return;
    }

    // const report = oneMetricFilteredReport(reportArr[0]);
    const report = cloneDeep(reportArr[0]);
    report.metrics = report.metrics.slice(0, 1);
    report.metrics[0].defaultGraphType = 'bar';
    let isDerivedMetric = report.metrics[0].type === 'simple' ? false : true;
    const sig = report?.metrics?.map((metric) => {
      return getSignalsListFromMeasurement(metric.measurement, signals);
    });
    const reportSelectedSignalsFlat = [...new Set(sig.flat(2))];
    const selectedSignals = signals.filter((sig) => {
      return reportSelectedSignalsFlat.includes(sig.signalName);
    });
    if (reportSelectedSignalsFlat.length > selectedSignals.length) {
      const cardData = generateCardDataError('Signal not found');
      if (insightGridDuration === '') {
        yield put(
          insightsGridActions.setAllReportsCard({ [reportId]: cardData }),
        );
      } else if (insightGridDuration === 3600000) {
        yield put(insightsGridActions.set1HCard({ [reportId]: cardData }));
      } else if (insightGridDuration === 86400000) {
        yield put(insightsGridActions.set1DCard({ [reportId]: cardData }));
      }
      return;
    }
    let selectedMetrics = report.metrics;
    if (selectedMetrics?.[0]?.defaultGraphType === 'packedbubble') {
      selectedMetrics[0].defaultGraphType = 'line';
    }
    selectedMetrics = handleMetricForSpreadAndDC(selectedMetrics);

    let { filters } = report;
    let selectedFilters = filters ? filters : {};
    let duration;
    let durationType;
    let durationStart;

    const dimensionsListAll = getDimensionList({
      selectedSignals,
      selectedMetrics,
      groupByX: '',
      groupByY: '',
      selectedFilters: {},
      type: 'signal',
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

    if (insightGridDuration === '') {
      // all insights report grid custom range load
      const { defaultStartTime, defaultTimeRange } = report;
      duration = defaultTimeRange;
      if (defaultStartTime === 0) {
        durationType = 'fixed';
        durationStart = getLatestTimeSegmentBoundary().valueOf() - duration;
      } else {
        durationType = 'custom';
        durationStart = alignOriginTime(defaultStartTime, 300000, 300000);
      }
    } else {
      // fixed from 1hr/1ay
      duration = insightGridDuration;
      durationType = 'fixed';
    }
    let { topX, defaultWindowLength, cyclicalComparisonStart } = report;
    let windowSize = defaultWindowLength;
    const groupByX = report?.dimensions?.[0];

    if (windowSize === undefined && insightGridDuration === '') {
      // all insight custom window size
      // const { newWindowSizeMapping } = getWSBasedOnExistingWSDuration({
      //   windowSize: duration,
      //   duration,
      // });
      // windowSize = findAllowedWindowSize(newWindowSizeMapping);
      // all insights 3 day data window size
      // windowSize = parseInt(duration / 36);
    } else if (insightGridDuration === 3600000) {
      windowSize = parseInt(duration / 12);
      durationStart = getLatestTimeSegmentBoundary().valueOf() - duration;
    } else if (insightGridDuration === 86400000) {
      windowSize = parseInt(duration / 24);
      durationStart = getLatestTimeSegmentBoundary().valueOf() - duration;
    }

    if (groupByX !== '') {
      windowSize = duration;
    }
    const action = {};

    let cyclicalComparisonCustom = false;
    if (cyclicalComparisonStart) {
      if (!['Hourly', 'Daily', 'Weekly'].includes(cyclicalComparisonStart)) {
        cyclicalComparisonCustom = true;
      }
    } else {
      cyclicalComparisonStart = durationStart - duration;
      cyclicalComparisonCustom = true;
    }
    action.payload = {
      signals,
      selectedSignals,
      selectedMetrics,
      durationType,
      duration,
      durationStart,
      timezone: '',
      cyclicalComparisonOn: true,
      cyclicalComparisonDisabled: false,
      cyclicalComparisonStart,
      cyclicalComparisonCustom,
      windowSize,
      groupByX,
      topX,
      groupByY: '',
      selectedFilters,
      allFilters: {},
      calledFrom: 'insights-overview-chart',
    };
    const resp = yield fetchReportGraphDataSaga(action);
    let cardData = {};
    if (groupByX === '' || groupByX === undefined) {
      const plotData = getGraphDataNoGroupBy({
        graphData: resp?.statementData,
        selectedMetrics,
        signalDataOrder: resp?.signalDataOrder,
        cyclicalData: resp?.cyclicalData,
        durationStart: resp?.queryStartTime ?? durationStart,
        duration,
        windowSize,
        cyclicalComparisonCustom: false,
        selectedSignals,
      });

      cardData = generateDataForCardNoGroupBy(
        plotData,
        windowSize,
        selectedFilters,
        isDerivedMetric,
        selectedMetrics,
        positiveIndicatorMap,
      );

      cardData.reportName = report.reportName;
    } else {
      const plotData = getGroupByXAxis({
        graphData: resp?.statementData,
        selectedMetrics: selectedMetrics,
        signalDataOrder: resp?.signalDataOrder,
        selectedSignals,
        cyclicalData: resp?.cyclicalData,
        duration: duration,
      });
      cardData = generateDataForCardGroupByX({
        graphData: resp?.statementData,
        duration,
        plotData,
        selectedFilters,
        isDerivedMetric,
        selectedMetrics,
        positiveIndicatorMap,
      });
      cardData.reportName = report.reportName;
    }
    //end count calculation based of merged dataset

    cardData.count = numberFormatter(cardData?.count, 3);
    if (selectedMetrics?.[0]?.type === 'simple') {
      const { unitDisplayName, unitDisplayPosition } = getSimpleMetricModifier(
        selectedSignals,
        selectedMetrics?.[0]?.measurement,
        metricsModifiers,
      );
      if (unitDisplayPosition !== '' && unitDisplayName !== '') {
        cardData.count = positionModifier({
          unitDisplayName,
          unitDisplayPosition,
          number: cardData.count,
        });
      }
    }
    if (selectedMetrics?.[0]?.type === 'derived') {
      const { unitDisplayName, unitDisplayPosition } = getDerivedMetricModifier(
        selectedSignals,
        selectedMetrics?.[0]?.measurement,
        metricsModifiers,
      );
      if (unitDisplayPosition !== '' && unitDisplayName !== '') {
        cardData.count = positionModifier({
          unitDisplayName,
          unitDisplayPosition,
          number: cardData.count,
        });
      }
    }

    if (insightGridDuration === '') {
      // update all report
      yield put(
        insightsGridActions.setAllReportsCard({ [reportId]: cardData }),
      );
    } else if (insightGridDuration === 3600000) {
      // update 1hr duration
      yield put(insightsGridActions.set1HCard({ [reportId]: cardData }));
    } else if (insightGridDuration === 86400000) {
      // update 1d duration
      yield put(insightsGridActions.set1DCard({ [reportId]: cardData }));
    }
  } catch (error) {
    handleAPIError(error);
  }
}
const cancelable = (saga, cancelAction) =>
  function* (...args) {
    yield race([call(saga, ...args), take(cancelAction)]);
  };

function* actionWatcher() {
  yield takeLatest(FETCH_INSIGHTS_GRID_DATA, fetchInsightsGridDataSaga);
  yield takeLatest(
    FETCH_INSIGHTS_GRID_ALL_CARD_DATA,
    cancelable(fetchInsightsAllCardsDataSaga, CANCEL_FETCH_INSIGHTS_GRID_DATA),
  );
  yield takeLatest(UPDATE_INSIGHTS_CONFIG, updateInsightsConfig);
  const requestNewCardDataChannel = yield actionChannel(FETCH_NEW_CARD);
  while (true) {
    const payload = yield take(requestNewCardDataChannel);
    yield call(fetchNewCardSaga, payload);
  }
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
