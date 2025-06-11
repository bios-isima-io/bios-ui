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
import { css } from 'aphrodite';
import { debounce } from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import iconStyles from 'common/styles/IconStyles';
import SwitchWrapper from 'components/Switch';
import Colon from 'containers/ReportV2/components/AdvanceSettings/components/Colon';
import { CYCLICAL_DISABLED_MSG } from 'containers/ReportV2/components/GroupBy/constant';
import { InfoNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { getCCStartTimestamp } from '../../../ReportGraph/utils';
import { getDurationString } from '../utils';
import CustomDateTimePicker from './CustomDateTimePicker/CustomDateTimePicker';
import { TIME_RANGE_MAP } from './const';
import { cyclicalComparisonActions } from './reducers';
import './styles.scss';
import {
  getCyclicalComparisonStartEpoch,
  getDefaultCyclicalComparisonStart,
  getTimeRangeMap,
  getTimeRangeText,
} from './utils';
import { WINDOW_1_DAY } from '../WindowSize/const';
import { getTimeOffsetFromCurrentTimezone } from 'containers/ReportV2/utils';

const showNotification = debounce((msg) => {
  InfoNotification({
    message: msg,
  });
}, 500);

const {
  setCCStatus,
  setCCDisabled,
  setFixedCC,
  setCustomCC,
  setForecast,
  setForecastDisabled,
} = cyclicalComparisonActions;

function CyclicalComparison({
  cyclicalComparisonOn,
  cyclicalComparisonDisabled,
  cyclicalComparisonStart,
  cyclicalComparisonCustom,
  setCCStatus,
  setCCDisabled,
  setFixedCC,
  setCustomCC,
  setForecast,
  selectedMetrics,
  setForecastDisabled,

  durationStart,
  queryStartTime,
  duration,
  durationType,
  timezone,
  forecast,
  forecastDisabled,
  groupByX,
  groupByY,
  windowSize,
  userClickEvent,
  history,
}) {
  const timezoneVal = timezone === '' ? moment.tz.guess() : timezone;
  const ccStart = getCCStartTimestamp(
    cyclicalComparisonStart,
    queryStartTime || durationStart,
    cyclicalComparisonCustom,
  );
  const enabled =
    !cyclicalComparisonDisabled &&
    cyclicalComparisonOn &&
    cyclicalComparisonStart;

  const [timeRangeMapping, setTimeRangeMapping] = useState(TIME_RANGE_MAP);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getCCInitialTime = () =>
    moment(
      getCyclicalComparisonStartEpoch(cyclicalComparisonStart, durationStart),
    );

  const [cStartDate, setCStartDate] = useState(getCCInitialTime());
  const [cStartTime, setCStartTime] = useState(getCCInitialTime());
  const [prevDurationType, setCurrentDurationType] = useState('');
  const [prevDuration, setCurrentDuration] = useState(0);
  const [prevCyclicalComparisonOn, setCurrentCyclicalComparisonOn] =
    useState(false);

  const cDatePickerRef = useRef();

  const resetDate = () => {
    setCStartDate(moment());
  };

  const saveCyclicalDuration = () => {
    const cyclicalDelta = durationStart - cStartTime.valueOf();

    if (timezone) {
      const offset = getTimeOffsetFromCurrentTimezone(timezone);
      cStartTime.add(offset, 'minutes');
    }

    setCustomCC({
      cyclicalComparisonStart: cStartTime.valueOf(),
      cyclicalDelta,
    });
    setShowDatePicker(false);
    userClickEvent({
      history,
      eventLabel: `Cyclical Comparison - custom`,
      rightSection: 'advancedSetting',
      mainSection: 'report',
      leftSection: 'insight',
    });
  };

  const getClassName = (timeConfig) => {
    return 'ant-radio-button-wrapper-unchecked';
  };

  const updateCyclicalStart = (e) => {
    if (e.target.value !== 'custom') {
      setFixedCC({
        cyclicalComparisonStart: e.target.value,
      });
      userClickEvent({
        history,
        eventLabel: `Cyclical Comparison  fixed`,
        rightSection: 'advancedSetting',
        mainSection: 'report',
        leftSection: 'insight',
      });
    }
  };

  useEffect(() => {
    const switchedToRegularDuration =
      durationType === 'fixed' && duration !== prevDuration;

    if (
      prevDurationType !== '' &&
      !cyclicalComparisonDisabled &&
      cyclicalComparisonOn &&
      (!prevCyclicalComparisonOn || switchedToRegularDuration)
    ) {
      const timeRangeMap = getTimeRangeMap(duration);
      setTimeRangeMapping(timeRangeMap);
      let newCyclicalComparisonStart =
        getDefaultCyclicalComparisonStart(duration);
      if (
        switchedToRegularDuration &&
        newCyclicalComparisonStart !== cyclicalComparisonStart
      ) {
        const newTimeRangeText = getTimeRangeText(duration);
        let msg = messages.report.timeRangeChange(
          newTimeRangeText,
          newCyclicalComparisonStart,
        );
        showNotification(msg);
      }
      setFixedCC({
        cyclicalComparisonStart: newCyclicalComparisonStart,
      });
    }
    setCurrentDurationType(durationType);
    setCurrentDuration(duration);
    setCurrentCyclicalComparisonOn(cyclicalComparisonOn);
  }, [
    prevCyclicalComparisonOn,
    prevDuration,
    prevDurationType,
    cyclicalComparisonDisabled,
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    duration,
    durationType,
    setFixedCC,
  ]);

  useEffect(() => {
    let ccStatusDisabled =
      selectedMetrics.length !== 1 ||
      selectedMetrics?.[0]?.defaultGraphType === 'packedbubble'
        ? true
        : false;
    setCCDisabled(ccStatusDisabled);
    if (ccStatusDisabled && cyclicalComparisonOn) {
      setCCStatus(false);
      setFixedCC({
        cyclicalComparisonStart: null,
      });
    } else if (
      !ccStatusDisabled &&
      cyclicalComparisonOn &&
      !cyclicalComparisonStart
    ) {
      setFixedCC({
        cyclicalComparisonStart: 'Hourly',
      });
    }
  }, [
    cyclicalComparisonOn,
    selectedMetrics,
    setCCDisabled,
    setCCStatus,
    setFixedCC,
  ]);

  useEffect(() => {
    if (
      selectedMetrics?.length === 1 &&
      selectedMetrics?.[0]?.defaultGraphType === 'line' &&
      groupByX === '' &&
      groupByY === '' &&
      durationType === 'fixed' &&
      windowSize !== WINDOW_1_DAY
    ) {
      forecastDisabled && setForecastDisabled({ forecastDisabled: false });
    } else {
      !forecastDisabled && setForecastDisabled({ forecastDisabled: true });
    }
  }, [selectedMetrics, groupByX, groupByY, durationType, windowSize]);

  useEffect(() => {
    if (cyclicalComparisonOn) {
      const timeRangeMap = getTimeRangeMap(duration);
      setTimeRangeMapping(timeRangeMap);
    }
  }, [cyclicalComparisonOn, duration]);

  useEffect(() => {
    if (
      cyclicalComparisonOn &&
      durationType === 'custom' &&
      !cyclicalComparisonCustom
    ) {
      const newCyclicalComparisonStart =
        getDefaultCyclicalComparisonStart(duration);
      setFixedCC({
        cyclicalComparisonStart: newCyclicalComparisonStart,
      });
    }
  }, [duration]);

  const DateTimePicker = () => (
    <CustomDateTimePicker
      cStartDate={cStartDate}
      setCStartDate={setCStartDate}
      cStartTime={cStartTime}
      setCStartTime={setCStartTime}
      resetDate={resetDate}
      saveCyclicalDuration={saveCyclicalDuration}
      cDatePickerRef={cDatePickerRef}
      setShowDatePicker={setShowDatePicker}
      timeDurationStart={durationStart}
      timeDuration={duration}
    ></CustomDateTimePicker>
  );

  const getCCDurationString = () =>
    getDurationString(ccStart, duration, timezoneVal);

  return (
    <div className="cyclical-comp-container">
      <div className="cc-header">
        <div className="title">
          Cyclical Comparison
          <Colon />
        </div>
        <SwitchWrapper
          onChange={(val) => {
            setCCStatus(val);
            userClickEvent({
              history,
              eventLabel: `Cyclical Comparison Toggle`,
              rightSection: 'advancedSetting',
              mainSection: 'report',
              leftSection: 'insight',
            });
          }}
          disabled={cyclicalComparisonDisabled}
          checked={cyclicalComparisonDisabled ? false : cyclicalComparisonOn}
          offLabel="OFF"
          onLabel="ON"
        />

        {cyclicalComparisonDisabled && (
          <div className="cyclical-disabled-wrapper">
            <Tooltip title={CYCLICAL_DISABLED_MSG}>
              <i className={`icon-Info ${css(iconStyles.IconInfo)}`} />
            </Tooltip>
          </div>
        )}
      </div>
      <Radio.Group
        value={
          cyclicalComparisonOn
            ? cyclicalComparisonCustom ||
              !['Hourly', 'Daily', 'Weekly'].includes(cyclicalComparisonStart)
              ? 'custom'
              : cyclicalComparisonStart
            : null
        }
        buttonStyle="solid"
        onChange={updateCyclicalStart}
        disabled={cyclicalComparisonDisabled}
        className="cyclical-comparison"
      >
        {timeRangeMapping.map((timeConfig) => {
          if (timeConfig.value === 'custom') {
            return (
              <Radio.Button
                disabled={timeConfig.disabled || !enabled}
                value={enabled ? timeConfig.value : ''}
                className={getClassName(timeConfig)}
                onClick={() => setShowDatePicker(true)}
                key={timeConfig.value}
              >
                <Popover
                  overlayClassName="timerange-popup"
                  placement="bottomRight"
                  content={DateTimePicker}
                  visible={showDatePicker}
                >
                  {timeConfig.text}
                </Popover>
              </Radio.Button>
            );
          }
          return (
            <Radio.Button
              disabled={timeConfig.disabled || !enabled}
              value={enabled ? timeConfig.value : ''}
              className={getClassName(timeConfig)}
              key={timeConfig.value}
            >
              {timeConfig.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>
      <div className="duration-display">
        {enabled ? getCCDurationString() : <span> </span>}
      </div>

      <div className="cc-header" style={{ marginTop: '20px' }}>
        <div className="title">
          Forecast&nbsp;(Alpha)
          <Colon />
        </div>
        <SwitchWrapper
          onChange={(val) => {
            setForecast({ forecast: val });
          }}
          disabled={forecastDisabled}
          checked={forecastDisabled ? false : forecast}
          offLabel="OFF"
          onLabel="ON"
        />

        {forecastDisabled && (
          <div className="cyclical-disabled-wrapper">
            <Tooltip
              title={
                'Forecast works with single metric line chart with groupby disabled.'
              }
            >
              <i className={`icon-Info ${css(iconStyles.IconInfo)}`} />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setCCStatus,
  setCCDisabled,
  setFixedCC,
  setCustomCC,
  setForecast,
  setForecastDisabled,
};

const mapStateToProps = (state) => {
  const {
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,
    forecastDisabled,
  } = state.report.duration.cyclicalComparison;

  const { groupByX, groupByY } = state?.report?.groupBy;

  const { selectedMetrics } = state.report.metrics;

  const { duration, durationStart, durationType } =
    state.report.duration.timeDuration;

  const { windowSize } = state.report.duration.windowSize;

  const { queryStartTime } = state.report.data;

  const { timezone } = state.report.duration.timeZone;
  return {
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    forecast,
    forecastDisabled,
    groupByX,
    groupByY,

    durationStart,
    duration,
    durationType,
    selectedMetrics,
    queryStartTime,
    timezone,
    windowSize,
  };
};

CyclicalComparison.propTypes = {
  cyclicalComparisonOn: PropTypes.bool,
  cyclicalComparisonCustom: PropTypes.bool,
  cyclicalComparisonDisabled: PropTypes.bool,
  cyclicalComparisonStart: PropTypes.any,
  setCCStatus: PropTypes.func,
  setFixedCC: PropTypes.func,
  setCustomCC: PropTypes.func,
  setCCDisabled: PropTypes.func,
  setForecastDisabled: PropTypes.func,
  selectedMetrics: PropTypes.array,
  durationStart: PropTypes.number,
  duration: PropTypes.number,
  durationType: PropTypes.string,
  timezone: PropTypes.string,
  forecast: PropTypes.bool,
  forecastDisabled: PropTypes.bool,
  windowSize: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(CyclicalComparison);
