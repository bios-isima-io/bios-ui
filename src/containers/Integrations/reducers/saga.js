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
import { cloneDeep } from 'lodash-es';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import { flowSpecsActions } from 'containers/Integrations/components/FlowListRightPanel/reducers';
import {
  INTEGRATION_TYPE_FACEBOOK,
  INTEGRATION_TYPE_GOOGLE,
} from 'containers/Integrations/const';
import { fetchSignals } from 'containers/Signal/actions';
import {
  fetchActiveStreams,
  handleAPIError,
  removeInternalProps,
  SuccessNotification,
} from 'containers/utils';
import messages from 'utils/notificationMessages';
import integrationActions from './actions';
import {
  DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE,
  FETCH_INTEGRATION_CONFIG,
  FETCH_INTEGRATION_SOURCE_QUALITY,
  GET_IMPORT_FLOW_SPEC,
  SAVE_INTEGRATIONS,
} from './actionTypes';
import {
  buildContextFacebookObj,
  buildContextGoogleObj,
  buildFlowFacebookObj,
  buildFlowGoogleObj,
  buildSignalFacebookObj,
  buildSignalGoogleObj,
} from './buildStreams';
import { assignIds } from 'containers/utils';
import { sqlQuotesHandler } from 'containers/ReportV2/components/ReportGraph/utils';
import moment from 'moment';

const successFunc = () => {
  return {
    status: 'success',
  };
};

const errorFunc = (error) => {
  return {
    status: 'error',
    error,
  };
};

function* getImportFlowSpecsCopy() {
  return yield select(
    ({ integration }) => integration?.integrationConfig?.importFlowSpecsCopy,
  );
}

function* fetchIntegrationConfig() {
  try {
    const tenant = yield bios.getTenant({ detail: true });
    let {
      importSources,
      importDestinations,
      importDataProcessors,
      importFlowSpecs,
      exportDestinations,
      tenantName,
    } = tenant;
    exportDestinations = assignIds(exportDestinations || []);
    yield put(
      integrationActions.setIntegrationConfig({
        importSources,
        importSourcesCopy: importSources,
        importDestinations,
        importDestinationsCopy: importDestinations,
        importDataProcessors,
        importDataProcessorsCopy: importDataProcessors,
        importFlowSpecs,
        importFlowSpecsCopy: importFlowSpecs,
        exportDestinations,
        exportDestinationsCopy: exportDestinations,
      }),
    );

    try {
      const allSignalHavingFlows = [];

      importFlowSpecs.forEach((flow) => {
        if (
          flow.destinationDataSpec.type === 'Signal' &&
          !allSignalHavingFlows.includes(flow.destinationDataSpec.name)
        ) {
          allSignalHavingFlows.push(flow.destinationDataSpec.name);
        }
      });

      const activeStreams = yield fetchActiveStreams(tenantName);

      const updatedImportSources = importSources.map((source) => {
        const isActive = importFlowSpecs.some((flow) => {
          if (flow.sourceDataSpec?.importSourceId === source.importSourceId) {
            const canonName = flow.destinationDataSpec?.name?.toLowerCase();
            return canonName && !!activeStreams[canonName];
          }
          return false;
        });
        return { ...source, status: isActive ? 'active' : 'inactive' };
      });

      yield put(
        integrationActions.setIntegrationConfig({
          importSources: updatedImportSources,
          importSourcesCopy: updatedImportSources,
          importDestinations,
          importDestinationsCopy: importDestinations,
          importDataProcessors,
          importDataProcessorsCopy: importDataProcessors,
          importFlowSpecs,
          importFlowSpecsCopy: importFlowSpecs,
          exportDestinations,
          exportDestinationsCopy: exportDestinations,
        }),
      );
    } catch (err) {
      // skip the error
    }
  } catch (error) {
    yield put(integrationActions.fetchIntegrationConfigError());
    handleAPIError(error);
  }
}

function* createImportSource(importSourceConfig) {
  try {
    yield bios.createImportSource(importSourceConfig);
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* updateImportSource(importSourceConfig) {
  try {
    yield bios.updateImportSource(
      importSourceConfig.importSourceId,
      importSourceConfig,
    );
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* deleteImportSource(importSourceConfig) {
  try {
    yield bios.deleteImportSource(importSourceConfig.importSourceId);
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* handleFbGoogleAds({ payload }) {
  try {
    let signals = yield select(({ signals }) => signals.signals);
    let contexts = yield select(({ contexts }) => contexts.contexts);
    let { isc } = payload;
    let contextPayload, signalPayload, flowPayload;
    let signalNameExist = signals.some(
      (signal) => signal.signalName === 'marketingMetrics',
    );
    let contextNameExist = false;
    if (isc.type === INTEGRATION_TYPE_GOOGLE) {
      isc.importSourceId = 'googleAdsInput';
      contextNameExist = contexts.some(
        (context) => context.contextName === 'googleLastKnownMetrics',
      );
      contextPayload = buildContextGoogleObj();
      signalPayload = buildSignalGoogleObj();
      flowPayload = buildFlowGoogleObj(isc.importDestinationId);
    } else if (isc.type === INTEGRATION_TYPE_FACEBOOK) {
      isc.importSourceId = 'fbAdsInput';
      contextNameExist = contexts.some(
        (context) => context.contextName === 'fbLastKnownMetrics',
      );
      contextPayload = buildContextFacebookObj();
      signalPayload = buildSignalFacebookObj();
      flowPayload = buildFlowFacebookObj(isc.importDestinationId);
    }
    yield createImportSource({
      ...isc,
    });
    if (!contextNameExist) {
      yield bios.createContext(contextPayload);
    }
    if (!signalNameExist) {
      yield bios.createSignal(signalPayload);
      yield put(fetchSignals());
    }
    yield bios.createImportFlowSpec(flowPayload);
    return {};
  } catch (error) {
    return { error: `Error  saving ${payload.isc.type} source` };
  }
}

const deleteActionParams = (spec) => {
  delete spec?.shouldDelete;
  delete spec?.shouldUpdate;
  delete spec?.shouldCreate;
};

function* importFlowSpecsCRUD({ name, type }) {
  try {
    const importFLowSpecsCopy = yield getImportFlowSpecsCopy();
    const filteredFlow = importFLowSpecsCopy?.filter(
      (spec) =>
        spec?.destinationDataSpec?.name === name &&
        spec?.destinationDataSpec?.type === type,
    );
    const hasErrors = [];
    let shouldFetchFlows = false;
    yield* filteredFlow?.map(function* (spec) {
      //Fix data type issue with kwArgs
      if (spec?.sourceDataSpec?.kwArgs) {
        const kwArgs = cloneDeep(spec.sourceDataSpec.kwArgs);
        Object.keys(kwArgs).forEach((key) => {
          let value = kwArgs[key];
          if (value === 'true' || value === 'TRUE') {
            value = true;
          } else if (value === 'false' || value === 'FALSE') {
            value = false;
          } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            value = +value;
          }
          kwArgs[key] = value;
        });

        spec.sourceDataSpec.kwArgs = kwArgs;
      }
      const { shouldDelete, shouldUpdate, shouldCreate } = spec;
      if (shouldDelete) {
        const resp = yield deleteImportFlowSpec(spec);
        if (resp?.error) {
          hasErrors.push(resp.error);
        } else {
          deleteActionParams(spec);
        }
        shouldFetchFlows = true;
      } else if (shouldCreate) {
        const resp = yield createImportFlowSpec({
          payload: { ...spec },
        });
        if (resp?.error) {
          hasErrors.push(resp.error);
        } else {
          deleteActionParams(spec);
        }
        shouldFetchFlows = true;
      } else if (shouldUpdate) {
        const resp = yield updateImportFlowSpec({
          payload: {
            ...spec,
          },
        });
        if (resp?.error) {
          hasErrors.push(resp.error);
        } else {
          deleteActionParams(spec);
        }
        shouldFetchFlows = true;
      }
    });

    if (hasErrors?.length > 0) {
      hasErrors.forEach((err) => {
        handleAPIError(err);
      });
      return;
    }
    if (shouldFetchFlows) {
      yield put(integrationActions.fetchIntegrationConfig({ loading: false }));
    }
  } catch (error) {
    handleAPIError(error);
  }
}

function* deleteImportFlowByNameAndType({ payload: { name, type } }) {
  try {
    const importFLowSpecsCopy = yield getImportFlowSpecsCopy();
    const filteredFlow = importFLowSpecsCopy?.filter(
      (spec) =>
        spec?.destinationDataSpec?.name === name &&
        spec?.destinationDataSpec?.type === type,
    );
    const hasErrors = [];
    yield* filteredFlow?.map(function* (spec) {
      const resp = yield deleteImportFlowSpec(spec);
      if (resp?.error) {
        hasErrors.push(resp.error);
      }
    });

    if (hasErrors?.length > 0) {
      hasErrors.forEach((err) => {
        handleAPIError(err);
      });
    }
  } catch (error) {
    handleAPIError(error);
  }
}

function* createImportFlowSpec({ payload }) {
  try {
    yield put(flowSpecsActions.setFlowConfig({ saving: true }));
    yield bios.createImportFlowSpec(payload);
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* updateImportFlowSpec({ payload }) {
  try {
    yield put(flowSpecsActions.setFlowConfig({ saving: true }));
    yield bios.updateImportFlowSpec(payload?.importFlowId, payload);
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* deleteImportFlowSpec(importFlowSpec) {
  try {
    yield bios.deleteImportFlowSpec(importFlowSpec.importFlowId);
    return successFunc();
  } catch (error) {
    return errorFunc(error);
  }
}

function* getImportFlowSpec({ payload }) {
  try {
    const importFLowSpecsCopy = yield getImportFlowSpecsCopy();
    const importFlow = importFLowSpecsCopy?.filter(
      (spec) => spec.importFlowId === payload?.id,
    );

    yield put(flowSpecsActions.setFlowConfig(importFlow?.[0]));
  } catch (error) {
    handleAPIError(error);
  }
}

function* saveIntegrations({ payload }) {
  const {
    importDestinationsCopy,
    importSourcesCopy,
    importDataProcessorsCopy,
    exportDestinationsCopy,
  } = payload;

  const errors = [];

  yield saveImportDestinations(importDestinationsCopy, errors);

  yield* saveImportSources(importSourcesCopy, errors);

  yield saveImportDataProcessors(importDataProcessorsCopy, errors);
  yield saveExportDestinations(exportDestinationsCopy, errors);

  yield concludeSavingIntegrations(errors);

  const saveIntegrationResult =
    errors.length === 0 ? successFunc() : errorFunc();
  yield put(integrationActions.saveIntegrationsResult(saveIntegrationResult));
}

async function saveExportDestinations(exportDestinations, hasErrors) {
  for (let destination of exportDestinations || []) {
    const { shouldCreate, shouldUpdate, shouldDelete } = destination;
    let promise = null;
    if (shouldCreate) {
      promise = bios.createExportDestination(removeInternalProps(destination));
    } else if (shouldUpdate) {
      promise = bios.updateExportDestination(
        destination.exportDestinationId,
        removeInternalProps(destination),
      );
    } else if (shouldDelete) {
      promise = bios.deleteExportDestination(destination.exportDestinationId);
    }

    if (promise) {
      try {
        await promise;
      } catch (error) {
        hasErrors.push(error);
      }
    }
  }
}

async function saveImportDestinations(importDestinations, errors) {
  for (let destination of importDestinations || []) {
    const { shouldUpdate, shouldCreate, shouldDelete } = destination;
    delete destination?.shouldUpdate;
    delete destination?.shouldCreate;
    delete destination?.shouldDelete;
    let promise = null;
    if (shouldUpdate) {
      promise = bios.updateImportDestination(
        destination.importDestinationId,
        destination,
      );
    } else if (shouldCreate) {
      promise = bios.createImportDestination(destination);
    } else if (shouldDelete) {
      promise = bios.deleteImportDestination(destination?.importDestinationId);
    }
    if (promise) {
      try {
        await promise;
      } catch (error) {
        errors.push(error);
      }
    }
  }
}

function* saveImportSources(importSources, errors) {
  const counter = { key: 101 };
  for (let source of importSources || []) {
    const { shouldDelete, shouldUpdate, shouldCreate } = source;
    delete source?.shouldDelete;
    delete source?.shouldUpdate;
    delete source?.shouldCreate;
    if (shouldDelete) {
      const resp = yield deleteImportSource(source);
      if (resp?.error) {
        errors.push(resp.error);
      }
      const importFLowSpecsCopy = yield getImportFlowSpecsCopy();
      const flowsToDelete =
        importFLowSpecsCopy?.filter((spec) => {
          return source.importSourceId === spec.sourceDataSpec?.importSourceId;
        }) || [];
      for (let flowSpec of flowsToDelete) {
        const resp2 = yield deleteImportFlowSpec(flowSpec);
        if (resp2?.error) {
          errors.push(resp.error);
        }
      }
    } else if (shouldUpdate) {
      const resp = yield updateImportSource(source);
      if (resp?.error) {
        errors.push(resp.error);
      }
    } else if (shouldCreate) {
      let resp;
      if (
        source.type === INTEGRATION_TYPE_FACEBOOK ||
        source.type === INTEGRATION_TYPE_GOOGLE
      ) {
        resp = yield handleFbGoogleAds({
          payload: { isc: source, counter },
        });
      } else {
        resp = yield createImportSource(source);
      }
      if (resp?.error) {
        errors.push(resp.error);
      }
    }
  }
}

async function saveImportDataProcessors(importDataProcessors, errors) {
  for (let processor of importDataProcessors || []) {
    const { shouldDelete, shouldUpdate, shouldCreate } = processor;
    delete processor?.shouldDelete;
    delete processor?.shouldUpdate;
    delete processor?.shouldCreate;
    let promise = null;
    if (shouldDelete) {
      promise = bios.deleteImportDataProcessor(processor.processorName);
    } else if (shouldUpdate) {
      promise = bios.updateImportDataProcessor(
        processor.processorName,
        processor.code,
      );
    } else if (shouldCreate) {
      promise = bios.createImportDataProcessor(
        processor.processorName,
        processor.code,
      );
    }
    if (promise) {
      try {
        await promise;
      } catch (error) {
        errors.push(error);
      }
    }
  }
}

function* concludeSavingIntegrations(errors) {
  // Turn off the saving state
  yield put(integrationActions.setIntegrationConfig({ savingSrcDest: false }));

  // Reload integration config states
  // TODO: Improve the implementation to avoid reloading the entire integration configs
  yield put(integrationActions.fetchIntegrationConfig({ loading: false }));

  // notify completion
  if (errors?.length === 0) {
    SuccessNotification({
      message: messages.integration.INTEGRATION_SAVE_SUCCESS,
    });
  }
  // show errors first
  errors.forEach(handleAPIError);
}

function* fetchIntegrationSourceQuality({ payload }) {
  const { streamsList } = payload;
  const tenantName = yield select(({ authMe }) => authMe.tenant);
  let totalSignal = '_clientMetrics';
  let errorSignal = '_operationFailure';
  if (tenantName === '_system') {
    totalSignal = '_operations';
    errorSignal = '_allOperationFailure';
  }
  const dimension = 'stream';
  const duration = 3600000; //259200000; 3d  86400000; 1d
  const durationStart = moment.now() - duration;
  const snappedTimeRange = 3600000;

  const statements = [];
  const streamsListFlat = streamsList
    .map((item) => {
      return sqlQuotesHandler(item, 'String');
    })
    .join(',');

  const whereClause =
    streamsList.length > 0 ? `"stream" IN (${streamsListFlat})` : null;

  const statement1 = bios
    .iSqlStatement()
    .select('sum(numSuccessfulOperations)')
    .from(totalSignal)
    .groupBy(dimension)
    .orderBy({ key: 'count()', order: 'desc' })
    .where(whereClause ? whereClause : undefined)
    .limit(streamsList.length)
    .tumblingWindow(duration)
    .snappedTimeRange(durationStart, duration, snappedTimeRange)
    .build();
  statements.push(statement1);

  const statement2 = bios
    .iSqlStatement()
    .select('count()')
    .from(errorSignal)
    .groupBy(dimension)
    .orderBy({ key: 'count()', order: 'desc' })
    .where(whereClause ? whereClause : undefined)
    .limit(streamsList.length)
    .tumblingWindow(duration)
    .snappedTimeRange(durationStart, duration, snappedTimeRange)
    .build();
  statements.push(statement2);

  if (statements?.length > 0) {
    const statementData = yield bios.multiExecute(...statements);
    yield put(
      integrationActions.setIntegrationConfig({
        sourceQualityData: statementData,
      }),
    );
  }
}

function* actionWatcher() {
  yield takeLatest(FETCH_INTEGRATION_CONFIG, fetchIntegrationConfig);
  yield takeLatest(GET_IMPORT_FLOW_SPEC, getImportFlowSpec);
  yield takeLatest(SAVE_INTEGRATIONS, saveIntegrations);
  yield takeLatest(
    DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE,
    deleteImportFlowByNameAndType,
  );
  yield takeLatest(
    FETCH_INTEGRATION_SOURCE_QUALITY,
    fetchIntegrationSourceQuality,
  );
}

export default function* saga() {
  yield all([fork(actionWatcher)]);
}

export { importFlowSpecsCRUD };
