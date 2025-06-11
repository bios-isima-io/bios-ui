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
import { cloneDeep, isEqual } from 'lodash';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import bios from '@bios/bios-sdk';

import { fetchContexts } from 'containers/Context/actions';
import { importFlowSpecsCRUD } from 'containers/Integrations/reducers/saga';
import {
  assignIds,
  handleAPIError,
  incorporateAttributeSynopsis,
  removeInternalProps,
  SuccessNotification,
} from 'containers/utils';
import messages from 'utils/notificationMessages';
import {
  createSignalError,
  enrichedAttributesDataSketchesLoaded,
  fetchSignalDetail,
  setSignalDetail,
  setSignalDetailError,
  updateSelectedTab,
  updateSignalDetail,
  updateSignalError,
} from './actions';
import {
  CREATE_SIGNAL,
  DELETE_SIGNAL,
  FETCH_ENRICHED_ATTRIBUTES_DATA_SKETCHES,
  FETCH_SIGNAL_DETAIL,
  UPDATE_SIGNAL,
} from './actionTypes';
import { buildDataTypeForEnrichment, isFeatureContext } from './utils';

/**
 * Ensures that the contexts as the target of a LastN FaC exist if the features are
 * configured.
 *
 * @param signalDetail {object} Signal configuration
 */
async function ensureFeatureContexts(signalDetail, originalSignalDetail) {
  const features = signalDetail.postStorageStage?.features || [];
  const oldFeatures = originalSignalDetail?.postStorageStage?.features || [];
  const featureModified = !isEqual(removeInternalProps(features), oldFeatures);

  if (!featureModified) {
    return;
  }

  for (let i = 0; i < features.length; ++i) {
    const featureDetail = features[i];
    const contextName = featureDetail.featureAsContextName;
    if (!contextName || !featureDetail?._context) {
      continue;
    }

    // check if the context exists
    let existingContext;
    try {
      existingContext = await bios.getContext(contextName);
    } catch (error) {
      existingContext = null;
    }
    const featureContext = removeInternalProps(featureDetail._context);
    const result = isFeatureContext(existingContext, featureContext);
    if (!result.schemaMatches) {
      if (existingContext) {
        await bios.deleteContext(contextName);
      }
      await bios.createContext(featureContext);
    } else if (!result.ttlEquals) {
      await bios.updateContext(contextName, featureContext);
    }
  }
}

async function getAttributeSynopsis(signalName, attributes) {
  let result = {};
  await Promise.all(
    attributes.map(async (attribute) => {
      result[attribute.attributeName.toLowerCase()] =
        attribute.type === 'Boolean'
          ? {}
          : await bios.getAttributeSynopsis(
              signalName,
              attribute.attributeName,
            );
    }),
  );
  return result;
}

async function retrieveEnrichedAttributes(signalDetail) {
  const enrichedAttributeMap = {};

  const enrichments = signalDetail?.enrich?.enrichments || [];
  const contexts = await bios.getContexts({
    detail: true,
    includeInternal: true,
  });
  for (let enrichment of enrichments) {
    const context = contexts?.find(
      (context) => context?.contextName === enrichment.contextName,
    );
    const remoteAttributes = context.attributes.reduce((acc, attr) => {
      acc[attr.attributeName.toLowerCase()] = attr;
      return acc;
    }, {});
    const canonForeignKey = enrichment.foreignKey[0].toLowerCase();
    enrichedAttributeMap[canonForeignKey] =
      enrichedAttributeMap[canonForeignKey] || [];
    enrichment.contextAttributes?.forEach((ctxAttribute) => {
      let remoteAttribute =
        remoteAttributes[ctxAttribute.attributeName.toLowerCase()];
      const attributeName = ctxAttribute.as || ctxAttribute.attributeName;
      if (!remoteAttribute) {
        const enrichmentDataTypes = buildDataTypeForEnrichment(
          context?.enrichments,
          contexts,
        );
        remoteAttribute = enrichmentDataTypes?.[ctxAttribute?.attributeName];
      }
      enrichedAttributeMap[canonForeignKey].push({
        attributeName,
        label: attributeName,
        type: remoteAttribute.type,
        _isEnrichment: true,
      });
    });
  }

  const timeLagEntries = signalDetail?.enrich?.ingestTimeLag || [];
  for (let timeLagEntry of timeLagEntries) {
    const canonAttributeName = timeLagEntry.attribute.toLowerCase();
    const attr = signalDetail.attributes.find(
      (attr) => attr.attributeName.toLowerCase() === canonAttributeName,
    );
    enrichedAttributeMap[canonAttributeName] =
      enrichedAttributeMap[canonAttributeName] || [];
    enrichedAttributeMap[canonAttributeName].push({
      attributeName: timeLagEntry.as,
      label: timeLagEntry.as,
      type: attr?.type,
      _isTimeLag: true,
      _isEnabled: true,
    });
  }

  return assignIds(enrichedAttributeMap);
}

function* fetchSignalDetails({ signalName }) {
  try {
    let signalDetail = yield bios.getSignal(signalName);
    const enrichedAttributeMap = yield retrieveEnrichedAttributes(signalDetail);

    // Add enrichedAttributes to each attributes
    signalDetail.attributes = signalDetail.attributes.map((item) => {
      const canonAttrName = item.attributeName.toLowerCase();
      if (enrichedAttributeMap.hasOwnProperty(canonAttrName)) {
        const enrichedAttributes = enrichedAttributeMap[canonAttrName];
        return {
          ...item,
          enrichedAttributes,
          _timeLag: enrichedAttributes?.find((attr) => attr._isTimeLag)?._id,
        };
      }
      return item;
    });

    signalDetail.isDataBeingIngested = false;
    signalDetail.attributes = signalDetail.attributes.map((item) => {
      item.defaultEnabled = true;
      return item;
    });
    yield put(
      updateSelectedTab(
        signalDetail?.isNewEntry === true
          ? 0
          : signalDetail?.isDataBeingIngested
          ? 1
          : 0,
      ),
    );
    yield put(setSignalDetail(signalDetail));

    try {
      const signalDetailCopy = cloneDeep(signalDetail);
      let attributesSynopsis = yield getAttributeSynopsis(
        signalName,
        signalDetailCopy.attributes,
      );

      signalDetailCopy.attributes = signalDetailCopy.attributes.map(
        (attribute) => {
          return incorporateAttributeSynopsis(attributesSynopsis, attribute);
        },
      );

      yield put(setSignalDetail(signalDetailCopy));
    } catch (e) {
      // eslint-disable-line
    }
  } catch (error) {
    yield put(setSignalDetailError('Error in fetching signal'));
    handleAPIError(error);
  }
}

function* deleteSignal({ payload }) {
  try {
    const { signalName, history, parentFlow, onCancel, onDeleteCreatedSignal } =
      payload;
    yield bios.deleteSignal(signalName);
    if (parentFlow && parentFlow === 'onboarding') {
      onDeleteCreatedSignal && onDeleteCreatedSignal(signalName);
      onCancel && onCancel();
    } else {
      history.push('/signals');
    }
  } catch (error) {
    // eslint-disable-line
  }
}

function* createSignal({ payload, onCreateNewSignal, parentFlow }) {
  let signalDetail;
  try {
    yield ensureFeatureContexts(payload);
    let signalConfig = removeInternalProps(payload);
    if (isAccumulatingCount({ payload })) {
      signalConfig = addOperationToSignal(payload);
    }
    signalDetail = yield bios.createSignal(signalConfig);
    if (parentFlow && parentFlow === 'onboarding') {
      // yield put(fetchSignalDetail(payload.signalName));
      onCreateNewSignal && onCreateNewSignal(signalDetail?.signalName);
    } else {
      SuccessNotification({
        message: messages.signal.signalCreated(signalDetail?.signalName),
      });
      yield put(fetchSignalDetail(payload.signalName));
      onCreateNewSignal && onCreateNewSignal(signalDetail?.signalName);
    }
  } catch (error) {
    yield put(createSignalError());
    handleAPIError(error);
  }

  try {
    yield importFlowSpecsCRUD({
      name: payload?.signalName,
      type: 'Signal',
    });
  } catch (error) {
    handleAPIError(error);
  }
}

const signalHasOperations = ({ originalSignalDetail }) => {
  const operationAttribute = originalSignalDetail?.attributes?.find(
    (att) => att?.attributeName === 'operation',
  );
  return operationAttribute ? true : false;
};

const isAccumulatingCount = ({ payload }) => {
  let accumulatingCountEnabled = false;
  const materializedAsItem = payload?.postStorageStage?.features?.some(
    (f) => f?.materializedAs === 'AccumulatingCount',
  );
  if (materializedAsItem) {
    accumulatingCountEnabled = true;
  }
  return accumulatingCountEnabled;
};

const shouldUpdateSignalForMaterialized = ({
  payload,
  originalSignalDetail,
}) => {
  const hasMaterialized = isAccumulatingCount({ payload });
  return !signalHasOperations({ originalSignalDetail }) && hasMaterialized;
};

const addOperationToSignal = (signalDetails) => {
  const clonedSignalDetails = cloneDeep(signalDetails);
  clonedSignalDetails?.attributes?.push({
    attributeName: 'operation',
    type: 'String',
    tags: {
      category: 'Dimension',
      firstSummary: 'WORD_CLOUD',
    },
    allowedValues: ['change', 'set'],
    default: 'set',
  });
  return clonedSignalDetails;
};

function* updateSignal({ payload, signalModified, originalSignalDetail }) {
  let signalName = payload.signalName;
  try {
    if (signalModified) {
      yield ensureFeatureContexts(payload, originalSignalDetail);
      let signalConfig = removeInternalProps(payload);
      if (
        shouldUpdateSignalForMaterialized({ payload, originalSignalDetail })
      ) {
        signalConfig = addOperationToSignal(payload);
      }
      const signalDetail = yield bios.updateSignal(signalName, signalConfig);
      signalName = signalDetail.signalName;
    }

    yield put(fetchContexts());
    yield put(fetchSignalDetail(payload?.signalName));

    yield importFlowSpecsCRUD({
      name: payload?.signalName,
      type: 'Signal',
    });

    SuccessNotification({
      message: messages.signal.signalUpdated(signalName),
    });
  } catch (error) {
    yield put(updateSignalError());
    handleAPIError(error);
  }
}

function* getSignalDetail() {
  return yield select(({ signalDetail }) => signalDetail.signalDetail);
}

function* fetchEnrichedAttributesDataSketches({ payload }) {
  try {
    const { signalLabel } = payload;
    const signalDetail = yield getSignalDetail();
    const newSignalDetail = cloneDeep(signalDetail);

    let enrichedAttributes = [];
    let index = null;
    signalDetail.attributes.forEach((attribute, i) => {
      if (attribute.label === signalLabel) {
        index = i;
        enrichedAttributes = attribute.enrichedAttributes;
      }
    });

    let attributesSynopsis = yield getAttributeSynopsis(
      newSignalDetail.signalName,
      enrichedAttributes,
    );

    newSignalDetail.attributes[index].enrichedAttributes =
      newSignalDetail.attributes[index].enrichedAttributes.map((attribute) => {
        return incorporateAttributeSynopsis(attributesSynopsis, attribute);
      });
    yield put(updateSignalDetail(newSignalDetail));
    yield put(enrichedAttributesDataSketchesLoaded());
  } catch (error) {
    yield put(enrichedAttributesDataSketchesLoaded());
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_SIGNAL_DETAIL, fetchSignalDetails);
  yield takeLatest(DELETE_SIGNAL, deleteSignal);
  yield takeLatest(CREATE_SIGNAL, createSignal);
  yield takeLatest(UPDATE_SIGNAL, updateSignal);
  yield takeLatest(
    FETCH_ENRICHED_ATTRIBUTES_DATA_SKETCHES,
    fetchEnrichedAttributesDataSketches,
  );
}

export function* watchSignalDetailSaga() {
  yield all([fork(actionWatcher)]);
}
