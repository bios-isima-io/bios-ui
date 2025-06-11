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
import { Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import EmptyPlaceholder from 'components/EmptyPlaceholder';
import { biosDestinationIntegrationActions } from 'containers/Integrations/components/BiosDestination/reducers';
import ContentListHeader from 'containers/Integrations/components/IntegrationContents/ContentListHeader';
import { facebookIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/Facebook/reducers';
import { fileIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/File/reducers';
import { googleIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/Google/reducers';
import { kafkaIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/Kafka/reducers';
import { rdbmsIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/RDBMS/reducers';
import { mongodbIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/MongoDB/reducers';
import { restIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/Rest/reducers';
import { s3IntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/S3/reducers';
import { webHookIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/Webhook/reducers';
import styles from 'containers/Integrations/components/IntegrationContents/styles';
import {
  ACTIVE_INTEGRATIONS,
  INTEGRATION_TYPE_DISPLAY_NAME,
  INTEGRATION_TYPE_FACEBOOK,
  INTEGRATION_TYPE_GOOGLE,
  INTEGRATION_TYPE_MONGODB_CDC,
  INTEGRATION_TYPE_MYSQL_CDC,
  INTEGRATION_TYPE_MYSQL_PULL,
  INTEGRATION_TYPE_POSTGRES_CDC,
  INTEGRATION_TYPE_PUSH_PULL,
  PANEL_SOURCE,
} from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import {
  buildAuthFromSavedAuth,
  buildPayloadValidation,
  findImportDestination,
  listActiveSources,
} from 'containers/Integrations/utils';
import { Button } from 'containers/components';
import ShowStyledToolTipSourceStatus from './ShowStyledToolTipSourceStatus';
import { buildAllFlowErrorData, buildErrorPercentagePerSource } from './utils';

const { userClicks } = ipxl;
const {
  setExistingIntegration,
  setRightPanelActive,
  setRightPanelType,
  setIntegrationConfig,
  setIntegrationName,
  setIntegrationType,
  clearSourceIndexToShow,
  fetchIntegrationSourceQuality,
} = integrationActions;

const EMPTY_BUTTON_NAME = 'Add Source';
const { setWebhookIntegration, resetWebhookIntegration } =
  webHookIntegrationActions;
const { setKafkaIntegration, resetKafkaIntegration } = kafkaIntegrationActions;
const { setRdbmsIntegration, resetRdbmsIntegration } = rdbmsIntegrationActions;
const { setMongoDBIntegration, resetMongoDBIntegration } =
  mongodbIntegrationActions;
const { setS3Integration, resetS3Integration } = s3IntegrationActions;
const { setFileIntegration, resetFileIntegration } = fileIntegrationActions;
const { setRestIntegration, resetRestIntegration } = restIntegrationActions;
const { setGoogleIntegration, resetGoogleIntegration } =
  googleIntegrationActions;
const { setFacebookIntegration, resetFacebookIntegration } =
  facebookIntegrationActions;
const { setBiosDestinationIntegration, resetBiosDestinationIntegration } =
  biosDestinationIntegrationActions;

function ImportSources({
  signals,
  contexts,
  sourceQualityData,
  setExistingIntegration,
  importSources,
  importSourcesCopy,
  setRightPanelActive,
  setRightPanelType,
  rightPanelActive,
  setIntegrationConfig,
  importDestinationsCopy,
  importFlowSpecs,
  importFlowSpecsCopy,
  setBiosDestinationIntegration,
  setWebhookIntegration,
  setKafkaIntegration,
  setRdbmsIntegration,
  setMongoDBIntegration,
  setS3Integration,
  setFileIntegration,
  setRestIntegration,
  setGoogleIntegration,
  setFacebookIntegration,
  setIntegrationName,
  setIntegrationType,
  integrationId,
  sourceIndexToShow,

  resetBiosDestinationIntegration,
  resetWebhookIntegration,
  resetKafkaIntegration,
  resetS3Integration,
  resetRdbmsIntegration,
  resetMongoDBIntegration,
  resetFileIntegration,
  resetRestIntegration,
  resetGoogleIntegration,
  resetFacebookIntegration,
  clearSourceIndexToShow,
  fetchIntegrationSourceQuality,
  history,
}) {
  const [errorPercentagePerSource, setErrorPercentagePerSource] =
    useState(null);
  const [errorPercentagePerStream, setErrorPercentagePerStream] =
    useState(null);
  useEffect(() => {
    // build signal list
    const signalNamesList = signals?.reduce((acc, signal) => {
      acc.push(signal.signalName);
      return acc;
    }, []);
    const contextNamesList = contexts?.reduce((acc, context) => {
      acc.push(context.contextName);
      return acc;
    }, []);

    // fetch signal data
    (signalNamesList.length > 0 || contextNamesList.length > 0) &&
      !sourceQualityData &&
      fetchIntegrationSourceQuality({
        streamsList: [...signalNamesList, ...contextNamesList],
      });
  }, [signals, contexts, sourceQualityData, fetchIntegrationSourceQuality]);

  useEffect(() => {
    const allFlowErrorData = buildAllFlowErrorData({
      importFlowSpecs,
      sourceQualityData,
    });
    setErrorPercentagePerStream(allFlowErrorData);

    const errorPercentagePerSource = buildErrorPercentagePerSource({
      allFlowErrorData,
    });
    setErrorPercentagePerSource(errorPercentagePerSource);
  }, [sourceQualityData, importFlowSpecs]);

  useEffect(() => {
    if (sourceIndexToShow != null) {
      if (sourceIndexToShow < 0) {
        resetIntegrations();
        setExistingIntegration(false);
        setIntegrationConfig({ integrationType: 'Webhook' });
      } else {
        const { importSourceId, importSourceName, type } =
          listActiveSources(importSourcesCopy)[sourceIndexToShow];
        showIntegrationSource({
          sourceId: importSourceId,
          sourceName: importSourceName,
          sourceType: type,
        });
      }
      clearSourceIndexToShow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceIndexToShow]);

  useEffect(() => {
    return () => resetIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listData = importSourcesCopy?.reduce((acc, is) => {
    if (is?.shouldDelete) {
      return acc;
    }
    if (!ACTIVE_INTEGRATIONS?.includes(is?.type)) {
      return acc;
    }
    acc.push({
      sourceId: is.importSourceId,
      sourceName: is.importSourceName,
      sourceType: is.type,
      active: is.active,
      status: is.status,
    });
    return acc;
  }, []);

  /**
   * Find the destination for a source and set it up as bios auth.
   * Use this method for setting up a source that requires biOS login.
   */
  const setupBiosLogin = (source) => {
    const destination = findImportDestination(
      source,
      importDestinationsCopy,
      importFlowSpecsCopy,
    );
    const newAuthFields = buildAuthFromSavedAuth(destination?.authentication);
    setBiosDestinationIntegration({
      ...newAuthFields,
      destAuthType: 'Login',
      existingDestination: destination?.importDestinationId,
    });
  };

  const showIntegrationSource = (ld) => {
    resetBiosDestinationIntegration();
    setRightPanelActive(true);
    setRightPanelType(PANEL_SOURCE);
    const source = importSourcesCopy?.find(
      (is) => is.importSourceId === ld.sourceId,
    );

    let integrationType = ld.sourceType;
    setIntegrationConfig({
      integrationId: ld.sourceId,
      integrationName: ld.sourceName,
      integrationType,
      integrationActive: ld.active,
      existingIntegration: true,
    });

    // set import source
    if (ld.sourceType === 'Webhook') {
      let buildAuth = {};
      buildAuth.srcWebhookPath = source.webhookPath;
      setWebhookIntegration({
        ...buildAuth,
      });
      if (source.authentication && source.authentication.type !== 'Login') {
        const newAuthFields = buildAuthFromSavedAuth(source.authentication);
        const validationFields = buildPayloadValidation(
          source.payloadValidation,
        );
        setBiosDestinationIntegration({
          ...newAuthFields,
          ...validationFields,
          destAuthType: source?.authentication?.type,
        });
        if (source.authentication.type === 'HttpHmacHeader') {
          const destination = importDestinationsCopy?.find(
            (id) => id?.authentication?.type === 'Login',
          );
          const newAuthFields = buildAuthFromSavedAuth(
            destination?.authentication,
          );
          setBiosDestinationIntegration({
            ...newAuthFields,
            destAuthType: 'Login',
            existingDestination: destination?.importDestinationId,
          });
        }
      } else {
        setupBiosLogin(source);
      }
    } else if (ld.sourceType === 'Kafka') {
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      if (source?.authentication?.type === 'SaslPlaintext') {
        buildAuth.srcUser = source?.authentication?.user;
        buildAuth.srcPassword = source?.authentication?.password;
      } else if (source?.authentication?.type === 'InMessage') {
        buildAuth.srcInMessageUserAttribute =
          source?.authentication?.inMessageUserAttribute;
        buildAuth.srcInMessagePasswordAttribute =
          source?.authentication?.inMessagePasswordAttribute;
      }

      setKafkaIntegration({
        bootstrapServers: source?.bootstrapServers,
        apiVersion: source?.apiVersion.join('.'),
        ...buildAuth,
      });

      setupBiosLogin(source);
    } else if (
      ld.sourceType === INTEGRATION_TYPE_MYSQL_CDC ||
      ld.sourceType === INTEGRATION_TYPE_MYSQL_PULL ||
      ld.sourceType === INTEGRATION_TYPE_POSTGRES_CDC
    ) {
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      buildAuth.srcUser = source?.authentication?.user;
      buildAuth.srcPassword = source?.authentication?.password;

      setRdbmsIntegration({
        databaseHost: source?.databaseHost,
        databasePort: source?.databasePort,
        databaseName: source?.databaseName,
        type: source.type,
        ...(source.type === INTEGRATION_TYPE_MYSQL_PULL && {
          pollingInterval: source?.pollingInterval,
        }),
        ...buildAuth,
      });

      setupBiosLogin(source);
    } else if (ld.sourceType === INTEGRATION_TYPE_MONGODB_CDC) {
      let buildAuth = {};
      buildAuth.srcAuthType = source?.authentication?.type;
      buildAuth.srcUser = source?.authentication?.user;
      buildAuth.srcPassword = source?.authentication?.password;

      setMongoDBIntegration({
        databaseName: source?.databaseName,
        endpoints: source?.endpoints,
        replicaSet: source?.replicaSet,
        useDnsSeedList: source?.useDnsSeedList,
        authSource: source?.authSource,
        type: source.type,
        ...buildAuth,
      });

      setupBiosLogin(source);
    } else if (ld.sourceType === 'S3') {
      let buildAuth = {};
      buildAuth.type = source?.authentication?.type;
      buildAuth.accessKey = source?.authentication?.accessKey;
      buildAuth.secretKey = source?.authentication?.secretKey;

      setS3Integration({
        endpoint: source?.endpoint,
        pollingInterval: source?.pollingInterval,
        ...buildAuth,
      });

      setupBiosLogin(source);
    } else if (ld.sourceType === 'File') {
      setFileIntegration({
        fileLocation: source?.fileLocation,
        pollingInterval: source?.pollingInterval,
      });
      setupBiosLogin(source);
    } else if (ld.sourceType === 'RestClient') {
      // flatten the source config and set it to the restIntegration Redux state
      const restSource = {
        ...(source || {}),
        ...(source?.authentication || {}),
      };
      delete restSource.authentication;
      setRestIntegration(restSource);
    } else if (ld.sourceType === INTEGRATION_TYPE_GOOGLE) {
      let buildAuth = {};
      buildAuth.type = source?.authentication?.type;
      buildAuth.clientId = source?.authentication?.clientId;
      buildAuth.clientSecret = source?.authentication?.clientSecret;
      buildAuth.developerToken = source?.authentication?.developerToken;
      buildAuth.refreshToken = source?.authentication?.refreshToken;
      setGoogleIntegration({
        pollingInterval: source?.pollingInterval,
        customerID: source?.customerID,
        ...buildAuth,
      });
      setupBiosLogin(source);
    } else if (ld.sourceType === INTEGRATION_TYPE_FACEBOOK) {
      let buildAuth = {};
      buildAuth.type = source?.authentication?.type;
      buildAuth.clientId = source?.authentication?.clientId;
      buildAuth.clientSecret = source?.authentication?.clientSecret;
      buildAuth.accessToken = source?.authentication?.accessToken;
      setFacebookIntegration({
        endpoint: source?.endpoint,
        pollingInterval: source?.pollingInterval,
        ...buildAuth,
      });
      setupBiosLogin(source);
    }

    // set import destination
    if (ACTIVE_INTEGRATIONS?.includes(ld.sourceType)) {
      const destination = importDestinationsCopy?.find(
        (id) => id.importDestinationId === source.importDestinationId,
      );
      if (destination && ld.sourceType !== 'Webhook') {
        setBiosDestinationIntegration({
          destAuthType: 'Login',
          key1: 'user',
          key2: 'password',
          value1: destination?.authentication?.user,
          value2: destination?.authentication?.password,
          existingDestination: destination?.importDestinationId,
        });
      }
    }

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: `Show Source`,
      rightSection: 'None',
      mainSection: 'integrationSource',
      leftSection: 'integration',
    });
  };

  const resetIntegrations = () => {
    resetWebhookIntegration();
    resetKafkaIntegration();
    resetWebhookIntegration();
    resetKafkaIntegration();
    resetS3Integration();
    resetRdbmsIntegration();
    resetMongoDBIntegration();
    resetFileIntegration();
    resetRestIntegration();
    resetGoogleIntegration();
    resetFacebookIntegration();
    setIntegrationName('');
    setIntegrationType('');
    setExistingIntegration(false);
    resetBiosDestinationIntegration();
  };

  return (
    <div className={css(styles.integrationContainer)}>
      {listData?.length === 0 ? (
        <EmptyPlaceholder
          onClick={() => {
            resetIntegrations();
            setExistingIntegration(false);
            setRightPanelActive(true);
            setRightPanelType(PANEL_SOURCE);
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: `New Source`,
              rightSection: 'None',
              mainSection: 'integrationSource',
              leftSection: 'integration',
            });
          }}
          buttonText={EMPTY_BUTTON_NAME}
          message="Define data source to import from"
          icon="icon-EMPTY-STATE-1"
        />
      ) : (
        <div>
          <Button
            type="primary"
            alignRight={true}
            onClick={() => {
              resetIntegrations();
              setExistingIntegration(false);
              setRightPanelActive(true);
              setRightPanelType(PANEL_SOURCE);
              setIntegrationConfig({ integrationType: 'Webhook' });
              userClicks({
                pageURL: history?.location?.pathname,
                pageTitle: document.title,
                pageDomain: window?.location?.origin,
                eventLabel: `New Source`,
                rightSection: 'None',
                mainSection: 'integrationSource',
                leftSection: 'integration',
              });
            }}
          >
            New Source
          </Button>
          <ContentListHeader type={PANEL_SOURCE} />
          {listData?.map((ld) => {
            return (
              <div
                key={ld.sourceId}
                className={css(
                  styles.integrationListItem,
                  styles.integrationListRow,
                  ld?.sourceId === integrationId &&
                    styles.activeIntegrationListRow,
                )}
                onClick={() => showIntegrationSource(ld)}
              >
                <div className={css(styles.integrationListItemText)}>
                  {ld.sourceName}
                </div>
                <div
                  className={css(
                    styles.integrationListItemText,
                    commonStyles.centerText,
                  )}
                >
                  {INTEGRATION_TYPE_DISPLAY_NAME?.[ld.sourceType]}
                </div>
                <div
                  className={css(
                    styles.integrationListItemText,
                    commonStyles.centerText,
                  )}
                >
                  {INTEGRATION_TYPE_PUSH_PULL?.[ld.sourceType] === 'Push' ? (
                    <i
                      className={`icon-Push ${css(
                        commonStyles.icon,
                        styles.pushIcon,
                      )}`}
                    />
                  ) : (
                    <i
                      className={`icon-Pull ${css(
                        commonStyles.icon,
                        styles.pullIcon,
                      )}`}
                    />
                  )}
                </div>
                <div className={css(commonStyles.flexCenter)}>
                  {ld.status ? (
                    ld.status === 'active' ? (
                      <Tooltip
                        title={
                          <ShowStyledToolTipSourceStatus
                            activeStatus="Active"
                            errorPercentage={
                              errorPercentagePerSource?.[ld.sourceId]
                                ?.errorPercentageAverage
                            }
                            errorPercentagePerStream={
                              errorPercentagePerStream?.[ld.sourceId]
                            }
                          />
                        }
                      >
                        <div className="ring-container">
                          <div
                            className={`ringring ${
                              errorPercentagePerSource?.[ld.sourceId]
                                ?.errorStatus
                            }`}
                          ></div>
                          <div
                            className={`circle ${
                              errorPercentagePerSource?.[ld.sourceId]
                                ?.errorStatus
                            }`}
                          ></div>
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Inactive">
                        <div
                          className={css(
                            commonStyles.inactiveStatus,
                            commonStyles.centerText,
                          )}
                        />
                      </Tooltip>
                    )
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

ImportSources.propTypes = {
  importSources: PropTypes.array,
  importSourcesCopy: PropTypes.array,
  rightPanelActive: PropTypes.bool,
  setRightPanelType: PropTypes.func,
  setExistingIntegration: PropTypes.func,
  setRightPanelActive: PropTypes.func,
  setIntegrationConfig: PropTypes.func,
  setIntegrationName: PropTypes.func,
  setIntegrationType: PropTypes.func,
  setBiosDestinationIntegration: PropTypes.func,
  importDestinationsCopy: PropTypes.array,
  importFlowSpecs: PropTypes.array,
  importFlowSpecsCopy: PropTypes.array,

  setWebhookIntegration: PropTypes.func,
  setKafkaIntegration: PropTypes.func,
  setRdbmsIntegration: PropTypes.func,
  setMongoDBIntegration: PropTypes.func,
  setS3Integration: PropTypes.func,
  setFileIntegration: PropTypes.func,
  setRestIntegration: PropTypes.func,
  setGoogleIntegration: PropTypes.func,
  setFacebookIntegration: PropTypes.func,

  resetBiosDestinationIntegration: PropTypes.func,
  resetWebhookIntegration: PropTypes.func,
  resetKafkaIntegration: PropTypes.func,
  resetS3Integration: PropTypes.func,
  resetRdbmsIntegration: PropTypes.func,
  resetMongoDBIntegration: PropTypes.func,
  resetFileIntegration: PropTypes.func,
  resetRestIntegration: PropTypes.func,
  resetGoogleIntegration: PropTypes.func,
  resetFacebookIntegration: PropTypes.func,

  signals: PropTypes.array,
  contexts: PropTypes.array,
  sourceQualityData: PropTypes.array,
};

const mapStateToProps = (state) => {
  const {
    importSources,
    importSourcesCopy,
    importDestinationsCopy,
    importFlowSpecs,
    importFlowSpecsCopy,
    rightPanelActive,
    integrationId,
    sourceIndexToShow,
    sourceQualityData,
  } = state?.integration?.integrationConfig;

  const { signals } = state?.signals;
  const { contexts } = state?.contexts;
  return {
    importSources,
    importSourcesCopy,
    importDestinationsCopy,
    importFlowSpecs,
    importFlowSpecsCopy,
    rightPanelActive,
    integrationId,
    sourceIndexToShow,
    signals,
    contexts,
    sourceQualityData,
  };
};

const mapDispatchToProps = {
  setExistingIntegration,
  setRightPanelActive,
  setRightPanelType,
  setIntegrationConfig,
  setIntegrationName,
  setIntegrationType,
  setBiosDestinationIntegration,
  clearSourceIndexToShow,

  setWebhookIntegration,
  setKafkaIntegration,
  setRdbmsIntegration,
  setMongoDBIntegration,
  setS3Integration,
  setFileIntegration,
  setRestIntegration,
  setGoogleIntegration,
  setFacebookIntegration,

  resetBiosDestinationIntegration,
  resetWebhookIntegration,
  resetKafkaIntegration,
  resetS3Integration,
  resetRdbmsIntegration,
  resetMongoDBIntegration,
  resetFileIntegration,
  resetRestIntegration,
  resetGoogleIntegration,
  resetFacebookIntegration,

  fetchIntegrationSourceQuality,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportSources);
