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
import { cloneDeep } from 'lodash';
import { jsonToCSV } from 'react-papaparse';
import { all, fork, put, takeLatest } from 'redux-saga/effects';

import bios from '@bios/bios-sdk';

import { importFlowSpecsCRUD } from 'containers/Integrations/reducers/saga';
import {
  assignIds,
  ErrorNotification,
  handleAPIError,
  incorporateAttributeSynopsis,
  removeInternalProps,
  SuccessNotification,
} from 'containers/utils';
import messages from 'utils/notificationMessages';
import {
  createContextError,
  setContextDetail,
  setContextDetailError,
  setFeaturesStatus,
  updateContextError,
  uploadContextDataFailure,
  uploadContextDataSuccess,
} from './actions';
import {
  CREATE_CONTEXT,
  DELETE_CONTEXT,
  FETCH_CONTEXT_DETAIL,
  UPDATE_CONTEXT,
  UPLOAD_CONTEXT_DATA,
} from './actionTypes';
import { fileSizeInMb, roughSizeOfString } from './UploadContextEntries/utils';
import { buildDataTypeForEnrichment } from 'containers/SignalDetail/utils';

function* getContext(contextName) {
  const contextDetailOrig = yield bios.getContext(contextName);
  contextDetailOrig.attributes = contextDetailOrig.attributes.map((item) => {
    item.defaultEnabled = true;
    return item;
  });
  yield put(setContextDetail(contextDetailOrig));

  let numUpdates = 0;
  if (contextDetailOrig.auditEnabled) {
    const status = yield bios.featureStatus(contextName);
    const now = bios.time.now();
    const delta = now - status.doneUntil;
    const window =
      Math.floor(delta / bios.time.minutes(5)) * bios.time.minutes(5);
    if (delta > bios.time.minutes(5)) {
      const statement = bios
        .iSqlStatement()
        .select('count()')
        .from('audit' + contextName)
        .tumblingWindow(window)
        .snappedTimeRange(now, -window, bios.time.minutes(5))
        .build();
      const result = yield bios.execute(statement);
      const record = result?.dataWindows?.[0]?.records?.[0];
      numUpdates = record?.[0] ?? 0;
    }
  }

  return { contextDetailOrig, numUpdates };
}

async function retrieveEnrichedAttributes(contextDetail) {
  const enrichedAttributeMap = {};

  const enrichments = contextDetail?.enrichments || [];
  if (enrichments.length === 0) {
    return enrichedAttributeMap;
  }
  const contexts = await bios.getContexts({
    detail: true,
    includeInternal: true,
  });
  for (let enrichment of enrichments) {
    const canonForeignKey = enrichment.foreignKey[0].toLowerCase();
    for (let enrichmentAtt of enrichment.enrichedAttributes) {
      enrichedAttributeMap[canonForeignKey] =
        enrichedAttributeMap[canonForeignKey] || [];
      const attributeName = enrichmentAtt.as;
      const enrichmentDataTypes = buildDataTypeForEnrichment(
        contextDetail?.enrichments,
        contexts,
      );
      let attributeType =
        enrichmentDataTypes[attributeName.toLowerCase()]?.type;
      enrichedAttributeMap[canonForeignKey].push({
        attributeName,
        label: attributeName,
        type: attributeType,
        _isEnrichment: true,
      });
    }
  }

  return assignIds(enrichedAttributeMap);
}

function* fetchContextDetail({ contextName }) {
  try {
    const [attributeSynopses, { contextDetailOrig, numUpdates }] =
      yield Promise.all([
        getAttributeSynopses(contextName),
        yield getContext(contextName),
      ]);
    const enrichedAttributeMap = yield retrieveEnrichedAttributes(
      contextDetailOrig,
    );

    contextDetailOrig.attributes = contextDetailOrig.attributes.map((item) => {
      const canonAttrName = item.attributeName.toLowerCase();
      if (enrichedAttributeMap.hasOwnProperty(canonAttrName)) {
        const enrichedAttributes = enrichedAttributeMap[canonAttrName];
        return {
          ...item,
          enrichedAttributes,
        };
      }
      return item;
    });

    const contextDetail = cloneDeep(contextDetailOrig);
    contextDetail.attributes = contextDetail.attributes.map((attribute) => {
      if (attribute?.enrichedAttributes) {
        attribute.enrichedAttributes = attribute.enrichedAttributes.map(
          (enrichedAttribute) => {
            return incorporateAttributeSynopsis(
              attributeSynopses,
              enrichedAttribute,
            );
          },
        );
      }
      return incorporateAttributeSynopsis(attributeSynopses, attribute);
    });

    // calculate feature caught up status
    const primaryKey = contextDetail.primaryKey[0].toLowerCase();
    const total = attributeSynopses[primaryKey]?.count?.[0] ?? 0;
    const percentageCaughtUp = Math.round(
      total === 0 ? 100 : (total / (numUpdates + total)) * 100,
    );
    yield put(setFeaturesStatus({ percentageCaughtUp }));

    yield put(setContextDetail(contextDetail));
  } catch (error) {
    yield put(setContextDetailError('Error in fetching context'));
    handleAPIError(error);
  }
}

const getAttributeSynopses = async (contextName) => {
  const synopsisFuture = bios.getContextSynopsis(contextName);
  const contextSynopsis = await synopsisFuture;
  return contextSynopsis.attributes.reduce((acc, attribute, i) => {
    if (attribute?.attributeName) {
      acc[attribute.attributeName.toLowerCase()] = {
        ...attribute,
        showTrendLIne: true,
        showPercentageChange: true,
      };
    }
    return acc;
  }, {});
};

function* deleteContext({ payload }) {
  try {
    const {
      contextName,
      history,
      parentFlow,
      onCancel,
      onDeleteCreatedContext,
    } = payload;
    yield bios.deleteContext(contextName);
    if (parentFlow && parentFlow === 'onboarding') {
      onDeleteCreatedContext && onDeleteCreatedContext(contextName);
      onCancel && onCancel();
    } else {
      history.push('/contexts');
    }
  } catch (error) {
    handleAPIError(error);
  }
}

function* createContext({ payload, onCreateNewContext, parentFlow }) {
  try {
    delete payload.isNewEntry;

    const contextDetail = yield bios.createContext(
      removeInternalProps(payload),
    );

    if (parentFlow && parentFlow === 'onboarding') {
      yield put(setContextDetail(contextDetail));
      onCreateNewContext && onCreateNewContext(contextDetail?.contextName);
    } else {
      SuccessNotification({
        message: messages.context.contextCreated(contextDetail?.contextName),
      });
      yield put(setContextDetail(contextDetail));
      onCreateNewContext &&
        onCreateNewContext(contextDetail?.contextName, false);
    }
  } catch (error) {
    yield put(createContextError());
    handleAPIError(error);
  }

  try {
    yield importFlowSpecsCRUD({
      name: payload?.contextName,
      type: 'Context',
    });
  } catch (error) {
    handleAPIError(error);
  }
}

function* updateContext({ payload, contextModified }) {
  let contextName = payload.contextName;
  try {
    let contextDetail = removeInternalProps(payload);
    if (contextModified) {
      contextDetail = yield bios.updateContext(contextName, contextDetail);
      contextName = contextDetail.contextName;
    }

    yield importFlowSpecsCRUD({
      name: payload?.contextName,
      type: 'Context',
    });

    yield put(setContextDetail(contextDetail));
    SuccessNotification({
      message: messages.context.contextUpdated(contextName),
    });
  } catch (error) {
    yield put(updateContextError());
    handleAPIError(error);
  }
}

function* uploadContextData({ payload }) {
  let totalEvents = 0;
  let eventsUploaded = 0;

  try {
    const { contextName, data } = payload || {};
    const csv = data.map((row) => {
      return jsonToCSV([row]);
    });

    totalEvents = csv.length;
    const approxRowSize = roughSizeOfString(csv[0]);
    const totalPayloadSize = fileSizeInMb(approxRowSize * csv.length);
    const noOfChunks = Math.ceil(totalPayloadSize); //Each chunk size is approx ~ 1MB
    const approxRecordsInEachChunk = Math.floor(csv.length / noOfChunks);
    const chunksData = [];

    for (let i = 0; i < noOfChunks; i++) {
      if (i === approxRecordsInEachChunk - 1) {
        chunksData[i] = csv.slice(i * approxRecordsInEachChunk);
      } else {
        chunksData[i] = csv.slice(
          i * approxRecordsInEachChunk,
          (i + 1) * approxRecordsInEachChunk,
        );
      }
    }

    for (const [i, chunk] of chunksData.entries()) {
      const statement = bios
        .iSqlStatement()
        .upsert()
        .into(contextName)
        .csvBulk(chunk)
        .build();
      yield bios.execute(statement);
      eventsUploaded =
        i === noOfChunks ? approxRecordsInEachChunk * i : totalEvents;
    }
    SuccessNotification({
      message: 'Data uploaded successfully',
    });
    yield put(uploadContextDataSuccess());
  } catch (error) {
    if (eventsUploaded) {
      SuccessNotification({
        message: eventsUploaded
          ? `${eventsUploaded} events uploaded out of ${totalEvents}`
          : '',
      });
    }
    ErrorNotification({
      message: error.message || 'Error uploading content',
    });
    yield put(uploadContextDataFailure());
    // handleAPIError(error);
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_CONTEXT_DETAIL, fetchContextDetail);
  yield takeLatest(DELETE_CONTEXT, deleteContext);
  yield takeLatest(CREATE_CONTEXT, createContext);
  yield takeLatest(UPDATE_CONTEXT, updateContext);
  yield takeLatest(UPLOAD_CONTEXT_DATA, uploadContextData);
}

export function* watchContextDetailSaga() {
  yield all([fork(actionWatcher)]);
}
