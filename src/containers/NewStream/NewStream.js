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

import commonStyles from 'app/styles/commonStyles';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { Button, Header } from 'containers/components';
import { startContextCreation } from 'containers/ContextDetail/actions';
import integrationActions from 'containers/Integrations/reducers/actions';
import { startSignalCreation } from 'containers/SignalDetail/actions';
import { ErrorNotification } from 'containers/utils';
import PageLayout from 'Layouts/PageLayout';
import { isValidStreamName } from 'utils';
import messages from 'utils/notificationMessages';

import {
  addDraftSignal,
  cleanUp,
  onLoadTeachBios,
  updateActiveTransformations,
  updateAttributes,
  updateCurrentStep,
  updateFileContent,
  updateFileName,
  updateFlowMapping,
  updateJSONValue,
  updatePrependKeySeparator,
  updateSelectedTab,
  updateSelectedType,
  updateStreamName,
  updateStreamType,
  updateUserAttribute,
  updateValidJSON,
} from './actions';
import RightAttributePanel from './RightAttributePanel';
import style from './style';
import TeachBios from './TeachBios';

const { setIntegrationConfig } = integrationActions;

const NewStream = ({
  tags,
  signals,
  contexts,
  streamType,
  streamName,
  currentStep,
  attributes,
  fileContent,
  selectedType,
  selectedTab,
  jsonValue,
  validJson,
  activeTransFormations,
  teachBiosLoading,
  userCustomAttribute,
  hideStreamTypeSwitch,
  updateAttributes,
  updateStreamName,
  updateUserAttribute,
  onLoadTeachBios,
  flowMapping,
  updatePrependKeySeparator,
  prependKeySeparator,
  selectedArrayToProcess,
  setIntegrationConfig,
  updateCurrentStep,
  addDraftSignal,
  defaultType,
  updateFileContent,
  updateFlowMapping,
  updateFileName,
  history,
  cleanUp,
  updateSelectedType,
  updateSelectedTab,
  backLinkText = '',
  backLinkClick = () => {},
  updateJSONValue,
  updateValidJSON,
  updateStreamType,
  updateActiveTransformations,
  startSignalCreation,
  startContextCreation,
  onDone = null,
  parentFlow = null,
  onCancel = null,
  onBack = null,
  isOntologyTeachBios = false,
}) => {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [signalDetail, setSignalDetail] = useState();
  const [contextDetail, setContextDetail] = useState();

  useEffect(() => {
    if (defaultType) {
      updateStreamType(defaultType);
    }
  }, [defaultType, updateStreamType]);

  useEffect(() => {
    return () => {
      cleanUp();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (streamType === 'signal') {
      const origSignalDetail = signalDetail || {
        signalName: streamName,
        missingAttributePolicy: 'Reject',
        attributes: [],
        enrich: {
          enrichments: [],
        },
        postStorageStage: {
          features: [],
        },
      };
      const newSignalDetail = {
        ...origSignalDetail,
        signalName: streamName,
        attributes,
      };
      setSignalDetail(newSignalDetail);
    } else if (streamType === 'context') {
      const origContextDetail = contextDetail || {
        contextName: streamName,
        missingAttributePolicy: 'Reject',
        missingLookupPolicy: 'FailParentLookup',
        auditEnabled: true,
      };
      const newContextDetail = {
        ...origContextDetail,
        contextName: streamName,
        attributes,
        primaryKey:
          attributes?.length > 0 ? [attributes[0].attributeName] : undefined,
      };
      setContextDetail(newContextDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, streamName, streamType]);

  const startCreation = (config, type) => {
    if (type === 'signal') {
      startSignalCreation();
    } else {
      startContextCreation();
    }
    onDone(config, type);
  };

  const validation = () => {
    // Validate stream name
    if (!isValidStreamName(streamName)) {
      ErrorNotification({
        message:
          streamName === ''
            ? streamType === 'signal'
              ? messages.signal.EMPTY_SIGNAL_NAME
              : messages.context.EMPTY_CONTEXT_NAME
            : streamType === 'signal'
            ? messages.signal.INVALID_SIGNAL_NAME
            : messages.context.INVALID_CONTEXT_NAME,
      });
      return false;
    }
    const nameAlreadyExist =
      streamType === 'signal'
        ? signals.some((item) => item.signalName === streamName)
        : contexts.some((item) => item.contextName === streamName);
    if (nameAlreadyExist) {
      ErrorNotification({
        message:
          streamType === 'signal'
            ? messages.signal.DUPLICATE_SIGNAL_NAME
            : messages.context.DUPLICATE_CONTEXT_NAME,
      });
      return false;
    }
    return true;
  };

  const initiateDIYFlow = () => {
    if (!validation()) {
      return;
    }
    if (streamType === 'signal') {
      const streamDetail = {
        signalName: streamName,
        missingAttributePolicy: 'Reject',
        attributes: [],
        enrich: {
          enrichments: [],
        },
        postStorageStage: {
          features: [],
        },
      };
      startCreation(streamDetail, streamType);
    } else {
      const streamDetail = {
        contextName: streamName,
        missingAttributePolicy: 'Reject',
        missingLookupPolicy: 'FailParentLookup',
        attributes: [],
        primaryKey: [],
        auditEnabled: true,
      };
      startCreation(streamDetail, streamType);
    }
  };

  const getActionContent = (currentStep) => {
    if (currentStep === 0) {
      if (window.innerWidth > isimaLargeDeviceBreakpointNumber) {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '20px',
            }}
          >
            <Button type="secondary" onClick={initiateDIYFlow}>
              DIY Build
            </Button>
          </div>
        );
      } else {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '20px',
            }}
          >
            <Tooltip title="DIY build">
              <i
                className={`icon-DIY-Build ${css(commonStyles.icon)}`}
                onClick={initiateDIYFlow}
              />
            </Tooltip>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <PageLayout
      MainContent={() => {
        return (
          <div className={css(commonStyles.pageContentWrapper)}>
            <div className={css(commonStyles.pageContent)}>
              <div className={`${css(commonStyles.mobileContentWrapper)}`}>
                <Header
                  title={streamName}
                  backLinkText={backLinkText}
                  backLinkClick={(e) => {
                    backLinkClick && backLinkClick();
                  }}
                  EmptyTitleText={
                    streamType === 'signal'
                      ? 'Enter signal name...'
                      : 'Enter context name...'
                  }
                  placeholder={
                    streamType === 'signal'
                      ? 'Signal name...'
                      : 'Context name...'
                  }
                  onChange={updateStreamName}
                  currentStep={currentStep}
                  updateCurrentStep={updateCurrentStep}
                  addDraftEntity={() => {
                    addDraftSignal(history);
                  }}
                  actionPanel={() => getActionContent(currentStep)}
                />
              </div>
              <div className={css(style.contentPanel)}>
                <TeachBios
                  selectedAttribute={selectedAttribute}
                  currentStep={currentStep}
                  attributes={attributes}
                  streamType={streamType}
                  hideStreamTypeSwitch={hideStreamTypeSwitch}
                  userCustomAttribute={userCustomAttribute}
                  updateUserAttribute={updateUserAttribute}
                  onLoadTeachBios={onLoadTeachBios}
                  fileContent={fileContent}
                  selectedArrayToProcess={selectedArrayToProcess}
                  updateFileContent={updateFileContent}
                  updateCurrentStep={updateCurrentStep}
                  updateFlowMapping={updateFlowMapping}
                  updateFileName={updateFileName}
                  teachBiosLoading={teachBiosLoading}
                  setShowRightPanel={setShowRightPanel}
                  setSelectedAttribute={setSelectedAttribute}
                  updatePrependKeySeparator={updatePrependKeySeparator}
                  prependKeySeparator={prependKeySeparator}
                  createEntity={() => {
                    if (!validation()) {
                      return;
                    }
                    setIntegrationConfig({
                      flowMapping,
                    });
                    if (streamType === 'signal') {
                      startCreation(signalDetail, streamType);
                    } else {
                      startCreation(contextDetail, streamType);
                    }
                  }}
                  backLinkClick={() => {
                    onCancel && onCancel(streamType);
                  }}
                  selectedType={selectedType}
                  selectedTab={selectedTab}
                  jsonValue={jsonValue}
                  validJson={validJson}
                  activeTransFormations={activeTransFormations}
                  updateSelectedType={updateSelectedType}
                  updateSelectedTab={updateSelectedTab}
                  updateJSONValue={updateJSONValue}
                  updateValidJSON={updateValidJSON}
                  updateActiveTransformations={updateActiveTransformations}
                  onCancel={() => {
                    onCancel && onCancel(streamType);
                  }}
                  onBack={onBack}
                  isOntologyTeachBios={isOntologyTeachBios}
                  parentFlow={parentFlow}
                  updateAttributes={(attribute) => {
                    updateAttributes(attribute);
                  }}
                  flowMapping={flowMapping}
                />
              </div>
            </div>
          </div>
        );
      }}
      RightPanelContent={() => {
        return (
          <RightAttributePanel
            tags={tags}
            flowMapping={flowMapping}
            updateFlowMapping={updateFlowMapping}
            attributes={attributes}
            selectedAttribute={selectedAttribute || {}}
            setSelectedAttribute={setSelectedAttribute}
            streamType={streamType}
            signalDetail={signalDetail}
            contextDetail={contextDetail}
            setShowRightPanel={setShowRightPanel}
            updateAttributes={(attribute) => {
              updateAttributes(attribute);
            }}
          />
        );
      }}
      showRightPanel={showRightPanel}
    />
  );
};

NewStream.propTypes = {
  streamName: PropTypes.string.isRequired,
  streamType: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  attributes: PropTypes.array.isRequired,
  updateStreamName: PropTypes.func.isRequired,
  updateUserAttribute: PropTypes.func.isRequired,
  onLoadTeachBios: PropTypes.func.isRequired,
  updateCurrentStep: PropTypes.func.isRequired,
  addDraftSignal: PropTypes.func.isRequired,
  updateFileContent: PropTypes.func.isRequired,
  updateFileName: PropTypes.func.isRequired,
  cleanUp: PropTypes.func.isRequired,
  onDone: PropTypes.func,
};

const mapDispatchToProps = {
  updateStreamName: (name) => updateStreamName(name),
  updateUserAttribute: (value) => updateUserAttribute(value),
  onLoadTeachBios: (payload) => onLoadTeachBios(payload),
  updateCurrentStep: (step) => updateCurrentStep(step),
  addDraftSignal: (payload) => addDraftSignal(payload),
  updateFileContent: (content) => updateFileContent(content),
  updateFileName: (name) => updateFileName(name),
  updateAttributes: (attributes) => updateAttributes(attributes),
  cleanUp: () => cleanUp(),
  updateSelectedType: (payload) => updateSelectedType(payload),
  updateSelectedTab: (payload) => updateSelectedTab(payload),
  updateJSONValue: (payload) => updateJSONValue(payload),
  updateValidJSON: (payload) => updateValidJSON(payload),
  updateActiveTransformations: (payload) =>
    updateActiveTransformations(payload),
  updateFlowMapping: (payload) => updateFlowMapping(payload),
  setIntegrationConfig: (payload) => setIntegrationConfig(payload),
  updateStreamType: (payload) => updateStreamType(payload),
  updatePrependKeySeparator: (payload) => updatePrependKeySeparator(payload),
  startSignalCreation,
  startContextCreation,
};

const mapStateToProps = (state) => {
  const { SignalConfig, signals } = state.signals;
  const { contexts } = state.contexts;

  const {
    streamName,
    streamType,
    currentStep,
    attributes,
    teachBiosLoading,
    userCustomAttribute,
    fileContent,
    selectedType,
    selectedTab,
    jsonValue,
    validJson,
    activeTransFormations,
    flowMapping,
    selectedArrayToProcess,
    prependKeySeparator,
  } = state.newStream;
  return {
    signals,
    contexts,
    streamType,
    streamName,
    currentStep,
    attributes,
    teachBiosLoading,
    userCustomAttribute,
    fileContent,
    tags: SignalConfig?.tags,
    selectedType,
    selectedTab,
    jsonValue,
    validJson,
    selectedArrayToProcess,
    activeTransFormations,
    flowMapping,
    prependKeySeparator,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewStream);
