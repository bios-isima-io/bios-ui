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
import { dismantleMetric } from 'containers/ReportV2/utils/metricsRegex';
import getEntitiesMetricsMapping from 'containers/ReportV2/utils/signalsMetricsMapping';
import { ErrorNotification } from 'containers/utils';
import { containsAll, getIntersectionForArrays } from 'utils';
import { CYCLICAL_DISABLED_MSG } from '../constant';

const hideGroupByY = (metrics) => {
  const bool = metrics.some((metric) => {
    if (
      metric?.measurement.includes('min(') ||
      metric?.measurement.includes('max(') ||
      metric?.measurement.includes('last(')
    ) {
      return true;
    }
    return false;
  });
  return bool;
};

const getEnabledDimensions = (selectedSignals, activeDimensions) => {
  let enabledDimensionFilter = [];
  selectedSignals.forEach((signal) => {
    signal?.postStorageStage?.features.forEach((feature) => {
      if (containsAll(feature.dimensions, activeDimensions)) {
        enabledDimensionFilter = enabledDimensionFilter.concat(
          feature.dimensions,
        );
      }
    });
  });
  return [...new Set(enabledDimensionFilter)];
};

const getDimensionList = ({
  selectedSignals,
  selectedMetrics,
  groupByX,
  groupByY,
  selectedFilters,
}) => {
  if (selectedSignals?.length === 0 || selectedMetrics?.length === 0) {
    return [];
  }

  const signalMap = {};
  selectedSignals.forEach((signal) => {
    signalMap[signal.signalName] = signal;
  });

  const signalsMetricsMapping = getEntitiesMetricsMapping(
    selectedMetrics,
    selectedSignals,
    'signal',
  );

  const activeDimensions = new Set(Object.keys(selectedFilters ?? {}));
  if (groupByX && groupByX !== '') {
    activeDimensions.add(groupByX);
  }
  if (groupByY && groupByY !== '') {
    activeDimensions.add(groupByY);
  }

  const dimensionsList = Object.keys(signalsMetricsMapping).reduce(
    (signalAcc, signal) => {
      let metricsList = new Set();
      metricsList.add(`count()`);
      signalMap[signal]?.availableAttributes?.forEach((attribute) => {
        const metrics = [
          ...attribute?.mainMetrics.map((val) => val.toLowerCase()),
          ...attribute?.commonMetrics.map((val) => val.toLowerCase()),
          ...attribute?.remainingMetrics.map((val) => val.toLowerCase()),
        ];
        metrics.forEach((m) => {
          if (m !== 'count') {
            metricsList.add(`${m}(${attribute.attributeName})`);
          }
        });
      });

      const allMetricsInFeature = [...metricsList];
      const MetricsWithThatSignal = signalsMetricsMapping[signal];
      const signalDimensions = signalMap?.[
        signal
      ]?.postStorageStage?.features?.reduce((featureAcc, feature) => {
        if (containsAll(allMetricsInFeature, MetricsWithThatSignal)) {
          const metrics = signalsMetricsMapping[signal].map((metric) =>
            dismantleMetric(metric),
          );
          const requiredDimensions = new Set();
          const requiredAttributes = new Set();
          metrics.forEach((metric) => {
            if (metric.function === 'distinctcount') {
              requiredDimensions.add(metric.of);
            } else if (metric.of) {
              requiredAttributes.add(metric.of);
            }
          });
          if (
            containsAll(feature?.dimensions, activeDimensions) &&
            containsAll(feature?.dimensions, requiredDimensions) &&
            containsAll(feature?.attributes ?? [], requiredAttributes)
          ) {
            const dimensions = [...(feature?.dimensions ?? [])].filter(
              (dimension) => !requiredDimensions.has(dimension),
            );
            featureAcc.push(...dimensions);
          }
        }
        return featureAcc;
      }, []);
      if (signalDimensions && signalDimensions.length > 0) {
        signalAcc.push([...new Set(signalDimensions)]);
      } else {
        signalAcc.push([]);
      }
      return [...new Set(signalAcc)];
    },
    [],
  );
  if (dimensionsList && dimensionsList.length > 0) {
    const uniqueDimensionList = [
      ...new Set(getIntersectionForArrays(dimensionsList)),
    ];
    return uniqueDimensionList;
  } else {
    return [];
  }
};

const getAttributeFromMetrics = (SignalsMetricsMapping) => {
  let uniqueMetrics = new Set();
  Object.keys(SignalsMetricsMapping).forEach((signal) => {
    SignalsMetricsMapping?.[signal].forEach((metric) => {
      uniqueMetrics.add(metric);
    });
  });
  uniqueMetrics = Array.from(uniqueMetrics);

  const uniqueAttributes = uniqueMetrics.reduce((acc, metric) => {
    const startIndex = metric.lastIndexOf('(') + 1;
    const endIndex = metric.lastIndexOf(')');
    if (startIndex < endIndex) {
      acc.push(metric?.substring(startIndex, endIndex));
    }
    return acc;
  }, []);

  return uniqueAttributes;
};

const getEnabledDimensionsGroupBy = (selectedSignals, activeDimensions) => {
  let enabledDimensionFilter = [];
  selectedSignals.forEach((signal, signal_index) => {
    signal?.[signal_index]?.postStorageStage?.features.forEach((feature) => {
      if (
        activeDimensions.length === 0 ||
        containsAll(feature.attributes, activeDimensions)
      ) {
        enabledDimensionFilter = enabledDimensionFilter.concat(
          feature.dimensions,
        );
      }
    });
  });
  return [...new Set(enabledDimensionFilter)];
};

const getDimensionListGroupBy = ({
  selectedSignals,
  selectedMetrics,
  groupByX,
  groupByY,
  type,
  selectedFilters,
  skipGroupByAndDimensionCheck,
  removeExistingGroupByFromList,
}) => {
  if (selectedSignals?.length === 0 || selectedMetrics?.length === 0) {
    return [];
  }

  const signalMap = {};
  selectedSignals.forEach((signal) => {
    signalMap[signal.signalName] = signal;
  });

  const SignalsMetricsMapping = getEntitiesMetricsMapping(
    selectedMetrics,
    selectedSignals,
    'signal',
  );

  const attributes = getAttributeFromMetrics(SignalsMetricsMapping);

  const dimensionsList = Object.keys(SignalsMetricsMapping).reduce(
    (signalAcc, signal) => {
      const signalDimensions = getEnabledDimensionsGroupBy(
        [
          selectedSignals.filter(
            (signalItem) => signalItem.signalName === signal,
          ),
        ],
        attributes,
      );
      if (signalDimensions && signalDimensions.length > 0) {
        signalAcc.push([...new Set(signalDimensions)]);
      } else {
        signalAcc.push([]);
      }
      return [...new Set(signalAcc)];
    },
    [],
  );
  if (dimensionsList && dimensionsList.length > 0) {
    let uniqueDimensionList = [
      ...new Set(getIntersectionForArrays(dimensionsList)),
    ];
    uniqueDimensionList = uniqueDimensionList.filter(
      (el) => !attributes.includes(el),
    );
    if (removeExistingGroupByFromList) {
      if (type === 'groupbyX') {
        uniqueDimensionList = uniqueDimensionList.filter(
          (el) => el !== groupByY,
        );
      } else if (type === 'groupbyY') {
        uniqueDimensionList = uniqueDimensionList.filter(
          (el) => el !== groupByX,
        );
      }
    }
    return uniqueDimensionList;
  } else {
    return [];
  }
};

const showErrorNotification = () => {
  ErrorNotification({
    message: CYCLICAL_DISABLED_MSG,
  });
};

export {
  hideGroupByY,
  getDimensionList,
  showErrorNotification,
  getEnabledDimensions,
  getDimensionListGroupBy,
};
