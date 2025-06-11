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
import { map, sum, unzip } from 'lodash';
import moment from 'moment-timezone';

import {
  CYCLICAL_COLOR,
  REST_GRADIENT,
  getGraphColorArrayName,
} from 'containers/ReportV2/components/ReportGraph/colors';
import { reorderSMforMultipleAxis } from 'containers/ReportV2/components/ReportGraph/utils';
import { evaluateDerivedMetrics } from 'containers/ReportV2/utils';
import { getCyclicalInterval } from 'containers/ReportV2/components/ReportGraph/utils/getCCStartTimestamp';

import { getGraphDataNoGroupBy } from '../noGroupBy';
import {
  addMarkerRadius,
  buildDataPointTooltipText,
  changeLastBarColorForOnTheFly,
  findTimestamp,
  handlePercentageData,
  makeTimestamps,
} from '../utils';
import { getMetricsFromDerivedMetric } from 'containers/ReportV2/utils/metricsRegex';

const isDistinctCount = (metric) => metric?.includes('distinctcount(');

const getYAxisValues = (selectedMetrics, colors, legendMinMax) => {
  let leftMax = -Infinity;
  let rightMax = -Infinity;
  let leftAxisAdded = false;
  let rightAxisAdded = false;

  function updateMinMaxValue(yAxisPosition, { max }) {
    if (yAxisPosition === 'right') {
      rightMax = Math.max(max, rightMax);
    } else {
      leftMax = Math.max(max, leftMax);
    }
  }

  selectedMetrics.forEach((sm) => {
    if (legendMinMax?.[sm?.as]) {
      updateMinMaxValue(sm.yAxisPosition, legendMinMax?.[sm?.as]);
    }
  });

  return selectedMetrics.map((sm, smIndex) => {
    let yAxisParams = {};
    if (sm.yAxisPosition === 'right' && !rightAxisAdded) {
      if (rightMax !== -Infinity) {
        yAxisParams.max = rightMax;
      }
      rightAxisAdded = true;
    } else if (sm.yAxisPosition === 'left' && !leftAxisAdded) {
      if (leftMax !== -Infinity) {
        yAxisParams.max = leftMax;
      }
      leftAxisAdded = true;
    }
    return {
      title: {
        text: `${sm.as}  ${sm.unitDisplayName ? sm.unitDisplayName : ''}
				${sm.showPercentage ? '(%)' : ''}`,
        style: {
          color: colors[smIndex % colors.length][0],
        },
      },
      opposite: sm.yAxisPosition === 'right' ? true : false,
      plotLines: [
        {
          value: 0,
        },
      ],
      ...(sm.defaultGraphType === 'bar' && yAxisParams),
    };
  });
};

const getGraphType = (graphType) => {
  let type = graphType === 'bar' ? 'column' : graphType;
  type = type === 'line' ? 'spline' : type;
  type = type === 'area' ? 'areaspline' : type;
  return type;
};

const generateColorMap = (allAvailableKeysSet, GRAPH_COLOR) => {
  let colorCounter = 0;
  const colorGroupByMapping = {};
  allAvailableKeysSet.forEach((record) => {
    colorGroupByMapping[record] =
      GRAPH_COLOR[colorCounter % GRAPH_COLOR.length];
    colorCounter += 1;
  });
  return colorGroupByMapping;
};

const getAllAvailableKeysSet = (selectQuery) => {
  const allAvailableKeysSet = new Set();
  selectQuery.forEach((sq, sq_index) => {
    if (sq_index % 2 === 0) {
      return;
    }
    selectQuery?.[sq_index]?.data?.forEach((xData) => {
      xData.records.forEach((record) => {
        allAvailableKeysSet.add(record[0]);
      });
    });
  });

  return allAvailableKeysSet;
};

function sum_columns(data) {
  return map(unzip(data), sum);
}

const findMinMaxInArray = (arr) => {
  let min = +Infinity;
  let max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return { min, max };
};

const buildMetricMinMaxMap = (series) => {
  let legendMinMax = {};
  let metricTotalMap = {};
  let metricStackMap = {};
  series.forEach((s) => {
    if (!metricStackMap[s?.stack]) {
      metricStackMap[s?.stack] = [];
    }
    // Series data format has been changed from array of yValue to array of [xValue, yValue].
    // The metricStackMap collects array of yValue arrays, so the new format data array needs
    // conversion.
    if (s?.data?.length > 0 && Array.isArray(s.data[0])) {
      // new
      metricStackMap[s?.stack].push(s.data.map((item) => item[1]));
    } else {
      // old, just in case
      metricStackMap[s?.stack].push(s.data);
    }
  });

  for (let legend in metricStackMap) {
    metricTotalMap[legend] = sum_columns(metricStackMap[legend]);
  }

  for (let legend in metricTotalMap) {
    if (!legendMinMax[legend]) {
      legendMinMax[legend] = findMinMaxInArray(metricTotalMap[legend]);
    }
  }
  return legendMinMax;
};

const getGroupByYAxis = (data) => {
  const {
    graphData,
    selectedMetrics: sm,
    signalDataOrder,
    cyclicalData,
    durationStart,
    duration,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    timezone,
    windowSize,
    selectedSignals,
    endTimestamp,
    onTheFly,
    isContextReportAuditLogChart,
  } = data;
  const selectedMetrics = reorderSMforMultipleAxis(sm);
  const colors = getGraphColorArrayName(7);
  let firstAxis = '';
  const GRAPH_COLOR = getGraphColorArrayName(sm?.length);
  const allAvailableKeysSet = getAllAvailableKeysSet(graphData);
  const colorMapping = generateColorMap(allAvailableKeysSet, GRAPH_COLOR);
  const dataSet = {};
  const dataTotal = {};
  const uniqueLabels = [];
  let multiplier = 0;
  const timeStampObj = {};
  const dataRest = {};
  signalDataOrder.forEach((signal, index) => {
    // rest
    graphData?.[index * multiplier]?.dataWindows?.forEach((dw) => {
      dw.records.forEach((rc, rcIndex) => {
        graphData[index * multiplier].definitions.forEach((def, defIndex) => {
          const metric = signal + '.' + def.name;
          if (dataTotal[metric] === undefined) {
            dataTotal[metric] = {};
            dataRest[metric] = {};
          }
          if (dataTotal[metric][dw.windowBeginTime] === undefined) {
            dataTotal[metric][dw.windowBeginTime] = {};
            dataRest[metric][dw.windowBeginTime] = {};
          }
          let data;
          if (rc[defIndex] > 1 || rc[defIndex] < 1) {
            data = Number(rc[defIndex].toFixed(2));
          } else {
            data = rc[defIndex];
          }
          dataTotal[metric][dw.windowBeginTime] = data;
          dataRest[metric][dw.windowBeginTime] = data;
        });
      });
      if (!isNaN(parseInt(dw?.windowBeginTime))) {
        timeStampObj[dw.windowBeginTime] = 0;
      }
    });

    // main data
    const mainDataIndex = index * multiplier + 1;
    graphData?.[mainDataIndex]?.dataWindows?.forEach((dw) => {
      dw.records.forEach((rc, rcIndex) => {
        const def = graphData[mainDataIndex].definitions;
        def.forEach((def, defIndex) => {
          if (defIndex !== 0) {
            const metric = signal + '.' + def.name;

            if (dataSet[metric] === undefined) {
              dataSet[metric] = {};
            }
            if (dataSet[metric][dw.windowBeginTime] === undefined) {
              dataSet[metric][dw.windowBeginTime] = {};
            }
            if (uniqueLabels.indexOf(rc[0]) < 0) {
              uniqueLabels.push(rc[0]);
            }

            let data;
            if (rc[defIndex] > 1 || rc[defIndex] < 1) {
              data = Number(rc[defIndex].toFixed(2));
            } else {
              data = rc[defIndex];
            }
            dataSet[metric][dw.windowBeginTime][rc[0]] = data;
            if (!isDistinctCount(def.name)) {
              if (dataRest?.[metric]?.[dw?.windowBeginTime]) {
                dataRest[metric][dw.windowBeginTime] -= data;
                if (
                  dataRest[metric][dw.windowBeginTime] > 1 ||
                  dataRest[metric][dw.windowBeginTime] < 1
                ) {
                  dataRest[metric][dw.windowBeginTime] = Number(
                    dataRest[metric][dw.windowBeginTime].toFixed(2),
                  );
                }
              }
            }
          }
        });
      });
      if (!isNaN(parseInt(dw.windowBeginTime))) {
        timeStampObj[dw.windowBeginTime] = undefined;
      }
    });

    multiplier = multiplier + 2;
  });
  const series = [];

  const timestamps = makeTimestamps({
    dataSet: timeStampObj,
    durationStart,
    duration,
    windowSize,
    endTimestamp,
    isContextReportAuditLogChart,
  });

  selectedMetrics.forEach((sm, smIndex) => {
    firstAxis = firstAxis === '' ? sm.yAxisPosition : firstAxis;
    const graphType = getGraphType(sm.defaultGraphType);

    if (sm.type === 'simple') {
      const tempSeries = [];
      let measurement = sm.measurement;
      const isAvg = measurement.includes('avg(');
      let cnt;
      if (isAvg) {
        measurement = sm.measurement.replace('avg(', 'sum(');
        cnt = sm.measurement.replace(/avg\(.*\)/, 'count()');
      }
      // make the main graph series
      if (
        dataSet[measurement] !== undefined &&
        (!isAvg || dataSet[cnt] !== undefined)
      ) {
        uniqueLabels.forEach((label) => {
          const data = timestamps.map(({ start, end }) => {
            let value = dataSet[measurement]?.[start]?.[label];
            if (isAvg) {
              const count = dataSet[cnt]?.[start]?.[label] ?? 0;
              value = count ? value / count : 0;
            }
            return [end, value ?? 0];
          });

          tempSeries.push({
            name: label?.toString(),
            unitDisplayName: sm?.unitDisplayName,
            unitDisplayPosition: sm?.unitDisplayPosition,
            stack: sm?.as,
            data,
            yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
            showInLegend: false,
            type: graphType,
            color: colorMapping?.[label]?.[smIndex],
            ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
            ...((graphType === 'column' || graphType === 'areaspline') && {
              stacking: 'normal',
            }),
          });
        });
      }
      tempSeries.reverse();
      // make the rest graph series
      if (
        dataRest[measurement] !== undefined &&
        (!isAvg || dataRest[cnt] !== undefined)
      ) {
        let shouldShowRestValues = false;
        const data = timestamps.map(({ start, end }) => {
          let value = dataRest[measurement]?.[start];
          if (isAvg) {
            const count = dataRest[cnt]?.[start];
            value = count ? value / count : 0;
          }
          shouldShowRestValues = shouldShowRestValues || !!value;
          return [end, value ?? 0];
        });
        if (shouldShowRestValues) {
          const isDc = isDistinctCount(sm.measurement);
          const label = isDc ? 'TOTAL' : 'THE REST';
          tempSeries.push({
            name: `${sm?.as} - ${label}`,
            unitDisplayName: sm?.unitDisplayName,
            unitDisplayPosition: sm?.unitDisplayPosition,
            stack: !isDc && sm?.as,
            data,
            yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
            color: REST_GRADIENT[smIndex % REST_GRADIENT.length],
            type: graphType,
            ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
            ...((graphType === 'column' || graphType === 'areaspline') && {
              stacking: 'normal',
            }),
          });
        }
      }
      series.push(...tempSeries);
    } else {
      // derived metric calculation

      // replace signal.avg(domain) -> (signal.sum(domain) / count())
      const formula = sm.measurement.replaceAll(
        /([0-9a-zA-Z_]*)\.avg\(([0-9a-zA-Z_]*)\)/g,
        '($1.sum($2) / $1.count())',
      );
      const terms = getMetricsFromDerivedMetric({
        metric: formula,
        entities: selectedSignals,
        type: 'signal',
      });

      const tempSeries = [];
      // derived metric data total
      const derivedMetricDataTotal = timestamps.reduce(
        (acc, { start, end }) => {
          acc[start] = evaluateDerivedMetrics({
            formula,
            terms,
            windowSize: Math.max(end - start, 1),
            fetchValue: (term) => dataTotal?.[term]?.[start],
          });
          return acc;
        },
        {},
      );

      // derived metrics main data
      const derivedMetricDataSet = {};
      uniqueLabels.forEach((label) => {
        timestamps.forEach(({ start, end }) => {
          const evaluatedValue = evaluateDerivedMetrics({
            formula: formula,
            terms,
            windowSize: Math.max(end - start, 1),
            fetchValue: (term) => dataSet?.[term]?.[start]?.[label],
          });

          if (derivedMetricDataSet[start] === undefined) {
            derivedMetricDataSet[start] = {};
          }
          derivedMetricDataSet[start][label] = evaluatedValue;
        });
      });

      uniqueLabels.forEach((label) => {
        const data = timestamps.map(({ start, end }) => {
          const value = derivedMetricDataSet?.[start]?.[label] ?? 0;
          derivedMetricDataTotal[start] -= value;
          return [end, value];
        });
        tempSeries.push({
          name: label?.toString(),
          stack: sm?.as,
          unitDisplayName: sm?.unitDisplayName,
          unitDisplayPosition: sm?.unitDisplayPosition,
          data,
          yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
          showInLegend: false,
          type: graphType,
          color: colorMapping?.[label]?.[smIndex],
          ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
          ...((graphType === 'column' || graphType === 'areaspline') && {
            stacking: 'normal',
          }),
        });
      });

      tempSeries.reverse();
      // the rest
      if (Object.keys(dataRest).every((metric) => !isDistinctCount(metric))) {
        let shouldShowRestValues = false;
        const restData = timestamps.map(({ start, end }) => {
          const evalResult = evaluateDerivedMetrics({
            formula: sm?.measurement,
            terms,
            windowSize: Math.max(end - start, 1),
            fetchValue: (term) => dataRest?.[term]?.[start],
          });
          shouldShowRestValues = shouldShowRestValues || !!evalResult;
          return [end, evalResult];
        });

        shouldShowRestValues &&
          tempSeries.push({
            name: sm?.as + ' - THE REST',
            unitDisplayName: sm?.unitDisplayName,
            unitDisplayPosition: sm?.unitDisplayPosition,
            stack: sm?.as,
            data: restData,
            yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
            color: REST_GRADIENT[smIndex % REST_GRADIENT.length],
            type: graphType,
            ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
            ...((graphType === 'column' || graphType === 'areaspline') && {
              stacking: 'normal',
            }),
          });
      }

      series.push(...tempSeries);
    }
  });

  if (cyclicalData && selectedMetrics.length === 1) {
    const cyclicalInterval = getCyclicalInterval(
      cyclicalComparisonStart,
      durationStart,
      cyclicalComparisonCustom,
    );
    const ccStart = timestamps[0].start - cyclicalInterval;
    const ccResponse = getGraphDataNoGroupBy({
      graphData: cyclicalData,
      selectedMetrics,
      signalDataOrder,
      cyclicalData: null,
      durationStart: ccStart,
      duration,
      windowSize,
      selectedSignals,
      timezone,
    }).series?.[0];
    ccResponse.type = 'areaspline';
    ccResponse.name = 'Cyclical Data';
    const ccTimestamps = makeTimestamps({
      timestamps: ccResponse.data.map((item) => item[0] - windowSize),
      durationStart: ccStart,
      duration,
      windowSize,
    });
    ccResponse.data = ccResponse.data.map((d, index) => {
      const timestamp = ccTimestamps[index].end + cyclicalInterval;
      const value = d[1] ?? 0;
      return [timestamp, value !== Infinity ? value : 0];
    });
    ccResponse.color = CYCLICAL_COLOR;
    ccResponse.tooltip = {
      customTooltipPerSeries: function () {
        const hoverMessage = buildDataPointTooltipText({
          tooltipHeader: ccResponse.name,
          timestamp: findTimestamp(this, ccTimestamps),
          offset,
          value: this.y,
          unitDisplayName: this?.series?.userOptions?.unitDisplayName,
          unitDisplayPosition: this?.series?.userOptions?.unitDisplayPosition,
        });
        return hoverMessage;
      },
    };
    series.unshift(ccResponse);
  }
  let seriesWithUpdatedRadius = addMarkerRadius({ series, markerRadius: 1 });
  seriesWithUpdatedRadius = handlePercentageData(
    selectedMetrics,
    seriesWithUpdatedRadius,
    true,
  );
  const timezoneVal = timezone === '' ? moment.tz.guess() : timezone;
  const offset = moment.tz(moment.utc(), timezoneVal).utcOffset();
  let legendMinMax = buildMetricMinMaxMap(series);

  if (onTheFly) {
    seriesWithUpdatedRadius = changeLastBarColorForOnTheFly(
      seriesWithUpdatedRadius,
    );
  }

  const resp = {
    title: {
      useHTML: true,
      text: '',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: getYAxisValues(selectedMetrics, colors, legendMinMax),

    tooltip: {
      useHTML: true,
      formatter: function () {
        if (this.series.tooltipOptions.customTooltipPerSeries) {
          return this.series.tooltipOptions.customTooltipPerSeries.call(this);
        }
        const tooltipHeader = this.series?.userOptions?.stack
          ? this.series.userOptions.stack
          : '';

        const text = buildDataPointTooltipText({
          tooltipHeader,
          timestamp: findTimestamp(this, timestamps),
          offset,
          seriesName: this.series?.name,
          value: this?.y,
          unitDisplayName: this?.series?.userOptions?.unitDisplayName,
          unitDisplayPosition: this?.series?.userOptions?.unitDisplayPosition,
          valuePercentage: ((this.y / this.point.stackTotal) * 100).toFixed(1),
          isContextReportAuditLogChart,
        });
        return text;
      },
    },

    plotOptions: {
      series: {
        borderRadius: 2,
        maxPointWidth: 20,
        ...(onTheFly && { pointWidth: 20 }),
      },
      areaspline: {
        lineWidth: 0,
      },
    },
    series: seriesWithUpdatedRadius,
  };

  if (duration <= 3600000) {
    resp.xAxis.tickInterval = 1000 * 60 * 15;
  }
  return resp;
};

export { getGroupByYAxis };
