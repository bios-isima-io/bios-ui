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
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsFunnelChart from 'highcharts/modules/funnel';
import HighchartsTreeChart from 'highcharts/modules/treemap';
import HighchartsMapChart from 'highcharts/modules/map';

import { cloneDeep, debounce } from 'lodash';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { useWindowSize } from 'common/hooks';
import { alignOriginTime } from 'containers/InsightsV2/utils';
import { getLatestTimeSegmentBoundary } from 'containers/ReportV3/utils';
import { ErrorNotification } from 'containers/utils';

import {
  getGraphDataNoGroupBy,
  getGroupByXAndYAxis,
  getGroupByXAxis,
  getGroupByYAxis,
} from '../ReportGraph/dataProc';
import { reportGraphActions } from '../ReportGraph/reducers';
import '../ReportGraph/styles.scss';
import {
  addDefaultGraphParam,
  queryHasPlottableData,
} from '../ReportGraph/utils';
import LoadingGraph from '../ReportGraph/components/LoadingGraph/LoadingGraph';
import NoData from '../ReportGraph/components/NoData';
import {
  DEFAULT_GROUPBY_X_TOP_N,
  DEFAULT_GROUPBY_Y_TOP_N,
} from '../ReportGraph/const';
import {
  buildReportLoadMetrics,
  getSignalsListFromMeasurement,
} from 'containers/ReportV2/utils';
import { ALLOWED_WINDOW_SIZES } from '../AdvanceSettings/Duration/WindowSize/const';
import { getWindowSizeMapping } from '../AdvanceSettings/Duration/WindowSize/util';
import { reportActions } from 'containers/ReportV2/reducers';

const { setSideCompareReport, resetSideCompareReport } = reportActions;

HighchartsMore(Highcharts);
HighchartsFunnelChart(Highcharts);
HighchartsTreeChart(Highcharts);
HighchartsMapChart(Highcharts);

Highcharts.seriesTypes.arearange.prototype.getPointSpline =
  Highcharts.seriesTypes.spline.prototype.getPointSpline;
const { fetchReportGraphDataSideCompare } = reportGraphActions;
window.moment = moment;

Highcharts.setOptions({
  lang: {
    thousandsSep: '',
  },
});
const TIME_DURATION_7_DAYS = 604800000;

function RenderSideComparisonChart({
  signals,
  selectedMetrics,
  topX,
  topY,
  durationType,
  duration,
  durationStart,
  rollupInterval,
  showDurationDatePicker,
  onTheFly,
  cyclicalComparisonOn,
  cyclicalComparisonDisabled,
  cyclicalComparisonCustom,
  cyclicalComparisonStart,
  forecast,
  windowSize,
  timezone,
  groupByX,
  groupByY,
  allFilters,
  selectedFilters,
  graphData,
  cyclicalData,
  signalDataOrder,
  graphDataLoading,
  graphDataError,
  queryStartTime,
  endTimestamp,
  forecastDataset,

  fetchReportGraphDataSideCompare,
  sideCompareReportId,
  reportConfigs,

  showRightPanel,
  sideReportGraphData,
  setSideCompareReport,
}) {
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [reportLoaded, setReportLoaded] = useState(false);

  const [screenWidth] = useWindowSize();
  const isMobile = window.innerWidth < isimaLargeDeviceBreakpointNumber;
  const [HCDataObj, setHCDataObj] = useState(
    addDefaultGraphParam({ title: '' }),
  );
  const [graphLoader, setGraphLoader] = useState(false);
  const [noData, setNoData] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [errorReported, setErrorReported] = useState(false);

  const params = useParams();

  useEffect(() => {
    const activeReportItem = reportConfigs?.filter(
      (report) => report.reportId === sideCompareReportId,
    );
    if (!activeReportItem || activeReportItem?.length === 0) {
      return;
    }
    const activeReport = cloneDeep(activeReportItem[0]);
    const activeReportDurationUrl = parseInt(params?.timeDuration);
    const sig = activeReport?.metrics?.map((metric) => {
      return getSignalsListFromMeasurement(metric?.measurement, signals);
    });
    const reportSelectedSignalsFlat = [...new Set(sig?.flat(2))];
    const reportSelectedSignals = signals.filter((sig) => {
      return reportSelectedSignalsFlat.includes(sig.signalName);
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
        const wsMapping = getWindowSizeMapping(defaultTimeRange);
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

    if (!reportLoaded) {
      setReportLoaded(true);
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
    let timezone = moment.tz.guess();
    setSideCompareReport({
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
        timeZone: { timezone },
      },
      selectedFilters: filters ? filters : {},
      filterOrder: filterOrder ? filterOrder : [],
      map: activeReport?.map ? activeReport.map : { mapChartCountry: '' },
    });
  }, [sideCompareReportId]);

  useEffect(() => {
    fetchReportGraphDataSideCompare({
      ...updateGraphData(),
      sideCompareReportId,
    });
  }, [selectedMetrics]);

  const updateGraphData = () => {
    let newCyclicalComparisonStart = null;
    if (cyclicalData && durationType === 'fixed') {
      newCyclicalComparisonStart = moment().valueOf() - cyclicalData;
      newCyclicalComparisonStart = alignOriginTime(
        newCyclicalComparisonStart,
        30000,
        30000,
      );
    }
    return {
      signals,
      selectedSignals,
      selectedMetrics,

      durationType,
      duration,
      durationStart,
      windowSize,
      timezone,
      rollupInterval,
      showDurationDatePicker,
      onTheFly,

      cyclicalComparisonOn,
      cyclicalComparisonDisabled,
      cyclicalComparisonCustom,
      cyclicalComparisonStart,
      ...(newCyclicalComparisonStart && {
        cyclicalComparisonStart: newCyclicalComparisonStart,
      }),

      groupByX,
      groupByY,

      allFilters,
      selectedFilters,
      topX,
      topY,
      forecast,
    };
  };

  const getOptionsHC = () => {
    let response = {
      title: '',
    };

    let graphData;
    if (sideReportGraphData?.graphData) {
      ({
        graphData,
        cyclicalData,
        signalDataOrder,
        graphDataLoading,
        graphDataError,
        queryStartTime,
        endTimestamp,
        forecastDataset,
      } = sideReportGraphData);
    } else {
      return;
    }

    if (!queryHasPlottableData(graphData)) {
      if (groupByX === '' && !queryHasPlottableData(cyclicalData)) {
        setNoData(true);
        return response;
      } else {
        setNoData(true);
        return response;
      }
    } else {
      setNoData(false);
    }

    if (groupByX !== '' && groupByY !== '') {
      response = getGroupByXAndYAxis({
        graphData,
        selectedMetrics,
        signalDataOrder,
        selectedSignals,
        cyclicalComparisonStart,
        cyclicalComparisonCustom,
        cyclicalData,
        duration,
      });
    } else if (groupByX !== '' && groupByY === '') {
      response = getGroupByXAxis({
        graphData,
        selectedMetrics,
        signalDataOrder,
        selectedSignals,
        cyclicalData,
        cyclicalComparisonStart,
        cyclicalComparisonCustom,
        durationStart,
        duration,
      });
    } else if (groupByX === '' && groupByY !== '') {
      response = getGroupByYAxis({
        graphData,
        selectedMetrics,
        signalDataOrder,
        cyclicalData,
        durationStart: queryStartTime,
        duration,
        cyclicalComparisonStart,
        cyclicalComparisonCustom,
        timezone,
        windowSize,
        selectedSignals,
        endTimestamp,
        onTheFly,
      });
    } else if (groupByX === '' && groupByY === '') {
      response = getGraphDataNoGroupBy({
        graphData,
        selectedMetrics,
        signalDataOrder,
        cyclicalData,
        duration,
        windowSize,
        cyclicalComparisonStart,
        cyclicalComparisonCustom,
        selectedSignals,
        timezone,
        durationStart: queryStartTime,
        endTimestamp,
        onTheFly,
        forecast,
        forecastDataset,
      });
    }

    if (response?.series?.length === 0) {
      setNoData(true);
      return response;
    }

    response = addDefaultGraphParam(response, true);
    if (groupByX === '') {
      response.time = {
        timezone: timezone === '' ? moment.tz.guess() : timezone,
      };
    }

    return response;
  };

  useEffect(() => {
    if (graphDataLoading) {
      let resp = { title: '' };
      resp = addDefaultGraphParam(resp, true);
      setHCDataObj(resp);
    } else {
      setGraphLoader(true);
      let resp = getOptionsHC();
      setHCDataObj(resp);
    }
    if (!!graphDataError && !errorReported) {
      ErrorNotification({ message: graphDataError });
      setErrorReported(true);
    }
  }, [graphData]);

  const reloadGraph = () => {
    setGraphLoader(true);
    let resp = getOptionsHC();
    setHCDataObj(resp);
  };

  const reloadGraphDebounce = debounce(() => {
    reloadGraph();
  }, 1000);

  useEffect(() => {
    let loaded = false;
    if (!showRightPanel && !graphDataLoading && !graphLoader && isMobile) {
      reloadGraph();
      loaded = true;
    }
    if (!loaded && firstLoad) {
      reloadGraphDebounce();
    }
    setFirstLoad(true);
  }, [showRightPanel]);

  useEffect(() => {
    reloadGraph();
  }, [screenWidth]);

  useEffect(() => {
    setGraphLoader(false);
  }, [HCDataObj]);

  useEffect(() => {
    setHCDataObj(addDefaultGraphParam({ title: '' }, true));
  }, []);

  const chart = (
    <HighchartsReact
      highcharts={Highcharts}
      options={HCDataObj}
      containerProps={{ style: { height: '450px', width: '100%' } }}
    />
  );
  return (
    <div style={{ width: '100%' }}>
      {graphLoader ? (
        <LoadingGraph />
      ) : (
        selectedSignals?.length > 0 &&
        selectedMetrics?.length > 0 &&
        graphData?.length > 0 && <div>{noData ? <NoData /> : chart}</div>
      )}
    </div>
  );
}

RenderSideComparisonChart.propTypes = {};

const mapDispatchToProps = {
  fetchReportGraphDataSideCompare,
  setSideCompareReport,
  resetSideCompareReport,
};

const mapStateToProps = (state) => {
  const { signals } = state.signalMultiSelect;

  const { selectedMetrics } =
    state?.report?.reportDetails?.sideCompareReport?.metrics;
  const { topX, topY } =
    state?.report?.reportDetails?.sideCompareReport?.dataGranularity;

  const {
    durationType,
    duration,
    durationStart,
    rollupInterval,
    showDurationDatePicker,
    onTheFly,
    onTheFlyRefresh,
  } = state.report.duration.timeDuration;
  const {
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,
  } = state.report.duration.cyclicalComparison;

  const { windowSize } = state.report.duration.windowSize;
  const { timezone } = state.report.duration.timeZone;

  const {
    graphData,
    cyclicalData,
    signalDataOrder,
    graphDataLoading,
    graphDataError,
    queryStartTime,
    endTimestamp,
    forecastDataset,
    topologyMapChartLevel2,
  } = state.report?.data?.sideReportGraphData;

  const { groupByX, groupByY } =
    state.report?.reportDetails?.sideCompareReport?.groupBy;

  const { allFilters, selectedFilters } =
    state?.report?.reportDetails?.sideCompareReport?.filters;

  const { map, sideCompareReportId } = state.report.data;
  const { reportConfigs } = state.report?.reportDetails?.allReports;

  const { sideReportGraphData } = state.report?.data;

  const { reportList } = state.report?.reportDetails;

  return {
    signals,
    selectedMetrics,
    topX,
    topY,
    durationType,
    duration,
    durationStart,
    rollupInterval,
    showDurationDatePicker,
    onTheFly,
    onTheFlyRefresh,
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,
    windowSize,
    timezone,
    groupByX,
    groupByY,
    allFilters,
    selectedFilters,
    graphData,
    cyclicalData,
    signalDataOrder,
    graphDataLoading,
    graphDataError,
    queryStartTime,
    endTimestamp,
    forecastDataset,
    topologyMapChartLevel2,
    map,
    sideCompareReportId,
    reportConfigs,

    reportList,
    sideReportGraphData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RenderSideComparisonChart);
