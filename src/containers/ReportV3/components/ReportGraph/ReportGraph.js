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

import { debounce } from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { useWindowSize } from 'common/hooks';
import { alignOriginTime } from 'containers/InsightsV2/utils';
import { cyclicalComparisonActions } from 'containers/ReportV3/components/AdvanceSettings/Duration/CyclicalComparison/reducers';
import { timeDurationActions } from 'containers/ReportV3/components/AdvanceSettings/Duration/TimeDuration/reducers';
import { reportFiltersActions } from 'containers/ReportV3/components/AdvanceSettings/Filters/reducers';
import { dataGridActions } from 'containers/ReportV3/components/DataGrid/reducers';
import { getDimensionList } from 'containers/ReportV3/components/GroupBy/utils';
import { getLatestTimeSegmentBoundary } from 'containers/ReportV3/utils';
import { ErrorNotification, InfoNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';

import ReportInit from './ReportInit';
import ReportURLParams from './ReportURLParams';
import LoadingGraph from './components/LoadingGraph/LoadingGraph';
import NoData from './components/NoData';
import ScrollArrow from './components/ScrollArrow';
import { REPORT_REFRESH_INTERVAL } from './const';
import {
  getGraphDataNoGroupBy,
  getGroupByXAndYAxis,
  getGroupByXAxis,
  getGroupByYAxis,
} from './dataProc';
import { reportGraphActions } from './reducers';
import './styles.scss';
import {
  addDefaultGraphParam,
  checkGraphType,
  isRegularDuration,
  queryHasPlottableData,
} from './utils';
import { getFunnelChartPlotData } from './dataProc/groupByX/funnerChart';
import RenderTwoChart from './components/RenderTwoChart/RenderTwoChart';
import { getTreemapXChartPlotData } from './dataProc/groupByX/treemapChart';
import { getDonutXChartPlotData } from './dataProc/groupByX/donutChart';
import { getTreemapXYChartPlotData } from './dataProc/groupByXY/treemapChart';
import { getDonutChartXYPlotData } from './dataProc/groupByXY/donutChart';
import {
  getMapXChartPlotDataLevel1,
  getMapXChartPlotDataLevel2,
} from './dataProc/groupByX/mapChart';
import { Button } from 'antdlatest';

HighchartsMore(Highcharts);
HighchartsFunnelChart(Highcharts);
HighchartsTreeChart(Highcharts);
HighchartsMapChart(Highcharts);

Highcharts.seriesTypes.arearange.prototype.getPointSpline =
  Highcharts.seriesTypes.spline.prototype.getPointSpline;
const { fetchReportGraphData, setMapChartCountry } = reportGraphActions;
const { fetchFilters, resetFilters } = reportFiltersActions;
const { setDataGrid } = dataGridActions;
const { setFixedTimeDuration, setCustomTimeDuration, setOnTheFly } =
  timeDurationActions;
const { setFixedCC, setCustomCC } = cyclicalComparisonActions;

window.moment = moment;

Highcharts.setOptions({
  lang: {
    thousandsSep: '',
  },
});

function ReportGraph({
  signals,
  selectedSignals,
  selectedMetrics,

  showDurationDatePicker,
  setOnTheFly,
  onTheFly,
  onTheFlyRefresh,

  fetchReportGraphData,
  map,
  setMapChartCountry,

  fetchFilters,
  resetFilters,
  setDataGrid,
  setFixedTimeDuration,
  setCustomTimeDuration,
  setCustomCC,
  setFixedCC,

  showRightPanel,
  reportIndex,
  data,
  reportList,
}) {
  const report = reportList?.[reportIndex];
  let groupByX,
    groupByY,
    allFilters,
    selectedFilters,
    topX,
    topY,
    durationType,
    duration,
    durationStart,
    timezone,
    rollupInterval,
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,
    windowSize;
  if (report) {
    groupByX = report?.groupBy?.groupByX;
    groupByY = report?.groupBy?.groupByY;
    allFilters = report?.filters?.allFilters;
    selectedFilters = report?.filters?.selectedFilters;
    topX = report?.dataGranularity?.topX;
    topY = report?.dataGranularity?.topY;

    durationType = report?.duration?.timeDuration?.durationType;
    duration = report?.duration?.timeDuration?.duration;
    durationStart = report?.duration?.timeDuration?.durationStart;
    timezone = report?.duration?.timeZone?.timezone;
    rollupInterval = report?.duration?.windowSize?.windowSize;

    cyclicalComparisonOn =
      report?.duration?.cyclicalComparison?.cyclicalComparisonOn;
    cyclicalComparisonDisabled =
      report?.duration?.cyclicalComparison?.cyclicalComparisonDisabled;
    cyclicalComparisonCustom =
      report?.duration?.cyclicalComparison?.cyclicalComparisonCustom;
    cyclicalComparisonStart =
      report?.duration?.cyclicalComparison?.cyclicalComparisonStart;
    forecast = report?.duration?.cyclicalComparison?.forecast;
    windowSize = report?.duration?.windowSize?.windowSize;
  }
  let graphData,
    cyclicalData,
    signalDataOrder,
    graphDataLoading,
    graphDataError,
    queryStartTime,
    endTimestamp,
    forecastDataset,
    topologyMapChartLevel2;
  if (data?.[reportIndex]) {
    ({
      graphData,
      cyclicalData,
      signalDataOrder,
      graphDataLoading,
      graphDataError,
      queryStartTime,
      endTimestamp,
      forecastDataset,
      topologyMapChartLevel2,
    } = data?.[reportIndex]);
  }
  const [screenWidth] = useWindowSize();
  const isMobile = window.innerWidth < isimaLargeDeviceBreakpointNumber;
  const [HCDataObj, setHCDataObj] = useState(
    addDefaultGraphParam({ title: '' }),
  );
  const [graphLoader, setGraphLoader] = useState(false);
  const [noData, setNoData] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [currentStartTime, setCurrentStartTime] = useState();
  const [errorReported, setErrorReported] = useState(false);
  const [funnelChart, setFunnelChart] = useState(false);
  const [treemapChart, setTreemapChart] = useState(false);
  const [donutChart, setDonutChart] = useState(false);
  const [mapChart, setMapChart] = useState(false);

  const [mapChartLevel, setMapChartLevel] = useState(1);

  useEffect(() => {
    if (map?.mapChartCountry !== '') {
      setMapChartLevel(2);
    } else {
      setMapChartLevel(1);
    }
  }, [map]);

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
      funnelChart,
      mapChartLevel,
      map,
    };
  };
  const refreshReport = () => {
    if (durationType === 'fixed') {
      const nextDurationStart =
        getLatestTimeSegmentBoundary().valueOf() - duration;
      setFixedTimeDuration({ duration, durationStart: nextDurationStart });
      if (cyclicalComparisonOn && cyclicalComparisonCustom) {
        const cyclicalDelta = durationStart - cyclicalComparisonStart;
        setCustomCC({
          cyclicalComparisonStart: nextDurationStart - cyclicalDelta,
          cyclicalDelta,
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const minute = new Date().getMinutes();
      if (minute % 5 === 1) {
        refreshReport();
      }
    }, REPORT_REFRESH_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMetrics,
    durationType,
    duration,
    durationStart,
    timezone,
    rollupInterval,
    cyclicalComparisonOn,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    windowSize,
    groupByX,
    groupByY,
    selectedFilters,
    topX,
    topY,
    selectedFilters,
  ]);

  useEffect(() => {
    if (selectedSignals?.length === 0 || selectedMetrics?.length === 0) {
      setDataGrid({ [reportIndex]: null });
      resetFilters();
      return;
    }
    const dimensionsListAll = getDimensionList({
      selectedSignals,
      selectedMetrics,
      groupByX,
      groupByY,
      selectedFilters,
    });

    const newSelectedFilters = dimensionsListAll.reduce((acc, dimension) => {
      if (selectedFilters.hasOwnProperty(dimension)) {
        acc[dimension] = selectedFilters[dimension];
      }
      return acc;
    }, {});

    setErrorReported(false);
    fetchReportGraphData({
      ...updateGraphData(),
      selectedFilters: newSelectedFilters,
      reportIndex,
    });

    fetchFilters({
      selectedSignals,
      selectedMetrics,

      duration,
      durationStart,
      windowSize,
      groupByX,
      groupByY,
      allFilters,
      selectedFilters: newSelectedFilters ? newSelectedFilters : {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMetrics,

    durationType,
    duration,
    durationStart,
    onTheFlyRefresh,
    timezone,
    rollupInterval,

    cyclicalComparisonOn,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,

    windowSize,

    groupByX,
    groupByY,
    selectedFilters,
    topX,
    topY,
    selectedFilters,
    mapChartLevel,
  ]);

  const getOptionsHC = () => {
    let response = {
      title: '',
    };
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
      if (treemapChart) {
        response = getTreemapXYChartPlotData({
          plotOptions: response,
          showCyclicalData: true,
        });
      } else if (donutChart) {
        response = getDonutChartXYPlotData({
          plotOptions: response,
          showCyclicalData: true,
          groupByX,
          groupByY,
          selectedMetrics,
        });
      }
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
      if (funnelChart) {
        response = getFunnelChartPlotData({
          plotOptions: response,
          selectedMetrics,
        });
      } else if (treemapChart) {
        response = getTreemapXChartPlotData({
          plotOptions: response,
          showCyclicalData: true,
        });
      } else if (donutChart) {
        response = getDonutXChartPlotData({
          plotOptions: response,
          showCyclicalData: true,
        });
      } else if (mapChart) {
        if (mapChartLevel === 1) {
          response = getMapXChartPlotDataLevel1({
            graphData,
            cyclicalData,
            setMapChartCountry,
            selectedMetrics,
            signalDataOrder,
            selectedSignals,
          });
        } else if (mapChartLevel === 2) {
          response = getMapXChartPlotDataLevel2({
            graphData,
            cyclicalData,
            topology: topologyMapChartLevel2,
            selectedMetrics,
            signalDataOrder,
            selectedSignals,
            country: map?.mapChartCountry,
          });
        }
      }
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
    onTheFly && setOnTheFly(0);

    if (response?.series?.length === 0) {
      setNoData(true);
      return response;
    }

    response = addDefaultGraphParam(response, true);
    setDataGrid({ [reportIndex]: response });
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
      setCurrentStartTime(queryStartTime);
    }
    if (!!graphDataError && !errorReported) {
      ErrorNotification({ message: graphDataError });
      setErrorReported(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphDataLoading, graphData, graphDataError]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRightPanel]);

  useEffect(() => {
    reloadGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenWidth]);

  useEffect(() => {
    setFunnelChart(checkGraphType({ selectedMetrics, graphType: 'funnel' }));
    setDonutChart(checkGraphType({ selectedMetrics, graphType: 'donut' }));
    setTreemapChart(checkGraphType({ selectedMetrics, graphType: 'treemap' }));
    setMapChart(checkGraphType({ selectedMetrics, graphType: 'map' }));
  }, [selectedMetrics]);

  useEffect(() => {
    setGraphLoader(false);
  }, [HCDataObj]);

  useEffect(() => {
    setHCDataObj(addDefaultGraphParam({ title: '' }, true));
  }, []);

  useEffect(() => {
    setCurrentStartTime(durationStart);
  }, [durationStart]);

  /**
   * Scrolls the time range of the graph.
   *
   * @param {number} scrollAmount - Scroll amount in milliseconds. A positive value scrolls the time
   *                          range forwards while a negative value scrolls the range backwards.
   */
  const scrollTimeRange = (scrollAmount) => {
    const absAmount = Math.abs(scrollAmount);
    setCustomTimeDuration({
      durationStart: currentStartTime + scrollAmount,
      duration: absAmount,
    });
    if (cyclicalComparisonOn && cyclicalComparisonCustom) {
      const cyclicalDelta = currentStartTime - cyclicalComparisonStart;
      setCustomCC({
        cyclicalComparisonStart: cyclicalComparisonStart + scrollAmount,
        cyclicalDelta,
      });
    }
  };

  function onScrollLeft() {
    scrollTimeRange(-duration);
  }

  function onScrollRight() {
    const currentTime = getLatestTimeSegmentBoundary().valueOf();
    const desiredEndTime = currentStartTime + duration * 2;
    if (desiredEndTime < currentTime) {
      scrollTimeRange(duration);
    } else {
      // The window has reached the right edge
      const offset = desiredEndTime - currentTime;
      if (offset > 0) {
        InfoNotification({
          message: messages.report.PARTIAL_DURATION_TRAVELED,
        });
      }
      if (isRegularDuration(duration)) {
        setFixedTimeDuration({ duration });
      } else {
        setCustomTimeDuration({
          durationStart: currentTime - duration,
          duration,
        });
      }
      if (cyclicalComparisonOn && cyclicalComparisonCustom) {
        const cyclicalDelta = durationStart - cyclicalComparisonStart;
        setCustomCC({
          cyclicalComparisonStart: cyclicalComparisonStart + duration - offset,
          cyclicalDelta,
        });
      }
    }
  }

  const leftScrollArrowStyles = isMobile
    ? {
        visibility: 'visible',
        top: '80px',
      }
    : {
        top: '185px',
      };

  const rightScrollArrowStyles = isMobile
    ? {
        visibility: 'visible',
        top: '80px',
      }
    : {
        top: '185px',
      };

  const showRightScrollArrow =
    getLatestTimeSegmentBoundary().valueOf() > durationStart + duration;

  const leftArrow = (
    <div
      onClick={onScrollLeft}
      className="report-graph-container-arrow"
      style={{
        position: 'relative',
        left: '45px',
        ...leftScrollArrowStyles,
      }}
    >
      <ScrollArrow direction="left" isMobile={isMobile} />
    </div>
  );

  const rightArrow = (
    <div
      onClick={onScrollRight}
      className="report-graph-container-arrow"
      style={{
        position: 'absolute',
        right: '10px',
        ...rightScrollArrowStyles,
      }}
    >
      <ScrollArrow direction="right" isMobile={isMobile} />
    </div>
  );

  const mapChartResetButton =
    mapChart && map?.mapChartCountry ? (
      <Button onClick={() => setMapChartCountry({ mapChartCountry: '' })}>
        Reset
      </Button>
    ) : null;

  const chart =
    funnelChart || donutChart || treemapChart || mapChart ? (
      <RenderTwoChart
        options={HCDataObj}
        cyclicalComparisonOn={cyclicalComparisonOn}
        page="report"
        isChartWithTwoSeries={donutChart && groupByY !== ''}
        mapChartResetButton={mapChartResetButton}
        mapChart={mapChart}
      />
    ) : (
      <HighchartsReact
        highcharts={Highcharts}
        options={HCDataObj}
        containerProps={{ style: { height: '450px', width: '100%' } }}
      />
    );

  return (
    <div>
      <ReportInit />
      <ReportURLParams />
      {graphDataLoading || graphDataLoading === null || graphLoader ? (
        <LoadingGraph></LoadingGraph>
      ) : (
        selectedSignals?.length > 0 &&
        selectedMetrics?.length > 0 &&
        graphData?.length > 0 && (
          <div className="report-graph-container">
            {leftArrow}
            {showRightScrollArrow && rightArrow}
            {noData ? <NoData /> : chart}
          </div>
        )
      )}
    </div>
  );
}

ReportGraph.propTypes = {
  onTheFly: PropTypes.number,
};

const mapDispatchToProps = {
  fetchReportGraphData,
  setMapChartCountry,
  fetchFilters,
  resetFilters,
  setDataGrid,
  setFixedTimeDuration,
  setCustomTimeDuration,
  setCustomCC,
  setFixedCC,
  setOnTheFly,
};

const mapStateToProps = (state) => {
  const { signals, selectedSignals } = state.signalMultiSelect;
  const { selectedMetrics } = state?.report?.metrics;
  const { onTheFly, onTheFlyRefresh } = state.report.duration.timeDuration;
  const { forecast } = state.report.duration.cyclicalComparison;

  const { map } = state.report.data;

  const { data } = state.reportV3;

  const { reportList } = state.reportV3?.reportDetails;

  const { activeTabRightPanel } = state.report.rightPanel;

  return {
    signals,
    selectedSignals,
    selectedMetrics,

    onTheFly,
    onTheFlyRefresh,

    forecast,
    map,

    activeTabRightPanel,

    data,
    reportList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportGraph);
