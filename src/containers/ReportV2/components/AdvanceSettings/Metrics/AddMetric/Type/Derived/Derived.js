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
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { reportFiltersActions } from 'containers/ReportV2/components/AdvanceSettings/Filters/reducers';
import Mentions from 'containers/ReportV2/components/AdvanceSettings/Metrics/rc-mention';
import { metricsActions } from 'containers/ReportV2/components/AdvanceSettings/Metrics/reducers';
import { groupByActions } from 'containers/ReportV2/components/GroupBy/reducers';
import { getDimensionListGroupBy } from 'containers/ReportV2/components/GroupBy/utils';
import {
  checkIfApproxMetricValue,
  shouldDisableForAdvanceMetric,
  userClickEvent,
} from 'containers/ReportV2/utils';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { getSignalMetricsForDropdown } from '../utils';
import {
  DERIVED_INPUT_PLACEHOLDER,
  DERIVED_METRICS_CUSTOM_VARIABLE_NAMES,
} from './const';
import { measurementForTextInput } from './utils';
import { checkGraphType } from 'containers/ReportV2/components/ReportGraph/utils';
import { cloneDeep } from 'lodash';
import './styles.scss';

const { setDisableFilters } = reportFiltersActions;
const { setDisableGroupBy, setGroupByXY } = groupByActions;

const { addMetric, updateMetric, updateSelectedMetricsArr } = metricsActions;
const { Option } = Mentions;
function Derived({
  selectedSignals,
  metricAction,
  defaultValue,
  addMetric,
  updateMetric,
  closeEditHandler,
  metric,
  setDisableFilters,
  setDisableGroupBy,
  selectedMetrics,
  groupByX,
  groupByY,
  setGroupByXY,
  updateSelectedMetricsArr,
}) {
  const history = useHistory();
  const [measurement, setMeasurement] = useState(defaultValue);
  const popupContainerId =
    metricAction === 'add'
      ? 'add-derived-metric'
      : 'edit-derived-metric-' + metric.as;
  const signalMetricsMap = getSignalMetricsForDropdown(selectedSignals);
  const options =
    signalMetricsMap &&
    Object.keys(signalMetricsMap).map((key) => {
      const metricsList = [
        ...signalMetricsMap[key]?.metrics?.mainMetrics,
        ...signalMetricsMap[key]?.metrics?.commonMetrics,
        ...signalMetricsMap[key]?.metrics?.remainingMetrics,
      ];
      return metricsList.length > 0 ? (
        <>
          <span type="heading">{key}</span>
          {metricsList.map((metric) => {
            return (
              <Option key={`${metric}_${key}`} value={`${key}.${metric}`}>
                {metric}
              </Option>
            );
          })}
        </>
      ) : null;
    });

  options.push(
    <>
      <span type="heading">Built in constants</span>
      {DERIVED_METRICS_CUSTOM_VARIABLE_NAMES.map((name) => (
        <Option key={name} value={name}>
          {name}
        </Option>
      ))}
    </>,
  );

  const validateMeasurement = () => {
    const mm = measurement?.replaceAll('#', '').trim();
    let isValid = true;
    let derivedMetric = mm;

    function IterateAndReplaceValues(signalMetricsMap, sig) {
      const metricsList = [
        ...signalMetricsMap[sig]?.metrics?.mainMetrics,
        ...signalMetricsMap[sig]?.metrics?.commonMetrics,
        ...signalMetricsMap[sig]?.metrics?.remainingMetrics,
      ];
      metricsList?.forEach((metric) => {
        derivedMetric = derivedMetric?.replaceAll(sig + '.' + metric, 2);
      });
    }
    for (const sig in signalMetricsMap) {
      IterateAndReplaceValues(signalMetricsMap, sig);
    }

    DERIVED_METRICS_CUSTOM_VARIABLE_NAMES.forEach((custom_variable) => {
      derivedMetric = derivedMetric?.replaceAll(custom_variable, 2);
    });

    //Check for constant expression like 12* (4+5), 6 etc
    if (mm === derivedMetric) {
      isValid = false;
    } else {
      try {
        evaluate(derivedMetric);
      } catch (e) {
        isValid = false;
      }
    }

    return isValid;
  };

  const saveChanges = () => {
    if (measurement.trim()) {
      if (validateMeasurement()) {
        // generate unique legend
        const newMetric = {
          measurement: measurement?.replaceAll('#', '').trim(),
          as: 'user_defined_metric_' + Math.floor(Math.random() * 100) + 1,
          type: 'derived',
          yAxisPosition: 'left',
        };
        const dimensionList = getDimensionListGroupBy({
          selectedSignals,
          selectedMetrics: [...selectedMetrics, newMetric],
          groupByX,
          groupByY,
          selectedFilters: {},
          allFilters: {},
          removeExistingGroupByFromList: false,
        });

        let resetGroupBy = false;
        if (groupByX !== '' && !dimensionList.includes(groupByX)) {
          resetGroupBy = true;
        }
        if (groupByY !== '' && !dimensionList.includes(groupByY)) {
          resetGroupBy = true;
        }
        if (resetGroupBy) {
          setGroupByXY({
            groupByX: '',
            groupByY: '',
          });
        }
        if (
          shouldDisableForAdvanceMetric(selectedSignals, measurement.trim())
        ) {
          setDisableGroupBy(true);
          setDisableFilters(true);
        }

        if (metricAction === 'add') {
          let graphType = 'bar';
          if (
            selectedMetrics.length === 0 &&
            measurement?.indexOf('/') >= 0 &&
            groupByY !== ''
          ) {
            graphType = 'area';
          }
          const isPackedBubble = selectedMetrics?.some(
            (sm) => sm.defaultGraphType === 'packedbubble',
          );

          const isFunnelMetric = checkGraphType({
            selectedMetrics,
            graphType: 'funnel',
          });
          const isDonutMetric = checkGraphType({
            selectedMetrics,
            graphType: 'donut',
          });
          const isTreemapMetric = checkGraphType({
            selectedMetrics,
            graphType: 'treemap',
          });

          if (isPackedBubble && selectedMetrics.length === 3) {
            ErrorNotification({
              message: messages.report.PACKED_BUBBLE_METRIC_LIMIT,
            });
            return;
          }
          const metric = {
            measurement: measurement?.replaceAll('#', '').trim(),
            as: 'user_defined_metric_' + Math.floor(Math.random() * 100) + 1,
            type: 'derived',
            defaultGraphType: isPackedBubble ? 'packedbubble' : graphType,
            yAxisPosition: 'left',
          };
          if (
            selectedMetrics.some(
              (sm) =>
                sm.type === 'simple' &&
                checkIfApproxMetricValue(sm.measurement),
            )
          ) {
            updateSelectedMetricsArr({ selectedMetrics: [metric] });
          } else if (isFunnelMetric || isDonutMetric || isTreemapMetric) {
            const selectedMetricsCopy = cloneDeep(selectedMetrics);
            selectedMetricsCopy.unshift(metric);
            selectedMetricsCopy.forEach((metric) => {
              metric.defaultGraphType = 'bar';
            });
            updateSelectedMetricsArr({ selectedMetrics: selectedMetricsCopy });
          } else {
            addMetric(metric);
          }
          userClickEvent({
            history,
            eventLabel: `Add Derived metric`,
            rightSection: 'advancedSetting',
            mainSection: 'report',
            leftSection: 'insight',
          });
          setMeasurement('');
        } else if (metricAction === 'edit') {
          updateMetric({
            ...metric,
            measurement: measurement?.replaceAll('#', '').trim(),
          });
          userClickEvent({
            history,
            eventLabel: `Edit Derived metric`,
            rightSection: 'advancedSetting',
            mainSection: 'report',
            leftSection: 'insight',
          });
          closeEditHandler();
        }
      } else {
        ErrorNotification({
          message: messages.report.INVALID_METRICS_FIELD_VALUE,
        });
      }
    } else {
      ErrorNotification({
        message:
          measurement === ''
            ? messages.report.EMPTY_METRICS_MSG
            : messages.report.EMPTY_LEGEND_MSG,
      });
    }
  };

  const updateMetricsField = (text) => {
    //I can add disabled character logic here
    setMeasurement(text);
  };

  const clearMetric = () => {
    if (metricAction === 'add') {
      setMeasurement('');
    } else if (metricAction === 'edit') {
      closeEditHandler();
    }
  };

  useEffect(() => {
    if (metricAction === 'edit') {
      const fixedMeasurement = measurementForTextInput(
        defaultValue,
        selectedSignals,
      );
      setMeasurement(fixedMeasurement);
    }
  }, [defaultValue, metricAction, selectedSignals]);

  return (
    <div id={popupContainerId} className="derived-metric-container">
      <Mentions
        prefix="#"
        split=" "
        placeholder={DERIVED_INPUT_PLACEHOLDER}
        value={measurement}
        style={{ width: '100%' }}
        className="dynamic-option"
        autoFocus
        onChange={updateMetricsField}
        getPopupContainer={() => {
          return document.getElementById(popupContainerId);
        }}
      >
        {options}
      </Mentions>
      <div className="derived-metrics-actions">
        <div className="derived-metrics-button">
          <i className="icon-check icon" onClick={() => saveChanges()}></i>
        </div>
        <div className="derived-metrics-button">
          <i className="icon-close icon" onClick={() => clearMetric()}></i>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  addMetric,
  updateMetric,
  updateSelectedMetricsArr,
  setDisableFilters,
  setDisableGroupBy,
  setGroupByXY,
};

const mapStateToProps = (state) => {
  const { selectedSignals } = state.signalMultiSelect;
  const { selectedMetrics } = state.report.metrics;
  const { groupByY, groupByX } = state.report.groupBy;
  return {
    selectedSignals,
    selectedMetrics,
    groupByY,
    groupByX,
  };
};

Derived.propTypes = {
  selectedSignals: PropTypes.array,
  addMetric: PropTypes.func,
  updateMetric: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
  setDisableFilters: PropTypes.func,
  setDisableGroupBy: PropTypes.func,
  setGroupByXY: PropTypes.func,
  selectedMetrics: PropTypes.array,
  groupByY: PropTypes.string,
  groupByX: PropTypes.string,
};
export default connect(mapStateToProps, mapDispatchToProps)(Derived);
