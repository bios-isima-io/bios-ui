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
import { cloneDeep } from 'lodash';
import { COLOR_GRADIENT, COLOR_LIST } from '../../colors';
import { getSeriesDataDerived } from './getDerivedMetricsData';
import { shouldFetchSampleCount } from '../../reducers/buildQuery/getDataNoGroupBy';
import { buildDataSetNoGroupByNormalFlow } from './dataNormalFlow';

function getSeriesDataForSection({
  otherCount,
  data,
  chartType,
  selectedFilters,
}) {
  let seriesData = data?.map((d, i) => {
    if (chartType === 'pie' || chartType === 'donut') {
      return {
        name: d[0].toString(),
        y: d[1],
        color: COLOR_GRADIENT[0][i] % COLOR_GRADIENT[0].length,
      };
    } else if (chartType === 'bar') {
      return [d[0].toString(), d[1]];
    } else {
      return {
        name: d[0]?.toString(),
        value: d[1],
      };
    }
  });
  if (Object.keys(selectedFilters).length === 0 && otherCount) {
    if ((chartType === 'pie' || chartType === 'donut') && otherCount > 0) {
      seriesData?.push({ name: 'other', y: otherCount });
    } else if (chartType === 'bar') {
      // do not add others
    } else {
      seriesData?.push({ name: 'other', value: otherCount });
    }
  }
  return seriesData;
}

const buildDataSetNoGroupBy = ({
  contextDataOrder,
  graphData,
  groupByX,
  chartType,
  selectedFilters,
  selectedMetrics,
  selectedContexts,
  topX,
  contextCountTotal,
}) => {
  if (selectedMetrics?.length === 0) {
    return { series: [] };
  }

  let maxDataPointsAllowed = topX;
  if (selectedMetrics?.[0]?.type === 'derived') {
    const dataSet = {};
    const dataAnalysis = {};
    const dataTotal = {};

    contextDataOrder?.forEach((context, index) => {
      dataAnalysis[context] = {};
      dataAnalysis[context]['datapoints'] = graphData?.[index]?.entries?.length;
      graphData?.[index]?.entries?.forEach((entry, entryIndex) => {
        const groupByXValue = entry?.['_sample'];
        if (
          Object.keys(selectedFilters).length > 0 &&
          selectedFilters?.[groupByX] &&
          !selectedFilters?.[groupByX].includes(groupByXValue)
        ) {
          return;
        }

        if (!dataSet?.[groupByXValue]) {
          dataSet[groupByXValue] = {};
        }
        Object.keys(entry).forEach((k) => {
          if (k !== '_sample' && k !== '_sampleLength') {
            if (entryIndex < maxDataPointsAllowed) {
              dataSet[groupByXValue][`${context}.${k}`] = entry[k];
            }
            if (dataTotal?.[`${context}.${k}`]) {
              dataTotal[`${context}.${k}`] =
                dataTotal[`${context}.${k}`] + entry[k];
            } else {
              dataTotal[`${context}.${k}`] = entry[k];
            }
          }
        });
      });
    });

    const showDataPoints = maxDataPointsAllowed;
    const newDataTotal = cloneDeep(dataTotal);

    let seriesDerived = getSeriesDataDerived({
      dataSet,
      selectedMetrics,
      selectedContexts,
      graphData,
      groupByX,
      showDataPoints,
      newDataTotal,
      selectedFilters,
    });

    return { series: seriesDerived };

    // end of new derived logic
  }
  let otherCount = contextCountTotal;
  let addedEntryCount = 0;
  const data = graphData?.[0]?.entries.reduce((acc, entry, entryIndex) => {
    const groupByXValue = entry?.['_sample'];

    if (
      Object.keys(selectedFilters).length > 0 &&
      selectedFilters?.[groupByX]
    ) {
      if (selectedFilters?.[groupByX].includes(groupByXValue)) {
        acc.push([groupByXValue, entry['_sampleCount']]);
      }
      return acc;
    }

    // for no filters
    if (addedEntryCount < maxDataPointsAllowed) {
      acc.push([groupByXValue, entry['_sampleCount']]);
      addedEntryCount = addedEntryCount + 1;
      otherCount = otherCount - entry['_sampleCount'];
    }

    return acc;
  }, []);

  data?.sort(function (a, b) {
    return b[1] - a[1];
  });

  let series = getSeriesDataForSection({
    otherCount,
    data,
    chartType,
    selectedFilters,
  });

  return { series };
};

const getGraphDataNoGroupBy = (data) => {
  const {
    graphData,
    contextDataOrder,
    selectedContexts,
    groupByX,
    contextSynopsis,
    selectedFilters,
    selectedMetrics,
    topX,
    contextCountTotal,
  } = data;
  const chartType = selectedMetrics?.[0]?.defaultGraphType;

  const fetchSampleCount = shouldFetchSampleCount({ selectedMetrics });
  let series = [];

  if (fetchSampleCount) {
    ({ series } = buildDataSetNoGroupBy({
      selectedContexts,
      contextDataOrder,
      graphData,
      groupByX,
      contextSynopsis,
      selectedMetrics,
      chartType,
      selectedFilters,
      topX,
      contextCountTotal,
    }));
  } else {
    ({ series } = buildDataSetNoGroupByNormalFlow({
      selectedContexts,
      contextDataOrder,
      graphData,
      groupByX,
      contextSynopsis,
      selectedMetrics,
      chartType,
      selectedFilters,
      topX,
    }));
  }

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
        series: {
          borderRadius: 2,
          maxPointWidth: 20,
        },
        ...(chartType === 'donut' && {
          series: {
            type: 'pie',
            size: '100%',
            innerSize: '50%',
          },
        }),
        pie: {
          size: '78%',
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          colors: COLOR_LIST,
        },
      },
      series: [
        {
          name: series?.[0]?.name,
          colorByPoint: true,
          data: series,
          ...(chartType === 'donut' && {
            dataLabels: {
              format:
                '<span><b>{point.name}: </b>{y} ({point.percentage:.1f}%)</span>',
              style: { fontWeight: 'normal' },
            },
          }),
        },
      ],
    };
  }
  if (chartType === 'treemap') {
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
      plotOptions: {
        column: {
          showInLegend: false,
        },
        series: {
          borderRadius: 2,
          maxPointWidth: 20,
        },
      },
      title: {
        text: '',
      },
      chart: {
        type: 'column',
      },
      series: [
        {
          name: groupByX,
          data: series,
          color: COLOR_LIST[0],
        },
      ],
      xAxis: { type: 'category' },
    };
  }
};

export { getGraphDataNoGroupBy, buildDataSetNoGroupBy };
