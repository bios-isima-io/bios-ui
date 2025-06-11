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
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'antdlatest';
import { groupByActions } from '../reducers';
import { useHistory } from 'react-router-dom';
import { reportFiltersActions } from '../../AdvanceSettings/Filters/reducers';
import { metricsActions } from 'containers/ReportV2/components/AdvanceSettings/Metrics/reducers';
import { dataGranularityActions } from 'containers/ReportV2/components/AdvanceSettings/DataGranularity/reducers';
import { shouldDisableForAdvanceMetric, userClickEvent } from '../../../utils';
import { groupByDataSketchDisabledMessage } from '../constant';
import { getDimensionList } from '../utils';
import { checkGraphType } from '../../ReportGraph/utils';
import '../styles.scss';
import './styles.scss';

const { Option } = Select;
const { setGroupByX, setDisableGroupBy } = groupByActions;
const { setDisableFilters } = reportFiltersActions;
const { updateSelectedMetricsArr } = metricsActions;
const { resetTop } = dataGranularityActions;

const GroupByX = ({
  selectedSignals,
  selectedMetrics,
  setGroupByX,
  groupByX,
  groupByY,
  allFilters,
  selectedFilters,
  disableGroupBy,
  disableFilters,
  setDisableGroupBy,
  setDisableFilters,
  updateSelectedMetricsArr,
  resetTop,
}) => {
  const [dimensions, setDimensions] = useState([]);
  const [oldMetricsGraphType, setOldMetricsGraphType] = useState([]);
  const history = useHistory();
  useEffect(() => {
    if (selectedSignals.length === 0) {
      return;
    }
    let tempDisableFiltersAndGroupBy = false;
    selectedMetrics.forEach((sm) => {
      if (shouldDisableForAdvanceMetric(selectedSignals, sm.measurement)) {
        tempDisableFiltersAndGroupBy = true;
      }
    });
    if (disableFilters && !tempDisableFiltersAndGroupBy) {
      setDisableFilters(false);
    }
    if (!disableFilters && tempDisableFiltersAndGroupBy) {
      setDisableFilters(tempDisableFiltersAndGroupBy);
    }
    if (disableGroupBy && !tempDisableFiltersAndGroupBy) {
      setDisableGroupBy(false);
    }
    if (!disableGroupBy && tempDisableFiltersAndGroupBy) {
      setDisableGroupBy(tempDisableFiltersAndGroupBy);
    }
  }, [
    selectedMetrics,
    selectedSignals,
    disableFilters,
    disableGroupBy,
    setDisableFilters,
    setDisableGroupBy,
  ]);

  const setGroupByXAxisChange = (value) => {
    if (groupByX === '' && value !== '') {
      const oldMetricsGraphType = selectedMetrics.reduce((acc, metric) => {
        acc[metric.as] = metric.defaultGraphType;
        return acc;
      }, {});
      setOldMetricsGraphType(oldMetricsGraphType);
      updateSelectedMetricsArr({
        selectedMetrics: selectedMetrics.map((metric) => {
          metric.defaultGraphType = 'bar';
          return metric;
        }),
      });
    }
    if (groupByX !== '' && value === '') {
      let isMetricChanged = false;
      let newMetrics = null;
      newMetrics = selectedMetrics.map((metric) => {
        if (
          oldMetricsGraphType.hasOwnProperty(metric.as) &&
          metric.defaultGraphType !== oldMetricsGraphType[metric.as]
        ) {
          isMetricChanged = true;
          metric.defaultGraphType = oldMetricsGraphType[metric.as];
        }
        return metric;
      });
      if (
        checkGraphType({ selectedMetrics, graphType: 'funnel' }) ||
        checkGraphType({ selectedMetrics, graphType: 'donut' }) ||
        checkGraphType({ selectedMetrics, graphType: 'treemap' })
      ) {
        isMetricChanged = true;
        newMetrics = selectedMetrics.map((metric) => {
          metric.defaultGraphType = 'bar';
          return metric;
        });
      }
      isMetricChanged &&
        updateSelectedMetricsArr({ selectedMetrics: newMetrics });
      setOldMetricsGraphType([]);
    }
    userClickEvent({
      history,
      eventLabel: `Groupby X - select ${value}`,
      rightSection: 'None',
      mainSection: 'report',
      leftSection: 'insight',
    });
    setGroupByX({ groupByX: value });
    if (value === '') {
      resetTop();
    }
  };
  const updateDimensions = useCallback(() => {
    let dimensionList = getDimensionList({
      selectedSignals,
      selectedMetrics,
      groupByX: '',
      groupByY,
      selectedFilters: {},
      allFilters,
    });
    if (groupByY && groupByY !== '') {
      dimensionList = dimensionList.filter((dim) => dim !== groupByY);
    }
    setDimensions(dimensionList);
  }, [allFilters, groupByY, selectedMetrics, selectedSignals]);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  useEffect(() => {
    updateDimensions();
  }, [
    groupByY,
    selectedSignals,
    selectedMetrics,
    selectedFilters,
    updateDimensions,
  ]);

  const getDisabledGroupByXMessage = () => {
    if (disableGroupBy) {
      return groupByDataSketchDisabledMessage('X');
    }
    return null;
  };

  return (
    <div
      className="groupby-x-axis"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        marginBottom: '1rem',
      }}
    >
      <div className="graph-groupby-below-graph-right">
        <Tooltip title={getDisabledGroupByXMessage()}>
          <Select
            placeholder="Time"
            onChange={setGroupByXAxisChange}
            value={groupByX}
            dropdownMatchSelectWidth={false}
            dropdownClassName="select-dropdown groupby-x-select"
            className="select-container"
            suffixIcon={() => <i className="icon-chevron-down"></i>}
            disabled={disableGroupBy}
          >
            <Option value="" key="">
              Time
            </Option>
            {dimensions.map((dimension) => (
              <Option key={dimension}>{dimension}</Option>
            ))}
          </Select>
        </Tooltip>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setGroupByX,
  setDisableGroupBy,
  setDisableFilters,
  updateSelectedMetricsArr,
  resetTop,
};

const mapStateToProps = (state) => {
  const { selectedSignals } = state.signalMultiSelect;
  const { selectedMetrics } = state?.report?.metrics;
  const { groupByX, groupByY, disableGroupBy } = state?.report?.groupBy;
  const { allFilters, selectedFilters, disableFilters } =
    state?.report?.filters;
  return {
    selectedSignals,
    selectedMetrics,
    groupByX,
    groupByY,
    allFilters,
    selectedFilters,
    disableGroupBy,
    disableFilters,
  };
};

GroupByX.propTypes = {
  selectedSignals: PropTypes.array,
  selectedMetrics: PropTypes.array,
  setGroupByX: PropTypes.func,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
  allFilters: PropTypes.object,
  selectedFilters: PropTypes.object,
  disableFilters: PropTypes.bool,
  disableGroupBy: PropTypes.bool,
  setDisableGroupBy: PropTypes.func,
  setDisableFilters: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
  resetTop: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupByX);
