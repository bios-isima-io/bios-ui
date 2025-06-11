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
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Tooltip } from 'antdlatest';
import { DEFAULT_GROUPBY_X_TOP_N, DEFAULT_GROUPBY_Y_TOP_N } from './const';
import { Y_AXIS_SHOW_TOP, X_AXIS_SHOW_TOP } from './const';
import { dataGranularityActions } from './reducers';
import { getShouldAllowTop } from './utils';
import './styles.scss';
import './../../../styles.scss';

const { Option } = Select;

const { setTopX, setTopY } = dataGranularityActions;

const TopDisableInfo = ({ level }) => {
  return (
    <Tooltip
      title={`Enable split-by ${level} axis to use Top-N`}
      overlayClassName="top-n-tooltip"
    >
      <i className="icon-Info" />
    </Tooltip>
  );
};

function DataGranularity({
  topX,
  topY,
  setTopX,
  setTopY,
  groupByX,
  groupByY,
  history,
}) {
  const { shouldAllowTopX, shouldAllowTopY } = getShouldAllowTop({
    groupByX,
    groupByY,
  });

  return (
    <div className="report-data-granularity">
      <div className="data-granularity-x-axis">
        <div className="text label">Level 1</div>
        <div className="text value">Show Top</div>
        <div>
          <Select
            defaultValue={DEFAULT_GROUPBY_X_TOP_N}
            value={shouldAllowTopX ? topX : ''}
            onChange={(val) => {
              setTopX(parseInt(val));
            }}
            disabled={!shouldAllowTopX}
            dropdownClassName="select-dropdown"
            className="select-container"
            suffixIcon={() => <i className="icon-chevron-down"></i>}
          >
            {X_AXIS_SHOW_TOP.map((val) => (
              <Option value={val} key={val.toString()}>
                {val}
              </Option>
            ))}
          </Select>
        </div>
        {!shouldAllowTopX && (
          <div className="top-disable-container">
            <TopDisableInfo level="Level 1"></TopDisableInfo>
          </div>
        )}
      </div>
      <div className="data-granularity-y-axis">
        <div className="text label">Level 2</div>
        <div className="text value">Show Top</div>
        <div>
          <Select
            defaultValue={DEFAULT_GROUPBY_Y_TOP_N}
            value={shouldAllowTopY ? topY : ''}
            onChange={(val) => {
              setTopY(parseInt(val));
            }}
            disabled={!shouldAllowTopY}
            dropdownClassName="select-dropdown"
            className="select-container"
            suffixIcon={() => <i className="icon-chevron-down"></i>}
          >
            {Y_AXIS_SHOW_TOP.map((val) => (
              <Option value={val} key={val.toString()}>
                {val}
              </Option>
            ))}
          </Select>
        </div>
        {!shouldAllowTopY && (
          <div className="top-disable-container">
            <TopDisableInfo level="Level 2"></TopDisableInfo>
          </div>
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setTopX,
  setTopY,
};

const mapStateToProps = (state) => {
  const { topX, topY } = state?.contextReport?.dataGranularity;
  const { groupByX, groupByY } = state?.contextReport?.groupBy;
  return {
    topX,
    topY,
    groupByX,
    groupByY,
  };
};

DataGranularity.propTypes = {
  setTopX: PropTypes.func,
  setTopY: PropTypes.func,
  topY: PropTypes.number,
  topX: PropTypes.number,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGranularity);
