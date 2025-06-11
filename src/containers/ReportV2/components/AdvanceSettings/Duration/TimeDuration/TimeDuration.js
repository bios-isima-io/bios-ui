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
import { Popover, Radio, Tooltip } from 'antdlatest';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { validateTimeDifference } from 'containers/ReportV2/components/AdvanceSettings/Duration/utils';
import Colon from 'containers/ReportV2/components/AdvanceSettings/components/Colon';
import {
  getLatestTimeSegmentBoundary,
  getTimeOffsetFromCurrentTimezone,
  shouldDisableForAdvanceMetric,
} from 'containers/ReportV2/utils';
import { ConfirmationDialog } from 'containers/components';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import DateRangeTimePicker from './DateRangeTimePicker';
import {
  ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_DURATION,
  ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_METRIC_TYPES,
  getTimeRangeMapping,
} from './const';
import { timeDurationActions } from './reducers';
import './styles.scss';
import { getDurationString } from '../utils';

const {
  setFixedTimeDuration,
  setCustomTimeDuration,
  setOnTheFly,
  setOnTheFlyRefresh,
} = timeDurationActions;

function TimeDuration({
  setFixedTimeDuration,
  setCustomTimeDuration,
  durationType,
  duration,
  durationStart,
  queryStartTime,
  userClickEvent,
  history,
  roles,
  setOnTheFly,
  onTheFly,
  setOnTheFlyRefresh,
  onTheFlyRefresh,
  timezone,
  selectedMetrics,
  selectedSignals,
  tenant,
}) {
  const timezoneVal = timezone === '' ? moment.tz.guess() : timezone;
  const [showOnTheFly, setShowOnTheFly] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(
    getLatestTimeSegmentBoundary().subtract(1, 'days'),
  );
  const [endDate, setEndDate] = useState(getLatestTimeSegmentBoundary());
  const [startTime, setStartTime] = useState(
    getLatestTimeSegmentBoundary().subtract(1, 'days'),
  );
  const [endTime, setEndTime] = useState(
    getLatestTimeSegmentBoundary().set({
      hour: 23,
      minute: 55,
    }),
  );

  const timeRangePickerRef = useRef();

  const resetDate = () => {
    const endTime = getLatestTimeSegmentBoundary();
    setStartTime(endTime.subtract(1, 'days'));
    setEndTime(endTime);
  };

  const saveTimeDuration = () => {
    const durationStart = moment().set({
      year: startDate.year(),
      month: startDate.month(),
      date: startDate.date(),
      hour: startTime.hour(),
      minute: startTime.minute(),
      second: 0,
      millisecond: 0,
    });
    const durationEnd = moment().set({
      year: endDate.year(),
      month: endDate.month(),
      date: endDate.date(),
      hour: endTime.hour(),
      minute: endTime.minute(),
      second: 0,
      millisecond: 0,
    });

    if (timezone) {
      const offset = getTimeOffsetFromCurrentTimezone(timezone);
      durationStart.add(offset, 'minutes');
      durationEnd.add(offset, 'minutes');
    }

    if (!validateTimeDifference(durationStart, durationEnd)) {
      ErrorNotification({
        message: messages.report.INVALID_DATE_RANGE,
      });
      return;
    }

    const duration = durationEnd.diff(durationStart);
    setCustomTimeDuration({
      durationStart: durationStart.valueOf(),
      duration,
    });
    setShowDatePicker(false);

    userClickEvent({
      history,
      eventLabel: `Time Duration custom`,
      rightSection: 'advancedSetting',
      mainSection: 'report',
      leftSection: 'insight',
    });
  };

  const setIntervalChange = (e) => {
    const rollupInterval = 60000;

    if (e.target.value === 'custom') {
      // handle custom duration
      // setShowDatePicker(true);
    } else {
      setFixedTimeDuration({
        duration: parseInt(e.target.value),
        rollupInterval,
      });

      userClickEvent({
        history,
        eventLabel: `Time Duration fixed`,
        rightSection: 'advancedSetting',
        mainSection: 'report',
        leftSection: 'insight',
      });
    }
  };

  const DateTimePick = () => (
    <DateRangeTimePicker
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      startTime={startTime}
      setStartTime={setStartTime}
      endTime={endTime}
      setEndTime={setEndTime}
      resetDate={resetDate}
      saveTimeDuration={saveTimeDuration}
      timeRangePickerRef={timeRangePickerRef}
      setShowDatePicker={setShowDatePicker}
      roles={roles}
      tenant={tenant}
    ></DateRangeTimePicker>
  );

  let onTheFlyDisabledMessage = null;

  if (duration !== 3600000 || durationType !== 'fixed') {
    onTheFlyDisabledMessage = ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_DURATION;
  }

  const dataSketchesUsed = selectedMetrics.some((metric) =>
    shouldDisableForAdvanceMetric(selectedSignals, metric.measurement),
  );

  if (dataSketchesUsed) {
    onTheFlyDisabledMessage =
      ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_METRIC_TYPES;
  }

  const onTheFlyDisabled = !!onTheFlyDisabledMessage;

  return (
    <div className="time-duration-container">
      <div className="header">
        <div className="header-text">
          Duration
          <Colon />
        </div>
        <div className="on-the-fly-container">
          <ConfirmationDialog
            show={showOnTheFly}
            onCancel={() => {
              setShowOnTheFly(false);
            }}
            onOk={() => {
              if (!onTheFly) {
                setOnTheFly({ onTheFly: moment.now().valueOf() });
              }
              setShowOnTheFly(false);
              setOnTheFlyRefresh({ onTheFlyRefresh: onTheFlyRefresh + 1 });
            }}
            type="exit"
            onCancelText="Dismiss"
            onOkText="Yes"
            headerTitleText="Show on the fly"
            helperText="Right now insights are worth the wait. Are you ready?"
          />
          <div
            onClick={() => {
              !onTheFlyDisabled && setShowOnTheFly(true);
            }}
          >
            <Tooltip
              title={onTheFlyDisabled ? onTheFlyDisabledMessage : 'On-the-fly'}
              placement="top"
            >
              <i
                className={`icon-refreshed ${onTheFlyDisabled && 'disabled'}`}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <Radio.Group
        buttonStyle="solid"
        className="report-graph-time-duration"
        name="radiogrp"
        value={durationType === 'custom' ? 'custom' : duration + ''}
        onChange={(e) => setIntervalChange(e)}
      >
        {getTimeRangeMapping(roles, tenant)?.map((timeConfig) => {
          if (timeConfig.value === 'custom') {
            return (
              <Radio.Button
                value={timeConfig.value}
                className={
                  durationType === 'custom'
                    ? 'ant-radio-button-wrapper-checked'
                    : 'ant-radio-button-wrapper-unchecked'
                }
                onClick={() => setShowDatePicker(true)}
                key={timeConfig.value}
              >
                <Popover
                  overlayClassName="timerange-popup"
                  placement="bottomRight"
                  content={DateTimePick}
                  visible={showDatePicker}
                >
                  {timeConfig.text}
                </Popover>
              </Radio.Button>
            );
          }
          return (
            <Radio.Button
              value={timeConfig.value}
              className={
                durationType === 'custom'
                  ? 'not-selected-radio'
                  : duration === timeConfig.value
                  ? ''
                  : 'ant-radio-button-wrapper-unchecked'
              }
              key={timeConfig.value}
            >
              {timeConfig.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>

      <div className="duration-display">
        {durationType === 'fixed' &&
          getTimeRangeMapping(roles).filter(
            (tr) => tr.value === String(duration),
          )?.[0]?.message}
        {durationType === 'custom' &&
          getDurationString(
            queryStartTime || durationStart,
            duration,
            timezoneVal,
          )}
      </div>
    </div>
  );
}

// TODO: add all the prop types and refactor unused mapStateToProps properties
TimeDuration.propTypes = {
  setFixedTimeDuration: PropTypes.func,
  setCustomTimeDuration: PropTypes.func,
  durationType: PropTypes.string,
  duration: PropTypes.number,
  durationStart: PropTypes.number,
  showDurationDatePicker: PropTypes.bool,
  roles: PropTypes.array,
  onTheFly: PropTypes.number,
  setOnTheFly: PropTypes.func,
  onTheFlyRefresh: PropTypes.number,
  setOnTheFlyRefresh: PropTypes.func,
  timezone: PropTypes.string,
  selectedMetrics: PropTypes.array,
  selectedSignals: PropTypes.array,
  tenant: PropTypes.string,
};

const mapDispatchToProps = {
  setFixedTimeDuration,
  setCustomTimeDuration,
  setOnTheFly,
  setOnTheFlyRefresh,
};

const mapStateToProps = (state) => {
  const { queryStartTime } = state.report.data;
  const {
    durationType,
    duration,
    durationStart,
    showDurationDatePicker,
    onTheFly,
    onTheFlyRefresh,
  } = state.report.duration.timeDuration;
  const { timezone } = state.report.duration.timeZone;
  const { roles } = state.authMe.authMe;
  const { selectedMetrics } = state.report.metrics;
  const { selectedSignals } = state.signalMultiSelect;
  const { tenant } = state.authMe;

  return {
    durationType,
    duration,
    durationStart,
    queryStartTime,
    showDurationDatePicker,
    roles,
    onTheFly,
    onTheFlyRefresh,
    timezone,
    selectedMetrics,
    selectedSignals,
    tenant,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDuration);
