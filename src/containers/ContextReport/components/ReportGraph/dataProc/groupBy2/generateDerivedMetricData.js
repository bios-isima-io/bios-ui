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
import { buildTreeMapSimpleMetric } from './buildTreeMapSimpleMetric';
import { buildDonutSimpleMetric } from './buildDonutSimpleMetric';
import { buildBarSimpleMetric } from './buildBarSimpleMetric';
import { handleOthersInData } from './data';
import { evaluate } from 'mathjs';

const evaluateDerivedMetrics = ({ formula, terms, fetchValue }) => {
  if (!terms) {
    return 0;
  }
  let doesContainUndefined = false;
  terms.forEach((term) => {
    const value = fetchValue(term) ?? 0;
    doesContainUndefined = value === undefined;
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

const buildMetricLegendSpecificData = ({
  dataValues,
  measurement,
  as,
  selectedContexts,
  dataGroupByX,
}) => {
  const terms = getMetricsFromDerivedMetric({
    metric: measurement,
    entities: selectedContexts,
    type: 'context',
  });

  for (var l1 in dataValues) {
    for (var l2 in dataValues?.[l1]) {
      const value = evaluateDerivedMetrics({
        formula: measurement,
        terms,
        fetchValue: (term) => dataValues?.[l1]?.[l2]?.[term],
      });
      dataValues[l1][l2][as] = value;
      if (!dataGroupByX?.[l1]) {
        dataGroupByX[l1] = value;
      } else {
        dataGroupByX[l1] = dataGroupByX[l1] + value;
      }
    }
  }
};

export const generateDerivedMetricData = ({
  selectedContexts,
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

          if (!dataValues?.[groupByXValue]?.[groupByYValue]) {
            dataValues[groupByXValue][groupByYValue] = {};
          }
          dataValues[groupByXValue][groupByYValue][context + '.' + k] =
            entry[k];
        }
      });
    });
  });
  const { measurement, defaultGraphType, as, type } = selectedMetrics?.[0];

  buildMetricLegendSpecificData({
    dataValues,
    measurement,
    as,
    selectedContexts,
    dataGroupByX,
  });

  const showOthers = !hasGroupByXFilter || !hasGroupByYFilter;
  if (showOthers) {
    ({ dataGroupByX, dataValues } = handleOthersInData({
      dataValues,
      dataGroupByX,
      measurement: as,
      graphType: defaultGraphType,
      topX,
      topY,
    }));
  }

  if (defaultGraphType === 'treemap') {
    let series;
    if (type === 'derived') {
      series = buildTreeMapSimpleMetric({
        dataValues,
        selectedFilters,
        metric: as,
        groupByX,
        groupByY,
      });
    }
    return { series };
  }

  if (defaultGraphType === 'donut') {
    let series;
    if (type === 'derived') {
      series = buildDonutSimpleMetric({
        dataValues,
        selectedFilters,
        metric: as,
        groupByX,
        groupByY,
      });
    }
    return { series };
  }
  if (defaultGraphType === 'bar') {
    let series, categories;
    if (type === 'derived') {
      ({ series, categories } = buildBarSimpleMetric({
        dataValues,
        dataGroupByX,
        selectedFilters,
        metric: as,
        groupByX,
        groupByY,
      }));
    }
    return { series, categories };
  }

  return { series: [], categories: [] };
};
