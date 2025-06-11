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
import axios from 'api/axios';
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import bios from '@bios/bios-sdk';

import { fetchActiveStreams, handleAPIError } from 'containers/utils';
import {
  DISABLE_SIGNAL_EXPORT,
  ENABLE_SIGNAL_EXPORT,
  FETCH_SIGNALS,
  FETCH_SIGNAL_CONFIG,
  GET_EXPORT_CONFIG,
} from './actionTypes';
import {
  setSignalConfig,
  setSignals,
  setSignalsError,
  updateExportConfig,
} from './actions';

function* getTenant() {
  return yield select(({ authMe }) => authMe.tenant);
}

async function getSignalsSynopsis(signals) {
  let result = {};
  await Promise.all(
    signals.map(async (signal) => {
      result[signal.signalName] = await bios.getSignalSynopsis(
        signal?.signalName,
      );
    }),
  );
  return result;
}

function* fetchSignals({ payload }) {
  try {
    let signals = yield bios.getSignals({
      detail: true,
      includeInternal: true,
    });
    yield put(setSignals(signals));
    if (payload?.onlyFetchSignals) {
      return;
    }
    try {
      const signalsSynopsis = yield getSignalsSynopsis(signals);
      const tenantName = yield getTenant();
      const activeStreams = yield fetchActiveStreams(tenantName);
      signals = signals.map((signal) => {
        const data = signalsSynopsis[signal.signalName];
        signal.count = data.count;
        signal.attributes = data.attributes;
        signal.showTrendLine = true;
        signal.showPercentageChange = true;
        signal.trendPercentChange = Math.round(
          Math.abs(data.countTrendPercent),
        );
        signal.positiveTrend = data.countTrendDesirability;
        signal.trendLineData = {
          sum: data.count,
        };
        const activityInfo = activeStreams[signal.signalName.toLowerCase()];
        signal.isActive = !!activityInfo;
        if (signal.isActive) {
          const success = activityInfo.successCount;
          const failure = activityInfo.failureCount;
          const total = success + failure;
          let errorPercentage = 0;
          if (total > 0) {
            errorPercentage = ((failure / total) * 100).toFixed(2);
          }
          signal.errorPercentage = errorPercentage;
        }
        return signal;
      });

      yield put(setSignals(signals));
    } catch (e) {
      // eslint-disable-line no-empty
    }
  } catch (e) {
    handleAPIError(e);
    yield put(setSignalsError('Error in fetching Signal'));
  }
}

async function updateDataExportConfig(tenant, payload) {
  return await axios
    .put(`bios/v1/tenants/${tenant}/export/awsDefault`, payload)
    .catch((error) => error);
}

async function getDataExportConfig(tenant) {
  return await axios
    .get(`bios/v1/tenants/${tenant}/export/awsDefault`)
    .catch((error) => error);
}

async function startDataExport(tenant) {
  return await axios
    .post(`bios/v1/tenants/${tenant}/export/awsDefault/start`)
    .catch((error) => error);
}

async function stopDataExport(tenant) {
  return await axios
    .post(`bios/v1/tenants/${tenant}/export/awsDefault/stop`)
    .catch((error) => error);
}

function* disableSignalExport({ payload }) {
  try {
    const tenant = yield getTenant();
    yield call(stopDataExport.bind(this, tenant));
    yield delay(800);
    yield put(updateExportConfig(payload));
  } catch (e) {
    handleAPIError(e);
  }
}

function* enableSignalExport({ payload }) {
  try {
    const tenant = yield getTenant();
    yield call(updateDataExportConfig.bind(this, tenant, payload));
    yield call(startDataExport.bind(this, tenant));
    yield put(
      updateExportConfig({
        awsDefault: payload,
      }),
    );
  } catch (e) {
    handleAPIError(e);
  }
}

function* getSignalExport() {
  try {
    const tenant = yield getTenant();
    const config = yield call(getDataExportConfig.bind(this, tenant));
    yield put(
      updateExportConfig({
        exportConfig: config,
        updatingExportConfig: false,
      }),
    );
  } catch (e) {
    handleAPIError(e);
    yield put(
      updateExportConfig({
        exportConfig: null,
        updatingExportConfig: false,
      }),
    );
  }
}

function* fetchSignalConfig() {
  try {
    let tags = yield bios.getSupportedTags();
    yield put(setSignalConfig(tags));
  } catch (e) {
    handleAPIError(e);
    yield put(setSignalsError('Error in fetching Signal Config'));
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_SIGNAL_CONFIG, fetchSignalConfig);
  yield takeLatest(FETCH_SIGNALS, fetchSignals);
  yield takeLatest(ENABLE_SIGNAL_EXPORT, enableSignalExport);
  yield takeLatest(DISABLE_SIGNAL_EXPORT, disableSignalExport);
  yield takeLatest(GET_EXPORT_CONFIG, getSignalExport);
}

export function* watchSignalSaga() {
  yield all([fork(actionWatcher)]);
}
