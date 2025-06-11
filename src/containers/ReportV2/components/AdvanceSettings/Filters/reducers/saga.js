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
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import { getDimensionList } from 'containers/ReportV2/components/GroupBy/utils';
import { createWhereClauseWithFilters } from 'containers/ReportV2/components/ReportGraph/utils';
import { buildAttributeTypeMapping } from 'containers/ReportV2/components/ReportGraph/utils/whereClause';
import getEntitiesMetricsMapping from 'containers/ReportV2/utils/signalsMetricsMapping';
import { handleAPIError } from 'containers/utils';
import { FETCH_FILTERS } from './actionTypes';
import { reportFiltersActions } from './index';
import { INTERVAL_5_MIN } from 'containers/ReportV2/components/ReportGraph/const';

const getFilterObj = (statementData) => {
  const resultObj = statementData.reduce((acc, sqIn, sqIndex) => {
    const dimension = sqIn.definitions?.[0]?.name;
    const sqRecords = sqIn?.dataWindows?.[0]?.records;
    if (dimension?.length === 0 || sqRecords.length === 0) {
      return acc;
    }
    if (acc[dimension] === undefined) {
      acc[dimension] = {};
    }

    sqRecords.forEach((entity) => {
      if (acc[dimension][entity[0]] === undefined) {
        acc[dimension][entity[0]] = entity[1];
      } else {
        acc[dimension][entity[0]] = acc[dimension][entity[0]] + entity[1];
      }
    });
    return acc;
  }, {});
  return resultObj;
};

function* getFilterOrder() {
  return yield select(({ report }) => report.filters.filterOrder);
}

function* fetchReportFiltersSaga(action) {
  try {
    const {
      selectedSignals,
      selectedMetrics,
      duration,
      durationStart,
      groupByX,
      groupByY,
      selectedFilters,
      shouldSetSelectedFilter,
      dimensions,
    } = action.payload;
    let filterOrder = yield getFilterOrder();

    const signalMetricsMapping = getEntitiesMetricsMapping(
      selectedMetrics,
      selectedSignals,
      'signal',
    );

    const activeDimensions = [];
    if (groupByX && groupByX !== '') {
      activeDimensions.push(groupByX);
    }
    if (groupByY && groupByY !== '') {
      activeDimensions.push(groupByY);
    }

    const dimensionsListAll = getDimensionList({
      selectedSignals,
      selectedMetrics,
      groupByX: '',
      groupByY: '',
      selectedFilters: selectedFilters ? selectedFilters : {},
    });

    for (const filter in selectedFilters) {
      if (!dimensionsListAll.includes(filter)) {
        delete selectedFilters[filter];
      }
    }

    // get all data with selected filter
    const statements1 = [];
    const sqInput1 = [];
    let attributeTypeMapping = {};
    for (const signal of selectedSignals) {
      attributeTypeMapping = Object.assign(
        attributeTypeMapping,
        buildAttributeTypeMapping(signal),
      );
    }

    for (const signal in signalMetricsMapping) {
      if (signalMetricsMapping[signal].length > 0) {
        dimensions?.forEach((dimension) => {
          const sf = cloneDeep(selectedFilters);
          delete sf[dimension];
          const dimensionIndex = filterOrder.indexOf(dimension);
          filterOrder.forEach((dimensionName, index) => {
            if (index > dimensionIndex && dimensionIndex !== -1) {
              delete sf[dimensionName];
            }
          });
          let whereClause = createWhereClauseWithFilters(
            sf,
            {},
            attributeTypeMapping,
          );
          const statement = bios
            .iSqlStatement()
            .select('count()')
            .from(signal)
            .groupBy(dimension)
            .orderBy({ key: 'count()', order: 'desc' })
            .where(whereClause === '' ? undefined : whereClause)
            .limit(100)
            .tumblingWindow(duration)
            .snappedTimeRange(durationStart, duration, INTERVAL_5_MIN)
            .build();
          statements1.push(statement);
          sqInput1.push({ signal, dimension });
        });
      }
    }
    // end get all data with selected filter
    let statementData = [];
    if (statements1?.length > 0) {
      statementData = yield bios.multiExecute(...statements1);
    }

    const unselectedFilterData = getFilterObj(statementData);
    const newData = cloneDeep(unselectedFilterData);
    for (const key in newData) {
      if (!dimensionsListAll.includes(key)) {
        delete newData[key];
      }
    }
    yield put(
      reportFiltersActions.setAllFilters({
        allFilters: newData,
        filterSelectedSignals: selectedSignals,
      }),
    );

    yield put(
      reportFiltersActions.setFiltersShow({
        filtersShow: { ...newData },
      }),
    );
    if (shouldSetSelectedFilter) {
      yield put(
        reportFiltersActions.setSelectedFilters({ ...selectedFilters }),
      );
    }
  } catch (error) {
    handleAPIError(error, 'Oops, something went wrong, please try again later');
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_FILTERS, fetchReportFiltersSaga);
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}
