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
import { all, fork, put, takeLatest } from 'redux-saga/effects';

import bios from '@bios/bios-sdk';

import {
  createWhereClauseWithFilters,
  handleFetchReportDataError,
} from 'containers/ReportV2/components/ReportGraph/utils';
import {
  FETCH_REPORT_AUDIT_GRAPH_DATA,
  FETCH_REPORT_GRAPH_DATA,
} from './actionTypes';
import { getDataNoGroupBy } from './buildQuery';
import { reportGraphActions } from './index';
import { getLatestTimeSegmentBoundary } from 'containers/ReportV2/utils';
import { getDataGroupByY } from 'containers/ReportV2/components/ReportGraph/reducers/buildQuery';
import { getGroupByYAxis } from 'containers/ReportV2/components/ReportGraph/dataProc';
import { addDefaultGraphParam } from '../utils';
import { buildAttributeTypeMapping } from 'containers/ReportV2/components/ReportGraph/utils/whereClause';
import { getDimensionAllFromSynopsis } from '../../GroupBy/utils';
import { capitalize } from 'lodash';

export function* fetchReportGraphDataSaga(action) {
  const requestParams = action.payload;
  let { selectedContexts, groupByX, groupByY, selectedFilters } = requestParams;

  const { calledFrom = 'report' } = requestParams;
  try {
    const contextSynopsis = yield bios.getContextSynopsis(
      selectedContexts?.[0]?.contextName,
    );

    const limitedDimensionList = getDimensionAllFromSynopsis({
      contextSynopsis,
    });

    let contextDataOrder = [];
    let statementData = [];

    let attributeTypeMapping = {};
    for (const context of selectedContexts) {
      attributeTypeMapping = Object.assign(
        attributeTypeMapping,
        buildAttributeTypeMapping(context),
      );
    }

    const filterWhereClause = createWhereClauseWithFilters(
      selectedFilters,
      {},
      attributeTypeMapping,
    );

    if (groupByX && limitedDimensionList?.includes(groupByX)) {
      ({ statementData, contextDataOrder } = yield getDataNoGroupBy({
        ...requestParams,
        groupByX,
        groupByY,
        filterWhereClause,
      }));

      if (statementData?.[0]?.['entries']?.length === 0) {
        statementData = [];
      }
    }

    if (calledFrom === 'report') {
      yield put(
        reportGraphActions.setReportGraphData({
          graphData: statementData,
          contextDataOrder,
          firstDivisionAttribute: groupByX,
          contextSynopsis,
        }),
      );
    }

    if (calledFrom !== 'report') {
      return {
        statementData,
        contextDataOrder,
        firstDivisionAttribute: groupByX,
        contextSynopsis,
      };
    }
  } catch (error) {
    if (calledFrom !== 'report') {
      return {
        statementData: [],
        contextDataOrder: [],
      };
    }
    let graphDataError = handleFetchReportDataError(error);
    yield put(
      reportGraphActions.setReportGraphData({
        graphData: [],
        contextDataOrder: [],
        cyclicalData: null,
        graphDataError,
      }),
    );
  }
}

export function* fetchReportAuditGraphDataSaga(action) {
  const requestParams = action.payload;
  let { selectedContexts, signals, selectedMetrics } = requestParams;

  const contextName = selectedMetrics?.[0]?.measurement?.split('.')?.[0];

  const contextDetails = selectedContexts?.find((context) => {
    return context?.contextName === contextName;
  });

  if (signals?.length === 0 || !contextName || !contextDetails) {
    return;
  }

  const countTotal = contextDetails?.synopses?.count;

  const signalName =
    'audit' + contextName.charAt(0).toUpperCase() + contextName.slice(1);
  const selectedSignal = signals.find(
    (signal) => signal.signalName === signalName,
  );
  const durationStart = getLatestTimeSegmentBoundary() - 86400000;

  if (!selectedSignal) {
    return;
  }

  try {
    const req = {
      selectedSignals: [selectedSignal],
      signalMetricsMapping: {
        [signalName]: ['count()'],
      },
      groupByY: '_operation',
      duration: 86400000,
      durationStart,
      onTheFly: 0,
      windowSize: 3600000,
      cyclicalComparisonOn: false,
      cyclicalComparisonDisabled: false,
      cyclicalComparisonCustom: false,
      cyclicalComparisonStart: 'Daily',
      filterWhereClause: '',
      topY: 10,
    };

    const { signalDataOrder, statementData } = yield getDataGroupByY(req);

    const resp = getGroupByYAxis({
      graphData: statementData,
      selectedMetrics: [
        {
          measurement: signalName + '.count()',
          as: signalName + '.count()',
          type: 'simple',
          defaultGraphType: 'line',
          yAxisPosition: 'left',
          unitDisplayName: '#',
          unitDisplayPosition: 'Prefix',
        },
      ],
      signalDataOrder: signalDataOrder,
      cyclicalData: null,
      durationStart,
      duration: 86400000,
      cyclicalComparisonStart: 'Daily',
      cyclicalComparisonCustom: false,
      timezone: '',
      windowSize: 3600000,
      selectedSignals: [selectedSignal],
      endTimestamp: 0,
      onTheFly: 0,
      isContextReportAuditLogChart: true,
    });

    if (resp?.xAxis) {
      resp.xAxis.visible = false;
    }
    if (resp?.['yAxis']?.[0]?.['title']?.['text']) {
      resp['yAxis'][0]['title']['text'] = '';
      resp['yAxis'][0]['gridLineWidth'] = 0;
      resp['yAxis'][0]['visible'] = false;
    }
    resp?.series?.forEach((row) => {
      const contextNameCapitalized = capitalize(contextName);
      row.lineWidth = 1.5;
      if (row?.name === 'Insert') {
        row.color = '#6AD686';
        row.name = 'new ' + contextNameCapitalized;
      }
      if (row?.name === 'Update') {
        row.color = '#D6BC6F';
        row.name = contextNameCapitalized + ' updated';
      }
      if (row?.name === 'Delete') {
        row.color = '#8B0000';
      }
    });

    yield put(
      reportGraphActions.setReportAuditGraphData({
        auditGraphDataLoading: null,
        auditGraphData: resp,
        auditGraphDataError: null,
        contextCountTotal: countTotal ? countTotal : '-',
      }),
    );
  } catch {
    yield put(
      reportGraphActions.setReportAuditGraphData({
        auditGraphDataLoading: null,
        auditGraphData: addDefaultGraphParam({ title: '' }),
        auditGraphDataError: null,
        contextCountTotal: '',
      }),
    );
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_REPORT_GRAPH_DATA, fetchReportGraphDataSaga);
  yield takeLatest(
    FETCH_REPORT_AUDIT_GRAPH_DATA,
    fetchReportAuditGraphDataSaga,
  );
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
