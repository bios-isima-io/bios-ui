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
import { Checkbox, Radio, Tooltip } from 'antdlatest';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import { usePrevious } from 'common/hooks';
import EditableInput from 'containers/components/EditableInput';
import { dataGranularityActions } from 'containers/ReportV2/components/AdvanceSettings/DataGranularity/reducers';
import { AddDerivedMetric } from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type';
import { metricsActions } from 'containers/ReportV2/components/AdvanceSettings/Metrics/reducers';
import { groupByActions } from 'containers/ReportV2/components/GroupBy/reducers';
import { getDimensionList } from 'containers/ReportV2/components/GroupBy/utils';
import Colon from 'containers/ReportV2/components/AdvanceSettings/components/Colon';
import {
  checkIfApproxMetric,
  checkIfApproxMetricValue,
  shouldDisableForAdvanceMetric,
} from 'containers/ReportV2/utils';
import { checkIfMedianOrDistinctCount } from 'containers/ReportV2/utils/checkIfApproxMetric';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { metricColorUnderline } from './utils';
import { DERIVED_METRICS_CUSTOM_VARIABLE_NAMES } from 'containers/ReportV2/components/AdvanceSettings/Metrics/AddMetric/Type/Derived/const';
import './styles.scss';

const {
  removeMetric,
  updateMetric,
  updateMetricLegend,
  updateSelectedMetricsArr,
} = metricsActions;
const { setGroupByXY, setGroupByY } = groupByActions;
const { setTopX } = dataGranularityActions;

function MetricItem({
  metric,
  metricIndex,
  allMetrics,
  removeMetric,
  updateMetric,
  updateMetricLegend,
  updateSelectedMetricsArr,
  groupByX,
  groupByY,
  selectedSignals,
  selectedMetrics,
  setGroupByXY,
  setGroupByY,
  setTopX,
}) {
  const selectedMetricsOld = usePrevious(selectedMetrics);
  const [metricShowEdit, setMetricShowEdit] = useState(false);
  const [bottomUnderline, setBottomUnderline] = useState('');

  const hasPackedBubble = selectedMetrics.some(
    (sm) => sm.defaultGraphType === 'packedbubble',
  );

  const updateGraphType = (e) => {
    const selectedMetricsHasMedianOrDC = selectedMetrics.some((sm) =>
      checkIfMedianOrDistinctCount(sm.measurement),
    );
    const dataSketchesUsed = selectedMetrics.some((metric) =>
      shouldDisableForAdvanceMetric(selectedSignals, metric.measurement),
    );

    if (e.target.value === 'packedbubble' && groupByX === '') {
      const dimensionList = getDimensionList({
        selectedSignals,
        selectedMetrics,
        groupByX,
        groupByY,
        selectedFilters: {},
        allFilters: {},
      });
      if (!selectedMetricsHasMedianOrDC) {
        if (dimensionList.length > 0 && !dataSketchesUsed) {
          setGroupByXY({ groupByX: dimensionList[0], groupByY: '' });
        } else {
          setGroupByXY({ groupByX: '', groupByY: '' });
        }
      }
      setTopX(15);
    } else {
      // check if any metric has packed bubble
      if (hasPackedBubble) {
        const newSelectedMetrics = selectedMetrics.map((sm) => {
          sm.defaultGraphType = 'bar';
          return sm;
        });
        updateSelectedMetricsArr({ selectedMetrics: newSelectedMetrics });
        if (selectedMetricsHasMedianOrDC) {
          setGroupByXY({ groupByX: '', groupByY: '' });
        }
      }
    }

    if (e.target.value === 'packedbubble') {
      if (groupByY !== '') {
        setGroupByY({ groupByY: '' });
      }
      const newSelectedMetrics = selectedMetrics.map((sm) => {
        sm.defaultGraphType = 'packedbubble';
        return sm;
      });
      if (newSelectedMetrics.length > 3) {
        newSelectedMetrics.splice(3);
      }
      updateSelectedMetricsArr({ selectedMetrics: newSelectedMetrics });
      return;
    }
    updateMetric({
      ...metric,
      defaultGraphType: e.target.value,
    });
  };
  const updateYAxisPosition = () => {
    const yAxis = metric.yAxisPosition === 'left' ? 'right' : 'left';
    if (checkIfApproxMetric(metric)) {
      const newSelectedMetrics = selectedMetrics.map((sm) => {
        if (sm.uuid === metric.uuid) {
          sm.yAxisPosition = yAxis;
        }
        return sm;
      });
      updateSelectedMetricsArr({ selectedMetrics: newSelectedMetrics });
    } else {
      // get other show Percentage state
      let otherMetricOnSameAxis = selectedMetrics.find((sm, index) => {
        if (index !== metricIndex && sm.yAxisPosition === yAxis) {
          return true;
        }
        return false;
      });
      let showPercentage = metric?.showPercentage;
      if (otherMetricOnSameAxis) {
        showPercentage = otherMetricOnSameAxis?.showPercentage;
      }
      if (showPercentage === undefined) {
        showPercentage = false;
      }
      // end get other show Percentage state

      updateMetric({
        ...metric,
        yAxisPosition: yAxis,
        showPercentage,
      });
    }
  };

  const showEditHandlerMetric = () => {
    if (metric.type === 'derived') {
      setMetricShowEdit(true);
    }
  };

  const closeEditHandlerMetric = () => {
    if (metric.type === 'derived') {
      setMetricShowEdit(false);
    }
  };

  const legendOnChange = (value) => {
    if (value === metric?.as) {
      return;
    }
    let count = 1;
    const checkIfValueExist = (allMetrics, value) =>
      allMetrics?.filter((m) => m.as === value).length >= 1;
    while (checkIfValueExist(allMetrics, value)) {
      value = `${value}_${count}`;
      count++;
    }
    updateMetricLegend({
      ...metric,
      oldLegend: metric.as,
      as: value,
    });
  };

  const validateLegendName = (input, showError) => {
    let error = false;
    let errorMessage = '';
    if (input === '') {
      errorMessage = messages.signal.EMPTY_LEGEND_MSG;
      error = true;
    }

    if (showError) {
      ErrorNotification({
        message: errorMessage,
      });
    }
    if (error) {
      return false;
    }
    return true;
  };

  const disableLineSwitch =
    (groupByY !== '' && selectedMetrics.length !== 1) ||
    (metric.type === 'simple' && checkIfApproxMetricValue(metric.measurement));

  const disableAreaSwitch = groupByY !== '' && selectedMetrics.length !== 1;

  const disableBarSwitch =
    metric.type === 'simple' && checkIfApproxMetricValue(metric.measurement);

  const disablePackedBubbleSwitch = checkIfApproxMetricValue(
    metric.measurement,
  );

  const disableFunnelSwitch =
    groupByY !== '' || groupByX == '' || selectedMetrics?.length > 1;

  const disableTreemapSwitch = groupByX == '' || selectedMetrics?.length > 1;

  const disableDonutSwitch = groupByX == '' || selectedMetrics?.length > 1;

  const disableMapSwitch =
    groupByX !== 'countryIsoCode' ||
    groupByY !== '' ||
    selectedMetrics?.length > 1;

  useEffect(() => {
    // newly added metric show percentage auto select
    if (
      selectedMetrics.length > 1 &&
      selectedMetricsOld?.length < selectedMetrics?.length
    ) {
      const topMetric = selectedMetrics[selectedMetrics.length - 1];
      const topMetricShowPercentage = topMetric.showPercentage || false;

      let hasMetricSameAxisAndPercentage = selectedMetrics
        .slice(0, selectedMetrics.length - 1)
        .find((sm) => {
          const smShowPercentage = sm?.showPercentage || false;
          return (
            sm.yAxisPosition === topMetric.yAxisPosition &&
            smShowPercentage !== topMetricShowPercentage
          );
        });

      if (hasMetricSameAxisAndPercentage) {
        const newSelectedMetrics = [...selectedMetrics];
        newSelectedMetrics[newSelectedMetrics.length - 1] = {
          ...topMetric,
          showPercentage: hasMetricSameAxisAndPercentage,
        };
        updateSelectedMetricsArr({ selectedMetrics: newSelectedMetrics });
      }
    }
  }, [selectedMetrics, selectedMetricsOld?.length, updateSelectedMetricsArr]);

  useEffect(() => {
    const bottomColor = metricColorUnderline(metric, selectedSignals);
    if (bottomColor && bottomColor != '') {
      setBottomUnderline(bottomColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric]);

  const formatMetricText = (metric) => {
    DERIVED_METRICS_CUSTOM_VARIABLE_NAMES?.forEach((variable) => {
      const styledVariable = `<span style="color: #506266">${variable}</span>`;
      metric = metric.replaceAll(variable, styledVariable);
    });
    return metric;
  };

  return (
    <Draggable
      key={metricIndex}
      draggableId={'id_ +' + metricIndex}
      index={metricIndex}
    >
      {(provided) => (
        <div
          className="metric-item-container"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <span className="metric-icon-move">
            <i className="icon-move" />
          </span>
          <div className="metric-edit">
            <div className="edit-name">
              Metric
              <Colon />
            </div>

            {metricShowEdit ? (
              <AddDerivedMetric
                metric={metric}
                defaultValue={metric.measurement}
                metricAction="edit"
                closeEditHandler={closeEditHandlerMetric}
              />
            ) : (
              <>
                <div
                  className="metric-value"
                  onClick={() => showEditHandlerMetric()}
                >
                  <Tooltip placement="top" title={metric?.measurement}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatMetricText(metric?.measurement),
                      }}
                    />
                  </Tooltip>
                </div>
                {metric.type === 'derived' && (
                  <i
                    className="icon-edit icon-metrics"
                    onClick={() => showEditHandlerMetric()}
                  />
                )}
                <i
                  className="icon-trash icon-metrics"
                  onClick={() => removeMetric(metric.as)}
                />
              </>
            )}
          </div>
          <div className="legend-edit">
            <div className="edit-name">
              Legend
              <Colon />
            </div>
            <EditableInput
              value={metric.as}
              EmptyTitleText=""
              onChange={legendOnChange}
              validate={validateLegendName}
              placeholder="Legend Name"
              bottomUnderline={bottomUnderline}
            />
          </div>
          <div className="options">
            <div className="chart-type">
              <div className="chart-type-title">
                Chart type
                <Colon />
              </div>
              <Radio.Group
                value={metric.defaultGraphType}
                buttonStyle="outline"
                onChange={(e) => updateGraphType(e)}
              >
                <Radio.Button value="line" disabled={disableLineSwitch}>
                  <i className="icon-line-chart-1 chart-icon" />
                </Radio.Button>
                <Radio.Button value="bar" disabled={disableBarSwitch}>
                  <i className="icon-bar-chart-1 chart-icon" />
                </Radio.Button>
                <Radio.Button value="area" disabled={disableAreaSwitch}>
                  <i className="icon-area-chart-1 chart-icon" />
                </Radio.Button>
                <Radio.Button
                  value="packedbubble"
                  disabled={disablePackedBubbleSwitch}
                >
                  <i className="icon-bubble-plot bubble-icon chart-icon" />
                </Radio.Button>
                <Radio.Button value="funnel" disabled={disableFunnelSwitch}>
                  <Icon type="funnel-plot" className="funnel-icon" />
                </Radio.Button>
                <Radio.Button value="donut" disabled={disableDonutSwitch}>
                  <Icon type="pie-chart" className="pie-chart-icon" />
                </Radio.Button>
                <Radio.Button value="treemap" disabled={disableTreemapSwitch}>
                  <i className="icon-layers  layer-icon chart-icon" />
                </Radio.Button>
                <Radio.Button value="map" disabled={disableMapSwitch}>
                  <Icon type="heat-map" className="heat-map-icon" />
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div className="percentage-selector">
            <div className="percentage-selector-title">
              Show as %
              <Colon />
              <div>
                <Checkbox
                  checked={metric?.showPercentage}
                  onChange={(e) => {
                    let yAxisPosition = metric.yAxisPosition;
                    if (!yAxisPosition || yAxisPosition === '') {
                      yAxisPosition = 'left';
                    }
                    let showPercentage = e.target.checked;
                    const newSelectedMetrics = selectedMetrics.map((sm) => {
                      if (sm.yAxisPosition === yAxisPosition) {
                        sm.showPercentage = showPercentage;
                      }
                      return sm;
                    });
                    updateSelectedMetricsArr({
                      selectedMetrics: newSelectedMetrics,
                    });
                  }}
                ></Checkbox>
              </div>
            </div>

            <div className="y-axis-toggle">
              {hasPackedBubble ? (
                <div className="bubble-plot-axis">
                  {metricIndex === 0 && 'Size'}
                  {metricIndex === 1 && 'X Axis'}
                  {metricIndex === 2 && 'Y Axis'}
                </div>
              ) : (
                <>
                  <div className="y-axis-toggle-text">
                    Axis
                    <Colon />
                  </div>
                  <div>
                    {metric.yAxisPosition === 'left' ? (
                      <div onClick={() => updateYAxisPosition()}>
                        <i className="icon-axis-switch y-axis-toggle-icon" />
                      </div>
                    ) : (
                      <div
                        onClick={() => updateYAxisPosition()}
                        className="y-axis-toggle-icon-rotated"
                      >
                        <i className="icon-axis-switch y-axis-toggle-icon" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

const mapStateToProps = (state) => {
  const { groupByX, groupByY } = state?.report?.groupBy;
  const { selectedSignals } = state?.signalMultiSelect;
  const { selectedMetrics } = state?.report?.metrics;
  return {
    groupByX,
    groupByY,
    selectedSignals,
    selectedMetrics,
  };
};

const mapDispatchToProps = {
  removeMetric,
  updateMetric,
  updateMetricLegend,
  updateSelectedMetricsArr,
  setGroupByXY,
  setGroupByY,
  setTopX,
};

MetricItem.propTypes = {
  metricIndex: PropTypes.number,
  removeMetric: PropTypes.func,
  updateMetric: PropTypes.func,
  updateMetricLegend: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
  selectedSignals: PropTypes.array,
  selectedMetrics: PropTypes.array,
  setGroupByXY: PropTypes.func,
  setGroupByY: PropTypes.func,
  setTopX: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(MetricItem);
