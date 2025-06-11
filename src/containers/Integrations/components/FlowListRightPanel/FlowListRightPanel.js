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
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { useDeviceDetect } from 'common/hooks';
import { CollapsableWrapper, Header } from 'containers/components';
import 'containers/Integrations/collapsable.scss';
import { AUTH_TYPE_LOGIN } from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import styles from 'containers/Integrations/styles';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import getActivePanel from './getActivePanelDropdown';
import { flowSpecsActions } from './reducers';
import signalIntegrationStyles from './styles';

const { userClicks } = ipxl;
const { setImportFlowCopy } = integrationActions;
const { setFlowConfig, resetFlowConfig } = flowSpecsActions;

const FlowListRightPanel = ({
  setShowRightPanel,
  importSources,
  importFlowSpecs,
  importFlowSpecsCopy,
  setFlowConfig,
  resetFlowConfig,
  importDestinationsCopy,
  name,
  type,
  setImportFlowCopy,
  setSelectedImportFlow,
  setShowIntegration,
  signalDetail,
  contextDetail,
  history,
  isExistingAuditSignal,
  isFACContext,
}) => {
  const isMobile = useDeviceDetect();
  const { existingFlowSpecs, importFlowName } = importFlowSpecs;
  const [activeRightPanelSection, setActiveRightPanelSection] =
    useState('import_flow_specs');
  const panels = getActivePanel({ setShowIntegration, pageType: type });

  const saveSignalIntegration = () => {
    /*
    let entity;
    if (type === 'Signal') {
      entity = signalDetail;
    } else if (type === 'Context') {
      entity = contextDetail;
    }
    */
    if (importFlowSpecs.importFlowName === '') {
      ErrorNotification({ message: messages.integration.NAME_REQUIRED });
      return;
    }
    if (
      importFlowSpecs?.sourceDataSpec?.payloadType === undefined ||
      importFlowSpecs?.sourceDataSpec?.payloadType === ''
    ) {
      ErrorNotification({ message: messages.integration.PAYLOAD_REQUIRED });
      return;
    }
    if (
      !('importSourceId' in importFlowSpecs.sourceDataSpec) ||
      importFlowSpecs.sourceDataSpec.importSourceId === ''
    ) {
      ErrorNotification({ message: messages.integration.SOURCE_TYPE_REQUIRED });
      return;
    }
    if (
      importFlowSpecs?.dataPickupSpec?.filters !== undefined &&
      Array.isArray(importFlowSpecs?.dataPickupSpec?.filters)
    ) {
      let hasError = false;
      let errorMessage = '';
      importFlowSpecs?.dataPickupSpec?.filters?.some((att) => {
        if (att.sourceAttributeName === '') {
          hasError = true;
          errorMessage = messages.integration.SOURCE_REQUIRED;
          return true;
        }
        if (att.filter === '') {
          hasError = true;
          errorMessage = messages.integration.FILTER_REQUIRED;
          return true;
        }
        return false;
      });
      if (hasError) {
        ErrorNotification({ message: errorMessage });
        return;
      }
    }
    if (
      importFlowSpecs?.dataPickupSpec?.attributes === undefined ||
      (Array.isArray(importFlowSpecs?.dataPickupSpec?.attributes) &&
        importFlowSpecs?.dataPickupSpec?.attributes?.length === 0)
    ) {
      ErrorNotification({
        message: messages.integration.DATA_MAPPING_REQUIRED_ATTRIBUTE,
      });
      return;
    }

    let errorMessage = '';
    if (
      importFlowSpecs?.dataPickupSpec?.attributes !== undefined &&
      Array.isArray(importFlowSpecs?.dataPickupSpec?.attributes)
    ) {
      let hasError = false;
      importFlowSpecs?.dataPickupSpec?.attributes?.forEach((att) => {
        if (att.sourceAttributeName === '') {
          hasError = true;
          errorMessage = messages.integration.SOURCE_REQUIRED;
        }
        // if (!att.as || att.as === '') {
        //   if (
        //     !checkIfAttributeExist(
        //       entity,
        //       att.sourceAttributeNames
        //         ? att.sourceAttributeNames
        //         : [att.sourceAttributeName],
        //     )
        //   ) {
        //     hasError = true;
        //     errorMessage = messages.integration.attributeNotValid(
        //       att.sourceAttributeName,
        //     );
        //   }
        // } else {
        //   if (att.as.length > 40) {
        //     hasError = true;
        //     errorMessage = messages.integration.ATTRIBUTE_LENGTH_LIMIT;
        //   }
        //   if (!checkIfAttributeExist(entity, [att.as])) {
        //     hasError = true;
        //     errorMessage = messages.integration.attributeNotValid(att.as);
        //   }
        // }

        if (att.as === '') {
          delete att.as;
        }
      });
      if (hasError) {
        ErrorNotification({ message: errorMessage });
        return;
      }
    }
    const sourceId = importFlowSpecs?.sourceDataSpec?.importSourceId;
    const importSource = importSources?.find(
      (is) => is.importSourceId === sourceId,
    );
    const sourceType = importSource?.['type'];
    let importDestinationId = importSource?.['importDestinationId'];
    if (sourceType === 'Kafka') {
      if (
        importFlowSpecs?.sourceDataSpec?.topic === undefined ||
        importFlowSpecs?.sourceDataSpec?.topic === ''
      ) {
        ErrorNotification({ message: messages.integration.TOPIC_REQUIRED });
        return;
      }
    }
    if (sourceType === 'Webhook') {
      if (
        importFlowSpecs?.sourceDataSpec?.webhookSubPath &&
        typeof importFlowSpecs?.sourceDataSpec?.webhookSubPath === 'string' &&
        !importFlowSpecs?.sourceDataSpec?.webhookSubPath.startsWith('/')
      ) {
        ErrorNotification({
          message: messages.integration.WEBHOOK_PATH_VALIDATION,
        });
        return;
      }
    }
    if (sourceType === 'S3') {
      if (
        importFlowSpecs?.sourceDataSpec?.s3Bucket === undefined ||
        importFlowSpecs?.sourceDataSpec?.s3Bucket === ''
      ) {
        ErrorNotification({
          message: messages.integration.S3_BUCKET_NAME_REQUIRED,
        });
        return;
      }
    }
    if (sourceType === 'File') {
      if (
        importFlowSpecs?.sourceDataSpec?.sourceBatchSize === undefined ||
        importFlowSpecs?.sourceDataSpec?.sourceBatchSize === ''
      ) {
        ErrorNotification({
          message: messages.integration.SOURCE_BATCH_SIZE_REQUIRED,
        });
        return;
      } else if (isNaN(importFlowSpecs?.sourceDataSpec?.sourceBatchSize)) {
        ErrorNotification({
          message: messages.integration.SOURCE_BATCH_SIZE_AS_NUMBER,
        });
        return;
      }
    }
    if (sourceType === 'Mysql' || sourceType === 'MysqlPull') {
      importFlowSpecs.sourceDataSpec.payloadType = 'Json';
      if (
        sourceType === 'Mysql' &&
        !importFlowSpecs.sourceDataSpec.cdcOperationTypes
      ) {
        importFlowSpecs.sourceDataSpec.cdcOperationTypes = [
          'Create',
          'Update',
          'Delete',
          'Read',
        ];
      }
      if (
        importFlowSpecs?.sourceDataSpec?.tableName === undefined ||
        importFlowSpecs?.sourceDataSpec?.tableName === ''
      ) {
        ErrorNotification({
          message: messages.integration.TABLE_NAME_REQUIRED,
        });
        return;
      }
    }

    if (sourceType === 'Mysql') {
      if (importFlowSpecs?.sourceDataSpec?.cdcOperationTypes?.length === 0) {
        ErrorNotification({
          message: messages.integration.CDC_MINIMUM_TYPE_SELECTION,
        });
        return;
      }
    }

    let destinationExist = importDestinationsCopy?.find(
      (id) => id.importDestinationId === importDestinationId,
    );
    if (!destinationExist) {
      destinationExist = importDestinationsCopy?.find(
        (id) => id?.authentication?.type === AUTH_TYPE_LOGIN,
      );
    }
    let destinationDataSpec = {};
    if (importDestinationId && importDestinationId !== '') {
      destinationDataSpec = {
        importDestinationId,
        type,
        name,
      };
    } else {
      destinationDataSpec = {
        importDestinationId: destinationExist?.importDestinationId,
        type,
        name,
      };
    }
    const newImportFlowSpecs = {
      ...cloneDeep(importFlowSpecs),
      destinationDataSpec,
    };
    delete newImportFlowSpecs.existingFlowSpecs;

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Add Flow',
      rightSection: 'flow',
      mainSection: type === 'Signal' ? 'SignalDetailFlow' : 'contextDetailFlow',
      leftSection: type === 'Signal' ? 'signal' : 'context',
    });

    if (existingFlowSpecs) {
      if (!importFlowSpecs.shouldCreate) {
        newImportFlowSpecs.shouldUpdate = true;
      }
      const newImportFlowSpecCopy = importFlowSpecsCopy.map((spec) => {
        if (spec.importFlowId === newImportFlowSpecs.importFlowId) {
          return newImportFlowSpecs;
        }
        return spec;
      });

      setImportFlowCopy(newImportFlowSpecCopy);
    } else {
      newImportFlowSpecs.shouldCreate = true;
      newImportFlowSpecs.importFlowId = uuidv4();
      setImportFlowCopy([...importFlowSpecsCopy, newImportFlowSpecs]);
    }
    setShowRightPanel(false);
    setSelectedImportFlow(null);
  };

  const deleteImportFlow = (flowId) => {
    const newImportFlowSpecCopy = importFlowSpecsCopy?.reduce((acc, spec) => {
      if (spec?.importFlowId !== flowId) {
        acc.push(spec);
      } else if (!spec?.shouldCreate) {
        acc.push({ ...spec, shouldDelete: true });
      }
      return acc;
    }, []);

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Flow',
      rightSection: 'flow',
      mainSection: type === 'Signal' ? 'SignalDetailFlow' : 'contextDetailFlow',
      leftSection: type === 'Signal' ? 'signal' : 'context',
    });

    setImportFlowCopy(newImportFlowSpecCopy);
    resetFlowConfig();
    setShowRightPanel(false);
  };

  return (
    <div>
      <Header
        title={importFlowName}
        validateReportName={'no-validation'}
        backLinkText={isMobile ? null : 'Flow Name'}
        EmptyTitleText="Flow Name"
        placeholder="Flow Name"
        rightPanel={true}
        onChange={(newName) => {
          setFlowConfig({ importFlowName: newName });
        }}
        actionPanel={() => {
          return (
            <div
              className={css(styles.actionControlWrapper, styles.twoColGrid)}
            >
              {!isExistingAuditSignal && !isFACContext && (
                <>
                  <Tooltip title="Save as draft">
                    <i
                      className={`icon-check ${css(commonStyles.icon)}`}
                      onClick={() => {
                        saveSignalIntegration();
                      }}
                    />
                  </Tooltip>
                </>
              )}
              {existingFlowSpecs && !isExistingAuditSignal && !isFACContext && (
                <Tooltip title="Delete flow">
                  <i
                    className={`icon-trash ${css(commonStyles.icon)}`}
                    onClick={() => {
                      deleteImportFlow(importFlowSpecs.importFlowId);
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip title="Close">
                <i
                  className={`icon-close ${css(commonStyles.icon)}`}
                  onClick={() => {
                    userClicks({
                      pageURL: history?.location?.pathname,
                      pageTitle: document.title,
                      pageDomain: window?.location?.origin,
                      eventLabel: 'Close Flow Panel',
                      rightSection: 'flow',
                      mainSection:
                        type === 'Signal'
                          ? 'SignalDetailFlow'
                          : 'contextDetailFlow',
                      leftSection: type === 'Signal' ? 'signal' : 'context',
                    });
                    setShowRightPanel(false);
                    setSelectedImportFlow(null);
                  }}
                />
              </Tooltip>
            </div>
          );
        }}
      />

      <div
        className={`right-panel-integration ${css(
          signalIntegrationStyles.signalIntegrationContainer,
        )}`}
      >
        <CollapsableWrapper
          activePanel={activeRightPanelSection}
          panels={panels}
          setActiveRightPanel={setActiveRightPanelSection}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setFlowConfig,
  resetFlowConfig,
  setImportFlowCopy,
};

const mapStateToProps = (state) => {
  const { importFlowSpecs } = state?.integration;
  const { importFlowSpecsCopy, importDestinationsCopy, importSources } =
    state?.integration?.integrationConfig;
  const { signalDetail } = state?.signalDetail;
  const { contextDetail } = state?.contextDetail;
  return {
    importFlowSpecs,
    importFlowSpecsCopy,
    importDestinationsCopy,
    importSources,
    signalDetail,
    contextDetail,
  };
};

FlowListRightPanel.propTypes = {
  setShowRightPanel: PropTypes.func,
  setShowIntegration: PropTypes.func,
  setFlowConfig: PropTypes.func,
  resetFlowConfig: PropTypes.func,
  importDestinationsCopy: PropTypes.array,
  name: PropTypes.string,
  type: PropTypes.string,
  importSources: PropTypes.array,
  importFlowSpecs: PropTypes.object,
  importFlowSpecsCopy: PropTypes.array,
  setImportFlowCopy: PropTypes.func,
  setSelectedImportFlow: PropTypes.func,
  signalDetail: PropTypes.object,
  contextDetail: PropTypes.object,
  isExistingAuditSignal: PropTypes.bool,
  isFACContext: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlowListRightPanel);
