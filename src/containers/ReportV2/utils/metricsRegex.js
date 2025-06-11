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
const getAllMetricForSignalsRegex = (signals) => {
  const allowedMetrics = new Set();
  signals?.forEach((signal) => {
    signal?.availableAttributes?.forEach((attribute) => {
      allowedMetrics.add(`${signal.signalName}.count\\(\\)`);
      attribute?.mainMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        if (metric === 'count') {
          allowedMetrics.add(`${signal.signalName}.${metric}\\(\\)`);
        } else {
          allowedMetrics.add(
            `${signal.signalName}.${metric}\\(${attribute.attributeName}\\)`,
          );
          allowedMetrics.add(
            `${signal.signalName}.spread\\(${attribute.attributeName}\\)`,
          );
          allowedMetrics.add(
            `${signal.signalName}.distinctcounts\\(${attribute.attributeName}\\)`,
          );
        }
      });
      attribute?.remainingMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        allowedMetrics.add(
          `${signal.signalName}.${metric}\\(${attribute.attributeName}\\)`,
        );
      });
      attribute?.commonMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        allowedMetrics.add(
          `${signal.signalName}.${metric}\\(${attribute.attributeName}\\)`,
        );
        if (metric === 'distinctcount') {
          allowedMetrics.add(
            `${signal.signalName}.distinctcounts\\(${attribute.attributeName}\\)`,
          );
        }
      });
    });
  });
  return allowedMetrics;
};

const getAllMetricForEntities = ({ entities, type }) => {
  const allowedMetrics = new Set();
  let entityName = '';
  if (type === 'context') {
    entityName = 'contextName';
  } else {
    entityName = 'signalName';
  }
  entities?.forEach((entity) => {
    entity?.availableAttributes?.forEach((attribute) => {
      allowedMetrics.add(`${entity?.[entityName]}.count()`);
      attribute?.mainMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        if (metric === 'count') {
          allowedMetrics.add(`${entity?.[entityName]}.${metric}()`);
        } else {
          allowedMetrics.add(
            `${entity?.[entityName]}.${metric}(${attribute.attributeName})`,
          );
          allowedMetrics.add(
            `${entity?.[entityName]}.spread(${attribute.attributeName})`,
          );
          allowedMetrics.add(
            `${entity?.[entityName]}.distinctcounts(${attribute.attributeName})`,
          );
        }
      });
      attribute?.remainingMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        allowedMetrics.add(
          `${entity?.[entityName]}.${metric}(${attribute.attributeName})`,
        );
      });
      attribute?.commonMetrics?.forEach((metricItem) => {
        const metric = metricItem.toLowerCase();
        allowedMetrics.add(
          `${entity?.[entityName]}.${metric}(${attribute.attributeName})`,
        );
        if (metric === 'distinctcount') {
          allowedMetrics.add(
            `${entity?.[entityName]}.distinctcounts(${attribute.attributeName})`,
          );
        }
      });
    });
  });

  return allowedMetrics;
};

const getRegexForSignals = (signals) => {
  const allowedMetrics = getAllMetricForSignalsRegex(signals);
  let regex = [...allowedMetrics].join('|');
  return new RegExp('(?:' + regex + ')', 'g');
};

const getMetricsFromDerivedMetric = ({ metric, entities, type }) => {
  const allowedMetrics = getAllMetricForEntities({ entities, type });

  const reMeasurement = new RegExp(
    '([a-zA-Z0-9_]+)\\.([a-zA-Z0-9][a-zA-Z0-9_]+)\\(([a-zA-Z0-9_]*)\\)',
    'g',
  );
  const metricFromRegex = metric?.match(reMeasurement);
  return metricFromRegex?.filter((metric) => allowedMetrics?.has(metric));
};

const checkIfAllMetricPresent = ({ metric, entities, type }) => {
  const allowedMetrics = getAllMetricForEntities({ entities, type });
  const reMeasurement = new RegExp(
    '([a-zA-Z0-9_]+)\\.([a-zA-Z0-9][a-zA-Z0-9_]+)\\(([a-zA-Z0-9_]*)\\)',
    'g',
  );
  const metricFromRegex = metric?.match(reMeasurement);
  const presentMetric = metricFromRegex?.filter((metric) =>
    allowedMetrics?.has(metric),
  );
  return metricFromRegex?.length === presentMetric?.length;
};

/**
 * A metric function structure
 * @typedef {Object} MetricFunction
 * @property {string} metric - The function expression, ex. score.sum(score)
 * @property {string} signal - (optional) Signal name, ex. score
 * @property {string} function - Function name, ex. sum
 * @property {string} of - Function dimension ex. score. If the function does not take an argument,
 *    this property should be an empty string
 */

/**
 * Parses a metric function (with or without signal name) and returns a metric function object.
 *
 * @param {string} metric - The original metric function expression, such as avg(latency)
 * @returns {MetricFunction} Parsed metric function object. If the input string does not have a
 *   function syntax, properties function and of are undefined. The property metric is always
 *   filled.
 */
const dismantleMetric = (metric) => {
  const pattern = /(?:([0-9a-zA-Z_]+)\.)?([0-9a-zA-Z]+)\((.*)\)/;
  const match = metric.match(pattern);
  const result = {
    metric: metric,
  };
  if (match) {
    return {
      ...result,
      signal: match[1],
      function: match[2],
      of: match[3],
    };
  }
  return result;
};

export {
  getRegexForSignals,
  getAllMetricForEntities,
  getMetricsFromDerivedMetric,
  checkIfAllMetricPresent,
  dismantleMetric,
};
