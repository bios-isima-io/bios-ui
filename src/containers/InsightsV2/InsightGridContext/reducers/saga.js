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
import { v4 as uuidv4 } from 'uuid';
import { reportActions } from 'containers/ReportV2/reducers';
import { reportHeaderActions } from 'containers/ReportV2/components/HeaderButtons/reducers';
import { handleAPIError } from 'containers/utils';
import { all, fork, put, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_INSIGHTS_GRID_DATA,
  UPDATE_INSIGHTS_CONFIG,
} from './actionTypes';
import insightsGridActions from './actions';
import {
  getCardInsightAllReports,
  getCardInsightRow1,
  getInsightConfigTemplate,
} from './utils';
import {
  REPORT_PAGE_SAVE_TO_INSIGHTS,
  REPORT_PAGE_SAVE_TO_INSIGHTS_FAILURE,
  REPORT_PAGE_SAVE_TO_INSIGHTS_SUCCESS,
} from 'containers/ReportV2/components/HeaderButtons/SaveToInsights/const';
import getContextsListFromMeasurement from 'containers/ContextReport/utils/getContextsListFromMeasurement';
import { checkIfAllMetricPresent } from 'containers/ReportV2/utils/metricsRegex';

const checkSubset = (parentArray, subsetArray) => {
  return subsetArray.every((el) => {
    return parentArray.includes(el);
  });
};

const addTwoArraysByIndex = (array1, array2) => {
  const maxLength = Math.max(array1.length, array2.length);

  const resultArray = [];

  for (let i = 0; i < maxLength; i++) {
    const value1 = array1[i] || 0;
    const value2 = array2[i] || 0;
    resultArray.push(value1 + value2);
  }

  return resultArray;
};

const buildReportListInsight = ({ insightsDetails, reportsDetails }) => {
  const rowCardNotFoundList = [];

  const reportList = insightsDetails?.sections?.[0]?.insightConfigs.reduce(
    (acc, element) => {
      const reportDetails1 = reportsDetails.reportConfigs.filter(
        (report) => report.reportId === element.reportId,
      );

      if (reportDetails1.length === 0) {
        return acc;
      }
      const NOT_FOUND = {
        id: element.insightId,
        title: reportDetails1[0].reportName,
        subtitle: 'Context not found',
        indicator: 0,
        delta: '',
        reportId: element.reportId,
        cardType: 'invalidCardNoContext',
      };

      if (reportDetails1[0]?.selectedContexts?.length === 0) {
        rowCardNotFoundList.push(NOT_FOUND);
        return acc;
      }

      acc.push(element);

      return acc;
    },
    [],
  );
  return {
    reportList,
    rowCardNotFoundList,
  };
};

const buildReportList = ({ reportsDetails }) => {
  const reportsList = reportsDetails.reportConfigs.reduce((acc, rd) => {
    if (rd.reportType !== 'contextReport') {
      return acc;
    }
    acc.push(rd);
    return acc;
  }, []);

  return [...(reportsList && Array.isArray(reportsList) ? reportsList : [])];
};

const buildCardsArray = ({
  contexts,
  noFav,
  insightsDetails,
  reportsDetails,
}) => {
  const filterExistingInsights =
    insightsDetails?.sections?.[0]?.insightConfigs?.filter((elem) => {
      const report = reportsDetails?.reportConfigs?.find(
        (report) => report?.reportId === elem?.reportId,
      );
      return report;
    });

  const rowInsightMetricsData = filterExistingInsights?.map((insightCard) => {
    const { reportId, insightId } = insightCard;
    const report = reportsDetails?.reportConfigs?.find(
      (report) => report?.reportId === reportId,
    );
    let fav = false;
    if (noFav) {
      fav = false;
    } else {
      fav = insightCard?.fav ?? false;
    }

    return getReportDetails({ report, contexts, fav, insightId });
  });
  return rowInsightMetricsData;
};

const getNotFoundCard = (report) => {
  const NOT_FOUND = {
    id: uuidv4(),
    title: report?.reportName,
    error: 'Context not found',
    count: 0,
    reportId: report?.reportId,
    cardType: 'invalidCardNoContext',
  };
  return NOT_FOUND;
};

const getReportDetails = ({ report, contexts, fav, insightId }) => {
  if (report?.metrics?.length === 0) {
    return getNotFoundCard(report);
  }

  const contextList = getContextsListFromMeasurement(
    report.metrics[0].measurement,
    contexts,
  );

  const isSubset = checkSubset(
    contexts.map((context) => context.contextName),
    contextList,
  );
  if (!isSubset) {
    return getNotFoundCard(report);
  }

  const isMetricPresent = checkIfAllMetricPresent({
    entities: contexts?.filter((sig) => contextList.includes(sig.contextName)),
    metric: report.metrics[0].measurement,
    type: 'context',
  });

  if (!isMetricPresent) {
    return getNotFoundCard(report);
  }

  let count = 0,
    trendLine,
    lastUpdated;
  contextList.forEach((context) => {
    const contextItem = contexts.find((con) => con.contextName === context);
    count = count + contextItem?.synopses?.count;
    if (!trendLine) {
      trendLine = contextItem?.synopses?.trendLineData?.count;
    } else {
      trendLine = addTwoArraysByIndex(
        trendLine,
        contextItem?.synopses?.trendLineData?.count,
      );
    }
    if (!lastUpdated) {
      lastUpdated = contextItem?.synopses?.lastUpdated;
    } else {
      if (lastUpdated < contextItem?.synopses?.lastUpdated);
      lastUpdated = contextItem?.synopses?.lastUpdated;
    }
  });

  return {
    id: insightId ?? uuidv4(),
    reportId: report?.reportId,
    title: report?.reportName,
    hasFilter: Object.keys(report?.selectedFilters)?.length > 0,
    trendLineArray: trendLine,
    lastUpdated: lastUpdated,
    count: count,
    fav,
  };
};

const buildCardsArrayAllReports = ({ rowInsightMetrics, contexts }) => {
  const filterExistingInsights = rowInsightMetrics?.filter((report) => {
    return report;
  });
  const rowInsightMetricsData = filterExistingInsights.map((report) => {
    return getReportDetails({ report, contexts, fav: false });
  });
  return rowInsightMetricsData;
};

function* fetchInsightsGridDataSaga(action) {
  try {
    const { contexts, avoidRefetchingReports } = action.payload;
    let insightsDetails = yield bios.getInsightConfigs('context');
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

    const {
      reportList: reportList1,
      rowCardNotFoundList: rowCardNotFoundList1,
    } = buildReportListInsight({
      insightsDetails,
      reportsDetails,
    });

    // start get row1 data
    const cardInsightDataRow1 = getCardInsightRow1();

    if (reportList1 && reportList1.length > 0) {
      const row1insightMetricsData = buildCardsArray({
        insightsDetails,
        contexts,
        reportsDetails,
      });
      cardInsightDataRow1.cards =
        row1insightMetricsData.concat(rowCardNotFoundList1);
    } else {
      cardInsightDataRow1.cards = rowCardNotFoundList1;
    }
    // end get row1 data

    // all reports
    const cardInsightAllData = getCardInsightAllReports();
    const reportsList = buildReportList({
      reportsDetails,
    });

    if (contexts && contexts.length > 0) {
      cardInsightAllData.cards = buildCardsArrayAllReports({
        rowInsightMetrics: reportsList,
        contexts,
      });
    } else {
      cardInsightAllData.cards = [];
    }
    // end all reports

    yield put(
      insightsGridActions.setInsightsGridData([
        cardInsightDataRow1,
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
    const insightSection = getInsightConfigTemplate({
      insightConfigRow1,
    });
    yield bios.putInsightConfigs('context', insightSection);
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

function* actionWatcher() {
  yield takeLatest(FETCH_INSIGHTS_GRID_DATA, fetchInsightsGridDataSaga);
  yield takeLatest(UPDATE_INSIGHTS_CONFIG, updateInsightsConfig);
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
