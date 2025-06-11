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
import { Modal, Tooltip } from 'antdlatest';
import { cloneDeep, debounce, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import PageLayout from 'Layouts/PageLayout';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import InviteFlowButton from 'components/InviteFlowButton';
import TitleHelmet from 'components/TitleHelmet';
import InviteUsers from 'containers/InviteUsers';
import { ConfirmationDialog, Input } from 'containers/components';
import Header from 'containers/components/Header';
import SignalMultiSelect from 'containers/components/SignalMultiSelect';
import { SELECT_UNDERLINE_COLOR } from 'containers/components/SignalMultiSelect/const';
import { signalMultiSelectActions } from 'containers/components/SignalMultiSelect/reducers/signals';
import { ErrorNotification } from 'containers/utils';
import ReportInstance from './ReportInstance';
import SaveToInsights from './components/HeaderButtons/SaveToInsights';
import LastUpdatedAt from './components/LastUpdatedAt/LastUpdatedAt';
import AdvanceSettings from './components/AdvanceSettings/AdvanceSettings';
import { cyclicalComparisonActions } from './components/AdvanceSettings/Duration/CyclicalComparison/reducers';
import { timeDurationActions } from './components/AdvanceSettings/Duration/TimeDuration/reducers';
import { ALLOWED_WINDOW_SIZES } from './components/AdvanceSettings/Duration/WindowSize/const';
import { windowSizeActions } from './components/AdvanceSettings/Duration/WindowSize/reducers';
import { getWindowSizeMapping } from './components/AdvanceSettings/Duration/WindowSize/util';
import { reportFiltersActions } from './components/AdvanceSettings/Filters/reducers';
import { metricsActions } from './components/AdvanceSettings/Metrics/reducers';
import { groupByActions } from './components/GroupBy/reducers';
import { getDimensionList } from './components/GroupBy/utils';
import { reportGraphActions } from './components/ReportGraph/reducers';
import checkIfMetricChangedBeforeSaving from './components/ReportGraph/utils/validate';
import { rightPanelActions } from './components/ReportSettingsToggle/reducers';
import { reportActions } from './reducers';
import './styles.scss';
import {
  buildReportLoadMetrics,
  cleanMetricsForSaving,
  getLatestTimeSegmentBoundary,
  getSignalsListFromMeasurement,
  validateReportSaving,
} from './utils';
import {
  DEFAULT_GROUPBY_X_TOP_N,
  DEFAULT_GROUPBY_Y_TOP_N,
} from './components/ReportGraph/const';
import {
  checkGraphType,
  checkGraphTypeAllMetric,
} from './components/ReportGraph/utils';

const TIME_DURATION_7_DAYS = 604800000;

const { resetGraphData } = reportGraphActions;
const { resetCC, setFixedCC, setCustomCC } = cyclicalComparisonActions;
const { resetTimeDuration, setFixedTimeDuration, setCustomTimeDuration } =
  timeDurationActions;
const { resetWindowSize, setFixedWindowSize } = windowSizeActions;
const { resetMetric, updateSelectedMetricsArr } = metricsActions;
const { resetFilters, fetchFilters } = reportFiltersActions;
const { resetActiveTabRightPanel, setActiveTabRightPanel } = rightPanelActions;
const { setGroupByXY } = groupByActions;

const { fetchAllReports, saveReport, loadReport, deleteReport } = reportActions;
const { fetchSignals, setSelectedSignals } = signalMultiSelectActions;

function Report({
  resetGraphData,
  resetCC,
  resetTimeDuration,
  resetWindowSize,
  resetMetric,
  resetFilters,
  resetActiveTabRightPanel,
  setActiveTabRightPanel,
  updateSelectedMetricsArr,
  selectedMetrics,
  groupByX,
  groupByY,
  topX,
  topY,
  forecast,

  fetchAllReports,
  fetchSignals,
  signals,
  allReports,
  setSelectedSignals,
  fetchFilters,

  graphDataLoading,
  map,

  windowSize,
  durationType,
  durationStart,
  duration,
  selectedFilters,
  cyclicalComparisonOn,
  cyclicalComparisonStart,
  cyclicalComparisonCustom,
  cyclicalDelta,
  saveReport,
  loadReport,
  roles,
  setGroupByXY,
  filterOrder,
  deleteReport,

  activeReportIndex,
}) {
  const location = useLocation();
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelType, setRightPanelType] = useState('');
  const [reportType, setReportType] = useState('new');
  const [isReportChanged, setIsReportChanged] = useState(false);
  const [activeReportId, setActiveReportId] = useState(uuidv4());
  const [loadSavedCounter, setLoadSavedCounter] = useState(1);
  const [reportLoaded, setReportLoaded] = useState(false);
  const [reportName, setReportName] = useState('');
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < isimaLargeDeviceBreakpointNumber ? true : false,
  );
  const [showGraphSection, setShowGraphSection] = useState(true);
  const [showDeleteReportConfirm, setShowDeleteReportConfirm] = useState(false);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    isMobile && !showGraphSection && setShowGraphSection(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetrics]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !isMobile && setShowGraphSection(true);
  }, [isMobile]);

  useEffect(() => {
    if (!!activeReportId && reportType === 'existing') {
      let activeReportDetails = allReports?.reportConfigs?.filter(
        (rep) => activeReportId === rep.reportId,
      );
      if (!activeReportDetails?.length) {
        return;
      }
      activeReportDetails = activeReportDetails[0];
      const activeReportDurationUrl = parseInt(params?.timeDuration);

      const metrics = cloneDeep(activeReportDetails?.metrics);

      const hasMetricChanged = checkIfMetricChangedBeforeSaving(
        metrics,
        selectedMetrics,
      );

      if (
        reportName !== activeReportDetails.reportName ||
        groupByX !== activeReportDetails?.dimensions?.[0] ||
        groupByY !== activeReportDetails?.dimensions?.[1] ||
        (activeReportDetails.topX && topX !== activeReportDetails?.topX) ||
        (activeReportDetails.topY && topY !== activeReportDetails?.topY) ||
        (!activeReportDurationUrl &&
          windowSize !== activeReportDetails?.defaultWindowLength) ||
        hasMetricChanged ||
        !isEqual(selectedFilters, activeReportDetails?.filters) ||
        (cyclicalComparisonOn &&
          activeReportDetails?.cyclicalComparisonStart !== null &&
          activeReportDetails?.cyclicalComparisonStart !== undefined &&
          (!cyclicalComparisonOn ||
            cyclicalComparisonStart !==
              activeReportDetails?.cyclicalComparisonStart)) ||
        (!activeReportDurationUrl &&
          activeReportDetails.defaultStartTime === 0 && //normal time range
          (duration !== activeReportDetails.defaultTimeRange ||
            durationType === 'custom')) ||
        (activeReportDetails.defaultStartTime !== 0 && //custom time range
          (durationStart !== activeReportDetails.defaultStartTime ||
            duration !== activeReportDetails.defaultTimeRange ||
            durationType === 'fixed')) ||
        (activeReportDurationUrl &&
          (activeReportDurationUrl !== duration || durationType === 'custom'))
      ) {
        setIsReportChanged(true);
      } else {
        setIsReportChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reportName,
    selectedMetrics,
    groupByX,
    groupByY,
    selectedFilters,
    cyclicalComparisonStart,
    durationStart,
    duration,
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    topX,
    topY,
  ]);

  const resetReport = () => {
    resetGraphData();
    resetCC();
    resetTimeDuration();
    resetWindowSize();
    resetMetric();
    resetFilters();
    resetActiveTabRightPanel();
    setGroupByXY({ groupByX: '', groupByY: '' });
  };

  useEffect(() => {
    return () => {
      resetReport();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAllReports();
    if (params?.reportId !== '' && params?.reportId !== undefined) {
      setActiveReportId(params?.reportId);
      setReportType('existing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      reportType === 'existing' &&
      signals?.length > 0 &&
      allReports?.reportConfigs?.length > 0
    ) {
      const activeReportDurationUrl = params?.timeDuration;
      let activeReportItem = allReports?.reportConfigs?.filter(
        (elem) => elem.reportId === activeReportId,
      );
      if (!activeReportItem || activeReportItem.length === 0) {
        return;
      }
      const activeReport = cloneDeep(activeReportItem[0]);
      const sig = activeReport?.metrics?.map((metric) => {
        return getSignalsListFromMeasurement(metric?.measurement, signals);
      });
      const reportSelectedSignalsFlat = [...new Set(sig.flat(2))];
      const reportSelectedSignals = signals.filter((sig) => {
        return reportSelectedSignalsFlat.includes(sig.signalName);
      });
      reportSelectedSignals.forEach((sig, index) => {
        sig.color = SELECT_UNDERLINE_COLOR[index % 3];
      });

      let reportMetrics = activeReport.metrics.map((metric) => {
        const metricTemp = metric;
        if (!metric.yAxisPosition) {
          metricTemp.yAxisPosition = 'left';
        }
        return metricTemp;
      });
      reportMetrics = buildReportLoadMetrics(reportMetrics);
      let activeReportCopy = cloneDeep(activeReport);
      let {
        defaultTimeRange,
        defaultWindowLength,
        defaultStartTime,
        filters,
        cyclicalComparisonStart,
        cyclicalDelta,
        dimensions,
        reportName,
        filterOrder,
        forecast,
      } = activeReportCopy;
      const [reportGroupByX = '', reportGroupByY = ''] = dimensions;

      if (defaultTimeRange > TIME_DURATION_7_DAYS) {
        defaultTimeRange = TIME_DURATION_7_DAYS;
      }

      let timeDurationType = 'custom';
      if (defaultStartTime === 0 || defaultStartTime === undefined) {
        timeDurationType = 'fixed';
        defaultStartTime =
          getLatestTimeSegmentBoundary().valueOf() - defaultTimeRange;
      }

      if (
        activeReportDurationUrl !== '' &&
        activeReportDurationUrl !== undefined
      ) {
        timeDurationType = 'fixed';
        defaultTimeRange = parseInt(activeReportDurationUrl);
        defaultStartTime =
          getLatestTimeSegmentBoundary().valueOf() - defaultTimeRange;
      }

      let nextCyclicalComparisonDisabled = false;
      let nextCyclicalComparisonCustom = false;
      let nextCyclicalComparisonOn;
      let nextCyclicalComparisonStart = cyclicalComparisonStart;
      let nextForecast = forecast ?? false;
      if (
        ['Hourly', 'Daily', 'Monthly', 'Weekly', 'Yearly'].includes(
          cyclicalComparisonStart,
        )
      ) {
        nextCyclicalComparisonOn = true;
        if (
          defaultTimeRange === 86400000 &&
          cyclicalComparisonStart === 'Hourly'
        ) {
          cyclicalComparisonStart = 'Daily';
          activeReportItem[0].cyclicalComparisonStart = cyclicalComparisonStart;
        }
      } else if (
        cyclicalComparisonStart === null ||
        cyclicalComparisonStart === undefined
      ) {
        nextCyclicalComparisonOn = false;
        nextCyclicalComparisonDisabled = true;
      } else {
        nextCyclicalComparisonOn = true;
        nextCyclicalComparisonCustom = true;
      }
      if (cyclicalDelta) {
        nextCyclicalComparisonOn = true;
        nextCyclicalComparisonCustom = true;
        nextCyclicalComparisonDisabled = false;
        nextCyclicalComparisonStart = defaultStartTime - cyclicalDelta;
      }
      if (reportMetrics?.length > 1) {
        nextCyclicalComparisonOn = false;
        nextCyclicalComparisonDisabled = true;
        nextCyclicalComparisonCustom = false;
      }

      // filters
      // data granularity

      if (
        activeReportDurationUrl !== '' &&
        activeReportDurationUrl !== undefined
      ) {
        if (activeReportDurationUrl === '3600000') {
          defaultWindowLength = parseInt(3600000 / 12);
        } else if (activeReportDurationUrl === '86400000') {
          defaultWindowLength = parseInt(86400000 / 24);
        }
      } else {
        if (!ALLOWED_WINDOW_SIZES.includes(parseInt(defaultWindowLength))) {
          const wsMapping = getWindowSizeMapping(duration);
          let unknownWS = parseInt(wsMapping[wsMapping.length - 1].value);
          for (let i = wsMapping.length - 1; i >= 0; i--) {
            if (defaultWindowLength < parseInt(wsMapping[i].value)) {
              unknownWS = parseInt(wsMapping[i].value);
            }
          }
          defaultWindowLength = unknownWS;
        }
      }

      setSelectedSignals(reportSelectedSignals);
      filters = filters ? filters : {};

      Object.keys(filters).length > 0 &&
        fetchFilters({
          selectedSignals: reportSelectedSignals,
          selectedMetrics: reportMetrics,
          duration: parseInt(defaultTimeRange),
          durationStart: parseInt(defaultStartTime),
          windowSize: parseInt(defaultWindowLength),
          groupByX: reportGroupByX,
          groupByY: reportGroupByY,
          selectedFilters: { ...filters },
          shouldSetSelectedFilter: true,
        });
      setReportName(reportName);
      const dimensionList = getDimensionList({
        selectedSignals: reportSelectedSignals,
        selectedMetrics: reportMetrics,
        groupByX: '',
        groupByY: '',
        selectedFilters: {},
      });
      for (const key in filters) {
        if (!dimensionList.includes(key)) {
          delete filters[key];
        }
      }
      if (!reportLoaded) {
        setReportLoaded(true);
        activeReportItem[0].filters = filters;
      }
      if (
        Object.keys(filters)?.length !== filterOrder?.length ||
        (filterOrder === undefined && Object.keys(filters)?.length > 0)
      ) {
        filterOrder = Object.keys(filters);
      }
      let { topX, topY } = activeReportCopy;
      if (!topX) {
        topX = DEFAULT_GROUPBY_X_TOP_N;
      }
      if (!topY) {
        topY = DEFAULT_GROUPBY_Y_TOP_N;
      }
      loadReport({
        selectedMetrics: reportMetrics,
        groupBy: { groupByX: reportGroupByX, groupByY: reportGroupByY },
        dataGranularity: {
          topX,
          topY,
        },
        duration: {
          timeDuration: {
            durationStart: parseInt(defaultStartTime),
            durationType: timeDurationType,
            duration: parseInt(defaultTimeRange),
          },
          cyclicalComparison: {
            cyclicalComparisonOn: nextCyclicalComparisonOn,
            cyclicalComparisonStart: nextCyclicalComparisonStart,
            cyclicalComparisonDisabled: nextCyclicalComparisonDisabled,
            cyclicalComparisonCustom: nextCyclicalComparisonCustom,
            forecast: nextForecast,
          },
          windowSize: parseInt(defaultWindowLength),
        },
        selectedFilters: filters ? filters : {},
        filterOrder: filterOrder ? filterOrder : [],
        map: activeReport?.map ? activeReport.map : { mapChartCountry: '' },
      });
    } else {
      const urlQuery = queryString?.parse(location.search);
      if (
        !urlQuery.data ||
        reportType === 'existing' ||
        !signals ||
        signals?.length === 0
      ) {
        return;
      }
      let urlEnc;
      let urlData;
      try {
        urlEnc = decodeURIComponent(window.atob(urlQuery.data));
        urlData = JSON.parse(urlEnc);
      } catch {
        history.push('/insights');
        return;
      }
      setSelectedSignals(
        signals.filter((signal) =>
          urlData?.selectedSignalsList?.includes(signal?.signalName),
        ),
      );
      let durationStartUrl = urlData?.durationStart;
      if (durationStartUrl && urlData.durationType === 'fixed') {
        durationStartUrl = getLatestTimeSegmentBoundary() - urlData?.duration;
      }
      loadReport({
        selectedMetrics: urlData.selectedMetrics,
        groupBy: { groupByX: urlData.groupByX, groupByY: urlData.groupByY },
        dataGranularity: {
          topX: urlData.topX,
          topY: urlData.topY,
        },
        duration: {
          timeDuration: {
            durationStart: parseInt(durationStartUrl),
            durationType: urlData.durationType,
            duration: parseInt(urlData.duration),
          },
          cyclicalComparison: {
            cyclicalComparisonOn: urlData.cyclicalComparisonOn,
            cyclicalComparisonStart: urlData.cyclicalComparisonStart,
            cyclicalComparisonDisabled: urlData.cyclicalComparisonDisabled,
            cyclicalComparisonCustom: urlData.cyclicalComparisonCustom,
            forecast: urlData.forecast,
          },
          windowSize: parseInt(urlData.windowSize),
        },
        selectedFilters: urlData.selectedFilters ? urlData.selectedFilters : {},
        filterOrder: urlData.filterOrder ? urlData.filterOrder : [],
        map: { ...urlData?.map },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReports, signals, loadSavedCounter]);

  useEffect(() => {
    if (groupByY !== '' && selectedMetrics.length > 1) {
      const selectedMetricsCopy = cloneDeep(selectedMetrics);
      let modified = false;
      selectedMetricsCopy.forEach((sm) => {
        if (sm?.defaultGraphType !== 'bar') {
          sm.defaultGraphType = 'bar';
          modified = true;
        }
      });
      if (modified) {
        updateSelectedMetricsArr({ selectedMetrics: selectedMetricsCopy });
      }
    }
  }, [groupByY, selectedMetrics, updateSelectedMetricsArr]);

  useEffect(() => {
    if (
      (checkGraphTypeAllMetric({ selectedMetrics, graphType: 'map' }) &&
        groupByX !== 'countryIsoCode') ||
      (checkGraphTypeAllMetric({ selectedMetrics, graphType: 'map' }) &&
        selectedMetrics?.length > 1)
    ) {
      const selectedMetricsCopy = cloneDeep(selectedMetrics);
      let modified = false;
      selectedMetricsCopy.forEach((sm) => {
        sm.defaultGraphType = 'bar';
        modified = true;
      });
      if (modified) {
        updateSelectedMetricsArr({ selectedMetrics: selectedMetricsCopy });
      }
    }
  }, [selectedMetrics, groupByX]);

  const saveReportClick = (createCopy = false, newReportName) => {
    let reportId = activeReportId;
    let reportNameVal = reportName;
    if (createCopy) {
      reportId = uuidv4();
      reportNameVal = newReportName;
    }
    const errors = validateReportSaving({
      reportName: reportNameVal,
      allReports,
      selectedMetrics,
      activeReportId: reportId,
    });
    const selectedMetricsCleaned = cleanMetricsForSaving(selectedMetrics);

    if (errors.length > 0) {
      errors.forEach((e) => ErrorNotification({ message: e }));
      return;
    }

    const goBackToAllInsights = () => {
      // resetReport();
      // history.push('/insights');
    };
    const isMapChart = checkGraphType({
      selectedMetrics: selectedMetricsCleaned,
      graphType: 'map',
    });
    const reportConfig = {
      reportId,
      reportName: reportNameVal,
      metrics: selectedMetricsCleaned,
      dimensions: [groupByX, groupByY],
      defaultTimeRange: duration,
      defaultWindowLength: windowSize,
      defaultStartTime: durationType === 'fixed' ? 0 : durationStart,
      existingReport: reportType === 'existing' && !createCopy,
      filters: selectedFilters,
      filterOrder,
      topX,
      topY,
      forecast,
      ...(cyclicalComparisonOn &&
        !cyclicalComparisonCustom && { cyclicalComparisonStart }),
      ...(cyclicalComparisonOn &&
        cyclicalComparisonCustom && { cyclicalDelta }),
      goBack: goBackToAllInsights,
      history,
      ...(isMapChart && { map }),
    };
    saveReport(reportConfig);
    setReportType('existing');
    setActiveReportId(reportId);
  };

  const reportOptions = () => {
    const saveButtonClass = graphDataLoading ? 'icon-disabled' : '';
    return (
      <div>
        <SaveToInsights
          reportType={reportType}
          activeReportId={activeReportId}
        />
        {reportType === 'existing' && (
          <Tooltip placement="top" title="Save report as">
            <i
              className="icon-File icon-File-custom"
              onClick={() => saveAsNewReportNameModal()}
            />
          </Tooltip>
        )}

        <Tooltip placement="top" title="Save">
          <i
            className={`icon-check-circle icon ${saveButtonClass}`}
            {...(saveButtonClass === '' && {
              onClick: () => {
                saveReportClick(false, '');
              },
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

  const MainContent = () => {
    return (
      <div className="report-container">
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
                history.push('/insights');
              }
            }}
            actionPanel={() => {
              return reportOptions();
            }}
            validateReportName={'no-validation'}
          />
          <LastUpdatedAt />
        </div>
        <div>
          <div className="signal-title">Signals</div>
          <SignalMultiSelect />
        </div>
        <ReportInstance
          isMobile={isMobile}
          showGraphSection={showGraphSection}
          setShowGraphSection={setShowGraphSection}
          showRightPanel={showRightPanel}
          setShowRightPanel={setShowRightPanel}
          setRightPanelType={setRightPanelType}
          selectedMetrics={selectedMetrics}
          activeReportIndex={activeReportIndex}
        />
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

  return (
    <PageLayout
      MainContent={MainContent}
      RightPanelContent={RightPanelContent}
      showRightPanel={showRightPanel}
      onCollapseAbleClick={() => {
        if (!showRightPanel) {
          setShowRightPanel(true);
          setActiveTabRightPanel('metric');
          setRightPanelType('advance_settings');
        } else {
          setShowRightPanel(false);
          setRightPanelType('');
          resetActiveTabRightPanel();
        }
      }}
      showCollapsibleAction={true}
    />
  );
}

const mapStateToProps = (state) => {
  const { signals } = state?.signalMultiSelect;
  const { selectedMetrics } = state?.report?.metrics;
  const { groupByX, groupByY } = state?.report?.groupBy;
  const { allReports } = state?.report?.reportDetails;
  const { graphDataLoading, map } = state?.report?.data;
  const { windowSize } = state?.report?.duration?.windowSize;
  const { topX, topY } = state?.report?.dataGranularity;
  const { durationType, durationStart, duration } =
    state?.report?.duration?.timeDuration;
  const {
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    cyclicalDelta,
    cyclicalComparisonCustom,
    forecast,
  } = state?.report?.duration?.cyclicalComparison;
  const { selectedFilters, filterOrder } = state?.report?.filters;
  const { roles } = state?.authMe;

  const { activeReportIndex } = state?.reportV3?.reportDetails;
  return {
    signals,
    selectedMetrics,
    groupByX,
    groupByY,
    topX,
    topY,
    allReports,
    graphDataLoading,
    map,
    windowSize,
    durationType,
    durationStart,
    duration,
    forecast,
    selectedFilters,
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    cyclicalDelta,
    roles,
    filterOrder,
    activeReportIndex,
  };
};

const mapDispatchToProps = {
  resetGraphData,
  resetCC,
  resetTimeDuration,
  resetWindowSize,
  resetMetric,
  resetFilters,
  resetActiveTabRightPanel,
  setActiveTabRightPanel,
  updateSelectedMetricsArr,

  fetchAllReports,
  fetchSignals,
  setSelectedSignals,
  setFixedTimeDuration,
  setCustomTimeDuration,
  setFixedCC,
  setCustomCC,
  setFixedWindowSize,
  setGroupByXY,
  saveReport,
  fetchFilters,
  loadReport,
  deleteReport,
};

Report.propTypes = {
  resetGraphData: PropTypes.func,
  resetCC: PropTypes.func,
  resetTimeDuration: PropTypes.func,
  resetWindowSize: PropTypes.func,
  resetMetric: PropTypes.func,
  resetFilters: PropTypes.func,
  resetActiveTabRightPanel: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,

  fetchAllReports: PropTypes.func,
  fetchSignals: PropTypes.func,
  setSelectedSignals: PropTypes.func,
  setFixedTimeDuration: PropTypes.func,
  setCustomTimeDuration: PropTypes.func,
  setFixedCC: PropTypes.func,
  setCustomCC: PropTypes.func,
  setFixedWindowSize: PropTypes.func,
  setGroupByXY: PropTypes.func,
  saveReport: PropTypes.func,
  fetchFilters: PropTypes.func,
  loadReport: PropTypes.func,

  signals: PropTypes.array,
  selectedMetrics: PropTypes.array,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
  allReports: PropTypes.object,
  graphDataLoading: PropTypes.bool,
  windowSize: PropTypes.number,
  durationType: PropTypes.string,
  durationStart: PropTypes.any,
  duration: PropTypes.any,
  selectedFilters: PropTypes.object,
  cyclicalComparisonOn: PropTypes.bool,
  cyclicalComparisonStart: PropTypes.any,
  cyclicalComparisonCustom: PropTypes.bool,
  cyclicalDelta: PropTypes.any,
  roles: PropTypes.array,
  filterOrder: PropTypes.array,
  deleteReport: PropTypes.func,

  activeReportIndex: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
