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
import { getMetricsFromDerivedMetric } from 'containers/ReportV2/utils/metricsRegex';
import { evaluateDerivedMetrics } from '../../../../utils';
import {
  COLOR_GRADIENT,
  getGraphColorArrayName,
  REST_GRADIENT,
} from '../../colors';
import { reorderSMforMultipleAxis } from '../../utils';
import { generateTooltipNumber, handlePercentageData } from '../utils';

const getGraphType = (graphType) => {
  let type = graphType === 'bar' ? 'column' : graphType;
  type = type === 'line' ? 'spline' : type;
  type = type === 'area' ? 'areaspline' : type;
  type = type === 'scatter' ? 'scatter' : type;
  return type;
};

const getYAxisValues = (selectedMetrics, colors) => {
  return selectedMetrics.map((sm, smIndex) => {
    return {
      title: {
        useHTML: true,
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
    };
  });
};

const buildDataSetGrpX = (graphData, signalDataOrder) => {
  const dataSetXGroup = {};
  signalDataOrder?.forEach((signal, signalIndex) => {
    const grpByXIndex = 2 * signalIndex + 1;
    if (graphData?.length < grpByXIndex) {
      return;
    }
    const sq = graphData[grpByXIndex];

    sq?.dataWindows?.[0]?.records?.forEach((record) => {
      sq?.definitions?.forEach((def, defIndex) => {
        if (defIndex === 0) {
          return;
        }
        if (dataSetXGroup[signal] === undefined) {
          dataSetXGroup[signal] = {};
        }
        if (dataSetXGroup[signal][def.name] === undefined) {
          dataSetXGroup[signal][def.name] = {};
        }
        dataSetXGroup[signal][def.name][record[0]] = record[defIndex];
      });
    });
  });

  return dataSetXGroup;
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

const buildDataSetGrpXY = (graphData, signalDataOrder) => {
  const dataSetXYgrp = {};
  signalDataOrder.forEach((signal, signalIndex) => {
    const grpByXYindex = 2 * signalIndex;
    if (graphData.length < grpByXYindex) {
      return;
    }
    const sq = graphData[grpByXYindex];

    sq?.dataWindows?.[0]?.records?.forEach((record) => {
      sq?.definitions?.forEach((def, defIndex) => {
        if (defIndex === 0 || defIndex === 1) {
          return;
        }
        if (dataSetXYgrp[signal] === undefined) {
          dataSetXYgrp[signal] = {};
        }
        if (dataSetXYgrp[signal][def.name] === undefined) {
          dataSetXYgrp[signal][def.name] = {};
        }
        if (dataSetXYgrp[signal][def.name][record[0]] === undefined) {
          dataSetXYgrp[signal][def.name][record[0]] = {};
        }
        dataSetXYgrp[signal][def.name][record[0]][record[1]] = record[defIndex];
      });
    });
  });

  return dataSetXYgrp;
};

const getUniqueXAxisCategories = (dataSetXGroup) => {
  const categoriesXAxis = [];

  for (const signal in dataSetXGroup) {
    for (const metric in dataSetXGroup[signal]) {
      for (const grpXValue in dataSetXGroup[signal][metric]) {
        categoriesXAxis.push(grpXValue);
      }
    }
  }
  return [...new Set(categoriesXAxis)];
};

const getUniqueXYValues = (dataSetXYgrp, uniqueCategories) => {
  const orderedList = [];
  for (const xLabel of uniqueCategories) {
    const labelValues = {};

    for (const signal in dataSetXYgrp) {
      for (const metric in dataSetXYgrp[signal]) {
        for (const grpXValue in dataSetXYgrp[signal][metric]) {
          for (const grpYValue in dataSetXYgrp[signal][metric][grpXValue]) {
            if (
              dataSetXYgrp?.[signal]?.[metric]?.[grpXValue]?.[grpYValue] &&
              grpXValue === xLabel
            ) {
              if (labelValues.hasOwnProperty(grpYValue)) {
                if (
                  labelValues[grpYValue] <
                  dataSetXYgrp?.[signal]?.[metric]?.[grpXValue]?.[grpYValue]
                ) {
                  labelValues[grpYValue] =
                    dataSetXYgrp[signal][metric][grpXValue][grpYValue];
                }
              } else {
                labelValues[grpYValue] =
                  dataSetXYgrp[signal][metric][grpXValue][grpYValue];
              }
            }
          }
        }
      }
    }
    const keysSorted = Object.keys(labelValues).sort(function (a, b) {
      return labelValues[b] - labelValues[a];
    });
    orderedList.push(...keysSorted);
  }
  return [...new Set(orderedList)];
};

const buildRestDataSet = ({
  dataSetXGroup,
  selectedMetrics,
  xValues,
  selectedSignals,
  duration,
}) => {
  const restData = {};
  selectedMetrics.forEach((sm) => {
    const [signalName, metric] = sm?.measurement?.split('.');
    if (sm.type === 'simple') {
      for (const item in dataSetXGroup?.[signalName]?.[metric]) {
        if (restData[sm.as] === undefined) {
          restData[sm.as] = {};
        }
        restData[sm.as][item] = dataSetXGroup?.[signalName]?.[metric]?.[item];
      }
    } else if (sm.type === 'derived') {
      const terms = getMetricsFromDerivedMetric({
        metric: sm?.measurement,
        entities: selectedSignals,
        type: 'signal',
      });

      for (const xValue of xValues) {
        const evalResult = evaluateDerivedMetrics({
          formula: sm?.measurement,
          terms,
          windowSize: duration,
          fetchValue: (term) => {
            const [signalName, metric] = term?.split('.');
            return dataSetXGroup?.[signalName]?.[metric]?.[xValue];
          },
        });
        if (restData[sm.as] === undefined) {
          restData[sm.as] = {};
        }
        restData[sm.as][xValue] = evalResult;
      }
    }
  });

  return restData;
};

/**
 * Sort series by the Y value.
 *
 * @param {array} series - series data
 * @returns {array} sorted series
 */
const sortSeries = (series) => {
  const seriesContainer = series.map((item) => ({
    value: item.data.reduce((acc, value) => acc + value, 0),
    item,
  }));
  const result = seriesContainer
    .sort((a, b) => a.value - b.value)
    .map((entry) => entry.item);
  return result;
};

/**
 * Changes the order of X labels (values) based on the total amount for each label.
 *
 * The order permutation happens in place of specified series and xValues
 *
 * @param {array} series - series data
 * @param {array} xValues - X labels (values)
 */
const sortXAxis = (series, xValues) => {
  // Make the permutation table and sort it by the total Y values (amount)
  const permutation = xValues.map((xValue, index) => ({
    xValue,
    index,
    amount: 0,
  }));
  series.reduce((perm, item) => {
    item.data.forEach((value, i) => {
      perm[i].amount += value;
    });
    return perm;
  }, permutation);
  permutation.sort((a, b) => b.amount - a.amount);

  // permutate x values
  permutation.forEach((entry, i) => {
    xValues[i] = entry.xValue;
  });
  // permutate series data
  series.forEach((item) => {
    const newData = permutation.map((entry) => item.data[entry.index]);
    item.data = newData;
  });
};

const getGroupByXAndYAxis = (data) => {
  const {
    graphData,
    selectedMetrics: sm,
    signalDataOrder,
    selectedSignals,
    cyclicalComparisonStart,
    cyclicalData,
    existingColorMapping,
    duration,
  } = data;
  const selectedMetrics = reorderSMforMultipleAxis(sm);

  const colors = getGraphColorArrayName(7);
  let firstAxis = '';
  // dataset storage format
  // datasetXGroup[signalName][metric][groupbyXValue] = 22
  // datasetXYgrp[signalName][metric][groupbyXValue][groupbyYValue] = 22
  const dataSetXGroup = buildDataSetGrpX(graphData, signalDataOrder);
  const dataSetXYGroup = buildDataSetGrpXY(graphData, signalDataOrder);
  const xValues = getUniqueXAxisCategories(dataSetXGroup);
  const yGroupNames = getUniqueXYValues(dataSetXYGroup, xValues);
  const GRAPH_COLOR = getGraphColorArrayName(sm?.length);
  let colorMapping;
  if (existingColorMapping) {
    colorMapping = existingColorMapping;
  } else {
    colorMapping = generateColorMap(yGroupNames, GRAPH_COLOR);
  }

  const restData = buildRestDataSet({
    dataSetXGroup,
    selectedMetrics,
    xValues,
    selectedSignals,
    duration,
  });

  let series = [];
  selectedMetrics.forEach((metrics, smIndex) => {
    firstAxis = firstAxis === '' ? metrics.yAxisPosition : firstAxis;
    const graphType = getGraphType(metrics.defaultGraphType);
    if (metrics.type === 'simple') {
      const [signalName, metric] = metrics.measurement.split('.');
      const tempSeries = [];
      yGroupNames?.forEach((val) => {
        const data = xValues?.map((cat) => {
          const data =
            dataSetXYGroup?.[signalName]?.[metric]?.[cat]?.[val] === undefined
              ? 0
              : dataSetXYGroup?.[signalName]?.[metric]?.[cat]?.[val];
          if (restData?.[metrics?.as]?.[cat] && data) {
            restData[metrics?.as][cat] = restData?.[metrics?.as]?.[cat] - data;
          }
          return data;
        });
        tempSeries.push({
          name: val?.toString(),
          data,
          stack: metrics.as,
          unitDisplayName: metrics?.unitDisplayName,
          unitDisplayPosition: metrics?.unitDisplayPosition,
          showInLegend: false,
          yAxis: metrics.yAxisPosition === firstAxis ? 0 : 1,
          color: colorMapping?.[val]?.[smIndex],
          type: graphType,
          ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
          ...((graphType === 'column' || graphType === 'areaspline') && {
            stacking: 'normal',
          }),
        });
      });
      series.push(...sortSeries(tempSeries));
    } else if (metrics.type === 'derived') {
      const terms = getMetricsFromDerivedMetric({
        metric: metrics?.measurement,
        entities: selectedSignals,
        type: 'signal',
      });

      const tempSeries = [];
      yGroupNames?.forEach((group) => {
        const data = xValues?.map((xValue) => {
          const evalResult = evaluateDerivedMetrics({
            formula: metrics?.measurement,
            terms,
            windowSize: duration,
            fetchValue: (term) => {
              const [signalName, metric] = term?.split('.');
              return dataSetXYGroup?.[signalName]?.[metric]?.[xValue]?.[group];
            },
          });
          if (restData[metrics?.as][xValue] && evalResult) {
            // TODO: This is not correct for non-linear measurement such as min and max
            restData[metrics?.as][xValue] -= evalResult;
          }
          return evalResult;
        });
        tempSeries.push({
          name: group?.toString(),
          data,
          stack: metrics.as,
          unitDisplayName: metrics?.unitDisplayName,
          unitDisplayPosition: metrics?.unitDisplayPosition,
          showInLegend: false,
          yAxis: metrics.yAxisPosition === firstAxis ? 0 : 1,
          color: colorMapping?.[group]?.[smIndex],
          type: graphType,
          ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
          ...((graphType === 'column' || graphType === 'areaspline') && {
            stacking: 'normal',
          }),
        });
      });
      series.push(...sortSeries(tempSeries));
    }
  });

  let shouldShowRestValues = false;
  selectedMetrics.forEach((sm, smIndex) => {
    const data = xValues.reduce((acc, uc) => {
      if (restData[sm.as]?.[uc] && restData[sm.as]?.[uc] > 0) {
        acc.push(restData[sm.as]?.[uc]);
        shouldShowRestValues = true;
      } else {
        acc.push(0);
      }
      return acc;
    }, []);

    const graphType = getGraphType(sm?.defaultGraphType);
    shouldShowRestValues &&
      series.push({
        name: sm.as + ' - THE REST',
        data,
        stack: sm.as,
        unitDisplayName: sm?.unitDisplayName,
        unitDisplayPosition: sm?.unitDisplayPosition,
        yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
        showInLegend: true,
        color: REST_GRADIENT[smIndex % REST_GRADIENT.length],
        type: graphType,
        ...(graphType === 'areaspline' && { fillOpacity: 0.6 }),
        ...((graphType === 'column' || graphType === 'areaspline') && {
          stacking: 'normal',
        }),
      });
  });

  const yAxis = getYAxisValues(selectedMetrics, colors);
  let cyclicalResp;
  if (cyclicalData && cyclicalComparisonStart !== null && sm.length === 1) {
    cyclicalResp = getGroupByXAndYAxis({
      graphData: cyclicalData,
      selectedMetrics: sm,
      selectedSignals,
      signalDataOrder,
      cyclicalData: null,
      existingColorMapping: colorMapping,
      duration,
    });

    const cyclicalCategories = cyclicalResp?.xAxis?.categories;
    cyclicalResp.series.forEach((ser) => {
      const cyclicalSeriesData = {};
      ser?.data.forEach((d, dataIndex) => {
        cyclicalSeriesData[cyclicalCategories[dataIndex]] = d;
      });
      let hasCCData = false;
      const newDataOrder = [];
      xValues.forEach((cat) => {
        if (cyclicalSeriesData?.[cat]) {
          newDataOrder.push(cyclicalSeriesData[cat]);
          hasCCData = true;
        } else {
          newDataOrder.push(0);
        }
      });
      ser.data = newDataOrder;
      ser.stack = `Cyclical Comparison: ${sm?.[0].as}`;
      ser.opacity = 0.7;

      ser.unitDisplayName = sm?.[0]?.unitDisplayName;
      ser.unitDisplayPosition = sm?.[0]?.unitDisplayPosition;
      if (ser.name.endsWith('THE REST')) {
        ser.name = ser.name + ' - cyclical';
      }
      hasCCData && series.push(ser);
    });
  }

  sortXAxis(series, xValues);

  series = handleBubblePlot(series, xValues);

  series = handlePercentageData(selectedMetrics, series);

  return {
    title: {
      text: '',
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: xValues,
    },

    yAxis,

    tooltip: {
      useHTML: true,
      formatter: function () {
        if (this.series?.userOptions?.type === 'column') {
          const tooltipHeader = this.series?.userOptions?.stack
            ? this.series.userOptions.stack
            : '';
          return (
            '<b>' +
            tooltipHeader +
            '</b><br/>Y: <b>' +
            this.series.name +
            '</b><br/>X: <b>' +
            this.x +
            '</b><br/>' +
            'Value: <b>' +
            generateTooltipNumber(
              this.y,
              this?.series?.userOptions?.unitDisplayName,
              this?.series?.userOptions?.unitDisplayPosition,
            ) +
            '</b> (' +
            ((this.y / this.point.stackTotal) * 100).toFixed(1) +
            '%)<br/>' +
            'Total: <b>' +
            generateTooltipNumber(
              this.point.stackTotal,
              this?.series?.userOptions?.unitDisplayName,
              this?.series?.userOptions?.unitDisplayPosition,
            ) +
            '</b>'
          );
        }
        if (
          this.series?.userOptions?.type === 'spline' ||
          this.series?.userOptions?.type === 'areaspline'
        ) {
          const tooltipHeader = this.series?.userOptions?.stack
            ? this.series.userOptions.stack
            : '';
          return (
            '<b>' +
            tooltipHeader +
            '</b><br/>Y: <b>' +
            this.series.name +
            '</b><br/>X: <b>' +
            this.x +
            '</b><br/>' +
            'Value: <b>' +
            generateTooltipNumber(
              this.y,
              this?.series?.userOptions?.unitDisplayName,
              this?.series?.userOptions?.unitDisplayPosition,
            ) +
            '</b><br/>'
          );
        }

        if (
          this.series?.userOptions?.type === 'packedbubble' &&
          this.point.leaf
        ) {
          return this.point.name + ' : ' + this.point.value;
        }
        if (this.series?.userOptions?.type === 'packedbubble') {
          return this.series.userOptions.name;
        }

        return '';
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        borderRadius: 2,
        maxPointWidth: 20,
      },
      areaspline: {
        lineWidth: 0,
      },
      packedbubble: {
        minSize: '10%',
        maxSize: '90%',
        layoutAlgorithm: {
          gravitationalConstant: 0.07,
          splitSeries: true,
          bubblePadding: 2,
        },
        marker: {
          lineWidth: 0,
          lineColor: null,
        },
        dataLabels: {
          // enabled: true,
          // formatter: function () {
          //   if (this.point.name.length > 8) {
          //     return this.point.name.slice(0, 7) + '...';
          //   } else {
          //     return this.point.name;
          //   }
          // },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal',
          },
        },
      },
    },
    series,
  };
};

const handleBubblePlot = (series, uniqueCategories) => {
  let bubbleOuter = uniqueCategories.reduce((acc, cat, index) => {
    acc[cat] = {
      name: cat,
      data: [],
      color: COLOR_GRADIENT[index % COLOR_GRADIENT.length][1],
      borderWidth: 0,
    };
    return acc;
  }, {});

  const newSeries = series.filter((ser) => {
    if (ser.type === 'packedbubble') {
      ser.data.forEach((dt, index) => {
        if (dt && dt > 0) {
          bubbleOuter[uniqueCategories[index]].data.push({
            name: ser.name.includes('THE REST')
              ? ser.name
              : ser.stack + ' - ' + ser.name,
            value: dt,
            leaf: true,
            cat: ser.stack,
          });
        }
      });
      return false;
    }
    return true;
  });

  uniqueCategories.forEach((cat) => {
    bubbleOuter[cat] &&
      bubbleOuter[cat].data.length > 0 &&
      newSeries.push({
        type: 'packedbubble',
        ...bubbleOuter[cat],
      });
  });

  return newSeries;
};

export { getGroupByXAndYAxis, buildDataSetGrpX };
