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
import { cloneDeep } from 'lodash-es';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect } from 'react-redux';

import commonStyles from 'app/styles/commonStyles';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import TitleHelmet from 'components/TitleHelmet';
import {
  ConfirmationDialog,
  EditableDescription,
  Header,
  Tabs,
} from 'containers/components';
import { getDefaultValueByType } from 'containers/ContextDetail/utils';
import FlowList from 'containers/Integrations/components/FlowList';
import { addImportSourceName } from 'containers/Integrations/components/FlowList/utils';
import { flowSpecsActions } from 'containers/Integrations/components/FlowListRightPanel/reducers';
import { integrationActions } from 'containers/Integrations/reducers';
import onboardingStyle from 'containers/NewSignal/style';
import {
  fetchEnrichedAttributesDataSketches,
  updateSelectedTab,
  updateSignal,
  updateSignalDetail,
} from 'containers/SignalDetail/actions';
import Loader from 'containers/SignalDetail/Loader';
import SignalDetailHeaderActions from 'containers/SignalDetail/SignalDetailHeaderActions';
import styles from 'containers/SignalDetail/styles';
import { removeInternalProps, WarningNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';

import AttributeTabContent from './AttributeTabContent';
import EnrichmentTabContent from './EnrichmentTabContent';
import FeatureTabContent from './FeatureTabContent';
import ExportData from './ExportData';

const { setFlowConfig, resetFlowConfig } = flowSpecsActions;
const { getImportFlow } = integrationActions;

const LeftSectionContent = ({
  loading,
  error,
  onEnrichmentItemClick,
  onAddingNewEnrichment,
  onAddingNewFlow,
  showRightPanel,
  updateSignalDetail,
  signalDetail,
  setShowRightPanel,
  onAddingNewFeature,
  selectedAttribute,
  selectedEnrichment,
  selectedFeature,
  onFeatureListItemClick,
  setSelectedAttribute,
  onAddNewAttribute,
  setSelectedImportFlow,
  enrichedAttributesDataSketchesLoaded,
  fetchEnrichedAttributesDataSketches,
  importFlowSpecsCopy,
  importSources,
  exportDestinations,
  resetFlowConfig,
  updateSelectedTab,
  getImportFlow,
  setFlowConfig,
  onCreateNewSignal,
  onDeleteCreatedSignal,
  parentFlow,
  onCancel,
  history,
  resetOnboarding,
  isLastOnboardingStep,
}) => {
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const onAttributeItemClick = (index) => {
    const attributeCopy = cloneDeep(signalDetail?.attributes?.[index]);
    const tags = attributeCopy.tags;
    delete attributeCopy.inferredTags;
    delete attributeCopy.tags;

    attributeCopy.defaultEnabled =
      attributeCopy.default !== null && attributeCopy.default !== undefined;

    setShowRightPanel(false);
    const temp = { ...attributeCopy, ...removeInternalProps(tags) };
    setSelectedAttribute(temp);
    setShowRightPanel(true);
  };

  const onEnrichedAttributeItemClick = (item) => {
    const attributeCopy = cloneDeep(item);
    attributeCopy.isEnriched = true;
    setShowRightPanel(false);
    setSelectedAttribute(attributeCopy);
    setShowRightPanel(true);
  };

  const onAttributePolicyChange = (updatedPolicy) => {
    if (updatedPolicy === 'StoreDefaultValue') {
      WarningNotification({
        message: messages.signal.ATTRIBUTE_POLICY_TO_STORE_DEFAULT,
      });

      const updatedSignalDetail = {
        ...signalDetail,
        missingAttributePolicy: updatedPolicy,
        attributes: signalDetail.attributes.map((attribute) => {
          attribute.default = getDefaultValueByType(attribute.type);
          attribute.defaultEnabled = true;
          return attribute;
        }),
      };
      updateSignalDetail(updatedSignalDetail);

      if (selectedAttribute) {
        let updatedSelectedAttribute = {
          ...selectedAttribute,
          default: getDefaultValueByType(selectedAttribute.type),
        };
        setSelectedAttribute(updatedSelectedAttribute);
      }
    } else {
      WarningNotification({
        message: messages.signal.ATTRIBUTE_POLICY_FROM_STORE_DEFAULT,
      });

      const updatedSignalDetail = {
        ...signalDetail,
        missingAttributePolicy: updatedPolicy,
        attributes: signalDetail.attributes.map((attribute) => {
          attribute.defaultEnabled = false;
          attribute.default = null;
          return attribute;
        }),
      };
      updateSignalDetail(updatedSignalDetail);

      if (selectedAttribute) {
        let updatedSelectedAttribute = Object.assign({}, selectedAttribute);
        selectedAttribute.defaultEnabled = false;
        selectedAttribute.default = null;
        setSelectedAttribute(updatedSelectedAttribute);
      }
    }
  };

  const isDataPresentInSignal = () => {
    const isDataBeingIngested = signalDetail?.attributes?.find(
      (attribute) =>
        attribute?.distinctCountSummaryNumber &&
        attribute?.distinctCountSummaryNumber > 0,
    );
    return isDataBeingIngested ? true : false;
  };

  const tabsConfig = {
    defaultTab:
      signalDetail?.isNewEntry === true ? 0 : isDataPresentInSignal() ? 1 : 0,
    tabs: [
      {
        label: 'Flows',
        key: 0,
        content: () => {
          return (
            <FlowList
              history={history}
              onAddingNewFlow={onAddingNewFlow}
              setSelectedImportFlow={setSelectedImportFlow}
              pageType="Signal"
              name={signalDetail?.signalName}
              showRightPanel={showRightPanel}
              parentFlow={parentFlow}
            />
          );
        },
      },
      {
        label: 'Attributes',
        key: 1,
        content: () => {
          return (
            <AttributeTabContent
              history={history}
              signalDetail={signalDetail}
              onListItemClick={onAttributeItemClick}
              onEnrichedAttributeItemClick={onEnrichedAttributeItemClick}
              onPolicyChange={onAttributePolicyChange}
              addNewEntry={onAddNewAttribute}
              enrichedAttributesDataSketchesLoaded={
                enrichedAttributesDataSketchesLoaded
              }
              fetchEnrichedAttributesDataSketches={
                fetchEnrichedAttributesDataSketches
              }
              selectedAttribute={selectedAttribute}
            />
          );
        },
      },
      {
        label: 'Enrichments',
        key: 2,
        content: () => {
          return (
            <EnrichmentTabContent
              history={history}
              selectedEnrichment={selectedEnrichment}
              data={signalDetail?.enrich?.enrichments}
              onListItemClick={onEnrichmentItemClick}
              addNewEntry={onAddingNewEnrichment}
            />
          );
        },
      },
      {
        label: 'Features',
        key: 3,
        content: () => {
          return (
            <FeatureTabContent
              history={history}
              selectedFeature={selectedFeature}
              data={signalDetail?.postStorageStage?.features}
              onListItemClick={onFeatureListItemClick}
              addNewEntry={onAddingNewFeature}
            />
          );
        },
      },
    ],
  };

  const getContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className={css(commonStyles.centerPosition)}>
          Error in loading signal detail....
        </div>
      );
    }

    return (
      <div className={css(styles.wrapper)}>
        <ExportData
          exportDestinationId={signalDetail?.exportDestinationId}
          updateExportDestinationId={(exportDestinationId) => {
            const updatedSignalDetail = {
              ...signalDetail,
              exportDestinationId,
            };
            if (exportDestinationId === 'export_clear_selection') {
              delete updatedSignalDetail?.exportDestinationId;
            }
            updateSignalDetail(updatedSignalDetail);
          }}
          exportDestinations={exportDestinations}
        />
        <div className={css(styles.topControlWrapper)}>
          <div className={css(styles.advanceConfigTrigger)}></div>
        </div>
        <Tabs
          tabsConfig={tabsConfig}
          onTabChange={(key) => {
            updateSelectedTab(key);
            if (key === 0 && showRightPanel) {
              let filterList = addImportSourceName(
                importFlowSpecsCopy,
                importSources,
                signalName,
                'Signal',
              );
              if (filterList?.length > 0) {
                const ifs = filterList[0];
                resetFlowConfig();
                onAddingNewFlow();
                getImportFlow(ifs?.importFlowId);
                setFlowConfig({
                  importFlowId: ifs?.importFlowId,
                  existingFlowSpecs: true,
                });
              } else {
                setShowRightPanel();
              }
            } else if (key === 1 && showRightPanel) {
              signalDetail?.attributes?.length > 0
                ? onAttributeItemClick(0)
                : setShowRightPanel();
            } else if (key === 2 && showRightPanel) {
              signalDetail?.enrich?.enrichments?.length > 0
                ? onEnrichmentItemClick(0)
                : setShowRightPanel();
            } else if (key === 3 && showRightPanel) {
              signalDetail?.postStorageStage?.features?.length > 0
                ? onFeatureListItemClick(0)
                : setShowRightPanel();
            }
          }}
        />
      </div>
    );
  };

  const signalName = signalDetail?.signalName;
  return (
    <>
      <TitleHelmet title={signalName} />
      {!loading && (
        <>
          <div
            className={`${css(
              parentFlow === 'onboarding' && onboardingStyle.headerWrapper,
            )}`}
          >
            <Header
              title={signalName}
              backLinkText={
                parentFlow !== 'onboarding'
                  ? window.innerWidth > isimaLargeDeviceBreakpointNumber
                    ? 'Back to All Signals'
                    : 'Back'
                  : ''
              }
              backLinkClick={(e) => {
                history.push('/signals');
              }}
              EmptyTitleText="Enter signal name..."
              placeholder="Signal name..."
              onChange={(signalName) => {
                const updatedSignalDetail = {
                  ...signalDetail,
                  signalName,
                };
                updateSignalDetail(updatedSignalDetail);
              }}
              actionPanel={() => {
                return (
                  <SignalDetailHeaderActions
                    history={history}
                    onCreateNewSignal={onCreateNewSignal}
                    onDeleteCreatedSignal={onDeleteCreatedSignal}
                    parentFlow={parentFlow}
                    onCancel={onCancel}
                    resetOnboarding={resetOnboarding}
                    isLastOnboardingStep={isLastOnboardingStep}
                    setShowRightPanel={setShowRightPanel}
                  />
                );
              }}
              readOnly={signalDetail.isNewEntry !== true}
            />
            {parentFlow === 'onboarding' && (
              <div className={css(onboardingStyle.closeIconWrapper)}>
                <i
                  className={`icon icon-close ${css(
                    onboardingStyle.closeIcon,
                  )}`}
                  onClick={() => {
                    setShowQuitDialog(true);
                  }}
                />
              </div>
            )}
          </div>
          <EditableDescription
            value={signalDetail?.description}
            onChange={(value) => {
              const updatedSignalDetail = {
                ...signalDetail,
                description: value,
              };
              updateSignalDetail(updatedSignalDetail);
            }}
          />
        </>
      )}
      {getContent()}
      <ConfirmationDialog
        type="exit"
        show={showQuitDialog}
        onCancel={() => {
          onCancel && onCancel();
        }}
        onOk={() => {
          setShowQuitDialog(false);
        }}
        onCancelText="Yes"
        onOkText="No"
        headerTitleText="Are you sure you want to quit?"
        helperText=""
      />
    </>
  );
};

LeftSectionContent.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  showRightPanel: PropTypes.bool,
  updateSignalDetail: PropTypes.func,
  signalDetail: PropTypes.instanceOf(Object),
  updateSignal: PropTypes.func,
  setShowRightPanel: PropTypes.func,
  selectedAttribute: PropTypes.instanceOf(Object),
  setSelectedAttribute: PropTypes.func,
  setSelectedImportFlow: PropTypes.func,
  history: PropTypes.instanceOf(Object),
  enrichedAttributesDataSketchesLoaded: PropTypes.bool,
  fetchEnrichedAttributesDataSketches: PropTypes.func,
  parentFlow: PropTypes.string,
  onCreateNewSignal: PropTypes.func,
  updateSelectedTab: PropTypes.func,
  exportDestinations: PropTypes.array,
};

const mapDispatchToProps = {
  updateSignalDetail,
  updateSignal,
  resetFlowConfig,
  getImportFlow,
  setFlowConfig,
  updateSelectedTab,
  fetchEnrichedAttributesDataSketches,
};

const mapStateToProps = (state) => {
  const { loading, error, signalDetail, enrichedAttributesDataSketchesLoaded } =
    state.signalDetail;
  const { importFlowSpecsCopy, importSources, exportDestinations } =
    state?.integration?.integrationConfig;
  return {
    loading,
    error,
    signalDetail,
    importFlowSpecsCopy,
    importSources,
    exportDestinations,
    enrichedAttributesDataSketchesLoaded,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSectionContent);
