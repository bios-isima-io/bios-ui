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
import { cloneDeep } from 'lodash';
import moment from 'moment-timezone';

import {
  approxColorMapping,
  diffNextValueMap,
} from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type/Simple/const';
import {
  CYCLICAL_COLOR,
  getGraphColorArrayName,
} from 'containers/ReportV2/components/ReportGraph/colors';
import {
  getCyclicalInterval,
  reorderSMforMultipleAxis,
} from 'containers/ReportV2/components/ReportGraph/utils';
import { evaluateDerivedMetrics } from 'containers/ReportV2/utils';
import {
  checkIfApproxMetricValue,
  checkIfMedianOrDistinctCount,
  checkIfSpreadOrDC,
} from 'containers/ReportV2/utils/checkIfApproxMetric';

import { buildBubbleDataSet, buildBubbleResp } from '../plot/bubble';
import {
  addMarkerRadius,
  buildDataPointTooltipText,
  changeLastBarColorForOnTheFly,
  findTimestamp,
  formatTimestamp,
  generateTooltipNumber,
  handlePercentageCustomData,
  makeTimestamps,
} from '../utils';
import { handleDistinctCountsCal } from './utils';
import { getMetricsFromDerivedMetric } from 'containers/ReportV2/utils/metricsRegex';
import { DURATION_1_DAY } from 'containers/ReportV2/components/AdvanceSettings/Duration/TimeDuration/const';

import ARIMA from 'arima';

export const generateForecast = (data, dataPoints, seasons) => {
  const ts = data.map((d) => d?.[1]);
  const arima = new ARIMA({
    p: 0,
    d: 1,
    q: 3,
    P: 0,
    D: 1,
    Q: 1,
    s: seasons,
    verbose: false,
  }).train(ts);
  const resp = arima.predict(dataPoints);
  return resp;
};

const getSeasons = (windowSize, duration) => {
  if (duration === 3600000) {
    return DURATION_1_DAY / (3600000 * 12);
  }
  return DURATION_1_DAY / windowSize;
};

const buildPackedBubbleData = (data, offset) => {
  return data.map((d) => {
    return {
      name: Highcharts.dateFormat(
        '%A, %b %e, %H:%M',
        moment(d[0] + offset * 60000),
      ),
      value: d[1],
    };
  });
};

const getYAxisValues = (selectedMetrics, colors) => {
  let isSpreadOrDC = false;
  let yAxisVal = selectedMetrics.map((sm, smIndex) => {
    let titleText;
    let color = colors[smIndex % colors.length][0];
    if (
      (isSpreadOrDC || checkIfSpreadOrDC(sm.measurement)) &&
      sm.type === 'simple'
    ) {
      isSpreadOrDC = true;
    }
    titleText = sm.as;
    return {
      title: {
        useHTML: true,
        text: `${titleText}  ${sm.unitDisplayName ? sm.unitDisplayName : ''}
				${sm.showPercentage ? '(%)' : ''}`,
        style: {
          color,
        },
      },
      opposite: sm.yAxisPosition === 'right' ? true : false,
      plotLines: [
        {
          value: 0,
        },
      ],
    };
  });

  if (isSpreadOrDC) {
    yAxisVal = selectedMetrics.reduce((acc, sm) => {
      let color = '#393939';
      if (checkIfApproxMetricValue(sm.measurement)) {
        acc.push({
          title: {
            useHTML: true,
            text: `${sm.as}  ${sm.unitDisplayName ? sm.unitDisplayName : ''}
						${sm.showPercentage ? '(%)' : ''}`,
            style: {
              color,
            },
          },
          opposite: sm.yAxisPosition === 'right' ? true : false,
          plotLines: [
            {
              value: 0,
            },
          ],
        });
      }
      return acc;
    }, []);
  }
  return yAxisVal;
};

const getSimpleMetricData = ({ metric, timestamps, dataSet }) => {
  return timestamps.map(({ start, end }) => {
    return [end, dataSet?.[start]?.[metric?.measurement]];
  });
};

const approxMetricAddAreaChart = ({ metric, timestamps, dataSet }) => {
  const att = metric.measurement.substring(
    metric.measurement.indexOf('.') + 1,
    metric.measurement.indexOf('('),
  );

  if (att === 'median' || att === 'distinctcount') {
    return timestamps.map(({ start, end }) => {
      const value = dataSet?.[start]?.[metric?.measurement];
      return [end, value ?? 0];
    });
  }
  let nextValueMetric = metric.measurement.replace(att, diffNextValueMap[att]);

  return timestamps.map(({ start, end }, i) => {
    const val1 = dataSet?.[start]?.[metric?.measurement] ?? 0;
    const val2 = dataSet?.[start]?.[nextValueMetric] ?? 0;
    let v1, v2;
    if (val1 < val2) {
      v1 = val1;
      v2 = val2;
    } else {
      v1 = val2;
      v2 = val1;
    }
    return [end, v1, v2];
  });
};

const getApproxMetricLineData = ({ metric, timestamps, dataSet }) => {
  return timestamps.map(({ start, end }) => {
    const value = dataSet?.[start]?.[metric?.measurement] ?? 0;
    return [end, value];
  });
};

const getDerivedMetricData = ({
  metric,
  timestamps,
  dataSet,
  selectedSignals,
}) => {
  const terms = getMetricsFromDerivedMetric({
    metric: metric.measurement,
    entities: selectedSignals,
    type: 'signal',
  });

  return timestamps.map(({ start, end }) => {
    const evalResult =
      terms &&
      evaluateDerivedMetrics({
        formula: metric?.measurement,
        terms,
        windowSize: Math.max(end - start, 1),
        fetchValue: (term) => dataSet?.[start]?.[term],
      });
    return [end, evalResult];
  });
};

const buildDataSetNoGroupBy = ({ signalDataOrder, graphData }) => {
  let dataSet = {};

  signalDataOrder?.forEach((signal, signalIndex) => {
    const sq = graphData?.[signalIndex];
    sq?.dataWindows?.forEach((window) => {
      // for defensive purpose
      if (window?.windowBeginTime === undefined) {
        return;
      }
      if (dataSet[window.windowBeginTime] === undefined) {
        dataSet[window.windowBeginTime] = {};
      }
      const dataSetEntry = dataSet[window.windowBeginTime];
      const record = window.records?.[0];
      sq.definitions.forEach((definition, index) => {
        const metricName = signal + '.' + definition?.name;
        dataSetEntry[metricName] = record?.[index] ?? 0;
      });
    });
  });
  return dataSet;
};

const buildDataSetNoGroupByApproxMetric = ({ signalDataOrder, graphData }) => {
  let dataSet = {};
  signalDataOrder?.forEach((signal, signalIndex) => {
    const sq = graphData?.[signalIndex];
    sq?.dataWindows?.forEach((window) => {
      if (dataSet[window?.windowBeginTime] === undefined) {
        dataSet[window?.windowBeginTime] = {};
      }
      window?.records?.[0]?.forEach((rc, rcIndex) => {
        const metricName = signal + '.' + sq?.definitions?.[rcIndex]?.name;
        if (isNaN(rc)) {
          const windowData = window?.records?.[0];
          if (
            rcIndex > 0 &&
            rcIndex < window?.records?.[0]?.length - 1 &&
            !isNaN(windowData[rcIndex - 1]) &&
            !isNaN(windowData[rcIndex + 1])
          ) {
            dataSet[window?.windowBeginTime][metricName] =
              (windowData[rcIndex - 1] + windowData[rcIndex + 1]) / 2;
          }
        } else {
          dataSet[window?.windowBeginTime][metricName] = rc;
        }
      });
    });
  });
  return dataSet;
};

const buildApproxMetricTooltipText = (chartInfo, timestamps, offset) => {
  const timestamp = timestamps.find((ts) => ts.end === chartInfo.x);
  const header = '<span style="font-size: 10px; margin: 0px; padding: 0px;">';
  const date = `<b>${formatTimestamp(timestamp, offset)}</b>`;
  const ulOpen =
    '<ul style="padding: 0px; margin-left: 15px; margin-bottom: 0px">';
  const items = chartInfo.points.map((point) => {
    const name = point?.series?.name;
    const value = generateTooltipNumber(point.y);
    const color = point?.series?.color;
    return [
      `<li style="color: ${color}; margin: 0px; padding: 0px">`,
      '<span style="color: black; margin-left: -5px">',
      `${name}: <b>${value}</b>`,
      '</span>',
      '</li>',
    ].join('');
  });
  const ulClose = '</ul>';
  const footer = '</span>';
  return [header, date, ulOpen, ...items, ulClose, footer].join('');
};

const updateAsFieldForApproxMetric = (metrics, as) => {
  metrics.forEach((metric) => {
    const { measurement } = metric;
    metric.as =
      as +
      ': ' +
      measurement?.substring(
        measurement.indexOf('.') + 1,
        measurement.indexOf('('),
      );
  });
};

const getGraphDataNoGroupBy = (data) => {
  const {
    signalDataOrder,
    selectedMetrics: sm,
    graphData,
    cyclicalData,
    durationStart,
    duration,
    windowSize,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    selectedSignals,
    timezone,
    endTimestamp,
    onTheFly,
    forecast,
    forecastDataset,
  } = data;
  const existingSelectedMetric = cloneDeep(sm);
  const isPackedBubble =
    sm.some((sm) => sm.defaultGraphType === 'packedbubble') &&
    (sm.length === 3 || sm.length === 2);
  const timezoneVal = timezone === '' ? moment.tz.guess() : timezone;
  const offset = moment.tz(moment.utc(), timezoneVal).utcOffset();
  const selectedMetricsAll = reorderSMforMultipleAxis(sm);
  const selectedMetrics = selectedMetricsAll.filter((sm) => {
    return !checkIfApproxMetricValue(sm.measurement);
  });

  const colors = getGraphColorArrayName(1);

  let firstAxis = '';
  let dataSet = buildDataSetNoGroupBy({
    signalDataOrder,
    graphData,
  });

  const timestamps = makeTimestamps({
    dataSet,
    durationStart,
    duration,
    windowSize,
    endTimestamp,
  });

  let isApproxMetric;
  let isApproxMetricCenterLine;
  const isDistinctCountsMetrics = selectedMetricsAll.some((sm) => {
    const att = sm?.measurement?.substring(
      sm?.measurement.lastIndexOf('.') + 1,
      sm?.measurement.lastIndexOf('('),
    );
    return att === 'distinctcounts';
  });

  const selectedMetricApprox = selectedMetricsAll.find((sm) => {
    return checkIfApproxMetricValue(sm?.measurement);
  });
  if (
    selectedMetricApprox &&
    selectedMetricApprox?.as &&
    selectedMetricApprox?.as !== selectedMetricApprox?.measurement
  ) {
    updateAsFieldForApproxMetric(selectedMetricsAll, selectedMetricApprox?.as);
  }

  let areaCharts = [];
  const rangeChartForecast = [];
  let rangeChartForecastSeries;
  const series = selectedMetrics.map((sm, smIndex) => {
    isApproxMetric = selectedMetricsAll.some((sm) => {
      return checkIfApproxMetricValue(sm.measurement);
    });
    isApproxMetricCenterLine = false;
    let name = sm.as;
    let type = sm.defaultGraphType === 'bar' ? 'column' : sm.defaultGraphType;
    type = type === 'line' ? 'spline' : type;
    type = type === 'area' ? 'areaspline' : type;
    type = type === 'scatter' ? 'scatter' : type;
    type = type === 'packedbubble' ? 'packedbubble' : type;
    let data = [];
    if (sm.type === 'simple') {
      data = getSimpleMetricData({ metric: sm, timestamps, dataSet });
    } else if (sm.type === 'derived') {
      data = getDerivedMetricData({
        selectedSignals,
        metric: sm,
        timestamps,
        dataSet,
      });
    }
    let prevForecastLastTimeStamp = data[data.length - 1]?.[0];
    let afterForecastLastTimeStamp;

    if (
      forecast &&
      type === 'spline' &&
      selectedMetrics?.length === 1 &&
      forecastDataset
    ) {
      let dataPoints = data.length;
      const seasons = getSeasons(windowSize, duration);
      const forecast = generateForecast(forecastDataset, dataPoints, seasons);
      let lastTimestamp = data[data.length - 1]?.[0];
      let lastTimestampValue = data[data.length - 1]?.[1];

      forecast?.[0]?.forEach((element) => {
        timestamps.push({
          start: lastTimestamp,
          end: lastTimestamp + windowSize,
        });
        if (rangeChartForecast?.length === 0) {
          rangeChartForecast.push([
            lastTimestamp,
            lastTimestampValue,
            lastTimestampValue,
          ]);
        }
        const error = element * 0.08;
        const lowerBound = element - error;
        const upperBound = element + error;
        rangeChartForecast.push([
          lastTimestamp + windowSize,
          lowerBound > 0 ? lowerBound : 0,
          upperBound > 0 ? upperBound : 0,
        ]);
        lastTimestamp = lastTimestamp + windowSize;
        data.push([lastTimestamp, element > 0 ? element : 0]);
        afterForecastLastTimeStamp = lastTimestamp;
      });
    }

    firstAxis = firstAxis === '' ? sm.yAxisPosition : firstAxis;
    let color;
    let dataAreaChart;
    if (isApproxMetric && sm.type === 'simple') {
      dataSet = buildDataSetNoGroupByApproxMetric({
        signalDataOrder,
        graphData,
      });
      const att = sm?.measurement?.substring(
        sm.measurement.lastIndexOf('.') + 1,
        sm.measurement.lastIndexOf('('),
      );
      color = approxColorMapping[att];
      data = getApproxMetricLineData({
        metric: sm,
        timestamps,
        dataSet,
      });
      dataAreaChart = approxMetricAddAreaChart({
        metric: sm,
        timestamps,
        dataSet,
      });
      if (att === 'median' || att === 'distinctcount') {
        isApproxMetricCenterLine = true;
      }
      type = 'spline';
    } else {
      color = colors[smIndex % colors.length][0];
    }
    const seriesItem = {
      name,
      data,
      type,
      unitDisplayName: sm?.unitDisplayName,
      unitDisplayPosition: sm?.unitDisplayPosition,
      yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
      color,
      ...(type === 'areaspline' && { fillOpacity: 0.6 }),

      ...(isApproxMetric &&
        !isApproxMetricCenterLine && {
          showInLegend: false,
          lineWidth: 0,
        }),

      ...(isApproxMetric &&
        isApproxMetricCenterLine && {
          showInLegend: false,
          lineWidth: 2,
        }),
      ...(forecast &&
        type === 'spline' &&
        selectedMetrics?.length === 1 &&
        forecastDataset && {
          zoneAxis: 'x',
          zones: [
            {
              value: prevForecastLastTimeStamp,
            },
            {
              value: afterForecastLastTimeStamp,
              dashStyle: 'ShortDash',
            },
          ],
          forecast: true,
        }),
    };
    if (rangeChartForecast?.length > 0) {
      rangeChartForecastSeries = {
        name,
        data: rangeChartForecast,
        type: 'arearange',
        unitDisplayName: sm?.unitDisplayName,
        unitDisplayPosition: sm?.unitDisplayPosition,
        yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
        color,
        fillOpacity: 0.2,
        marker: {
          fillColor: 'transparent',
          lineWidth: 0,
        },
      };
    }
    if (type === 'packedbubble') {
      data = buildPackedBubbleData(data, offset);
      seriesItem.data = data;
      seriesItem.tooltip = {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}',
      };
    }
    if (!checkIfMedianOrDistinctCount(sm.measurement)) {
      areaCharts.push({
        ...seriesItem,
        data: dataAreaChart,
        type: 'areasplinerange',
        tooltip: {
          useHTML: true,
          formatter: function () {
            return buildDataPointTooltipText({
              timestamp: findTimestamp(this, timestamps),
              offset,
              tooltipHeader: this.series.name,
              value: this.y,
            });
          },
        },
        enableMouseTracking: false,
        showInLegend: false,
        lineWidth: 0,
      });
    }
    return seriesItem;
  });
  if (isPackedBubble) {
    const dataSet = buildBubbleDataSet(series);
    return buildBubbleResp(sm, dataSet, [colors?.[0]]);
  }

  if (
    !isApproxMetric &&
    cyclicalData &&
    selectedMetrics.length === 1 &&
    selectedMetrics?.[0]?.defaultGraphType !== 'packedbubble'
  ) {
    let data = [];

    let CCdataSet = buildDataSetNoGroupBy({
      signalDataOrder,
      graphData: cyclicalData,
    });

    const cyclicalInterval = getCyclicalInterval(
      cyclicalComparisonStart,
      durationStart,
      cyclicalComparisonCustom,
    );
    const ccTimestamps = makeTimestamps({
      dataSet: CCdataSet,
      durationStart: timestamps[0].start - cyclicalInterval,
      duration,
      windowSize,
    });

    if (selectedMetrics?.[0].type === 'simple') {
      data = getSimpleMetricData({
        metric: selectedMetrics?.[0],
        timestamps: ccTimestamps,
        dataSet: CCdataSet,
      });
    } else if (selectedMetrics?.[0].type === 'derived') {
      data = getDerivedMetricData({
        selectedSignals,
        metric: selectedMetrics?.[0],
        timestamps: ccTimestamps,
        dataSet: CCdataSet,
        windowSize,
      });
    }

    data.forEach((_, index) => {
      if (series[0].data?.[index]?.[0]) {
        data[index][0] += cyclicalInterval;
      } else {
        delete data[index];
      }
    });

    series.unshift({
      name: 'Cyclical Data',
      data,
      unitDisplayName: selectedMetrics?.[0]?.unitDisplayName,
      unitDisplayPosition: selectedMetrics?.[0]?.unitDisplayPosition,
      type: 'areaspline',
      color: CYCLICAL_COLOR,
      tooltip: {
        useHTML: true,
        customTooltipPerSeries: function () {
          return buildDataPointTooltipText({
            timestamp: findTimestamp(this, ccTimestamps),
            offset,
            tooltipHeader: this?.point?.series?.name,
            value: this?.y,
            unitDisplayName: this?.series?.userOptions?.unitDisplayName,
            unitDisplayPosition: this?.series?.userOptions?.unitDisplayPosition,
          });
        },
      },
    });
  }
  let seriesWithUpdatedRadius = addMarkerRadius({
    series,
    markerRadius: 1,
  });
  let yAxisValues = getYAxisValues(selectedMetrics, colors);
  if (isApproxMetric) {
    let restSeries;
    yAxisValues = getYAxisValues(sm, colors);
    if (isDistinctCountsMetrics) {
      const areaChartsClone = cloneDeep(areaCharts).slice(0, 6);
      seriesWithUpdatedRadius = handleDistinctCountsCal(
        series,
        areaChartsClone,
      );
    } else {
      seriesWithUpdatedRadius.push(...areaCharts);
      if (restSeries) {
        seriesWithUpdatedRadius.push(restSeries);
      }
    }

    seriesWithUpdatedRadius = addMarkerRadius({
      series: seriesWithUpdatedRadius,
      markerRadius: 0,
    });
  }
  if (rangeChartForecastSeries) {
    seriesWithUpdatedRadius.push(rangeChartForecastSeries);
  }

  if (isApproxMetric) {
    const handlePercentageProbabilisticData = (
      existingSelectedMetric,
      plotData,
    ) => {
      let selectedMetric = existingSelectedMetric?.[0];
      let showPercentage = false;
      if (selectedMetric.showPercentage) {
        showPercentage = selectedMetric.showPercentage;
      }
      if (!showPercentage) {
        return plotData;
      }
      for (let chart of plotData) {
        chart?.data.forEach((d, i) => {
          if (chart.type === 'spline') {
            chart.data[i][1] = d[1] / 100;
          }
          if (chart.type === 'areasplinerange') {
            chart.data[i][1] = d[1] / 100;
            chart.data[i][2] = d[2] / 100;
          }
        });
      }
      return plotData;
    };
    seriesWithUpdatedRadius = handlePercentageProbabilisticData(
      existingSelectedMetric,
      seriesWithUpdatedRadius,
    );
  } else {
    seriesWithUpdatedRadius = handlePercentageCustomData(
      selectedMetrics,
      seriesWithUpdatedRadius,
      'noGroupBy',
    );
  }

  if (onTheFly) {
    seriesWithUpdatedRadius = changeLastBarColorForOnTheFly(
      seriesWithUpdatedRadius,
    );
  }

  const resp = {
    title: {
      text: '',
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return buildDataPointTooltipText({
          timestamp: findTimestamp(this, timestamps),
          offset,
          seriesName: this?.series?.name,
          value: this?.y,
          unitDisplayName: this?.series?.userOptions?.unitDisplayName,
          unitDisplayPosition: this?.series?.userOptions?.unitDisplayPosition,
          pointName: this?.point?.name,
        });
      },
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: yAxisValues,
    series: seriesWithUpdatedRadius,
    plotOptions: {
      series: {
        borderRadius: 2,
        maxPointWidth: 20,
        ...(onTheFly && { pointWidth: 20 }),
      },
      areaspline: {
        lineWidth: 0,
      },
      arearange: {
        lineWidth: 0,
        enableMouseTracking: false,
      },
    },
  };

  if (
    !isApproxMetric &&
    cyclicalData &&
    selectedMetrics.length === 1 &&
    selectedMetrics?.[0]?.defaultGraphType !== 'packedbubble'
  ) {
    resp.tooltip = {
      formatter: function () {
        if (this.series.tooltipOptions.customTooltipPerSeries) {
          return this.series.tooltipOptions.customTooltipPerSeries.call(this);
        } else {
          // single bar chart
          return buildDataPointTooltipText({
            timestamp: findTimestamp(this, timestamps),
            offset,
            tooltipHeader: this?.series?.name,
            value: this?.y,
            unitDisplayName: this?.series?.userOptions?.unitDisplayName,
            unitDisplayPosition: this?.series?.userOptions?.unitDisplayPosition,
            ...(forecast && {
              forecast: this?.series?.userOptions?.forecast,
              series: seriesWithUpdatedRadius,
              pointIndex: this?.point?.index,
            }),
          });
        }
      },
    };
  }

  if (isApproxMetric) {
    resp.tooltip = {
      shared: true,
      backgroundColor: 'rgba(255,255,255,1)',
      useHTML: true,
      formatter: function () {
        return buildApproxMetricTooltipText(this, timestamps, offset);
      },
    };
    resp.plotOptions.series.states = {
      inactive: {
        opacity: 1,
      },
    };
  }

  if (duration <= 3600000) {
    resp.xAxis.tickInterval = 1000 * 60 * 15;
  }

  return resp;
};

export { getGraphDataNoGroupBy, buildDataSetNoGroupBy };
