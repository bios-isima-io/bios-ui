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
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { groupByActions } from 'containers/ContextReport/components/GroupBy/reducers';
import { metricsActions } from 'containers/ContextReport/components/AdvanceSettings/MetricsNew/reducers';
import { contextMultiSelectActions } from './reducers/context/index';
import queryString from 'query-string';
import { getContextColorMapping, getContextList } from './utils';
import { getMetricsToRemove } from 'utils/entityDropdown';
import './styles.scss';

const { setSelectedContexts, fetchContexts } = contextMultiSelectActions;
const { setGroupByXY } = groupByActions;
const { addMetric, removeMetricsByLegendArr, updateSelectedMetricsArr } =
  metricsActions;

function ContextMultiSelect({
  fetchContexts,
  loadingContexts,
  contexts,
  selectedContexts,
  setSelectedContexts,
  selectedMetrics,
  setGroupByXY,
  groupByX,
  addMetric,
  removeMetricsByLegendArr,
  updateSelectedMetricsArr,
}) {
  const location = useLocation();
  const history = useHistory();
  const urlPath = window.location.pathname;
  const urlQuery = queryString.parse(location.search);
  const inputRef = useRef();
  const [contextColorMapping, setContextColorMapping] = useState({});
  const [selectOpen, setSelectOpen] = useState(false);
  const updateSelectedValues = (_, option) => {
    if (urlPath === '/insights' && option?.length === 1) {
      history.push('/context-report/?selectedContext=' + option?.[0]?.value);
      return;
    }
    const contextColors = getContextColorMapping(contextColorMapping, option);
    setContextColorMapping(contextColors);
    let selectedContextList = option?.reduce((acc, context) => {
      acc.push(context.label);
      return acc;
    }, []);

    const filteredContexts = selectedContextList?.reduce((acc, contextName) => {
      const contextObj = contexts.find((con) => {
        return con.contextName === contextName;
      });

      contextObj.color = contextColors?.[contextName];
      acc.push(contextObj);
      return acc;
    }, []);
    setSelectedContexts(filteredContexts);

    if (selectedContexts?.length < option?.length) {
      // reset groupby
      setGroupByXY({ groupByX: '', groupByY: '' });

      // add new metric
      const contextName = option?.[option?.length - 1]?.value;
      let attribute = 'count()';

      if (selectedMetrics?.length === 0) {
        const metric = {
          measurement: `${contextName}.${attribute}`,
          as: `${contextName}.${attribute}`,
          type: 'simple',
          defaultGraphType:
            selectedMetrics?.length > 0
              ? selectedMetrics?.[selectedMetrics.length - 1].defaultGraphType
              : 'donut',
        };
        addMetric(metric);
      }
    }

    if (selectedContexts.length >= option.length) {
      const metricsToRemove = getMetricsToRemove(
        selectedContexts,
        selectedMetrics,
        selectedContextList,
        'context',
      );
      removeMetricsByLegendArr(metricsToRemove);
      if (option.length === 0) {
        setGroupByXY({ groupByX: '', groupByY: '' });
      }
    }

    setSelectOpen(false);
    inputRef?.current?.blur();
  };

  useEffect(() => {
    if (selectedMetrics?.length === 0 && selectedContexts?.length === 1) {
      const metric = {
        measurement: `${selectedContexts?.[0]?.contextName}.count()`,
        as: `${selectedContexts?.[0]?.contextName}.count()`,
        type: 'simple',
        defaultGraphType:
          selectedMetrics?.length > 0
            ? selectedMetrics?.[selectedMetrics.length - 1].defaultGraphType
            : 'donut',
      };
      addMetric(metric);
    }
  }, [selectedContexts]);

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const underlineColor = `3px solid ${contextColorMapping?.[value]}`;
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
    fetchContexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (urlPath === '/insights') {
      setSelectedContexts([]);
      return;
    }
  }, []);

  useEffect(() => {
    const options = selectedContexts.map((con) => {
      return {
        disabled: false,
        label: con.contextName,
        value: con.contextName,
      };
    });
    const contextColors = getContextColorMapping(contextColorMapping, options);
    setContextColorMapping(contextColors);
  }, [selectedContexts]);

  useEffect(() => {
    if (selectedContexts?.length === 0 && groupByX && groupByX !== '') {
      setGroupByXY({ groupByX: '', groupByY: '' });
    }
  }, [selectedContexts, groupByX, setGroupByXY]);

  useEffect(() => {
    const selectedContextURL = urlQuery?.selectedContext;
    if (
      urlPath === '/context-report/' &&
      contexts.length > 0 &&
      selectedContexts.length === 0 &&
      selectedContextURL &&
      selectedContextURL !== ''
    ) {
      updateSelectedValues(null, [
        { label: selectedContextURL, value: selectedContextURL },
      ]);
    }
  }, [contexts]);

  const contextList = getContextList(contexts, selectedContexts);

  return (
    <div className="context-multi-select-container">
      <Select
        className="context-multi-select"
        dropdownClassName="context-multi-select-dropdown"
        value={selectedContexts.reduce((acc, con) => {
          acc.push(con.contextName);
          return acc;
        }, [])}
        mode="multiple"
        onChange={updateSelectedValues}
        placeholder="What are you looking for?"
        tagRender={tagRender}
        optionLabelProp="label"
        showArrow={true}
        suffixIcon={<i className="icon-search search-suffix-icon" />}
        options={contextList}
        loading={loadingContexts}
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
  fetchContexts,
  setSelectedContexts,
  setGroupByXY,
  addMetric,
  removeMetricsByLegendArr,
  updateSelectedMetricsArr,
};

const mapStateToProps = (state) => {
  const { loadingContexts, contexts, selectedContexts } =
    state.contextReport.contextMultiSelect;
  const { selectedMetrics } = state.contextReport.metrics;
  const { groupByX } = state.contextReport.groupBy;
  return {
    loadingContexts,
    contexts,
    selectedContexts,
    selectedMetrics,
    groupByX,
  };
};

ContextMultiSelect.propTypes = {
  fetchContexts: PropTypes.func,
  loadingContexts: PropTypes.bool,
  contexts: PropTypes.array,
  selectedContexts: PropTypes.array,
  setSelectedContexts: PropTypes.func,
  setGroupByXY: PropTypes.func,
  groupByX: PropTypes.string,
  removeMetricsByLegendArr: PropTypes.func,
  updateSelectedMetricsArr: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextMultiSelect);
