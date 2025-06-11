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
import { useEffect } from 'react';
import { connect } from 'react-redux';

import commonStyles from 'app/styles/commonStyles';
import TitleHelmet from 'components/TitleHelmet';
import { fetchContexts } from 'containers/Context/actions';
import {
  PANEL_DESTINATION,
  PANEL_PROCESS,
  PANEL_SOURCE,
  TAB_DESTINATION,
  TAB_PROCESS,
  TAB_SOURCE,
} from 'containers/Integrations/const';
import {
  getNewProcessDetails,
  listActiveEntries,
  listActiveSources,
  parseProcessorConf,
} from 'containers/Integrations/utils';
import { fetchSignals } from 'containers/Signal/actions';
import PageLayout from 'Layouts/PageLayout';
import { biosDestinationIntegrationActions } from './components/BiosDestination/reducers';
import IntegrationContents from './components/IntegrationContents';
import {
  requestDestinationCreation,
  setSelectedExportDestination,
} from './components/IntegrationContents/ExportDestinations/actions';
import LeftSectionHeader from './components/LeftSectionHeader';
import { kafkaIntegrationActions } from './components/IntegrationContents/ImportSources/Type/Kafka/reducers';
import { webHookIntegrationActions } from './components/IntegrationContents/ImportSources/Type/Webhook/reducers';
import Loader from './Loader';
import { integrationActions } from './reducers';
import RightPanelContent from './RightPanelContent';

const { setKafkaIntegration } = kafkaIntegrationActions;
const { setWebhookIntegration } = webHookIntegrationActions;
const {
  fetchIntegrationConfig,
  setRightPanelActive,
  setRightPanelType,
  setIntegrationConfig,
  setProcessDetails,
  setSourceIndexToShow,
} = integrationActions;
const { setBiosDestinationIntegration, resetBiosDestinationIntegration } =
  biosDestinationIntegrationActions;

function Integrations({
  fetchIntegrationConfig,
  setRightPanelActive,
  selectedTab,
  importSourcesCopy,
  setIntegrationConfig,
  rightPanelActive,
  setRightPanelType,
  setProcessDetails,
  importDataProcessorsCopy,
  loading,
  error,
  fetchSignals,
  fetchContexts,
  history,
  setSourceIndexToShow,
  exportDestinationsCopy,
  setSelectedExportDestination,
  requestDestinationCreation,
}) {
  useEffect(() => {
    fetchIntegrationConfig({ loading: true });
    setRightPanelActive(false);
    fetchSignals({ onlyFetchSignals: true });
    fetchContexts();
  }, [
    fetchContexts,
    fetchIntegrationConfig,
    fetchSignals,
    setRightPanelActive,
  ]);

  const trySelectingContent = (key) => {
    let selectable = false;
    switch (key) {
      case TAB_SOURCE:
        setRightPanelType(PANEL_SOURCE);
        selectable = listActiveSources(importSourcesCopy)?.length > 0;
        setSourceIndexToShow(selectable ? 0 : -1);
        break;
      case TAB_DESTINATION:
        setRightPanelType(PANEL_DESTINATION);
        const destinations = listActiveEntries(exportDestinationsCopy);
        selectable = destinations?.length > 0;
        if (selectable) {
          setSelectedExportDestination(destinations[0]);
        } else {
          requestDestinationCreation();
        }
        break;
      case TAB_PROCESS: {
        setRightPanelType(PANEL_PROCESS);
        const processors = listActiveEntries(importDataProcessorsCopy);
        selectable = processors?.length > 0;
        if (selectable) {
          setProcessDetails(parseProcessorConf(processors[0]));
        } else {
          setProcessDetails(getNewProcessDetails());
        }
        break;
      }
      default:
      // do nothing
    }
    return selectable;
  };

  const MainContent = () => {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className={css(commonStyles.centerPosition)}>
          Error in loading integrations....
        </div>
      );
    }

    return (
      <div>
        <LeftSectionHeader history={history} />
        <TitleHelmet title="Integrations" />
        <IntegrationContents
          trySelectingContent={trySelectingContent}
          history={history}
        />
      </div>
    );
  };

  return (
    <PageLayout
      MainContent={MainContent}
      RightPanelContent={() => <RightPanelContent history={history} />}
      showRightPanel={rightPanelActive}
      onCollapseAbleClick={() => {
        if (rightPanelActive) {
          setIntegrationConfig({
            integrationId: '',
            integrationName: '',
            integrationType: 'Webhook',
            integrationActive: true,
            existingIntegration: false,
            rightPanelActive: false,
            processName: '',
            processCode: '',
            existingProcess: false,
          });
        } else {
          trySelectingContent(selectedTab);
          setRightPanelActive(true);
        }
      }}
      showCollapsibleAction={true}
    />
  );
}

Integrations.propTypes = {
  fetchIntegrationConfig: PropTypes.func,
  setRightPanelActive: PropTypes.func,
  rightPanelActive: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  fetchSignals: PropTypes.func,
  fetchContexts: PropTypes.func,
  exportDestinationsCopy: PropTypes.array,
  setSelectedExportDestination: PropTypes.func,
  requestDestinationCreation: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
    rightPanelActive,
    loading,
    error,
    selectedTab,
    importSourcesCopy,
    importDestinationsCopy,
    importDataProcessorsCopy,
    exportDestinationsCopy,
  } = state?.integration?.integrationConfig;
  return {
    rightPanelActive,
    loading,
    error,
    importDataProcessorsCopy,
    selectedTab,
    importSourcesCopy,
    importDestinationsCopy,
    exportDestinationsCopy,
  };
};

const mapDispatchToProps = {
  fetchIntegrationConfig,
  setRightPanelActive,
  fetchSignals,
  fetchContexts,
  resetBiosDestinationIntegration,
  setBiosDestinationIntegration,
  setRightPanelType,
  setIntegrationConfig,
  setWebhookIntegration,
  setKafkaIntegration,
  setProcessDetails,
  setSourceIndexToShow,
  setSelectedExportDestination,
  requestDestinationCreation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
