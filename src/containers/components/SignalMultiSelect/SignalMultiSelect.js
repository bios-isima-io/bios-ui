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
import { Select, Tag } from 'antdlatest';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import ipxl from '@bios/ipxl';

import { metricsActions } from 'containers/ReportV2/components/AdvanceSettings/Metrics/reducers';
import { groupByActions } from 'containers/ReportV2/components/GroupBy/reducers';
import { checkIfApproxMetricValue } from 'containers/ReportV2/utils';
import { INSIGHTS_URL, REPORT_URL } from './const';
import { signalMultiSelectActions } from './reducers/signals/index';
import { getSignalColorMapping, getSignalsList } from './utils';
import { getMetricsToRemove } from 'utils/entityDropdown';
import './styles.scss';

const { userClicks } = ipxl;
const { setSelectedSignals, fetchSignals } = signalMultiSelectActions;
const { addMetric, removeMetricsByLegendArr, updateSelectedMetricsArr } =
  metricsActions;
const { setGroupByXY } = groupByActions;
function SignalMultiSelect({
  fetchSignals,
  loadingSignals,
  signals,
  selectedSignals,
  setSelectedSignals,
  addMetric,
  removeMetricsByLegendArr,
  updateSelectedMetricsArr,
  selectedMetrics,
  setGroupByXY,
}) {
  const location = useLocation();
  const history = useHistory();
  const urlPath = window.location.pathname;
  const urlQuery = queryString.parse(location.search);
  const inputRef = useRef();

  const [signalColorMapping, setSignalColorMapping] = useState({});
  const [selectOpen, setSelectOpen] = useState(false);

  const updateSelectedValues = (_, option) => {
    if (urlPath === INSIGHTS_URL && option?.length === 1) {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: `Select ${option?.[0]?.value}`,
        rightSection: 'None',
        mainSection: 'insight',
        leftSection: 'insight',
      });
      history.push('/report/?selectedSignal=' + option?.[0]?.value);
      return;
    }
    const signalColors = getSignalColorMapping(signalColorMapping, option);
    setSignalColorMapping(signalColors);
    const selectedSignalList = option?.reduce((acc, signal) => {
      acc.push(signal.label);
      return acc;
    }, []);

    const filteredSignals = selectedSignalList?.reduce((acc, signalName) => {
      const signalObj = signals.find((sig) => {
        return sig.signalName === signalName;
      });

      signalObj.color = signalColors?.[signalName];
      acc.push(signalObj);
      return acc;
    }, []);

    setSelectedSignals(filteredSignals);

    if (selectedSignals?.length < option?.length) {
      // reset groupby
      setGroupByXY({ groupByX: '', groupByY: '' });

      //add new metric
      const signalName = option?.[option?.length - 1]?.value;
      let attribute =
        signalName === '_requests' ? 'sum(reqSuccessCount)' : 'count()';
      const metric = {
        measurement: `${signalName}.${attribute}`,
        as: `${signalName}.${attribute}`,
        type: 'simple',
        defaultGraphType:
          selectedMetrics.length > 0
            ? selectedMetrics[selectedMetrics.length - 1].defaultGraphType
            : 'bar',
        yAxisPosition: 'left',
      };
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

    if (selectedSignals.length >= option.length) {
      const metricsToRemove = getMetricsToRemove(
        selectedSignals,
        selectedMetrics,
        selectedSignalList,
        'signal',
      );
      removeMetricsByLegendArr(metricsToRemove);
      if (option.length === 0) {
        setGroupByXY({ groupByX: '', groupByY: '' });
      }
    }
    setSelectOpen(false);
    inputRef?.current?.blur();
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const underlineColor = `3px solid ${signalColorMapping?.[value]}`;
    return (
      <div className="select-tag-container">
        <Tag
          closable={closable}
          onClose={onClose}
          style={{ borderBottom: underlineColor }}
        >
          {label}
        </Tag>
      </div>
    );
  };

  useEffect(() => {
    fetchSignals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (urlPath === INSIGHTS_URL) {
      setSelectedSignals([]);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const options = selectedSignals.map((sig) => {
      return {
        disabled: false,
        label: sig.signalName,
        value: sig.signalName,
      };
    });
    const signalColors = getSignalColorMapping(signalColorMapping, options);
    setSignalColorMapping(signalColors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSignals]);

  useEffect(() => {
    const selectedSignalURL = urlQuery?.selectedSignal;
    if (
      urlPath === REPORT_URL &&
      signals.length > 0 &&
      selectedSignals.length === 0 &&
      selectedSignalURL &&
      selectedSignalURL !== ''
    ) {
      updateSelectedValues(null, [
        { label: selectedSignalURL, value: selectedSignalURL },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals]);

  const signalList = getSignalsList(signals, selectedSignals);

  return (
    <div className="signal-multi-select-container">
      <Select
        className="signal-multi-select"
        dropdownClassName="signal-multi-select-dropdown"
        value={selectedSignals.reduce((acc, sig) => {
          acc.push(sig.signalName);
          return acc;
        }, [])}
        mode="multiple"
        onChange={updateSelectedValues}
        placeholder="What are you looking for?"
        tagRender={tagRender}
        optionLabelProp="label"
        showArrow={true}
        suffixIcon={<i className="icon-search search-suffix-icon" />}
        options={signalList}
        loading={loadingSignals}
        open={selectOpen}
        onFocus={() => setSelectOpen(true)}
        onBlur={() => setSelectOpen(false)}
        ref={inputRef}
        onClick={() => {
          !selectOpen && setSelectOpen(true);
        }}
      ></Select>
    </div>
  );
}

const mapDispatchToProps = {
  fetchSignals,
  setSelectedSignals,
  addMetric,
  removeMetricsByLegendArr,
  updateSelectedMetricsArr,
  setGroupByXY,
};

const mapStateToProps = (state) => {
  const { loadingSignals, signals, selectedSignals } = state.signalMultiSelect;
  const { selectedMetrics } = state.report.metrics;
  return {
    loadingSignals,
    signals,
    selectedSignals,
    selectedMetrics,
  };
};

SignalMultiSelect.propTypes = {
  fetchSignals: PropTypes.func,
  loadingSignals: PropTypes.bool,
  signals: PropTypes.array,
  selectedSignals: PropTypes.array,
  setSelectedSignals: PropTypes.func,
  addMetric: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
  removeMetric: PropTypes.func,
  removeMetricsByLegendArr: PropTypes.func,
  selectedMetrics: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignalMultiSelect);
