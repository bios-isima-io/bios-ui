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
import FlowListRightPanel from 'containers/Integrations/components/FlowListRightPanel/FlowListRightPanel';
import ImportSourceContent from 'containers/Integrations/components/IntegrationContents/ImportSources/ImportSourceContent';
import { integrationActions } from 'containers/Integrations/reducers';
import { updateFlowMapping } from 'containers/NewStream/actions';
import { removeInternalProps } from 'containers/utils';
import PageLayout from 'Layouts/PageLayout';
import { cloneDeep } from 'lodash-es';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from '../../Layouts/PageLayout/styles';
import { fetchContexts } from '../Context/actions';
import { addImportSourceName } from '../Integrations/components/FlowList/utils';
import { flowSpecsActions } from '../Integrations/components/FlowListRightPanel/reducers';
import { fetchSignalConfig } from '../Signal/actions';
import NotFound from './../NotFoundPage';
import {
  cleanUp,
  clearValidationErrors,
  fetchSignalDetail,
  setSignalDetail,
  updateSelectedTab,
} from './actions';
import LeftSectionContent from './LeftSectionContent/LeftSectionContent';
import RightPanelAttributeTabContent from './RightPanelAttributeTabContent/RightPanelAttributeTabContent';
import RightPanelEnrichmentTabContent from './RightPanelEnrichmentTabContent';
import RightPanelFeatureTabContent from './RightPanelFeatureTabContent';

const { resetFlowConfig, setFlowConfig } = flowSpecsActions;
const { clearIntegrationConfig, fetchIntegrationConfig, getImportFlow } =
  integrationActions;

const SignalDetail = ({
  history,
  match,
  loading,
  error,
  signalDetail,
  selectedTab,
  fetchSignalConfig,
  fetchSignalDetail,
  updateSelectedTab,
  fetchContexts,
  setSignalDetail,
  updateFlowMapping,
  clearIntegrationConfig,
  SignalConfig,
  importFlowSpecsCopy,
  fetchIntegrationConfig,
  resetFlowConfig,
  getImportFlow,
  setFlowConfig,
  importSources,
  parentFlow = null,
  skipInitialDetailSetup = false,
  onCreateNewSignal = null,
  onDeleteCreatedSignal = null,
  onCancel = null,
  cleanUp,
  resetOnboarding = null,
  isLastOnboardingStep,
  clearValidationErrors,
}) => {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedEnrichment, setSelectedEnrichment] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedImportFlow, setSelectedImportFlow] = useState(null);
  const [showIntegration, setShowIntegration] = useState(null);

  const isExistingAuditSignal =
    signalDetail?.signalName?.startsWith('audit') && !signalDetail?.isNewEntry;

  useEffect(() => {
    if (!skipInitialDetailSetup) {
      const signalName = match?.params?.signalId;
      const signalDetail = history?.location?.state?.signalDetail;
      // Teach bios flow provide signal with attributes detail
      // while opening an existing signal won't
      if (signalDetail) {
        // Added isNewEntry to check if user creating new signal or
        // interacting with pre-existing signal in the system
        signalDetail['isNewEntry'] = true;
        setSignalDetail(signalDetail);
        updateSelectedTab(
          signalDetail?.isNewEntry === true
            ? 0
            : signalDetail?.isDataBeingIngested
            ? 1
            : 0,
        );
        // Reset location state after using it
        history.replace({ ...history.location, state: undefined });
      } else {
        fetchSignalDetail(signalName);
      }
    }
    fetchContexts();
    !SignalConfig && fetchSignalConfig();
    if (!importFlowSpecsCopy) {
      fetchIntegrationConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      updateFlowMapping({ flowMapping: null });
      clearIntegrationConfig();
      cleanUp();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAttributeItemClick = (index) => {
    const attributeCopy = cloneDeep(signalDetail?.attributes?.[index]);
    const tags = attributeCopy.tags;
    delete attributeCopy.inferredTags;
    delete attributeCopy.tags;

    if (signalDetail.isNewEntry) {
      if (
        attributeCopy.hasOwnProperty('default') &&
        attributeCopy.default !== null
      ) {
        attributeCopy.defaultEnabled = true;
      } else {
        attributeCopy.defaultEnabled = false;
      }
    } else {
      attributeCopy.defaultEnabled = attributeCopy.hasOwnProperty('default');
      attributeCopy.default = attributeCopy.hasOwnProperty('default')
        ? attributeCopy.default
        : null;
    }
    setShowRightPanel(false);
    const temp = { ...attributeCopy, ...removeInternalProps(tags) };
    setSelectedAttribute(temp);
    setShowRightPanel(true);
  };

  const onAddNewAttribute = () => {
    setShowRightPanel(false);
    let attribute = {
      isNewEntry: true,
      attributeName: '',
      label: '',
      defaultEnabled: false,
      default: null,
      type: 'Integer',
      category: null,
      kind: null,
      otherKindName: '',
      unit: null,
      unitDisplayName: '',
      unitDisplayPosition: null,
      positiveIndicator: null,
      firstSummary: null,
      secondSummary: null,
    };
    if (
      (signalDetail.isNewEntry === true &&
        signalDetail?.missingAttributePolicy === 'StoreDefaultValue') ||
      signalDetail.isNewEntry !== true
    ) {
      attribute.default = 0;
      attribute.defaultEnabled = true;
    }
    setSelectedAttribute(attribute);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  const onEnrichmentItemClick = (index) => {
    const enrichmentItem = Object.assign(
      {},
      {
        ...signalDetail?.enrich?.enrichments?.[index],
        contextAttributes: signalDetail?.enrich?.enrichments?.[
          index
        ]?.contextAttributes.map((item) => {
          item.minimize = true;
          return item;
        }),
      },
    );
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(enrichmentItem);
    setSelectedFeature(null);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  const onAddingNewEnrichment = () => {
    setShowRightPanel(false);
    const enrichment = {
      isNewEntry: true,
      enrichmentName: '',
      foreignKey: [],
      missingLookupPolicy: signalDetail.isNewEntry
        ? 'Reject'
        : 'StoreFillInValue',
      contextName: null,
      contextAttributes: [],
    };

    setSelectedAttribute(null);
    setSelectedEnrichment(enrichment);
    setSelectedFeature(null);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  const onFeatureListItemClick = (index) => {
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(signalDetail?.postStorageStage?.features[index]);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  const onAddingNewFeature = () => {
    setShowRightPanel(false);
    const feature = {
      isNewEntry: true,
      featureName: '',
      dimensions: [],
      attributes: [],
      featureInterval: 300000,
    };

    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(feature);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  const onAddingNewFlow = () => {
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
    setSelectedImportFlow(true);
    setShowRightPanel(true);
  };

  const cloneFeature = (currentFeature) => {
    setShowRightPanel(false);
    const feature = {
      isNewEntry: true,
      featureName: `${currentFeature?.featureName}_clone`,
      dimensions: currentFeature?.dimensions ? currentFeature?.dimensions : [],
      attributes: currentFeature?.attributes ? currentFeature?.attributes : [],
      featureInterval: 300000,
    };

    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(feature);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  if (!loading && error && signalDetail === null) {
    return (
      <div className={css(styles.pageWrapper)}>
        <div className={css(styles.mainSection)}>
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      MainContent={() => {
        return (
          <LeftSectionContent
            setShowRightPanel={setShowRightPanel}
            showRightPanel={showRightPanel}
            selectedAttribute={selectedAttribute}
            setSelectedAttribute={setSelectedAttribute}
            onAddNewAttribute={onAddNewAttribute}
            selectedEnrichment={selectedEnrichment}
            onEnrichmentItemClick={onEnrichmentItemClick}
            onAddingNewEnrichment={onAddingNewEnrichment}
            selectedFeature={selectedFeature}
            onAddingNewFeature={onAddingNewFeature}
            onFeatureListItemClick={onFeatureListItemClick}
            setSelectedImportFlow={setSelectedImportFlow}
            onAddingNewFlow={onAddingNewFlow}
            onCreateNewSignal={onCreateNewSignal}
            onDeleteCreatedSignal={onDeleteCreatedSignal}
            parentFlow={parentFlow}
            history={history}
            onCancel={onCancel}
            resetOnboarding={resetOnboarding}
            isLastOnboardingStep={isLastOnboardingStep}
          />
        );
      }}
      RightPanelContent={() => {
        if (selectedAttribute !== null) {
          return (
            <RightPanelAttributeTabContent
              history={history}
              selectedAttribute={selectedAttribute}
              selectedEnrichment={selectedEnrichment}
              setShowRightPanel={setShowRightPanel}
              setSelectedFeature={setSelectedFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              isExistingAuditSignal={isExistingAuditSignal}
            />
          );
        } else if (selectedEnrichment !== null) {
          return (
            <RightPanelEnrichmentTabContent
              history={history}
              selectedEnrichment={selectedEnrichment}
              setShowRightPanel={setShowRightPanel}
              setSelectedFeature={setSelectedFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
            />
          );
        } else if (selectedFeature !== null) {
          return (
            <RightPanelFeatureTabContent
              history={history}
              setShowRightPanel={setShowRightPanel}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              cloneFeature={cloneFeature}
            />
          );
        } else if (showIntegration) {
          return (
            <ImportSourceContent
              setRightPanelActive={() => setShowIntegration(false)}
              page="signal"
            />
          );
        } else if (selectedImportFlow !== null) {
          return (
            <FlowListRightPanel
              history={history}
              setShowRightPanel={setShowRightPanel}
              setSelectedImportFlow={setSelectedImportFlow}
              setShowIntegration={setShowIntegration}
              name={signalDetail?.signalName}
              type="Signal"
              isExistingAuditSignal={isExistingAuditSignal}
            />
          );
        }
      }}
      showRightPanel={showRightPanel}
      onCollapseAbleClick={() => {
        const signalName = signalDetail?.signalName;
        if (showRightPanel) {
          setShowRightPanel(false);
          setSelectedAttribute(null);
          setSelectedEnrichment(null);
          setSelectedFeature(null);
          setSelectedImportFlow(null);
          clearValidationErrors();
        } else {
          if (selectedTab === 0) {
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
              onAddingNewFlow();
            }
          } else if (selectedTab === 1) {
            signalDetail?.attributes?.length > 0
              ? onAttributeItemClick(0)
              : onAddNewAttribute();
          } else if (selectedTab === 2) {
            signalDetail?.enrich?.enrichments?.length > 0
              ? onEnrichmentItemClick(0)
              : onAddingNewEnrichment();
          } else if (selectedTab === 3) {
            signalDetail?.postStorageStage?.features?.length > 0
              ? onFeatureListItemClick(0)
              : onAddingNewFeature();
          }
        }
      }}
      showCollapsibleAction={true}
    />
  );
};

SignalDetail.propTypes = {
  error: PropTypes.bool,
  loading: PropTypes.bool,
  match: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  signalDetail: PropTypes.instanceOf(Object),
  fetchSignalDetail: PropTypes.func.isRequired,
  fetchContexts: PropTypes.func.isRequired,
  fetchSignalConfig: PropTypes.func.isRequired,
  SignalConfig: PropTypes.instanceOf(Object),
  cleanUp: PropTypes.func.isRequired,
  parentFlow: PropTypes.string,
  detailData: PropTypes.instanceOf(Object),
  onCreateNewSignal: PropTypes.func,
  importFlowSpecsCopy: PropTypes.array,
  fetchIntegrationConfig: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { loading, error, signalDetail, selectedTab } = state.signalDetail;
  const { SignalConfig } = state.signals;
  const { importFlowSpecsCopy, importSources } =
    state?.integration?.integrationConfig;

  return {
    loading,
    error,
    signalDetail,
    SignalConfig,
    importFlowSpecsCopy,
    importSources,
    selectedTab,
  };
};

const mapDispatchToProps = {
  fetchSignalDetail: (signalName) => fetchSignalDetail(signalName),
  fetchSignalConfig: (signalName) => fetchSignalConfig(signalName),
  setSignalDetail: (payload) => setSignalDetail(payload),
  fetchContexts: (options) => fetchContexts(options),
  fetchIntegrationConfig: (payload) => fetchIntegrationConfig(payload),
  cleanUp: () => cleanUp(),
  resetFlowConfig: (payload) => resetFlowConfig(payload),
  getImportFlow: (payload) => getImportFlow(payload),
  setFlowConfig: (payload) => setFlowConfig(payload),
  updateSelectedTab: (payload) => updateSelectedTab(payload),
  updateFlowMapping: (payload) => updateFlowMapping(payload),
  clearIntegrationConfig,
  clearValidationErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignalDetail);
