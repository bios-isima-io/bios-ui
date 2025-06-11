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
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import LineBreak from 'components/LineBreak';
import LineCenteredText from 'components/LineCenteredText';
import SwitchWrapper from 'components/Switch';
import { Input } from 'containers/components';
import { fetchContexts } from 'containers/Context/actions';
import SourceList from 'containers/Integrations/components/FlowListRightPanel/components/IntegrationTypes/SourceList';
import {
  ACTIVE_INTEGRATIONS,
  AUTH_TYPE_LOGIN,
} from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import integrationStyles from 'containers/Integrations/styles';
import {
  buildKafkaImportSrcData,
  buildRdbmsPullImportSrcData,
  buildRdbmsImportSrcData,
  validateKafkaSource,
  validateRdbmsPullSource,
  validateRdbmsSource,
  validateSourceInstance,
  validateMongodbSource,
  buildMongodbImportSrcData,
} from 'containers/Integrations/utils';
import Actions from 'containers/Onboarding/components/Actions';
import OnboardingSteps from 'containers/Onboarding/components/OnboardingSteps';
import insightsSetupStyles from 'containers/Onboarding/InsightSetUp/style';
import onboardingStyles from 'containers/Onboarding/styles';
import { fetchSignals } from 'containers/Signal/actions';
import { ErrorNotification } from 'containers/utils';
import { removeObjectKey } from 'utils/index';
import messages from 'utils/notificationMessages';
import { v4 as uuidv4 } from 'uuid';
import { RenderUneditableText } from './helperComponent';
import KafkaWrapper from './KafkaWrapper';
import MysqlWrapper from './MysqlWrapper';
import PostgresWrapper from './PostgresWrapper';
import MongoDBWrapper from './MongoDBWrapper';
import { integrationOnboardingActions } from './reducers';

const { userClicks } = ipxl;
const {
  fetchIntegrationConfig,
  saveIntegrations,
  resetSaveIntegrationsResult,
} = integrationActions;
const {
  setOnboardingIntegration,
  resetOnboardingIntegration,
  setMysqlOnboarding,
} = integrationOnboardingActions;

function ImportSources({
  fetchIntegrationConfig,
  importSourcesCopy,
  importDestinations,
  setOnboardingIntegration,
  resetOnboardingIntegration,
  integrationName,
  importSourceId,
  shouldUpdate,
  kafka,
  mysql,
  postgres,
  mongodb,
  saveIntegrations,
  fetchSignals,
  fetchContexts,
  setStep,
  signals,
  contexts,
  selectedEntitySource,
  setMysqlOnboarding,
  saveIntegrationResult,
  resetSaveIntegrationsResult,
  reset,
  history,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (signals === null || signals.length === 0) {
      fetchSignals({
        onlyFetchSignals: true,
      });
    }
    if (contexts === null || contexts.length === 0) {
      fetchContexts();
    }
    // fetching signals and contexts should be done only once on loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [existingIntegration, setExistingIntegration] = useState(false);
  const [disableFieldEdit, setDisableFieldEdit] = useState(false);

  const loadExistingIntegrationData = (id) => {
    if (id === 'NA') {
      setExistingIntegration(false);
      resetOnboardingIntegration();
      setDisableFieldEdit(false);
      return;
    }
    setDisableFieldEdit(true);
    setExistingIntegration(true);
    const source = importSourcesCopy.find((is) => is.importSourceId === id);
    if (source.type === 'Mysql' || source.type === 'Postgres') {
      setSourceType(source.type);
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      buildAuth.srcUser = source?.authentication?.user;
      buildAuth.srcPassword = source?.authentication?.password;

      let rdbms = {
        databaseHost: source?.databaseHost,
        databasePort: source?.databasePort,
        databaseName: source?.databaseName,
        type: source.type,
        ...(source.hasOwnProperty('ssl') && {
          ssl: source?.ssl,
        }),
        ...(source.hasOwnProperty('slotName') && {
          slotName: source?.slotName,
        }),
        ...buildAuth,
      };

      setOnboardingIntegration({
        importSourceId: source.importSourceId,
        integrationName: source.importSourceName,
        ...(source.type === 'Mysql' && {
          mysql: rdbms,
        }),
        ...(source.type === 'Postgres' && {
          postgres: rdbms,
        }),
      });
    } else if (source.type === 'Kafka') {
      setSourceType('Kafka');
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      if (source?.authentication?.type === 'SaslPlaintext') {
        buildAuth.srcUser = source?.authentication?.user;
        buildAuth.srcPassword = source?.authentication?.password;
      }
      setOnboardingIntegration({
        importSourceId: source.importSourceId,
        integrationName: source.importSourceName,
        kafka: {
          bootstrapServers: source?.bootstrapServers,
          apiVersion: source?.apiVersion.join('.'),
          ...buildAuth,
        },
      });
    } else if (source.type === 'MysqlPull') {
      setSourceType(source.type);
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      buildAuth.srcUser = source?.authentication?.user;
      buildAuth.srcPassword = source?.authentication?.password;

      setOnboardingIntegration({
        importSourceId: source.importSourceId,
        integrationName: source.importSourceName,
        mysql: {
          databaseHost: source?.databaseHost,
          databasePort: source?.databasePort,
          databaseName: source?.databaseName,
          type: source.type,
          pollingInterval: source?.pollingInterval,
          ...(source.hasOwnProperty('columnName') && {
            columnName: source?.columnName,
          }),
          ...(source.hasOwnProperty('ssl') && {
            ssl: source?.ssl,
          }),
          ...(source.hasOwnProperty('columnName') && {
            columnName: source?.columnName,
          }),
          ...buildAuth,
        },
      });
    } else if (source.type === 'Mongodb') {
      setSourceType(source.type);
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      buildAuth.srcUser = source?.authentication?.user;
      buildAuth.srcPassword = source?.authentication?.password;

      setOnboardingIntegration({
        importSourceId: source.importSourceId,
        integrationName: source.importSourceName,

        mongodb: {
          endpoints: source?.endpoints,
          databaseName: source?.databaseName,
          replicaSet: source?.replicaSet,
          authSource: source?.authSource,
          useDnsSeedList: source?.useDnsSeedList,
          type: source.type,

          ...(source.hasOwnProperty('ssl') && {
            ssl: source?.ssl,
          }),

          ...buildAuth,
        },
      });
    }
  };

  useEffect(() => {
    fetchIntegrationConfig({ loading: true });
    // fetching integration config should be done only once on loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [sourceType, setSourceType] = useState(selectedEntitySource);
  const setSourceInfo = () => {
    if (importSourceId === '' || importSourceId === undefined) {
      setSourceType('Kafka');
      return;
    }
    const srcType = importSourcesCopy?.find(
      (src) => src.importSourceId === importSourceId,
    )?.['type'];
    if (ACTIVE_INTEGRATIONS?.includes(srcType)) {
      setSourceType(srcType);
    }
  };

  useEffect(() => {
    if (importSourceId) {
      setSourceInfo();
      setExistingIntegration(true);
      setDisableFieldEdit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importSourceId]);

  useEffect(() => {
    if (saveIntegrationResult) {
      saveIntegrationResult?.status === 'success' && setStep(4);
      saveIntegrationResult?.status === 'error' && setStep(6);
      resetSaveIntegrationsResult();
    }
  }, [saveIntegrationResult, resetSaveIntegrationsResult, setStep]);

  const saveIntegrationsConfig = () => {
    if (!existingIntegration) {
      // Validate process instance limitation based on source type
      const validationMsg = validateSourceInstance(
        sourceType,
        importSourcesCopy,
      );
      if (validationMsg !== '') {
        ErrorNotification({ message: validationMsg });
        return;
      }
    }

    let src = null;
    if (sourceType === 'Kafka') {
      const validationMessage = validateKafkaSource(
        kafka,
        integrationName.trim(),
        setErrors,
        errors,
      );
      if (validationMessage !== '') {
        ErrorNotification({ message: validationMessage });
        return;
      }
      src = buildKafkaImportSrcData(
        kafka,
        integrationName.trim(),
        kafka?.importDestinationId || '',
      );
    } else if (sourceType === 'Mysql' || sourceType === 'Postgres') {
      let rdbms = null;
      switch (sourceType) {
        case 'Mysql':
          rdbms = mysql;
          break;
        case 'Postgres':
          rdbms = postgres;
          rdbms.slotName = rdbms?.slotName
            ? rdbms.slotName
            : uuidv4().replaceAll('-', '_');
          break;
        default:
          rdbms = mysql;
      }
      const validationMessage = validateRdbmsSource(
        rdbms,
        integrationName.trim(),
        setErrors,
        errors,
      );
      if (validationMessage !== '') {
        ErrorNotification({ message: validationMessage });
        return;
      }
      src = buildRdbmsImportSrcData({
        rdbms,
        integrationName: integrationName.trim(),
        importDestinationId: rdbms?.importDestinationId || '',
      });
    } else if (sourceType === 'MysqlPull') {
      const validationMessage = validateRdbmsPullSource(
        mysql,
        integrationName.trim(),
        setErrors,
        errors,
      );
      if (validationMessage !== '') {
        ErrorNotification({ message: validationMessage });
        return;
      }
      src = buildRdbmsPullImportSrcData({
        rdbms: mysql,
        integrationName: integrationName.trim(),
        importDestinationId: mysql?.importDestinationId || '',
      });
    } else if (sourceType === 'Mongodb') {
      const validationMessage = validateMongodbSource(
        mongodb,
        integrationName.trim(),
        setErrors,
        errors,
      );
      if (validationMessage !== '') {
        ErrorNotification({ message: validationMessage });
        return;
      }
      src = buildMongodbImportSrcData({
        mongodb,
        integrationName: integrationName.trim(),
        importDestinationId: mongodb?.importDestinationId || '',
      });
    }
    if (existingIntegration) {
      src.shouldUpdate = true;
      src.importSourceId = importSourceId;
      if (!shouldUpdate) {
        setStep(4);
        return;
      }
    } else {
      const authLogin = importDestinations?.find(
        (id) => id?.authentication?.type === AUTH_TYPE_LOGIN,
      );
      if (authLogin) {
        src.importDestinationId = authLogin.importDestinationId;
      } else {
        ErrorNotification({
          message: messages.onboarding.UNAVAILABLE_DESTINATION,
        });
        return;
      }
      src.shouldCreate = true;
      const uuidValue = uuidv4();
      setOnboardingIntegration({
        importSourceId: uuidValue,
      });
      src.importSourceId = uuidValue;
    }

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Start discovery',
      rightSection: 'None',
      mainSection: 'onboardingDataSourceDetail',
      leftSection: 'onboarding',
    });
    saveIntegrations({
      importDestinationsCopy: [],
      importSourcesCopy: [src],
      importDataProcessorsCopy: [],
    });
  };
  const importSources = importSourcesCopy
    ? importSourcesCopy.filter((source) => {
        return sourceType === source.type;
      })
    : [];

  return (
    <div className={css(onboardingStyles.wrapperContainer)}>
      <OnboardingSteps activeIndex={1} />
      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.headerItem)}>{sourceType}</div>
      </div>
      <div className={css(onboardingStyles.wrapper)}>
        <div className={css(onboardingStyles.sourceListWrapper)}>
          <SourceList
            importSourceId={importSourceId}
            sources={importSources}
            setSourceData={setOnboardingIntegration}
            loadExistingIntegrationData={loadExistingIntegrationData}
            page="onboarding"
            sourceType={sourceType}
            existingIntegration={existingIntegration}
          />
        </div>

        {!existingIntegration && <LineCenteredText text="OR" />}
        {!existingIntegration && (
          <div
            className={css(
              integrationStyles.onboardingIntegrationTitle,
              onboardingStyles.onboardingSourceNewHeader,
            )}
          >
            Add new source{' '}
          </div>
        )}

        {existingIntegration && (
          <div
            className={css(
              integrationStyles.rPanelSubSectionRow,
              onboardingStyles.onboardingSourceExistingHeader,
            )}
          >
            <div className={css(integrationStyles.rPanelSubSectionCol1)}>
              <div
                className={css(integrationStyles.onboardingIntegrationTitle)}
              >
                Source details{' '}
              </div>
            </div>
            <div
              className={css(
                integrationStyles.rPanelSubSectionCol2,
                integrationStyles.rPanelSubSectionCol2TextOnboarding,
                integrationStyles.editButton,
              )}
              onClick={() => setDisableFieldEdit(!disableFieldEdit)}
            >
              {disableFieldEdit ? 'Edit' : 'Save'}
            </div>
          </div>
        )}
        <div className={css(integrationStyles.rPanelSubSectionRow)}>
          <div className={css(integrationStyles.rPanelSubSectionCol1)}>
            Name
          </div>
          <div>
            {disableFieldEdit ? (
              <RenderUneditableText text={integrationName} />
            ) : (
              <Input
                error={errors.integrationName}
                hideSuffix={true}
                placeholder="Name"
                onChange={(event) => {
                  setErrors(removeObjectKey(errors, 'integrationName'));
                  setOnboardingIntegration({
                    shouldUpdate: true,
                    integrationName: event.target.value,
                  });
                }}
                value={integrationName}
                disabled={disableFieldEdit}
              />
            )}
          </div>
        </div>

        {sourceType === 'Mysql' && (
          <div className={css(integrationStyles.rPanelSubSectionRow)}>
            <div className={css(integrationStyles.rPanelSubSectionCol1)}>
              Ingestion Type
            </div>
            <div className={css(integrationStyles.toggleContainer)}>
              <SwitchWrapper
                checked={mysql?.type === 'MysqlPull'}
                onChange={(bool) => {
                  setMysqlOnboarding({
                    type: bool ? 'MysqlPull' : 'Mysql',
                  });
                }}
                offLabel="CDC"
                onLabel="PULL"
                disabled={disableFieldEdit}
              />
            </div>
          </div>
        )}

        {sourceType === 'Kafka' && (
          <KafkaWrapper
            errors={errors}
            setErrors={setErrors}
            disableFieldEdit={disableFieldEdit}
          />
        )}
        {(sourceType === 'Mysql' || sourceType === 'MysqlPull ') && (
          <MysqlWrapper
            errors={errors}
            setErrors={setErrors}
            disableFieldEdit={disableFieldEdit}
          />
        )}
        {sourceType === 'Postgres' && (
          <PostgresWrapper
            errors={errors}
            setErrors={setErrors}
            disableFieldEdit={disableFieldEdit}
          />
        )}

        {sourceType === 'Mongodb' && (
          <MongoDBWrapper
            errors={errors}
            setErrors={setErrors}
            disableFieldEdit={disableFieldEdit}
          />
        )}

        <LineBreak height={'60px'} />
        <Actions
          className={css(insightsSetupStyles.mt100)}
          onNextClick={() => {
            saveIntegrationsConfig();
          }}
          onBackClick={() => {
            setStep(2);
          }}
          onCancel={() => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Cancel Onboarding',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceDetail',
              leftSection: 'onboarding',
            });
            reset && reset();
          }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { importSourcesCopy, importDestinations, saveIntegrationResult } =
    state?.integration?.integrationConfig;
  const {
    kafka,
    mysql,
    postgres,
    mongodb,
    integrationName,
    importSourceId,
    shouldUpdate,
  } = state?.onboardinge2e.integration;
  const { selectedEntitySource } = state?.onboardinge2e.entityListing;
  const { signals } = state?.signals;
  const { contexts } = state?.contexts;

  return {
    importSourcesCopy,
    importDestinations,
    kafka,
    mysql,
    postgres,
    mongodb,
    integrationName,
    shouldUpdate,
    importSourceId,
    signals,
    contexts,
    selectedEntitySource,
    saveIntegrationResult,
  };
};
const mapDispatchToProps = {
  fetchIntegrationConfig,
  setOnboardingIntegration,
  saveIntegrations,
  resetOnboardingIntegration,
  fetchSignals,
  fetchContexts,
  setMysqlOnboarding,
  resetSaveIntegrationsResult,
};

ImportSources.propTypes = {
  fetchIntegrationConfig: PropTypes.func,
  importSourcesCopy: PropTypes.array,
  importDestinations: PropTypes.array,
  setOnboardingIntegration: PropTypes.func,
  resetOnboardingIntegration: PropTypes.func,
  integrationName: PropTypes.string,
  shouldUpdate: PropTypes.bool,
  importSourceId: PropTypes.string,
  kafka: PropTypes.object,
  mysql: PropTypes.object,
  postgres: PropTypes.object,
  mongodb: PropTypes.object,
  saveIntegrations: PropTypes.func,
  fetchSignals: PropTypes.func,
  fetchContexts: PropTypes.func,
  signals: PropTypes.array,
  contexts: PropTypes.array,
  reset: PropTypes.func,
  selectedEntitySource: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportSources);
