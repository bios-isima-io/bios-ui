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
import moment from 'moment';

const checkIfSimpleMetric = (sm) => sm?.[0]?.type === 'simple';

const getPositiveIndicator = (selectedMetric, positiveIndicatorMap) => {
  if (!checkIfSimpleMetric(selectedMetric)) {
    return '';
  }
  const measurement = selectedMetric?.[0]?.measurement;
  if (!measurement) {
    return '';
  }
  const signalName = measurement?.substring(0, measurement.lastIndexOf('.'));
  const attribute = measurement?.substring(
    measurement.indexOf('(') + 1,
    measurement.lastIndexOf(')'),
  );
  if (!attribute || attribute === '') {
    return '';
  }

  if (
    positiveIndicatorMap?.[signalName]?.[attribute] &&
    positiveIndicatorMap?.[signalName]?.[attribute] !== ''
  ) {
    return positiveIndicatorMap?.[signalName]?.[attribute];
  }

  return '';
};

const noGrpByDataForCyclicalSeries = (data, isDerivedMetric) => {
  let count = 'NA';
  let numOfDataPoints = 0;
  data?.forEach((d) => {
    if (count === 'NA') {
      count = 0;
    }
    if (d?.[1] && d?.[1] !== 0) {
      count = count + d[1];
      numOfDataPoints = numOfDataPoints + 1;
    }
  });
  if (isDerivedMetric && count !== 0 && count !== 'NA') {
    count = count / numOfDataPoints;
  }
  return count;
};

const generateDataForCardNoGroupBy = (
  plotData,
  windowSize,
  selectedFilters,
  isDerivedMetric,
  selectedMetrics,
  positiveIndicatorMap,
) => {
  let count = 'NA';
  let lastTimeStamp = 'NA';
  let numOfDataPoints = 0;
  const trendLineArray = [];
  const hasFilter = Object.keys(selectedFilters).length > 0 ? true : false;
  plotData?.series?.[1]?.data?.forEach((d) => {
    if (count === 'NA') {
      count = 0;
    }
    if (d?.[1] && d?.[1] !== 0) {
      count = count + d[1];
      numOfDataPoints = numOfDataPoints + 1;
      trendLineArray.push(d[1]);
    }

    if (d?.[0]) {
      lastTimeStamp = d[0];
    }
  });

  if (plotData?.series?.[1]?.data?.length === 0) {
    count = 0;
    lastTimeStamp = moment().valueOf();
  }

  if (isDerivedMetric && count !== 0 && count !== 'NA') {
    count = count / numOfDataPoints;
  }

  const cyclicalCount = noGrpByDataForCyclicalSeries(
    plotData?.series?.[0]?.data,
    isDerivedMetric,
  );

  let cyclicalPercentageChange = null;
  if (!isNaN(count) && !isNaN(cyclicalCount)) {
    cyclicalPercentageChange = ((count - cyclicalCount) / cyclicalCount) * 100;
    if (
      cyclicalPercentageChange &&
      Number(cyclicalPercentageChange) === cyclicalPercentageChange &&
      cyclicalPercentageChange % 1 !== 0
    ) {
      cyclicalPercentageChange = parseFloat(cyclicalPercentageChange).toFixed(
        3,
      );
    }
    if (cyclicalPercentageChange === null || isNaN(cyclicalPercentageChange)) {
      cyclicalPercentageChange = '-';
    }
  }

  const indicator = getPositiveIndicator(selectedMetrics, positiveIndicatorMap);

  return {
    count,
    cyclicalCount,
    cyclicalPercentageChange,
    lastTimeStamp,
    trendLineArray,
    hasFilter,
    indicator,
  };
};

const generateCardDataError = (error) => {
  return {
    count: 'NA',
    lastTimeStamp: 'NA',
    trendLineArray: [],
    hasFilter: false,
    error,
  };
};

const grpXByDataForCyclicalSeries = (data, isDerivedMetric) => {
  let count = 'NA';
  let numOfDataPoints = 0;
  data?.forEach((d) => {
    if (count === 'NA') {
      count = 0;
    }
    if (d && d !== 0) {
      count = count + d;
      numOfDataPoints = numOfDataPoints + 1;
    }
  });

  if (data?.length === 0) {
    count = 0;
  }

  if (isDerivedMetric && count !== 0 && count !== 'NA') {
    count = count / numOfDataPoints;
  }

  return count;
};
const generateDataForCardGroupByX = ({
  graphData,
  plotData,
  selectedFilters,
  isDerivedMetric,
  selectedMetrics,
  positiveIndicatorMap,
  duration,
}) => {
  let count = 'NA';
  let lastTimeStamp = 'NA';
  let numOfDataPoints = 0;
  const trendLineArray = [];
  const hasFilter = Object.keys(selectedFilters).length > 0 ? true : false;
  plotData?.series?.[0]?.data?.forEach((d) => {
    if (count === 'NA') {
      count = 0;
      lastTimeStamp = moment().valueOf();
    }
    if (d && d !== 0) {
      count = count + d;
      numOfDataPoints = numOfDataPoints + 1;
      trendLineArray.push(d);
    }
  });

  lastTimeStamp =
    graphData?.[0]?.dataWindows?.[graphData?.[0]?.dataWindows?.length - 1]
      ?.windowBeginTime + duration;

  if (plotData?.series?.[0]?.data?.length === 0) {
    count = 0;
    lastTimeStamp = moment().valueOf();
  }

  if (isDerivedMetric && count !== 0 && count !== 'NA') {
    count = count / numOfDataPoints;
  }

  const cyclicalCount = grpXByDataForCyclicalSeries(
    plotData?.series?.[1]?.data,
    isDerivedMetric,
  );

  let cyclicalPercentageChange = null;
  if (!isNaN(count) && !isNaN(cyclicalCount)) {
    cyclicalPercentageChange = ((count - cyclicalCount) / cyclicalCount) * 100;
    if (
      cyclicalPercentageChange &&
      Number(cyclicalPercentageChange) === cyclicalPercentageChange &&
      cyclicalPercentageChange % 1 !== 0
    ) {
      cyclicalPercentageChange = parseFloat(cyclicalPercentageChange).toFixed(
        3,
      );
    }
    if (cyclicalPercentageChange === null || isNaN(cyclicalPercentageChange)) {
      cyclicalPercentageChange = '-';
    }
  }

  const indicator = getPositiveIndicator(selectedMetrics, positiveIndicatorMap);

  return {
    count,
    cyclicalCount,
    cyclicalPercentageChange,
    lastTimeStamp,
    trendLineArray,
    hasFilter,
    indicator,
  };
};

export {
  generateDataForCardNoGroupBy,
  generateDataForCardGroupByX,
  generateCardDataError,
};
