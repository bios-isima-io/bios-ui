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
import { TreeSelect } from 'antdlatest';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { reportFiltersActions } from 'containers/ReportV2/components/AdvanceSettings/Filters/reducers';
import { metricsActions } from 'containers/ReportV2/components/AdvanceSettings/Metrics/reducers';
import { groupByActions } from 'containers/ReportV2/components/GroupBy/reducers';
import { getDimensionListGroupBy } from 'containers/ReportV2/components/GroupBy/utils';
import {
  checkIfApproxMetricValue,
  shouldDisableForAdvanceMetric,
  userClickEvent,
} from 'containers/ReportV2/utils';
import addApproxMetrics from 'containers/ReportV2/utils/addApproxMetrics';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { getSimpleMetricModifier } from '../getMetricModifier';
import { getSignalMetricsForDropdown } from '../utils';
import {
  buildMetricsFilteredObj,
  getRegexFilteredMetrics,
  separateMetrics,
} from './utils';
import { checkGraphType } from 'containers/ReportV2/components/ReportGraph/utils';
import { cloneDeep } from 'lodash';
import './styles.scss';

const { addMetric, updateSelectedMetricsArr } = metricsActions;
const { setDisableFilters } = reportFiltersActions;
const { setDisableGroupBy, setGroupByXY } = groupByActions;

function Simple({
  selectedSignals,
  metricsModifiers,
  addMetric,
  updateSelectedMetricsArr,
  selectedMetrics,
  setDisableFilters,
  setDisableGroupBy,
  setGroupByXY,
  groupByX,
  groupByY,
  type,
}) {
  const history = useHistory();
  const [metricsTree, setMetricsTree] = useState([]);

  useEffect(() => {
    const selectedSignalMetricMap =
      getSignalMetricsForDropdown(selectedSignals);
    const signalTree = [];
    for (const signal in selectedSignalMetricMap) {
      const mainMetrics = selectedSignalMetricMap[
        signal
      ].metrics?.mainMetrics?.reduce((acc, metric) => {
        const checkIfMetricExist = selectedMetrics?.some(
          (sm) => sm.measurement === `${signal}.${metric}`,
        );
        if (!checkIfMetricExist) {
          acc.push({ title: metric, value: `${signal}.${metric}` });
        }
        return acc;
      }, []);

      // uncomment after data sketches support for groupby
      const advanceMetrics = selectedSignalMetricMap[
        signal
      ].metrics?.remainingMetrics?.reduce((acc, metric) => {
        const checkIfMetricExist = selectedMetrics?.some(
          (sm) => sm.measurement === `${signal}.${metric}`,
        );
        if (!checkIfMetricExist) {
          acc.push({ title: metric, value: `${signal}.${metric}` });
        }
        return acc;
      }, []);

      let commonMetrics = selectedSignalMetricMap[
        signal
      ].metrics?.commonMetrics?.reduce((acc, metric) => {
        const checkIfMetricExist = selectedMetrics?.some(
          (sm) => sm.measurement === `${signal}.${metric}`,
        );
        if (!checkIfMetricExist) {
          acc.push({ title: metric, value: `${signal}.${metric}` });
        }
        return acc;
      }, []);

      const metricsRegex = new RegExp('(?:min|max)+\\((?:.*?)\\)', 'g');
      commonMetrics = commonMetrics.reduce((acc, cm) => {
        if (cm.title.match(metricsRegex)) {
          mainMetrics.push(cm);
          return acc;
        }
        acc.push(cm);
        return acc;
      }, []);

      let metricsList;

      const advanceMetricsFiltered = separateMetrics(advanceMetrics);
      const commonMetricsFiltered = separateMetrics(commonMetrics);
      if (type === 'simple') {
        const simpleRegex =
          '(:|^count|min|max|sum|avg|distinctcount)+\\((?:.*?)\\)';
        metricsList = [
          ...getRegexFilteredMetrics(mainMetrics, simpleRegex),
          ...getRegexFilteredMetrics(commonMetrics, simpleRegex),
        ];
      } else if (type === 'data-sketches-exact') {
        const advanceRegex =
          '(:|sum2|sum3|sum4|stddev|variance|skewness|kurtosis|median)+\\((?:.*?)\\)';
        metricsList = [
          ...getRegexFilteredMetrics(mainMetrics, advanceRegex),
          ...getRegexFilteredMetrics(commonMetrics, advanceRegex),
          ...getRegexFilteredMetrics(advanceMetrics, advanceRegex),
        ];
      } else if (type === 'data-sketches-approx') {
        const metricFilterModifiedObj = buildMetricsFilteredObj({
          commonMetricsFiltered,
          advanceMetricsFiltered,
        });
        metricsList = [...metricFilterModifiedObj];
      }

      const signalMetrics = {
        title: signal,
        value: signal,
        children: metricsList,
        selectable: false,
      };

      if (metricsList.length > 0) {
        signalTree.push(signalMetrics);
      }
    }
    setMetricsTree(signalTree);
  }, [selectedSignals, selectedMetrics, type]);

  const onChange = (value) => {
    const att = value.substring(
      value.lastIndexOf('.') + 1,
      value.lastIndexOf('('),
    );
    let isApproxMetric = false;
    let selectedMetricsCopy = [];
    let uuid;
    if (att === 'distinctcounts' || att === 'spread') {
      uuid = uuidv4();
      selectedMetricsCopy = addApproxMetrics(value, att, uuid);
      isApproxMetric = true;
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
    const { unitDisplayName, unitDisplayPosition } = getSimpleMetricModifier(
      selectedSignals,
      value,
      metricsModifiers,
    );

    const metric = {
      measurement: value,
      as: value,
      unitDisplayName,
      unitDisplayPosition,
      type: 'simple',
      defaultGraphType: isPackedBubble ? 'packedbubble' : 'bar',
      yAxisPosition: 'left',
    };

    const dimensionList = getDimensionListGroupBy({
      selectedSignals,
      selectedMetrics: [...selectedMetrics, metric],
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

    if (shouldDisableForAdvanceMetric(selectedSignals, value)) {
      setDisableGroupBy(true);
      setDisableFilters(true);
    }

    if (isApproxMetric) {
      metric.plot = false;
      metric.defaultGraphType = 'area';
      metric.uuid = uuid;
      selectedMetricsCopy.unshift(metric);
      updateSelectedMetricsArr({ selectedMetrics: selectedMetricsCopy });
    } else if (isFunnelMetric || isDonutMetric || isTreemapMetric) {
      const selectedMetricsCopy = cloneDeep(selectedMetrics);
      selectedMetricsCopy.unshift(metric);
      selectedMetricsCopy.forEach((metric) => {
        metric.defaultGraphType = 'bar';
      });
      updateSelectedMetricsArr({ selectedMetrics: selectedMetricsCopy });
    } else {
      if (
        selectedMetrics.some(
          (sm) =>
            sm.type === 'simple' && checkIfApproxMetricValue(sm.measurement),
        )
      ) {
        updateSelectedMetricsArr({ selectedMetrics: [metric] });
      } else {
        addMetric(metric);
      }
    }
    userClickEvent({
      history,
      eventLabel: `Add ${type} metric`,
      rightSection: 'advancedSetting',
      mainSection: 'report',
      leftSection: 'insight',
    });
  };

  return (
    <div>
      <TreeSelect
        className="simple-metric-select"
        style={{ width: '100%' }}
        value={null}
        showSearch
        treeData={metricsTree}
        placeholder="Select a metric"
        onChange={(e) => onChange(e)}
        dropdownClassName="simple-metric-select-dropdown"
        suffixIcon={() => <i className="icon-chevron-down"></i>}
      />
    </div>
  );
}

const mapDispatchToProps = {
  addMetric,
  updateSelectedMetricsArr,
  setDisableFilters,
  setDisableGroupBy,
  setGroupByXY,
};

const mapStateToProps = (state) => {
  const { selectedSignals, metricsModifiers } = state.signalMultiSelect;
  const { selectedMetrics } = state.report.metrics;
  const { groupByY, groupByX } = state.report.groupBy;
  return {
    selectedSignals,
    metricsModifiers,
    selectedMetrics,
    groupByY,
    groupByX,
  };
};

Simple.propTypes = {
  selectedSignals: PropTypes.array,
  metricsModifiers: PropTypes.array,
  selectedMetrics: PropTypes.array,
  addMetric: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
  setDisableFilters: PropTypes.func,
  setDisableGroupBy: PropTypes.func,
  setGroupByXY: PropTypes.func,
  groupByY: PropTypes.string,
  groupByX: PropTypes.string,
  type: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Simple);
