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
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import PageLayout from 'Layouts/PageLayout';
import FlowListRightPanel from 'containers/Integrations/components/FlowListRightPanel/FlowListRightPanel';
import ImportSourceContent from 'containers/Integrations/components/IntegrationContents/ImportSources/ImportSourceContent';
import { integrationActions } from 'containers/Integrations/reducers';
import { updateFlowMapping } from 'containers/NewStream/actions';
import { removeInternalProps } from 'containers/utils';
import styles from '../../Layouts/PageLayout/styles';
import { fetchContextConfig, fetchContexts } from '../Context/actions';
import { addImportSourceName } from '../Integrations/components/FlowList/utils';
import { flowSpecsActions } from '../Integrations/components/FlowListRightPanel/reducers';
import NotFound from '../NotFoundPage/NotFoundPage';
import RightPanelAttributeTabContent from './Attribute/RightPanelAttributeTabContent';
import RightPanelEnrichmentTabContent from './Enrichment/RightPanelEnrichmentTabContent';
import RightPanelFeatureTabContent from './Feature/RightPanelFeatureTabContent';
import LeftSectionContent from './LeftSectionContent';
import { cleanUp, fetchContextDetail, setContextDetail } from './actions';
import { getAllFAC } from 'containers/Context/utils';
import { fetchSignals } from 'containers/Signal/actions';
import shortid from 'shortid';

const { setFlowConfig, resetFlowConfig } = flowSpecsActions;
const { clearIntegrationConfig, fetchIntegrationConfig, getImportFlow } =
  integrationActions;

const ContextDetail = ({
  history,
  match,
  error,
  loading,
  selectedTab,
  contextDetail,
  fetchContexts,
  fetchContextDetail,
  fetchSignals,
  setContextDetail,
  signals,
  importSources,
  ContextConfig,
  getImportFlow,
  setFlowConfig,
  resetFlowConfig,
  fetchContextConfig,
  updateFlowMapping,
  clearIntegrationConfig,
  importFlowSpecsCopy,
  fetchIntegrationConfig,
  parentFlow = null,
  skipInitialDetailSetup = false,
  onCreateNewContext = null,
  onDeleteCreatedContext = null,
  onCancel = null,
  cleanUp,
  resetOnboarding = null,
  isLastOnboardingStep,
}) => {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedEnrichment, setSelectedEnrichment] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedImportFlow, setSelectedImportFlow] = useState(null);
  const [showIntegration, setShowIntegration] = useState(null);

  const allFAC = getAllFAC(signals);
  const isFACContext =
    allFAC.has(contextDetail?.contextName) && !contextDetail?.isNewEntry;

  useEffect(() => {
    if (!skipInitialDetailSetup) {
      const contextName = match?.params?.contextId;
      const contextDetail = history?.location?.state?.contextDetail;
      // Teach bios flow provide context with attributes detail
      // while opening an existing context won't
      if (contextDetail) {
        // Added isNewEntry to check if user creating new context or
        // interacting with pre-existing context in the system
        contextDetail['isNewEntry'] = true;
        setContextDetail(contextDetail);
        // Reset location state after using it
        history.replace({ ...history.location, state: undefined });
      } else {
        fetchContextDetail(contextName);
      }
    }
    fetchContexts();
    !ContextConfig && fetchContextConfig();
    if (!importFlowSpecsCopy) {
      fetchIntegrationConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  useEffect(() => {
    return () => {
      updateFlowMapping({ flowMapping: null });
      if (parentFlow != 'onboarding') {
        clearIntegrationConfig();
        cleanUp();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attributeListItemClick = (attributeName) => {
    setShowRightPanel(false);
    if (typeof attributeName === 'number') {
      attributeName = contextDetail?.attributes?.[attributeName]?.attributeName;
    }
    const selectedAttribute = cloneDeep(
      contextDetail?.attributes?.find(
        (attribute) => attributeName === attribute?.attributeName,
      ),
    );
    const tags = selectedAttribute.tags;
    delete selectedAttribute.inferredTags;
    delete selectedAttribute.tags;

    selectedAttribute.disabled =
      contextDetail?.primaryKey?.includes(attributeName);
    if (contextDetail.isNewEntry) {
      if (
        selectedAttribute.hasOwnProperty('default') &&
        selectedAttribute.default !== null
      ) {
        selectedAttribute.defaultEnabled = true;
      } else {
        selectedAttribute.defaultEnabled = false;
      }
    } else {
      selectedAttribute.defaultEnabled =
        selectedAttribute.hasOwnProperty('default') &&
        selectedAttribute.default !== null;
      selectedAttribute.default = selectedAttribute.default ?? null;
    }
    setSelectedAttribute({
      ...selectedAttribute,
      ...removeInternalProps(tags),
    });
    setShowRightPanel(true);
  };

  const addNewAttribute = () => {
    setShowRightPanel(false);
    let attribute = {
      _id: shortid.generate(),
      isNewEntry: true,
      attributeName: '',
      label: '',
      type: 'Integer',
      defaultEnabled: false,
      default: null,
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
      (contextDetail.isNewEntry === true &&
        contextDetail?.missingAttributePolicy === 'StoreDefaultValue') ||
      contextDetail.isNewEntry !== true
    ) {
      attribute.default = 0;
      attribute.defaultEnabled = true;
    }
    setSelectedAttribute(attribute);
    setSelectedFeature(null);
    setShowRightPanel(true);
  };

  const enrichmentListItemClick = (index) => {
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(contextDetail?.enrichments?.[index]);
    setSelectedFeature(null);
    setShowRightPanel(true);
  };

  const addNewEnrichment = () => {
    setShowRightPanel(false);
    setSelectedAttribute(null);
    const enrichment = {
      isNewEntry: true,
      enrichmentName: '',
      foreignKey: [],
      enrichedAttributes: [],
    };
    setSelectedEnrichment(enrichment);
    setSelectedFeature(null);
    setShowRightPanel(true);
  };

  const onFeatureListItemClick = (index) => {
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(contextDetail?.features?.[index]);
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
      indexed: false,
      featureInterval: 300000,
      aggregated: true,
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
      ...currentFeature,
      isNewEntry: true,
      featureName: `${currentFeature?.featureName}_clone`,
      dimensions: currentFeature?.dimensions ? currentFeature?.dimensions : [],
      attributes: currentFeature?.attributes ? currentFeature?.attributes : [],
    };

    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(feature);
    setSelectedImportFlow(null);
    setShowRightPanel(true);
  };

  if (!loading && error && contextDetail === null) {
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
            history={history}
            showRightPanel={showRightPanel}
            selectedAttribute={selectedAttribute}
            addNewAttribute={addNewAttribute}
            attributeListItemClick={attributeListItemClick}
            selectedEnrichment={selectedEnrichment}
            addNewEnrichment={addNewEnrichment}
            enrichmentListItemClick={enrichmentListItemClick}
            setSelectedAttribute={setSelectedAttribute}
            setSelectedEnrichment={setSelectedEnrichment}
            selectedFeature={selectedFeature}
            onAddingNewFeature={onAddingNewFeature}
            onFeatureListItemClick={onFeatureListItemClick}
            setSelectedImportFlow={setSelectedImportFlow}
            onAddingNewFlow={onAddingNewFlow}
            setShowRightPanel={setShowRightPanel}
            parentFlow={parentFlow}
            onCancel={onCancel}
            onCreateNewContext={onCreateNewContext}
            onDeleteCreatedContext={onDeleteCreatedContext}
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
              setShowRightPanel={setShowRightPanel}
              setSelectedAttribute={setSelectedAttribute}
              isFACContext={isFACContext}
            />
          );
        } else if (selectedEnrichment !== null) {
          return (
            <RightPanelEnrichmentTabContent
              history={history}
              selectedEnrichment={selectedEnrichment}
              setShowRightPanel={setShowRightPanel}
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
              name={contextDetail?.contextName}
              type="Context"
              isFACContext={isFACContext}
            />
          );
        }
      }}
      showRightPanel={showRightPanel}
      onCollapseAbleClick={() => {
        const contextName = contextDetail?.contextName;
        if (showRightPanel) {
          setShowRightPanel(false);
          setSelectedAttribute(null);
          setSelectedEnrichment(null);
          setSelectedImportFlow(null);
        } else {
          if (selectedTab === 0) {
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
              onAddingNewFlow();
            }
          } else if (selectedTab === 1) {
            contextDetail?.attributes?.length > 0
              ? attributeListItemClick(0)
              : addNewAttribute();
          } else if (selectedTab === 2) {
            contextDetail?.enrichments?.length > 0
              ? enrichmentListItemClick(0)
              : addNewEnrichment();
          }
        }
      }}
      showCollapsibleAction={true}
    />
  );
};

ContextDetail.propTypes = {
  error: PropTypes.bool,
  loading: PropTypes.bool,
  match: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  contextDetail: PropTypes.instanceOf(Object),
  signals: PropTypes.instanceOf(Object),
  fetchContextDetail: PropTypes.func.isRequired,
  fetchFeaturesStatus: PropTypes.func.isRequired,
  fetchContexts: PropTypes.func.isRequired,
  fetchSignals: PropTypes.func.isRequired,
  setContextDetail: PropTypes.func.isRequired,
  cleanUp: PropTypes.func.isRequired,
  ContextConfig: PropTypes.instanceOf(Object),
  parentFlow: PropTypes.string,
  detailData: PropTypes.instanceOf(Object),
  onCreateNewContext: PropTypes.func,
  importFlowSpecsCopy: PropTypes.array,
  fetchIntegrationConfig: PropTypes.func,
  selectedTab: PropTypes.number,
};

const mapDispatchToProps = {
  fetchContextDetail: (contextName) => fetchContextDetail(contextName),
  setContextDetail: (payload) => setContextDetail(payload),
  fetchContexts: (options) => fetchContexts(options),
  fetchSignals: (options) => fetchSignals(options),
  fetchContextConfig: (options) => fetchContextConfig(options),
  fetchIntegrationConfig: (payload) => fetchIntegrationConfig(payload),
  setFlowConfig: (options) => setFlowConfig(options),
  resetFlowConfig: (options) => resetFlowConfig(options),
  getImportFlow: (options) => getImportFlow(options),
  updateFlowMapping: (payload) => updateFlowMapping(payload),
  clearIntegrationConfig,
  cleanUp: () => cleanUp(),
};

const mapStateToProps = (state) => {
  const { ContextConfig } = state.contexts;
  const { signals } = state.signals;
  const { loading, error, contextDetail, selectedTab } = state.contextDetail;
  const { importFlowSpecsCopy, importSources } =
    state?.integration?.integrationConfig;
  return {
    loading,
    error,
    selectedTab,
    contextDetail,
    ContextConfig,
    importSources,
    importFlowSpecsCopy,
    signals,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextDetail);
