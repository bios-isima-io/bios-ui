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
import { COLOR_LIST } from '../../colors';
import { buildDonutSimpleMetric } from './buildDonutSimpleMetric';
import { buildTreeMapSimpleMetric } from './buildTreeMapSimpleMetric';
import { buildBarSimpleMetric } from './buildBarSimpleMetric';
import { generateDerivedMetricData } from './generateDerivedMetricData';

export const handleOthersInData = ({
  dataValues,
  dataGroupByX,
  measurement,
  topX,
  topY,
}) => {
  let newDataValues = {};
  let newDataGroupByX = {};
  let othersLimit = topX;
  let othersLimitLevel2 = topY;

  // level 1 computation
  const groupByXSorted = Object.entries(dataGroupByX).sort(
    ([, a], [, b]) => b - a,
  );

  if (groupByXSorted?.length > othersLimit) {
    groupByXSorted.forEach((d, index) => {
      if (index < othersLimit) {
        newDataGroupByX[d[0]] = d[1];
      } else {
        newDataGroupByX['other'] = newDataGroupByX['other']
          ? newDataGroupByX['other'] + d[1]
          : d[1];
      }
    });
  } else {
    newDataGroupByX = dataGroupByX;
  }

  // level 2 computation
  Object.keys(newDataGroupByX).forEach((elem) => {
    if (elem === 'other') {
      newDataValues['other'] = {};
      newDataValues['other']['other'] = {};
      newDataValues['other']['other'][measurement] = newDataGroupByX['other'];
    } else {
      newDataValues[elem] = {};
      const groupByXYSorted = Object.entries(dataValues?.[elem]).sort(
        ([, a], [, b]) => b?.[measurement] - a?.[measurement],
      );
      if (groupByXYSorted?.length > othersLimitLevel2) {
        let othersTotal = 0;
        groupByXYSorted.forEach((d, index) => {
          if (index < othersLimitLevel2) {
            newDataValues[elem][d[0]] = d[1];
          } else {
            othersTotal = othersTotal + d[1]?.[measurement];
          }
        });

        if (othersTotal > 0) {
          newDataValues[elem]['other'] = { [measurement]: othersTotal };
        }
      } else {
        newDataValues[elem] = dataValues[elem];
      }
    }
  });
  return { dataValues: newDataValues, dataGroupByX: newDataGroupByX };
};

const generateBasicMetricData = ({
  contextDataOrder,
  graphData,
  groupByX,
  groupByY,
  selectedFilters,
  selectedMetrics,
  topX,
  topY,
}) => {
  let dataValues = {};
  let dataGroupByX = {};

  const hasGroupByXFilter = selectedFilters[groupByX] !== undefined;
  const hasGroupByYFilter = selectedFilters[groupByY] !== undefined;

  contextDataOrder?.forEach((context, index) => {
    graphData?.[index]?.entries?.forEach((entry, entryIndex) => {
      const groupByXValue = entry?.[groupByX];
      const groupByYValue = entry?.[groupByY];
      const shouldIgnoreEntry =
        (hasGroupByXFilter &&
          !selectedFilters[groupByX].includes(groupByXValue)) ||
        (hasGroupByYFilter &&
          !selectedFilters[groupByY].includes(groupByYValue));

      Object.keys(entry).forEach((k) => {
        if (k !== groupByX && k !== groupByY && !shouldIgnoreEntry) {
          if (!dataValues?.[groupByXValue]) {
            dataValues[groupByXValue] = {};
          }
          if (!dataGroupByX?.[groupByXValue]) {
            dataGroupByX[groupByXValue] = entry[k];
          } else {
            dataGroupByX[groupByXValue] =
              dataGroupByX[groupByXValue] + entry[k];
          }

          if (!dataValues?.[groupByXValue]?.[groupByYValue]) {
            dataValues[groupByXValue][groupByYValue] = {};
          }
          dataValues[groupByXValue][groupByYValue][context + '.' + k] =
            entry[k];
        }
      });
    });
  });

  const { measurement, defaultGraphType, type } = selectedMetrics?.[0];

  const showOthers = !hasGroupByXFilter || !hasGroupByYFilter;
  if (showOthers) {
    ({ dataGroupByX, dataValues } = handleOthersInData({
      dataValues,
      dataGroupByX,
      measurement,
      graphType: defaultGraphType,
      topX,
      topY,
    }));
  }

  if (defaultGraphType === 'treemap') {
    let series;
    if (type === 'simple') {
      series = buildTreeMapSimpleMetric({
        dataValues,
        selectedFilters,
        metric: measurement,
        groupByX,
        groupByY,
      });
    }
    return { series };
  }

  if (defaultGraphType === 'donut') {
    let series;
    if (type === 'simple') {
      series = buildDonutSimpleMetric({
        dataValues,
        selectedFilters,
        metric: measurement,
        groupByX,
        groupByY,
      });
    }
    return { series };
  }
  if (defaultGraphType === 'bar') {
    let series, categories;
    if (type === 'simple') {
      ({ series, categories } = buildBarSimpleMetric({
        dataValues,
        dataGroupByX,
        selectedFilters,
        metric: measurement,
        groupByX,
        groupByY,
      }));
    }
    return { series, categories };
  }
};

const buildDataSetGroupBy2 = ({
  contextDataOrder,
  graphData,
  groupByX,
  groupByY,
  chartType,
  selectedFilters,
  selectedMetrics,
  selectedContexts,
  topX,
  topY,
}) => {
  if (selectedMetrics?.length === 0) {
    return { series: [] };
  }

  if (selectedMetrics?.[0]?.type === 'simple') {
    return generateBasicMetricData({
      contextDataOrder,
      graphData,
      groupByX,
      groupByY,
      chartType,
      selectedFilters,
      selectedMetrics,
      selectedContexts,
      topX,
      topY,
    });
  }

  if (selectedMetrics?.[0]?.type === 'derived') {
    return generateDerivedMetricData({
      selectedContexts,
      contextDataOrder,
      graphData,
      groupByX,
      groupByY,
      chartType,
      selectedFilters,
      selectedMetrics,
      topX,
      topY,
    });
  }

  return { series: [] };
};

const getGraphDataGroupBy2 = (data) => {
  const {
    graphData,
    contextDataOrder,
    selectedContexts,
    groupByX,
    groupByY,
    contextSynopsis,
    selectedFilters,
    selectedMetrics,
    topX,
    topY,
  } = data;
  const chartType = selectedMetrics?.[0]?.defaultGraphType;

  let { series, categories } = buildDataSetGroupBy2({
    selectedContexts,
    contextDataOrder,
    graphData,
    groupByX,
    groupByY,
    contextSynopsis,
    selectedMetrics,
    chartType,
    selectedFilters,
    topX,
    topY,
  });

  if (chartType === 'pie' || chartType === 'donut') {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: '',
        align: 'left',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        ...(chartType === 'donut' && {
          pie: { shadow: false, center: ['50%', '50%'] },
        }),
      },
      series,
    };
  }
  if (chartType === 'treemap') {
    if (groupByX !== '' && groupByY !== '') {
      return {
        title: {
          text: '',
          align: 'left',
        },
        series,
      };
    }
    return {
      series: [
        {
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          clip: false,
          data: series,
          colorByPoint: true,
        },
      ],
      plotOptions: {
        treemap: {
          colors: COLOR_LIST,
        },
        series: {
          borderRadius: 2,
          maxPointWidth: 20,
        },
      },

      title: {
        text: '',
      },
    };
  }

  if (chartType === 'bar') {
    return {
      title: {
        text: '',
      },
      chart: {
        type: 'column',
      },
      series,
      xAxis: {
        categories,
      },
      plotOptions: {
        column: {
          colors: COLOR_LIST,
          stacking: 'normal',
          showInLegend: false,
        },

        series: {
          borderRadius: 2,
          maxPointWidth: 20,
        },
      },
    };
  }
};

export { getGraphDataGroupBy2, buildDataSetGroupBy2 };
