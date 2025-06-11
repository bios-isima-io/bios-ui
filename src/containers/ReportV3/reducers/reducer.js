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
import {
  SET_ACTIVE_REPORT,
  SET_ALL_REPORTS,
  SET_REPORT_LOADING,
} from './actionTypes';

const initState = {
  allReports: null,
  reportLoading: false,
  activeReportIndex: 0,
  // for testing will be removed later as we start building the object
  reportList: [
    {
      rightPanel: {
        activeTabRightPanel: '',
      },
      duration: {
        cyclicalComparison: {
          cyclicalComparisonOn: true,
          cyclicalComparisonCustom: false,
          cyclicalComparisonStart: 'Weekly',
          cyclicalComparisonDisabled: false,
          cyclicalDelta: null,
          forecast: false,
          forecastDisabled: false,
        },
        timeDuration: {
          durationType: 'fixed',
          duration: 3600000,
          durationStart: 1714714500000,
          onTheFly: 0,
          onTheFlyRefresh: 0,
        },
        windowSize: {
          windowSize: 300000,
        },
        timeZone: {
          timezone: '',
        },
      },
      metrics: {
        selectedMetrics: [
          {
            measurement:
              '_operations.sum(numSuccessfulOperations) + _operations.sum(numValidationErrors) + _operations.sum(numTransientErrors)',
            as: 'Requests',
            type: 'derived',
            defaultGraphType: 'bar',
            yAxisPosition: 'left',
            unitDisplayName: '#',
            unitDisplayPosition: 'Prefix',
          },
        ],
      },
      groupBy: {
        groupByX: '',
        groupByY: 'tenant',
      },
      filters: {
        allData: {},
        allFilters: {},
        selectedFilters: {
          request: [
            'INSERT',
            'INSERT_BULK',
            'UPSERT',
            'SELECT',
            'GET_SIGNALS',
            'DELETE',
            'GET_TENANT_CONFIG',
            'PUT_CONTEXT_ENTRIES',
            'GET_CONTEXT_ENTRIES',
            'GET_UPSTREAM_CONFIG',
            'GET_CONTEXT',
            'GET_REPORT_CONFIGS',
            'PUT_REPORT_CONFIGS',
            'GET_INSIGHT_CONFIGS',
            'PUT_INSIGHT_CONFIGS',
            'GET_CONTEXTS',
          ],
        },
        loadingFilters: false,
        disableFilters: false,
        filterOrder: ['request', 'stream'],
      },
      dataGranularity: {
        topX: 20,
        topY: 20,
      },
      headerButton: {
        saveReportToInsightsMessage: null,
      },
    },
    {
      rightPanel: {
        activeTabRightPanel: '',
      },
      duration: {
        cyclicalComparison: {
          cyclicalComparisonOn: false,
          cyclicalComparisonCustom: false,
          cyclicalComparisonDisabled: true,
          cyclicalDelta: null,
          forecast: false,
          forecastDisabled: false,
        },
        timeDuration: {
          durationType: 'fixed',
          duration: 3600000,
          durationStart: 1714714500000,
          onTheFly: 0,
          onTheFlyRefresh: 0,
        },
        windowSize: {
          windowSize: 300000,
        },
        timeZone: {
          timezone: '',
        },
      },
      metrics: {
        selectedMetrics: [
          {
            measurement:
              '_operations.sum(latencySum) / _operations.sum(numSuccessfulOperations) / 1000',
            as: 'Avg. Server Latency (ms)',
            type: 'derived',
            defaultGraphType: 'bar',
            yAxisPosition: 'left',
          },
        ],
      },
      groupBy: {
        groupByX: '',
        groupByY: '',
      },
      filters: {
        allData: {},
        allFilters: {},
        selectedFilters: {
          request: [
            'INSERT',
            'INSERT_BULK',
            'UPSERT',
            'SELECT_CONTEXT',
            'SELECT',
          ],
        },
        loadingFilters: false,
        disableFilters: false,
        filterOrder: ['request'],
        filtersShow: {},
      },
      dataGranularity: {
        topX: 5,
        topY: 5,
      },
      headerButton: {
        saveReportToInsightsMessage: null,
      },
    },
  ],
  reportList1: [
    {
      reportId: '7ccce868-0e43-428c-b3ea-fb9d40e38026',
      reportName: 'Requests',
      metrics: [
        {
          measurement:
            '_operations.sum(numSuccessfulOperations) + _operations.sum(numValidationErrors) + _operations.sum(numTransientErrors)',
          as: 'Requests',
          type: 'derived',
          defaultGraphType: 'bar',
          yAxisPosition: 'left',
        },
      ],
      dimensions: ['', 'tenant'],
      defaultTimeRange: 3600000,
      defaultWindowLength: 300000,
      defaultStartTime: 0,
      existingReport: true,
      filters: {
        request: [
          'INSERT',
          'INSERT_BULK',
          'UPSERT',
          'SELECT',
          'GET_SIGNALS',
          'DELETE',
          'GET_TENANT_CONFIG',
          'PUT_CONTEXT_ENTRIES',
          'GET_CONTEXT_ENTRIES',
          'GET_UPSTREAM_CONFIG',
          'GET_CONTEXT',
          'GET_REPORT_CONFIGS',
          'PUT_REPORT_CONFIGS',
          'GET_INSIGHT_CONFIGS',
          'PUT_INSIGHT_CONFIGS',
          'GET_CONTEXTS',
        ],
      },
      filterOrder: ['request', 'stream'],
      topX: 20,
      topY: 20,
      cyclicalComparisonStart: 'Weekly',
    },
    {
      reportId: '842ade4b-b8a1-4f21-ac57-19bde590d262',
      reportName: 'Latencies (Data)',
      metrics: [
        {
          measurement:
            '_operations.sum(latencySum) / _operations.sum(numSuccessfulOperations) / 1000',
          as: 'Avg. Server Latency (ms)',
          type: 'derived',
          defaultGraphType: 'line',
          yAxisPosition: 'left',
        },
        {
          measurement:
            '_operations.sum(storageLatencySum) / _operations.sum(numStorageAccesses) /1000',
          as: 'Avg. Storage Latency (ms.)',
          type: 'derived',
          defaultGraphType: 'line',
          yAxisPosition: 'left',
        },
        {
          measurement:
            '_operations.sum(numStorageAccesses) / _operations.sum(numSuccessfulOperations)',
          as: 'DbAccess / Operation',
          type: 'derived',
          defaultGraphType: 'line',
          yAxisPosition: 'right',
          showPercentage: false,
        },
      ],
      dimensions: ['', ''],
      defaultTimeRange: 86400000,
      defaultWindowLength: 3600000,
      defaultStartTime: 0,
      existingReport: true,
      filters: {
        request: [
          'INSERT',
          'INSERT_BULK',
          'UPSERT',
          'SELECT_CONTEXT',
          'SELECT',
        ],
      },
      filterOrder: ['request'],
      topX: 5,
      topY: 5,
    },
  ],
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SET_ALL_REPORTS:
      return {
        ...state,
        ...action.payload,
      };
    case SET_REPORT_LOADING:
      return {
        ...state,
        ...action.payload,
      };

    case SET_ACTIVE_REPORT:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
