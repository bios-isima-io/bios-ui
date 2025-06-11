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
import { useEffect } from 'react';
import { Dropdown } from 'antdlatest';
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import ipxl from '@bios/ipxl';

import getConfig from 'config/env/getConfig';
import { biosDestinationIntegrationActions } from 'containers/Integrations/components/BiosDestination/reducers';
import RightPanelHeader from 'containers/Integrations/components/RightPanelHeader';
import getActivePanel from 'containers/Integrations/components/IntegrationContents/ImportSources/getActivePanel';
import sourceTypeMenu from 'containers/Integrations/components/IntegrationContents/ImportSources/SourceTypeMenu';
import {
  INTEGRATION_TYPE_DISPLAY_NAME,
  INTEGRATION_TYPE_FACEBOOK,
  INTEGRATION_TYPE_FILE,
  INTEGRATION_TYPE_GOOGLE,
  INTEGRATION_TYPE_HIBERNATE,
  INTEGRATION_TYPE_KAFKA,
  INTEGRATION_TYPE_MONGODB_CDC,
  INTEGRATION_TYPE_MYSQL_CDC,
  INTEGRATION_TYPE_MYSQL_PULL,
  INTEGRATION_TYPE_POSTGRES_CDC,
  INTEGRATION_TYPE_REST,
  INTEGRATION_TYPE_S3,
  INTEGRATION_TYPE_TO_TYPE_MAP,
  INTEGRATION_TYPE_WEBHOOK,
  PANEL_SOURCE,
} from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import styles from 'containers/Integrations/styles';
import {
  buildDestData,
  buildFacebookImportSrcData,
  buildFileImportSrcData,
  buildGoogleImportSrcData,
  buildHibernateImportSrcData,
  buildKafkaImportSrcData,
  buildRdbmsImportSrcData,
  buildMongodbImportSrcData,
  buildRestImportSrcData,
  buildS3ImportSrcData,
  buildWebhookImportSrcData,
  validateFacebookSource,
  validateFileSource,
  validateGoogleSource,
  validateHibernateSource,
  validateKafkaSource,
  validateRdbmsPullSource,
  validateMongodbSource,
  validateRdbmsSource,
  validateRestSource,
  validateS3Source,
  validateSourceInstance,
  validateWebhookSource,
  webhookAddAuth,
} from 'containers/Integrations/utils';
import { ErrorNotification } from 'containers/utils';

const { userClicks } = ipxl;
const {
  setIntegrationConfig,
  setIntegrationType,
  setIntegrationName,
  setImportSourcesCopy,
  setImportDestinationsCopy,
  saveIntegrations,
  resetIntegrationConfig,
  resetSaveIntegrationsResult,
} = integrationActions;

const { setBiosDestinationIntegration } = biosDestinationIntegrationActions;

const ImportSourceContent = ({
  existingIntegration,
  setRightPanelActive,
  integrationType,
  setIntegrationName,
  integrationName,
  integration,
  integrationId,
  rightPanelType,
  setIntegrationConfig,
  setImportSourcesCopy,
  importSourcesCopy,
  importSources,
  importDestinationsCopy,
  setImportDestinationsCopy,
  importFlowSpecs,
  setBiosDestinationIntegration,
  saveIntegrations,
  saveIntegrationResult,
  resetSaveIntegrationsResult,
  page,
  history,
}) => {
  useEffect(() => {
    if (saveIntegrationResult) {
      if (saveIntegrationResult.status === 'success') {
        setRightPanelActive(false);
        resetIntegrationConfig();
      }
      resetSaveIntegrationsResult();
    }
  }, [saveIntegrationResult, resetSaveIntegrationsResult, setRightPanelActive]);

  const {
    webhook,
    kafka,
    s3,
    rest,
    google,
    facebook,
    rdbms,
    mongodb,
    file,
    biosDestination,
  } = integration;
  const configEnv = getConfig();
  const updateBiosDest = (srcType) => {
    if (srcType === INTEGRATION_TYPE_WEBHOOK) {
      setBiosDestinationIntegration({
        key1: 'userHeader',
        key2: 'passwordHeader',
        value1: '',
        value2: '',
        destAuthType: 'HttpHeadersPlain',
      });
    } else {
      setBiosDestinationIntegration({
        key1: 'user',
        key2: 'password',
        value1: '',
        value2: '',
        destAuthType: 'Login',
      });
    }
  };

  const typeMenuChange = (val) => {
    setIntegrationConfig({ integrationType: val.key });
    updateBiosDest(val.key);
  };

  const saveTenantIntegrationConfig = () => {
    //Validate process instance limitation based on source type
    const sourceType = INTEGRATION_TYPE_TO_TYPE_MAP[integrationType];
    let validationMsg = '';
    if (!existingIntegration) {
      validationMsg = validateSourceInstance(sourceType, importSourcesCopy);
    }

    if (validationMsg !== '') {
      ErrorNotification({ message: validationMsg });
      return;
    }

    // validation based on integration source
    let validationMessage = '';
    if (integrationType === INTEGRATION_TYPE_WEBHOOK) {
      validationMessage = validateWebhookSource(
        webhook,
        integrationName,
        biosDestination,
      );
    } else if (integrationType === INTEGRATION_TYPE_KAFKA) {
      validationMessage = validateKafkaSource(kafka, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_HIBERNATE) {
      validationMessage = validateHibernateSource(integrationName);
    } else if (
      integrationType === INTEGRATION_TYPE_MYSQL_CDC ||
      integrationType === INTEGRATION_TYPE_POSTGRES_CDC
    ) {
      validationMessage = validateRdbmsSource(rdbms, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_MYSQL_PULL) {
      validationMessage = validateRdbmsPullSource(rdbms, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_MONGODB_CDC) {
      validationMessage = validateMongodbSource(mongodb, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_S3) {
      validationMessage = validateS3Source(s3, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_FILE) {
      validationMessage = validateFileSource(file, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_REST) {
      validationMessage = validateRestSource(rest, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_GOOGLE) {
      validationMessage = validateGoogleSource(google, integrationName);
    } else if (integrationType === INTEGRATION_TYPE_FACEBOOK) {
      validationMessage = validateFacebookSource(facebook, integrationName);
    }
    if (validationMessage !== '') {
      ErrorNotification({ message: validationMessage });
      return;
    }

    let newImportDestinationCopy = [];
    let destId = '';

    if (existingIntegration && integrationId !== '') {
      // update
      if (biosDestination?.existingDestination !== '') {
        destId = biosDestination?.existingDestination;
        newImportDestinationCopy = importDestinationsCopy?.map((dest) => {
          if (
            dest.importDestinationId === destId &&
            biosDestination?.hasChanges
          ) {
            return {
              importDestinationId: destId,
              ...buildDestData(biosDestination),
              endpoint: configEnv?.serverDirectURL,
              shouldUpdate: true,
            };
          }
          return dest;
        });
      }

      setImportDestinationsCopy(newImportDestinationCopy);

      const defaultValues = {
        shouldUpdate: true,
        importSourceId: integrationId,
      };
      let existingSrc = null;
      if (integrationType === INTEGRATION_TYPE_WEBHOOK) {
        existingSrc = buildWebhookImportSrcData(
          webhook,
          integrationName,
          destId,
        );
        existingSrc = webhookAddAuth(existingSrc, biosDestination);
      } else if (integrationType === INTEGRATION_TYPE_KAFKA) {
        existingSrc = buildKafkaImportSrcData(kafka, integrationName, destId);
      } else if (integrationType === INTEGRATION_TYPE_HIBERNATE) {
        existingSrc = buildHibernateImportSrcData(integrationName, destId);
      } else if (
        integrationType === INTEGRATION_TYPE_MYSQL_CDC ||
        integrationType === INTEGRATION_TYPE_POSTGRES_CDC
      ) {
        existingSrc = buildRdbmsImportSrcData({
          rdbms,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_MYSQL_PULL) {
        existingSrc = buildRdbmsImportSrcData({
          rdbms,
          integrationName,
          importDestinationId: destId,
        });
        existingSrc.pollingInterval = rdbms.pollingInterval;
      } else if (integrationType === INTEGRATION_TYPE_MONGODB_CDC) {
        existingSrc = buildMongodbImportSrcData({
          mongodb,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_S3) {
        existingSrc = buildS3ImportSrcData({
          s3,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_FILE) {
        existingSrc = buildFileImportSrcData({
          file,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_REST) {
        existingSrc = buildRestImportSrcData({
          rest,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_GOOGLE) {
        existingSrc = buildGoogleImportSrcData({
          google,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_FACEBOOK) {
        existingSrc = buildFacebookImportSrcData({
          facebook,
          integrationName,
          importDestinationId: destId,
        });
      }
      if (existingSrc) {
        if (existingSrc?.importDestinationId === '') {
          delete existingSrc.importDestinationId;
        }
        existingSrc = {
          ...existingSrc,
          ...defaultValues,
        };
        const newImportSources = importSourcesCopy.map((isc) => {
          if (isc.importSourceId === integrationId) {
            return existingSrc;
          }
          return isc;
        });
        setImportSourcesCopy(newImportSources);
      }
    } else {
      // create
      destId = uuidv4();
      newImportDestinationCopy = [
        ...importDestinationsCopy,
        {
          importDestinationId: destId,
          ...buildDestData(biosDestination),
          endpoint: configEnv?.serverDirectURL,
          shouldCreate: true,
        },
      ];
      setImportDestinationsCopy(newImportDestinationCopy);

      const defaultValues = {
        shouldCreate: true,
        importSourceId: uuidv4(),
      };
      let newSrc = null;
      if (integrationType === INTEGRATION_TYPE_WEBHOOK) {
        newSrc = buildWebhookImportSrcData(webhook, integrationName, destId);
        newSrc = webhookAddAuth(newSrc, biosDestination);
      } else if (integrationType === INTEGRATION_TYPE_KAFKA) {
        newSrc = buildKafkaImportSrcData(kafka, integrationName, destId);
      } else if (integrationType === INTEGRATION_TYPE_HIBERNATE) {
        newSrc = buildHibernateImportSrcData(integrationName, destId);
      } else if (
        integrationType === INTEGRATION_TYPE_MYSQL_CDC ||
        integrationType === INTEGRATION_TYPE_POSTGRES_CDC
      ) {
        if (integrationType === INTEGRATION_TYPE_POSTGRES_CDC) {
          rdbms.slotName = uuidv4().replaceAll('-', '_');
        }
        newSrc = buildRdbmsImportSrcData({
          rdbms,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_MONGODB_CDC) {
        newSrc = buildMongodbImportSrcData({
          mongodb,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_MYSQL_PULL) {
        newSrc = buildRdbmsImportSrcData({
          rdbms,
          integrationName,
          importDestinationId: destId,
        });
        newSrc.pollingInterval = rdbms.pollingInterval;
        newSrc.columnName = rdbms.columnName;
      } else if (integrationType === INTEGRATION_TYPE_S3) {
        newSrc = buildS3ImportSrcData({
          s3,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_FILE) {
        newSrc = buildFileImportSrcData({
          file,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_REST) {
        newSrc = buildRestImportSrcData({
          rest,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_GOOGLE) {
        newSrc = buildGoogleImportSrcData({
          google,
          integrationName,
          importDestinationId: destId,
        });
      } else if (integrationType === INTEGRATION_TYPE_FACEBOOK) {
        newSrc = buildFacebookImportSrcData({
          facebook,
          integrationName,
          importDestinationId: destId,
        });
      }
      if (newSrc) {
        newSrc = {
          ...newSrc,
          ...defaultValues,
        };
        setImportSourcesCopy([...importSourcesCopy, newSrc]);
        if (page === 'signal' || page === 'context') {
          saveIntegrations({
            importDestinationsCopy: newImportDestinationCopy,
            importSourcesCopy: [...importSourcesCopy, newSrc],
            importDataProcessorsCopy: [],
          });
        }
      }
    }
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel:
        existingIntegration && integrationId !== ''
          ? 'Update Source'
          : 'Create Source',
      rightSection: PANEL_SOURCE,
      mainSection: 'integration',
      leftSection: 'integration',
    });
  };

  const deleteImportSource = (integrationId) => {
    let newImportSources;
    if (importSources?.some((is) => is.importSourceId === integrationId)) {
      newImportSources = importSourcesCopy.map((source) => {
        if (source.importSourceId === integrationId) {
          return {
            ...source,
            shouldDelete: true,
          };
        }
        return source;
      });
    } else {
      newImportSources = importSourcesCopy.filter((source) => {
        return !(source.importSourceId === integrationId);
      });
    }

    const deleteSource = importSourcesCopy.find((source) => {
      return source.importSourceId === integrationId;
    });

    let newImportDestinations;
    if (deleteSource?.importDestinationId !== '') {
      newImportDestinations = importDestinationsCopy.map((destination) => {
        if (
          deleteSource?.importDestinationId === destination.importDestinationId
        ) {
          return {
            ...destination,
            shouldDelete: true,
          };
        }
        return destination;
      });
    }

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Source',
      rightSection: PANEL_SOURCE,
      mainSection: 'integration',
      leftSection: 'integration',
    });
    newImportSources && setImportSourcesCopy(newImportSources);
    newImportDestinations && setImportDestinationsCopy(newImportDestinations);
  };

  const getContent = () => {
    const Content = getActivePanel(
      integrationType === null ? INTEGRATION_TYPE_WEBHOOK : integrationType,
    );
    return (
      <div>
        <RightPanelHeader
          history={history}
          setRightPanelActive={setRightPanelActive}
          save={saveTenantIntegrationConfig}
          name={integrationName}
          setName={setIntegrationName}
          rightPanelType={rightPanelType}
          setIntegrationConfig={setIntegrationConfig}
          existing={
            page === 'signal' || page === 'context'
              ? false
              : existingIntegration
          }
          deleteItem={() => deleteImportSource(integrationId)}
          page={page}
          importFlowSpecs={importFlowSpecs}
          itemId={integrationId}
        />
        <div className={css(styles.rightPanelSectionContainer)}>
          <div className={css(styles.rPanelSubSectionRow)}>
            <div className={css(styles.rPanelSubSectionCol1)}>Type</div>
            <div>
              {existingIntegration ? (
                INTEGRATION_TYPE_DISPLAY_NAME?.[integrationType]
              ) : (
                <Dropdown
                  overlay={() =>
                    sourceTypeMenu({ typeMenuChange, importSourcesCopy })
                  }
                  trigger={['click']}
                  disabled={existingIntegration}
                >
                  <div
                    className={css(styles.dropdownLabelWrapper)}
                    data-test-id="select-integration-type-dropdown"
                  >
                    <div>
                      {integrationType === null
                        ? 'Webhook'
                        : INTEGRATION_TYPE_DISPLAY_NAME?.[integrationType]}
                    </div>
                    <i className="icon-chevron-down" />
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
        <Content />
      </div>
    );
  };
  return <div>{getContent()}</div>;
};

ImportSourceContent.propTypes = {
  setIntegrationConfig: PropTypes.func,
  existingIntegration: PropTypes.bool,
  saveIntegrations: PropTypes.func,
  integrationType: PropTypes.string,
  setIntegrationName: PropTypes.func,
  integrationName: PropTypes.string,
  biosDestination: PropTypes.object,
  createImportDestination: PropTypes.func,
  updateImportDestination: PropTypes.func,
  integrationId: PropTypes.string,
  rightPanelType: PropTypes.string,
  tenant: PropTypes.string,
  setImportSourcesCopy: PropTypes.func,
  importSourcesCopy: PropTypes.array,
  importSources: PropTypes.array,
  importDestinationsCopy: PropTypes.array,
  setImportDestinationsCopy: PropTypes.func,
  setBiosDestinationIntegration: PropTypes.func,
  page: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { integration } = state;
  const {
    rightPanelType,
    existingIntegration,
    integrationActive,
    integrationType,
    integrationName,
    destAuthType,
    integrationId,
    importDestinationsCopy,
    importSourcesCopy,
    importSources,
    saveIntegrationResult,
    importFlowSpecs,
  } = state?.integration?.integrationConfig;
  return {
    existingIntegration,
    integrationActive,
    integrationType,
    integrationName,
    rightPanelType,
    destAuthType,
    integrationId,
    importSourcesCopy,
    importSources,
    importDestinationsCopy,
    saveIntegrationResult,
    integration,
    importFlowSpecs,
  };
};

const mapDispatchToProps = {
  setIntegrationConfig,
  saveIntegrations,
  setIntegrationType,
  setIntegrationName,
  setImportSourcesCopy,
  setImportDestinationsCopy,
  setBiosDestinationIntegration,
  resetIntegrationConfig,
  resetSaveIntegrationsResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportSourceContent);
