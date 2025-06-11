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
  COLOR_INDEX_ORDER,
  CYCLICAL_COLOR,
  getGraphColorArrayName,
} from '../../colors';
import { reorderSMforMultipleAxis } from '../../utils';
import { buildBubbleDataSet, buildBubbleResp } from '../plot/bubble';
import {
  addMarkerRadius,
  generateTooltipNumber,
  handlePercentageCustomData,
} from '../utils';

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

const buildCategoryValueResp = (resp) => {
  const dataset = resp?.xAxis?.categories?.reduce((acc, category, index) => {
    if (resp?.series?.[0]?.data?.[index]) {
      acc[category] = resp?.series?.[0]?.data?.[index];
    } else {
      acc[category] = 0;
    }
    return acc;
  }, {});

  return dataset;
};

const buildPackedBubbleData = (categories, data, colorsMap, colorShadeMap) => {
  return categories.reduce((acc, cat, index) => {
    if (data[index] === undefined || data[index] === 0) {
      return acc;
    }
    let color = null;
    if (cat in colorShadeMap) {
      colorShadeMap[cat] = (colorShadeMap[cat] + 1) % COLOR_GRADIENT[0].length;
    } else {
      colorShadeMap[cat] = 0;
      colorsMap[cat] =
        (Object.keys(colorShadeMap).length - 1) % COLOR_GRADIENT.length;
    }

    color =
      COLOR_GRADIENT[colorsMap[cat]][COLOR_INDEX_ORDER[colorShadeMap[cat]]];

    const resp = {
      name: cat,
      value: data[index],
      color,
      dataLabels: {
        style: {
          color: 'black',
          textOutline: 'none',
          fontWeight: 'normal',
        },
      },
    };
    acc.push(resp);
    return acc;
  }, []);
};

const getGroupByXAxis = (data) => {
  const {
    graphData,
    selectedMetrics: sm,
    signalDataOrder,
    selectedSignals,
    cyclicalData,
    duration,
  } = data;

  const isPackedBubble =
    sm.some((sm) => sm.defaultGraphType === 'packedbubble') &&
    (sm.length === 3 || sm.length === 2);
  const colorShadeMap = {}; // for bubble chart
  const colorsMap = {}; // for bubble chart
  const selectedMetrics = reorderSMforMultipleAxis(sm);
  const colors = getGraphColorArrayName(1);

  let firstAxis = '';
  const dataSetByCategories = {};
  let categories = [];
  signalDataOrder?.forEach((signal, signalIndex) => {
    const sq = graphData?.[signalIndex];
    sq?.dataWindows?.[0]?.records?.forEach((record) => {
      const category = record?.[0] ?? '?';
      if (categories.indexOf(category) < 0) {
        categories.push(record[0]);
      }
      for (var index = 1; index < record.length; ++index) {
        const metricName = signal + '.' + sq?.definitions?.[index]?.name;
        if (dataSetByCategories[category] === undefined) {
          dataSetByCategories[category] = {};
        }
        dataSetByCategories[category][metricName] = record[index];
      }
    });
  });

  const series = selectedMetrics.map((sm, smIndex) => {
    firstAxis = firstAxis === '' ? sm.yAxisPosition : firstAxis;
    let type =
      sm.defaultGraphType === 'bar' ||
      sm.defaultGraphType === 'funnel' ||
      sm.defaultGraphType === 'treemap' ||
      sm.defaultGraphType === 'donut'
        ? 'column'
        : sm.defaultGraphType;
    type = type === 'line' ? 'spline' : type;
    type = type === 'area' ? 'areaspline' : type;
    type = type === 'packedbubble' ? 'packedbubble' : type;
    if (sm.type === 'simple') {
      let data = categories.map((category) => {
        return dataSetByCategories?.[category]?.[sm?.measurement] === undefined
          ? 0
          : dataSetByCategories?.[category]?.[sm?.measurement];
      });

      const resp = {
        name: sm.as,
        _measurement: sm.measurement,
        unitDisplayName: sm?.unitDisplayName,
        unitDisplayPosition: sm?.unitDisplayPosition,
        data,
        type,
        yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
        color: colors[smIndex % colors.length][0],
        tooltip: {
          useHTML: true,
          customTooltipPerSeries: function () {
            return (
              '<b>' +
              this.series.name +
              '</b></br>X: <b>' +
              this.x +
              '</b><br>Value: <b> ' +
              generateTooltipNumber(
                this.y,
                this?.series?.userOptions?.unitDisplayName,
                this?.series?.userOptions?.unitDisplayPosition,
              ) +
              '</b>'
            );
          },
        },
      };

      if (type === 'packedbubble') {
        data = buildPackedBubbleData(
          categories,
          data,
          colorsMap,
          colorShadeMap,
        );
        resp.tooltip = {
          useHTML: true,
          customTooltipPerSeries: function () {
            return (
              this.key +
              ': <b>' +
              generateTooltipNumber(
                this.y,
                this?.series?.userOptions?.unitDisplayName,
                this?.series?.userOptions?.unitDisplayPosition,
              ) +
              '</b>'
            );
          },
        };
        resp.data = data;
      }
      return resp;
    } else {
      const terms = getMetricsFromDerivedMetric({
        metric: sm?.measurement,
        entities: selectedSignals,
        type: 'signal',
      });

      const dataArray = categories.map((category) => {
        const value = evaluateDerivedMetrics({
          formula: sm?.measurement,
          terms,
          windowSize: duration,
          fetchValue: (term) => dataSetByCategories?.[category]?.[term],
        });
        return { category, value };
      });

      dataArray.sort(function (a, b) {
        return parseFloat(b.value) - parseFloat(a.value);
      });

      // rebuild data post sort
      categories = dataArray.reduce((acc, item) => {
        acc.push(item.category);
        return acc;
      }, []);
      data = dataArray.reduce((acc, item) => {
        acc.push(item.value);
        return acc;
      }, []);

      const resp = {
        name: sm.as,
        _measurement: sm.measurement,
        unitDisplayName: sm?.unitDisplayName,
        unitDisplayPosition: sm?.unitDisplayPosition,
        data,
        yAxis: sm.yAxisPosition === firstAxis ? 0 : 1,
        color: colors[smIndex % colors.length][0],
        type,
        tooltip: {
          useHTML: true,
          customTooltipPerSeries: function () {
            return (
              '<b>' +
              this.series.name +
              '</b></br>' +
              (this.x ? 'X: <b>' + this.x + '</b><br>' : '') +
              'Value: <b>' +
              generateTooltipNumber(
                this.y,
                this?.series?.userOptions?.unitDisplayName,
                this?.series?.userOptions?.unitDisplayPosition,
              ) +
              '</b>'
            );
          },
        },
      };

      if (type === 'packedbubble') {
        data = buildPackedBubbleData(
          categories,
          data,
          colorsMap,
          colorShadeMap,
        );
        resp.data = data;
        resp.tooltip = {
          useHTML: true,
          customTooltipPerSeries: function () {
            return (
              '<b>' +
              this.series.name +
              '</b><br>' +
              this.key +
              ': <b>' +
              generateTooltipNumber(
                this.y,
                this?.series?.userOptions?.unitDisplayName,
                this?.series?.userOptions?.unitDisplayPosition,
              ) +
              '</b>'
            );
          },
        };
      }
      return resp;
    }
  });

  if (isPackedBubble) {
    const dataSet = buildBubbleDataSet(series);
    return buildBubbleResp(sm, dataSet, colors);
  }

  if (
    cyclicalData &&
    sm.length === 1 &&
    sm?.[0]?.defaultGraphType !== 'packedbubble'
  ) {
    const cyclicalResp = getGroupByXAxis({
      graphData: cyclicalData,
      selectedMetrics: sm,
      selectedSignals,
      signalDataOrder,
      duration,
    });
    const dataset = buildCategoryValueResp(cyclicalResp);
    const dataListCyclical = [];
    let hasCCData = false;
    categories.forEach((category) => {
      if (dataset[category]) {
        dataListCyclical.push(dataset[category]);
        hasCCData = true;
      } else {
        dataListCyclical.push(0);
      }
    });

    let type =
      sm[0].defaultGraphType === 'bar' ? 'column' : sm[0].defaultGraphType;
    type = type === 'line' ? 'spline' : type;
    type = type === 'area' ? 'areaspline' : type;

    hasCCData &&
      series.push({
        name: `Cyclical Comparison: ${sm?.[0]?.as}`,
        unitDisplayName: sm?.[0]?.unitDisplayName,
        unitDisplayPosition: sm?.[0]?.unitDisplayPosition,
        data: dataListCyclical,
        type,
        yAxis: sm[0].yAxisPosition === firstAxis ? 0 : 1,
        color: CYCLICAL_COLOR,
        tooltip: {
          useHTML: true,
          customTooltipPerSeries: function () {
            return (
              '<b>' +
              this.series.name +
              '</b></br>' +
              (this.x ? 'X: <b>' + this.x + '</b><br>' : '') +
              'Value: <b>' +
              generateTooltipNumber(
                this.y,
                this?.series?.userOptions?.unitDisplayName,
                this?.series?.userOptions?.unitDisplayPosition,
              ) +
              '</b>'
            );
          },
        },
      });
  }
  let seriesWithUpdatedRadius = addMarkerRadius({ series, markerRadius: 1 });

  seriesWithUpdatedRadius = handlePercentageCustomData(
    selectedMetrics,
    seriesWithUpdatedRadius,
    'groupByX',
  );

  let packedbubbleMinSize = '30%';
  let packedbubbleMaxSize = '90%';
  if (seriesWithUpdatedRadius?.[0]?.data?.length < 5) {
    packedbubbleMinSize = '40%';
    packedbubbleMaxSize = '75%';
  }
  return {
    title: {
      text: '',
      useHTML: true,
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      categories,
      type: 'category',
    },
    yAxis: getYAxisValues(selectedMetrics, colors),
    series: seriesWithUpdatedRadius,
    tooltip: {
      useHTML: true,
      formatter: function () {
        if (this.series.tooltipOptions.customTooltipPerSeries) {
          return this.series.tooltipOptions.customTooltipPerSeries.call(this);
        }
      },
    },
    plotOptions: {
      series: {
        borderRadius: 2,
        maxPointWidth: 20,
      },
      areaspline: {
        lineWidth: 0,
      },
      packedbubble: {
        minSize: packedbubbleMinSize,
        maxSize: packedbubbleMaxSize,
        layoutAlgorithm: {
          initialPositions: 'random',
        },
      },
    },
  };
};

export { getGroupByXAxis };
