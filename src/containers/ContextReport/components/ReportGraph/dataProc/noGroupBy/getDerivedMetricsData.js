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
import { evaluate } from 'mathjs';
import { getMetricsFromDerivedMetric } from 'containers/ReportV2/utils/metricsRegex';

const evaluateDerivedMetrics = ({
  formula,
  terms,
  fetchValue,
  newDataTotal,
  groupByXValue,
}) => {
  if (!terms) {
    return 0;
  }
  let doesContainUndefined = false;
  terms.forEach((term) => {
    const newMetric = term.split('.')?.[0] + '._sampleCount';
    const value = fetchValue(groupByXValue, newMetric) ?? 0;

    if (value && newDataTotal?.[newMetric]) {
      newDataTotal[newMetric] = newDataTotal[newMetric] - value;
    }
    doesContainUndefined = doesContainUndefined || value === undefined;
    formula = formula.replace(term, value);
  });

  try {
    const result = evaluate(formula);
    if (
      doesContainUndefined ||
      isNaN(result) ||
      result === Infinity ||
      result === -Infinity
    ) {
      return 0;
    }
    return result;
  } catch (e) {
    return 0;
  }
};

function getSeriesDataForSection({ data, chartType }) {
  let seriesData = data?.map((d) => {
    if (chartType === 'pie' || chartType === 'donut') {
      return {
        name: d[0],
        y: d[1],
      };
    } else if (chartType === 'bar') {
      return [d[0], d[1]];
    } else {
      return {
        name: d[0],
        value: d[1],
      };
    }
  });
  return seriesData;
}

export const getSeriesDataDerived = ({
  dataSet,
  selectedMetrics,
  selectedContexts,
  graphData,
  groupByX,
  showDataPoints,
  newDataTotal,
  selectedFilters,
}) => {
  const terms = getMetricsFromDerivedMetric({
    metric: selectedMetrics?.[0]?.measurement,
    entities: selectedContexts,
    type: 'context',
  });

  const dataArray = graphData?.[0]?.entries?.reduce((acc, entry) => {
    const groupByXValue = entry?.['_sample'];
    if (
      Object.keys(selectedFilters).length > 0 &&
      selectedFilters?.[groupByX] &&
      !selectedFilters?.[groupByX].includes(groupByXValue)
    ) {
      return acc;
    }
    const value = evaluateDerivedMetrics({
      formula: selectedMetrics?.[0]?.measurement,
      terms,
      fetchValue: (groupByXValue, term) => dataSet?.[groupByXValue]?.[term],
      newDataTotal,
      groupByXValue: groupByXValue,
    });
    if (value !== 0) {
      acc.push([entry['_sample'], value]);
    }
    return acc;
  }, []);

  if (
    showDataPoints < graphData?.[0]?.entries?.length &&
    selectedMetrics?.[0]?.defaultGraphType !== 'bar'
  ) {
    // rest
    let formula = selectedMetrics?.[0]?.measurement;
    let result = 0;

    terms.forEach((term) => {
      const value = newDataTotal[term.split('.')?.[0] + '._sampleCount'];
      let doesContainUndefined = false;
      doesContainUndefined = doesContainUndefined || value === undefined;
      formula = formula.replace(term, value);
      try {
        result = evaluate(formula);
        if (
          doesContainUndefined ||
          isNaN(result) ||
          result === Infinity ||
          result === -Infinity
        ) {
          result = 0;
        }
      } catch (e) {
        result = 0;
      }
    });

    if (result !== 0) {
      dataArray.push(['other', result]);
    }
  }

  const resp = getSeriesDataForSection({
    data: dataArray,
    chartType: selectedMetrics?.[0]?.defaultGraphType,
    total: newDataTotal,
  });

  return resp;
};
