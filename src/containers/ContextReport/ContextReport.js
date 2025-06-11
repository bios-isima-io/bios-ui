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
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { Modal, Tooltip } from 'antdlatest';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDialog, Input } from 'containers/components';
import PageLayout from 'Layouts/PageLayout';
import TitleHelmet from 'components/TitleHelmet';
import Header from 'containers/components/Header';
import ContextMultiSelect from './components/ContextMultiSelect/ContextMultiSelect';
import ReportGraph from './components/ReportGraph';
import BelowGraphOptions from './BelowGraphOptions';
import AboveGraphOptions from './AboveGraphOptions';
import AdvanceSettings from './components/AdvanceSettings';
import InviteFlowButton from 'components/InviteFlowButton';
import { reportActions } from './reducers';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { ErrorNotification } from 'containers/utils';
import InviteUsers from 'containers/InviteUsers';
import { groupByActions } from './components/GroupBy/reducers';
import getContextsListFromMeasurement from './utils/getContextsListFromMeasurement';
import { SELECT_UNDERLINE_COLOR } from './components/ContextMultiSelect/const';
import {
  DEFAULT_GROUPBY_X_TOP_N,
  DEFAULT_GROUPBY_Y_TOP_N,
} from './components/AdvanceSettings/DataGranularity/const';
import './styles.scss';
import DataGrid from './components/DataGrid';

const {
  fetchAllReports,
  saveReport,
  loadReport,
  deleteReport,
  resetReportData,
} = reportActions;
const { setGroupByXY } = groupByActions;

function ContextReport({
  fetchAllReports,
  saveReport,
  loadReport,
  deleteReport,

  selectedContexts,
  selectedMetrics,
  selectedFilters,
  groupByX,
  groupByY,
  graphDataLoading,
  allReports,
  contexts,
  resetReportData,
  topX,
  topY,
}) {
  const history = useHistory();
  const params = useParams();
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelType, setRightPanelType] = useState('');
  const [reportType, setReportType] = useState('new');
  const [activeReportId, setActiveReportId] = useState(uuidv4());

  const [loadSavedCounter, setLoadSavedCounter] = useState(1);

  const [showDeleteReportConfirm, setShowDeleteReportConfirm] = useState(false);

  const [reportName, setReportName] = useState('');
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < isimaLargeDeviceBreakpointNumber ? true : false,
  );

  const [isReportChanged] = useState(false);
  const debouncedHandleResize = debounce(() => {
    const newIsMobile =
      window.innerWidth < isimaLargeDeviceBreakpointNumber ? true : false;
    setIsMobile(newIsMobile);
  }, 1000);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  useEffect(() => {
    resetReportData();
    fetchAllReports();
    if (params?.reportId !== '' && params?.reportId !== undefined) {
      setActiveReportId(params?.reportId);
      setReportType('existing');
    }
  }, []);

  useEffect(() => {
    if (
      reportType === 'existing' &&
      contexts?.length > 0 &&
      allReports?.reportConfigs?.length > 0
    ) {
      let activeReportItem = allReports?.reportConfigs?.filter(
        (elem) => elem.reportId === activeReportId,
      );

      if (!activeReportItem || activeReportItem.length === 0) {
        return;
      }

      const {
        chartType,
        groupByX,
        groupByY,
        reportId,
        reportName,
        reportType,
        selectedFilters,
        selectedContexts,
        topX,
        topY,
      } = activeReportItem?.[0];

      let { metrics } = activeReportItem?.[0];

      const context = metrics?.map((metric) => {
        return getContextsListFromMeasurement(metric?.measurement, contexts);
      });

      const reportSelectedContextsFlat = [...new Set(context?.flat(2))];
      let reportSelectedContexts = contexts.filter((con) => {
        return reportSelectedContextsFlat.includes(con.contextName);
      });

      reportSelectedContexts.forEach((con, index) => {
        con.color = SELECT_UNDERLINE_COLOR[index % 3];
      });

      setReportName(reportName);

      // support for old report
      if (selectedContexts?.length > 0 && metrics.length === 0) {
        metrics = [
          {
            measurement: selectedContexts?.[0] + '.count()',
            as: selectedContexts?.[0] + '.count()',
            type: 'simple',
            defaultGraphType: 'donut',
          },
        ];
        reportSelectedContexts = contexts?.filter(
          (con) => con.contextName === selectedContexts[0],
        );
      }

      loadReport({
        chartType,
        groupByX,
        groupByY: groupByY ?? '',
        reportId,
        reportName,
        reportType,
        selectedContexts: reportSelectedContexts,
        selectedMetrics: metrics,
        selectedFilters,
        topX: topX ?? DEFAULT_GROUPBY_X_TOP_N,
        topY: topY ?? DEFAULT_GROUPBY_Y_TOP_N,
      });
    }
  }, [allReports, contexts, loadSavedCounter]);

  const saveAsNewReportNameModal = () => {
    let newReportName = '';
    Modal.confirm({
      icon: <i className="icon-File new-report-name-icon" />,
      className: 'report-page-modal save-as-modal',
      title: 'Save As',
      content: (
        <div>
          <Input
            placeholder="Enter new report name..."
            hideSuffix={true}
            onChange={(event) => {
              newReportName = event.target.value;
            }}
          />
        </div>
      ),
      okText: 'Save',
      onOk: () => {
        saveReportClick(true, newReportName);
      },
      cancelText: 'Close',
    });
  };
  const reportOptions = () => {
    const saveButtonClass = graphDataLoading ? 'icon-disabled' : '';
    return (
      <div>
        {reportType === 'existing' && (
          <Tooltip placement="top" title="Save report as">
            <i
              className="icon-File icon-File-custom"
              onClick={() => {
                saveAsNewReportNameModal();
              }}
            />
          </Tooltip>
        )}

        <Tooltip placement="top" title="Save">
          <i
            className={`icon-check-circle icon ${saveButtonClass}`}
            {...(saveButtonClass === '' && {
              onClick: () => saveReportClick(false, reportName),
            })}
          />
        </Tooltip>
        {reportType === 'existing' && (
          <Tooltip placement="top" title="Discard Changes">
            <i
              className="icon-revert icon"
              onClick={() => setLoadSavedCounter(loadSavedCounter + 1)}
            />
          </Tooltip>
        )}
        <ConfirmationDialog
          show={showDeleteReportConfirm}
          onCancel={() => {
            setShowDeleteReportConfirm(false);
          }}
          onOk={() => {
            deleteReport(activeReportId, history);
          }}
          type="delete"
          onCancelText="No, Keep Report"
          onOkText="Yes, Delete Report"
          headerTitleText="Delete Report"
          helperText="Deleting the report will remove it for all users"
        />
        {reportType === 'existing' && (
          <Tooltip placement="top" title="delete report">
            <i
              className="icon-trash  icon-trash-custom"
              onClick={() => {
                setShowDeleteReportConfirm(true);
              }}
            />
          </Tooltip>
        )}
        <span className="report-invite-user-button">
          <InviteFlowButton
            onButtonClick={() => {
              if (showRightPanel) {
                setShowRightPanel(false);
                setRightPanelType('');
              } else {
                setShowRightPanel(true);
                setRightPanelType('invite_users');
              }
            }}
          />
        </span>
      </div>
    );
  };
  const validateReportSaving = ({ selectedContexts, groupByX, reportName }) => {
    let errors = [];

    if (!reportName) {
      errors.push({ message: 'Report name required' });
    }

    if (selectedContexts?.length < 1) {
      errors.push({ message: 'Please select context' });
    }

    if (groupByX == undefined || groupByX === '') {
      errors.push({ message: 'Please set groupby X' });
    }
    return errors;
  };

  const saveReportClick = (createCopy = false, newReportName) => {
    let reportId = activeReportId;
    let reportNameVal = reportName;
    if (createCopy) {
      reportId = uuidv4();
      reportNameVal = newReportName;
    }

    const errors = validateReportSaving({
      selectedContexts,
      groupByX,
      reportName: reportNameVal,
    });

    if (errors.length > 0) {
      errors.forEach((e) => ErrorNotification({ message: e.message }));
      return;
    }

    const goBackToAllInsights = () => {
      history.push('/insights');
    };
    const reportConfig = {
      reportId,
      reportName: reportNameVal,
      selectedFilters,
      groupByX,
      groupByY,
      topX,
      topY,
      metrics: selectedMetrics,
      dimensions: [],
      defaultTimeRange: 0,
      defaultWindowLength: 0,
      goBack: goBackToAllInsights,
      history,
      reportType: 'contextReport',
    };
    saveReport(reportConfig);
    setReportType('existing');
    setActiveReportId(reportId);
  };

  const showUnsavedChangesModal = () => {
    Modal.confirm({
      className: 'report-page-modal',
      title: 'Unsaved Changes',
      content: 'Unsaved changes will be lost.',
      okText: 'Go back',
      onOk: () => {
        history.push('/insights');
      },
      cancelText: 'Stay',
    });
  };

  const MainContent = () => {
    return (
      <div className="context-report-container">
        <div className="report-header">
          <TitleHelmet title="Report" />
          <Header
            title={reportName}
            EmptyTitleText="Untitled Report"
            placeholder="Report Name"
            onChange={setReportName}
            backLinkText={
              window.innerWidth > isimaLargeDeviceBreakpointNumber
                ? 'Back to all Insights'
                : 'Back'
            }
            backLinkClick={(e) => {
              if (isReportChanged) {
                showUnsavedChangesModal();
              } else {
                resetReportData();
                history.push('/insights');
              }
            }}
            actionPanel={() => {
              return reportOptions();
            }}
            validateReportName={'no-validation'}
          />
        </div>
        <div>
          <div className="context-title">Contexts</div>
          <ContextMultiSelect />
        </div>
        <div className="report-detail-dropdown-wrapper">
          <>
            <AboveGraphOptions
              showRightPanel={showRightPanel}
              setShowRightPanel={setShowRightPanel}
              setRightPanelType={setRightPanelType}
            />
            <ReportGraph showRightPanel={showRightPanel}></ReportGraph>
            <BelowGraphOptions></BelowGraphOptions>
          </>
        </div>
        <DataGrid isMobile={isMobile}></DataGrid>
      </div>
    );
  };

  const RightPanelContent = () => {
    if (rightPanelType === 'advance_settings') {
      return (
        <AdvanceSettings
          setShowRightPanel={setShowRightPanel}
          setRightPanelType={setRightPanelType}
        />
      );
    } else if (rightPanelType === 'invite_users') {
      return (
        <InviteUsers
          showRightPanel={showRightPanel}
          closeRightPanel={() => {
            setShowRightPanel(false);
            setRightPanelType('');
          }}
        />
      );
    }
  };

  return (
    <PageLayout
      MainContent={MainContent}
      RightPanelContent={RightPanelContent}
      showRightPanel={showRightPanel}
      showCollapsibleAction={true}
      onCollapseAbleClick={() => {
        setShowRightPanel(!showRightPanel);
      }}
    />
  );
}

const mapStateToProps = (state) => {
  const { selectedContexts, contexts } =
    state?.contextReport?.contextMultiSelect;
  const { selectedMetrics } = state?.contextReport?.metrics;
  const { selectedFilters } = state?.contextReport?.filters;
  const { groupByX, groupByY } = state?.contextReport?.groupBy;
  const { topX, topY } = state?.contextReport?.dataGranularity;
  const { graphDataLoading } = state?.contextReport?.data;
  const { allReports } = state?.contextReport?.report;

  return {
    selectedContexts,
    selectedMetrics,
    contexts,
    selectedFilters,
    groupByX,
    groupByY,
    graphDataLoading,
    allReports,
    topX,
    topY,
  };
};

const mapDispatchToProps = {
  setGroupByXY,
  fetchAllReports,
  saveReport,
  loadReport,
  deleteReport,
  resetReportData,
};

ContextReport.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContextReport);
