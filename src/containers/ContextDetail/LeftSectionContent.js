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
import { useState } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import TitleHelmet from 'components/TitleHelmet';
import {
  ConfirmationDialog,
  EditableDescription,
  Header,
  Tabs,
} from 'containers/components';
import FlowList from 'containers/Integrations/components/FlowList';
import { addImportSourceName } from 'containers/Integrations/components/FlowList/utils';
import { flowSpecsActions } from 'containers/Integrations/components/FlowListRightPanel/reducers';
import { integrationActions } from 'containers/Integrations/reducers';
import onboardingStyles from 'containers/NewSignal/style';
import Loader from 'containers/SignalDetail/Loader';
import styles from 'containers/SignalDetail/styles';
import { WarningNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { updateContextDetail, updateSelectedTab } from './actions';
import AttributeTabContent from './Attribute/AttributeTabContent';
import ContextDetailHeaderActions from './ContextDetailHeaderActions';
import EnrichmentTabContent from './Enrichment/EnrichmentTabContent';
import Ttl from './Ttl';
import UploadContextEntries from './UploadContextEntries';
import { getDefaultValueByType } from './utils';
import { FeatureTabContent } from './Feature';
import { cloneDeep } from 'lodash';

const { userClicks } = ipxl;
const { setFlowConfig, resetFlowConfig } = flowSpecsActions;
const { getImportFlow } = integrationActions;

const LeftSectionContent = ({
  // Data props
  error,
  loading,
  history,
  showRightPanel,
  contextDetail,
  selectedAttribute,
  selectedEnrichment,
  importFlowSpecsCopy,
  importSources,
  parentFlow,

  //Methods props
  updateSelectedTab,
  setShowRightPanel,
  addNewAttribute,
  attributeListItemClick,
  updateContextDetail,
  setSelectedAttribute,
  setSelectedEnrichment,
  addNewEnrichment,
  enrichmentListItemClick,
  selectedFeature,
  onFeatureListItemClick,
  onAddingNewFeature,
  setSelectedImportFlow,
  onAddingNewFlow,
  resetFlowConfig,
  getImportFlow,
  setFlowConfig,
  onCreateNewContext,
  onDeleteCreatedContext,
  onCancel,
  resetOnboarding,
  isLastOnboardingStep,
}) => {
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const onEnrichedAttributeItemClick = (item) => {
    const attributeCopy = cloneDeep(item);
    attributeCopy.isEnriched = true;
    setShowRightPanel(false);
    setSelectedAttribute(attributeCopy);
    setShowRightPanel(true);
  };

  const attributePolicyChange = (updatedPolicy) => {
    if (updatedPolicy === 'StoreDefaultValue') {
      WarningNotification({
        message: messages.context.ATTRIBUTE_POLICY_TO_STORE_DEFAULT,
      });

      const updatedContextDetail = {
        ...contextDetail,
        missingAttributePolicy: updatedPolicy,
        attributes: contextDetail.attributes.map((attribute, i) => {
          attribute.default = getDefaultValueByType(attribute.type);
          attribute.defaultEnabled = true;
          return attribute;
        }),
      };
      updateContextDetail(updatedContextDetail);

      if (selectedAttribute) {
        let updatedSelectedAttribute = {
          ...selectedAttribute,
          default: getDefaultValueByType(selectedAttribute.type),
        };
        setSelectedAttribute(updatedSelectedAttribute);
      }
    } else {
      WarningNotification({
        message: messages.context.ATTRIBUTE_POLICY_FROM_STORE_DEFAULT,
      });

      const updatedContextDetail = {
        ...contextDetail,
        missingAttributePolicy: updatedPolicy,
        attributes: contextDetail.attributes.map((attribute) => {
          attribute.defaultEnabled = false;
          attribute.default = null;
          return attribute;
        }),
      };
      updateContextDetail(updatedContextDetail);

      if (selectedAttribute) {
        let updatedSelectedAttribute = Object.assign({}, selectedAttribute);
        selectedAttribute.defaultEnabled = false;
        selectedAttribute.default = null;
        setSelectedAttribute(updatedSelectedAttribute);
      }
    }
  };

  const tabsConfig = {
    defaultTab: contextDetail?.isNewEntry === true ? 0 : 1,
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
              pageType="Context"
              name={contextDetail?.contextName}
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
              onEnrichedAttributeItemClick={onEnrichedAttributeItemClick}
              contextDetail={contextDetail}
              onListItemClick={attributeListItemClick}
              onPolicyChange={attributePolicyChange}
              addNewEntry={addNewAttribute}
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
              data={contextDetail?.enrichments}
              onListItemClick={enrichmentListItemClick}
              addNewEntry={addNewEnrichment}
              selectedEnrichment={selectedEnrichment}
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
              data={contextDetail?.features}
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
          Error in loading context detail....
        </div>
      );
    }

    return (
      <div className={css(styles.wrapper)}>
        <div className={css(commonStyles.leftSectionRowWrapper)}>
          <Ttl
            ttlInMillis={contextDetail.ttl}
            updateTtl={(ttl) => {
              const newContextDetail = {
                ...contextDetail,
                ttl,
              };
              if (ttl === 0) {
                delete newContextDetail.ttl;
              }
              updateContextDetail(newContextDetail);
            }}
          />
          <UploadContextEntries />
        </div>
        <Tabs
          tabsConfig={tabsConfig}
          onTabChange={(key) => {
            updateSelectedTab(key);
            if (key === 0 && showRightPanel) {
              let filterList = addImportSourceName(
                importFlowSpecsCopy,
                importSources,
                contextName,
                'Context',
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
              contextDetail?.attributes?.length > 0
                ? attributeListItemClick(0)
                : setShowRightPanel();
            } else if (key === 2 && showRightPanel) {
              contextDetail?.enrichments?.length > 0
                ? enrichmentListItemClick(0)
                : setShowRightPanel();
            }
          }}
        />
      </div>
    );
  };

  const contextName = contextDetail?.contextName;
  return (
    <>
      <TitleHelmet title={contextName} />
      {!loading && (
        <>
          <div
            className={`${css(
              parentFlow === 'onboarding' && onboardingStyles.headerWrapper,
            )}`}
          >
            <Header
              title={contextName}
              backLinkText={
                parentFlow !== 'onboarding'
                  ? window.innerWidth > isimaLargeDeviceBreakpointNumber
                    ? 'Back to All Contexts'
                    : 'Back'
                  : ''
              }
              backLinkClick={(e) => {
                userClicks({
                  pageURL: history?.location?.pathname,
                  pageTitle: document.title,
                  pageDomain: window?.location?.origin,
                  eventLabel: 'Navigate Context Home',
                  rightSection: 'None',
                  mainSection: 'contextDetail',
                  leftSection: 'context',
                });
                history.push('/contexts');
              }}
              EmptyTitleText="Untitled_context"
              placeholder="Context name..."
              onChange={(contextName) => {
                const updatedContextDetail = {
                  ...contextDetail,
                  contextName,
                };
                updateContextDetail(updatedContextDetail);
              }}
              actionPanel={() => {
                return (
                  <ContextDetailHeaderActions
                    history={history}
                    parentFlow={parentFlow}
                    onCreateNewContext={onCreateNewContext}
                    onDeleteCreatedContext={onDeleteCreatedContext}
                    onCancel={onCancel}
                    resetOnboarding={resetOnboarding}
                    isLastOnboardingStep={isLastOnboardingStep}
                    setShowRightPanel={setShowRightPanel}
                  />
                );
              }}
              readOnly={contextDetail.isNewEntry !== true}
            />
            {parentFlow === 'onboarding' && (
              <div className={css(onboardingStyles.closeIconWrapper)}>
                <i
                  className={`icon icon-close ${css(
                    onboardingStyles.closeIcon,
                  )}`}
                  onClick={() => {
                    setShowQuitDialog(true);
                  }}
                />
              </div>
            )}
          </div>
          <EditableDescription
            value={contextDetail?.description}
            onChange={(value) => {
              const updatedContextDetail = {
                ...contextDetail,
                description: value,
              };
              updateContextDetail(updatedContextDetail);
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
  error: PropTypes.bool,
  loading: PropTypes.bool,
  history: PropTypes.instanceOf(Object),
  contextDetail: PropTypes.instanceOf(Object),
  setShowRightPanel: PropTypes.func,
  revertLocalChanges: PropTypes.func,
  updateContextDetail: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
  setSelectedEnrichment: PropTypes.func,
  resetFlowConfig: PropTypes.func,
  getImportFlow: PropTypes.func,
  setFlowConfig: PropTypes.func,
  importFlowSpecsCopy: PropTypes.array,
  importSources: PropTypes.array,
  parentFlow: PropTypes.string,
  onCreateNewContext: PropTypes.func,
};

const mapDispatchToProps = {
  updateContextDetail,
  resetFlowConfig,
  getImportFlow,
  setFlowConfig,
  updateSelectedTab,
};

const mapStateToProps = (state) => {
  const { loading, error, contextDetail } = state.contextDetail;

  const { importFlowSpecsCopy, importSources } =
    state?.integration?.integrationConfig;
  return {
    loading,
    error,
    contextDetail,
    importFlowSpecsCopy,
    importSources,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSectionContent);
