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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'aphrodite';
import { Radio, Tooltip } from 'antdlatest';
import { windowSizeActions } from './reducers';
import { getWSBasedOnExistingWSDuration } from './util';
import { WINDOW_1_DAY, WINDOW_SIZE_MAPPING } from './const';
import { WINDOW_SIZE_DISABLED_MSG } from 'containers/ReportV2/components/GroupBy/constant';
import Colon from 'containers/ReportV2/components/AdvanceSettings/components/Colon';
import iconStyles from 'common/styles/IconStyles';
import './styles.scss';

const { setFixedWindowSize } = windowSizeActions;

function WindowSize({
  windowSize,
  setFixedWindowSize,
  duration,
  durationType,
  groupByX,
  forecast,
  userClickEvent,
  history,
}) {
  const [windowSizeMapping, setWindowSizeMapping] =
    useState(WINDOW_SIZE_MAPPING);

  const updateWindowSize = (value) => {
    setFixedWindowSize({
      windowSize: parseInt(value),
    });

    userClickEvent({
      history,
      eventLabel: `Window Size`,
      rightSection: 'advancedSetting',
      mainSection: 'report',
      leftSection: 'insight',
    });
  };

  useEffect(() => {
    const { newWindowSize, newWindowSizeMapping } =
      getWSBasedOnExistingWSDuration({ windowSize, duration });
    if (windowSize !== newWindowSize) {
      updateWindowSize(newWindowSize);
    }
    setWindowSizeMapping(newWindowSizeMapping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  // TODO: check if you can reuse code between this and time duration
  return (
    <div className="window-size-container">
      <div className="window-size-header-container">
        <div className="header">
          Window size
          <Colon />
        </div>
        {groupByX !== '' && (
          <div>
            <Tooltip title={WINDOW_SIZE_DISABLED_MSG}>
              <i className={`icon-Info ${css(iconStyles.IconInfo)}`} />
            </Tooltip>
          </div>
        )}
      </div>
      <Radio.Group
        buttonStyle="solid"
        className="window-size-duration"
        name="radiogrp"
        value={groupByX === '' ? windowSize.toString() : ''}
        onChange={(e) => updateWindowSize(e.target.value)}
      >
        {windowSizeMapping?.map((windowConfig) => {
          return (
            <Radio.Button
              value={windowConfig.value}
              className="ant-radio-button-wrapper-unchecked"
              disabled={
                windowConfig.disabled ||
                groupByX !== '' ||
                (forecast && windowConfig.value === WINDOW_1_DAY.toString())
              }
              key={windowConfig.value}
            >
              {windowConfig.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
}

const mapDispatchToProps = {
  setFixedWindowSize,
};

const mapStateToProps = (state) => {
  const { windowSize } = state.report.duration.windowSize;
  const { duration, durationType } = state.report.duration.timeDuration;
  const { groupByX } = state.report.groupBy;

  const { forecast } = state.report.duration.cyclicalComparison;
  return {
    windowSize,
    duration,
    durationType,
    groupByX,
    forecast,
  };
};

WindowSize.propTypes = {
  setFixedWindowSize: PropTypes.func,
  windowSize: PropTypes.number,
  duration: PropTypes.number,
  durationType: PropTypes.string,
  groupByX: PropTypes.string,
  forecast: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowSize);
