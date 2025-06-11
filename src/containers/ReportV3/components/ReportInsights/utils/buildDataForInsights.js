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
import shortid from 'shortid';

import {
  getDerivedMetricModifier,
  getSimpleMetricModifier,
} from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type/getMetricModifier';
import { getGroupByXAxis } from 'containers/ReportV2/components/ReportGraph/dataProc';
import {
  buildDataSetNoGroupBy,
  getGraphDataNoGroupBy,
} from 'containers/ReportV2/components/ReportGraph/dataProc/noGroupBy/data';
import { positionModifier } from 'containers/ReportV2/components/ReportGraph/dataProc/utils';
import numberFormatter from 'utils/numberFormatter';

const getGroupByXDataset = (signalDataOrder, sqData) => {
  const dataSetXGroup = {};
  signalDataOrder?.forEach((signal, i) => {
    sqData?.[i]?.dataWindows?.[0]?.records?.forEach((record) => {
      sqData?.[i]?.definitions?.forEach((def, defIndex) => {
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

const parseFloatCustom = (n) => {
  if (n && Number(n) === n && n % 1 !== 0) {
    n = parseFloat(n).toFixed(3);
  }
  return n;
};

const shouldRemoveDecimal = (num) => {
  if (num > 1 || num < -1) {
    if (num - Math.floor(num) !== 0) {
      return true;
    }
  }
  return false;
};

const buildDataForInsights = (reportInsights, metricsModifiers) => {
  let {
    signalDataOrder,
    metric,
    queryData,
    cyclicalData,
    duration,
    durationStart,
    windowSize,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    selectedSignals,
    timezone,
    groupByX,
  } = reportInsights;

  let isDerivedMetric = false;
  if (reportInsights.metric.type === 'derived') {
    isDerivedMetric = true;
  }
  const insightsBoxes = []; // {value: '', message: ''}

  let box1Value = null;
  let box1Hover = null;
  let box1Measurement = null;
  let dataPoints1 = 0;
  let box2Value = null;
  let box2Hover = null;
  let dataPoints2 = 0;
  let box3Value = null;
  let box3Hover = null;
  let box4Value = null;
  let box4Hover = null;

  if (metric.defaultGraphType === 'packedbubble') {
    metric = { ...metric };
    metric.defaultGraphType = 'bar';
  }
  if (groupByX === '' || groupByX === undefined) {
    const graphData = getGraphDataNoGroupBy({
      signalDataOrder,
      selectedMetrics: [metric],
      graphData: queryData,
      cyclicalData,
      duration,
      durationStart,
      windowSize,
      cyclicalComparisonStart,
      cyclicalComparisonCustom,
      selectedSignals,
      timezone,
    });

    box1Hover = graphData?.series?.[1]?.name;
    box1Measurement =
      graphData?.series?.[1]?._measurement ?? graphData?.series?.[1]?.name;
    graphData?.series?.[1]?.data?.forEach((dt) => {
      if (!isNaN(dt[1]) && dt[1] !== 0) {
        box1Value = box1Value + dt[1];
        dataPoints1++;
      }
    });

    box2Hover = graphData?.series?.[0]?.name;
    graphData?.series?.[0]?.data?.forEach((dt) => {
      if (!isNaN(dt[1]) && dt[1] !== 0) {
        box2Value = box2Value + dt[1];
        dataPoints2++;
      }
    });

    let dataSet = buildDataSetNoGroupBy({
      signalDataOrder,
      graphData: queryData,
    });
    for (const ts in dataSet) {
      for (const metric in dataSet[ts]) {
        if (metric.endsWith('count()')) {
          box4Value = box4Value + dataSet[ts][metric];
        }
      }
    }
    if (shouldRemoveDecimal(box4Value)) {
      box4Value = parseFloatCustom(box4Value);
    }
  } else {
    const graphData = getGroupByXAxis({
      graphData: queryData,
      selectedMetrics: [metric],
      signalDataOrder,
      selectedSignals,
      cyclicalData,
      cyclicalComparisonStart,
      cyclicalComparisonCustom,
      duration,
    });

    box1Hover = graphData?.series?.[0]?.name;
    box1Measurement =
      graphData?.series?.[0]?._measurement ?? graphData?.series?.[0]?.name;
    graphData?.series?.[0]?.data?.forEach((dt) => {
      if (!isNaN(dt) && dt !== 0) {
        box1Value = box1Value + dt;
        dataPoints1++;
      }
    });
    box2Hover = graphData?.series?.[1]?.name;
    graphData?.series?.[1]?.data?.forEach((dt) => {
      if (!isNaN(dt) && dt !== 0) {
        box2Value = box2Value + dt;
        dataPoints2++;
      }
    });
    let dataSet = getGroupByXDataset(signalDataOrder, queryData);
    for (const signal in dataSet) {
      for (const metric in dataSet[signal]) {
        if (metric === 'count()') {
          for (const item in dataSet[signal][metric]) {
            box4Value = box4Value + dataSet[signal][metric][item];
          }
        }
      }
    }
    if (shouldRemoveDecimal(box4Value)) {
      box4Value = parseFloatCustom(box4Value);
    }
  }

  if (isDerivedMetric && dataPoints1 > 0) {
    box1Value = box1Value / dataPoints1;
  }
  if (isDerivedMetric && dataPoints2 > 0) {
    box2Value = box2Value / dataPoints2;
  }

  if (!isNaN(box2Value) && !isNaN(box1Value)) {
    box3Value = ((box1Value - box2Value) / box2Value) * 100;
    box3Value = parseFloatCustom(box3Value);
    if (box3Value === null || isNaN(box3Value) || box3Value === 'Infinity') {
      box3Value = '-';
    }
  }

  if (shouldRemoveDecimal(box1Value)) {
    box1Value = parseFloatCustom(box1Value);
  }
  {
    let unitDisplayName = '';
    let unitDisplayPosition = '';
    if (isDerivedMetric) {
      ({ unitDisplayName, unitDisplayPosition } = getDerivedMetricModifier(
        reportInsights.selectedSignals,
        reportInsights?.metric?.measurement,
        metricsModifiers,
      ));
    } else {
      ({ unitDisplayName, unitDisplayPosition } = getSimpleMetricModifier(
        reportInsights.selectedSignals,
        box1Measurement,
        metricsModifiers,
      ));
    }

    box1Value = numberFormatter(box1Value, 3);
    if (unitDisplayName !== '' && unitDisplayPosition !== '') {
      box1Value = positionModifier({
        unitDisplayName,
        unitDisplayPosition,
        number: box1Value,
      });
    }
  }

  if (shouldRemoveDecimal(box2Value)) {
    box2Value = parseFloatCustom(box2Value);
  }
  {
    let unitDisplayName = '';
    let unitDisplayPosition = '';
    if (isDerivedMetric) {
      ({ unitDisplayName, unitDisplayPosition } = getDerivedMetricModifier(
        reportInsights.selectedSignals,
        reportInsights?.metric?.measurement,
        metricsModifiers,
      ));
    } else {
      ({ unitDisplayName, unitDisplayPosition } = getSimpleMetricModifier(
        reportInsights.selectedSignals,
        box1Measurement,
        metricsModifiers,
      ));
    }
    box2Value = parseFloatCustom(box2Value);
    box2Value = numberFormatter(box2Value, 3);

    if (unitDisplayName !== '' && unitDisplayPosition !== '') {
      box2Value = positionModifier({
        unitDisplayName,
        unitDisplayPosition,
        number: box2Value,
      });
    }
  }

  box4Hover = '';
  box4Value = numberFormatter(box4Value, 3);
  box4Value = parseFloatCustom(box4Value);
  box4Value = '# ' + box4Value;

  insightsBoxes.push({
    message: isDerivedMetric ? 'Average' : 'Total',
    value: box1Value === '' ? '-' : box1Value,
    hover: box1Hover,
    _id: shortid(),
  });
  insightsBoxes.push({
    message: isDerivedMetric ? 'Cyclical average' : 'Cyclical total',
    value: box2Value === '' ? '-' : box2Value,
    hover: box2Hover,
    _id: shortid(),
  });
  insightsBoxes.push({
    message: '% change',
    value: box3Value === '' ? '-' : box3Value,
    hover: box3Hover,
    _id: shortid(),
  });
  insightsBoxes.push({
    message: 'Data points',
    value: box4Value === '' ? '-' : box4Value,
    hover: box4Hover,
    _id: shortid(),
  });
  return insightsBoxes;
};

export { buildDataForInsights };
