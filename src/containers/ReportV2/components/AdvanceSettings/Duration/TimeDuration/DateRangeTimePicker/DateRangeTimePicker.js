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
import { Button, DatePicker, TimePicker } from 'antdlatest';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { useOnClickOutside } from 'common/hooks';
import { getLatestTimeSegmentBoundary } from 'containers/ReportV2/utils';
import { getAllowedTimeDurationDays } from '../const';
import './styles.scss';

const DateRangeTimePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  saveTimeDuration,
  setShowDatePicker,
  timeRangePickerRef,
  roles,
  tenant,
}) => {
  const [activeDatePicker, setActiveDatePicker] = useState('start');
  const allowedTimeDuration = getAllowedTimeDurationDays(roles, tenant);

  useOnClickOutside(timeRangePickerRef, () => {
    setShowDatePicker(false);
  });

  const setDate = (value, type) => {
    if (!value?.isValid) {
      return;
    }

    let newDate = moment(type === 'start' ? startTime : endTime);
    newDate.set({
      date: value.date(),
      month: value.month(),
      year: value.year(),
    });
    const nowMoment = getLatestTimeSegmentBoundary();

    if (type === 'start') {
      setStartDate(newDate);
      if (
        newDate.isSame(endDate, 'day') &&
        startTime.hours() >= nowMoment.hours() &&
        startTime.minutes() >= nowMoment.minutes()
      ) {
        setStartTime(moment(endTime).subtract(1, 'hours'));
      }
      if (
        Math.abs(newDate.diff(endDate, 'days')) >= allowedTimeDuration ||
        endDate.diff(newDate, 'days') < 0
      ) {
        setEndDate(moment(newDate).add(allowedTimeDuration, 'days'));
      }
    } else if (type === 'end') {
      setEndDate(newDate);
      if (
        newDate.isSame(startDate, 'day') &&
        endTime.hours() >= startTime.hours() &&
        endTime.minutes() >= startTime.minutes()
      ) {
        setEndTime(moment(startTime).add(1, 'hours'));
      }
    }
  };

  const setTime = (value, type) => {
    if (!value?.isValid) {
      return;
    }
    if (type === 'start') {
      setStartTime(value);
    } else if (type === 'end') {
      setEndTime(value);
    }
  };

  const disabledDate = (current, type) => {
    if (startDate === undefined || endDate === undefined) {
      return false;
    }
    if (type === 'start') {
      return (
        moment().add(-3, 'month') >= current ||
        current.startOf('day').valueOf() > moment().valueOf()
      );
    } else if (type === 'end') {
      return (
        current.startOf('day').valueOf() > moment().valueOf() ||
        current.startOf('day').valueOf() < startDate.startOf('day').valueOf() ||
        current.diff(startDate, 'days') > allowedTimeDuration
      );
    }
    return false;
  };

  const disabledHours = (type) => {
    const hours = [];
    const momentNow = moment();
    if (type === 'start') {
      if (startDate.isSame(momentNow, 'day')) {
        for (let i = momentNow.hour() + 1; i < 24; i++) {
          hours.push(i);
        }
      }
      if (startDate.isSame(endDate, 'day')) {
        // same date and todays date
        for (let i = endTime.hour(); i < 24; i++) {
          hours.push(i);
        }
        return hours;
      } else {
        return hours;
      }
    }

    if (type === 'end') {
      const hours = [];

      if (endDate.isSame(momentNow, 'day')) {
        for (let i = endTime.hour() + 1; i < 24; i++) {
          hours.push(i);
        }
      }

      if (startDate.isSame(endDate, 'day')) {
        // same date and todays date
        for (let i = 0; i < startTime.hour() + 1; i++) {
          hours.push(i);
        }
        return hours;
      } else {
        return hours;
      }
    }
    return [];
  };

  const disabledMinutes = (selectedHour, type) => {
    if (
      startDate.isSame(endDate, 'day') &&
      startTime.hour() === endTime.hour() &&
      selectedHour === startTime.hour()
    ) {
      if (type === 'start') {
        const min = [];
        for (let i = endTime.minute(); i < 60; i++) {
          min.push(i);
        }
        return min;
      }
      if (type === 'end') {
        const min = [];
        for (let i = 0; i < startTime.minute(); i++) {
          min.push(i);
        }
        return min;
      }
    }
    if (
      startDate.isSame(endDate, 'day') &&
      startTime.hour() === endTime.hour() &&
      selectedHour === startTime.hour() + 1
    ) {
      if (type === 'start') {
        const min = [];
        for (let i = endTime.minute(); i < 60; i++) {
          min.push(i);
        }
        return min;
      }
      if (type === 'end') {
        const min = [];
        for (let i = 0; i < startTime.minute(); i++) {
          min.push(i);
        }
        return min;
      }
    }
    const momentNow = moment();
    if (
      startDate.isSame(momentNow, 'day') &&
      selectedHour === momentNow.hour()
    ) {
      if (type === 'start') {
        const min = [];
        for (let i = startTime.minute(); i < 60; i++) {
          min.push(i);
        }
        return min;
      }
    }
    if (endDate.isSame(momentNow, 'day') && selectedHour === momentNow.hour()) {
      if (type === 'end') {
        const min = [];
        for (let i = endTime.minute(); i < 60; i++) {
          min.push(i);
        }
        return min;
      }
    }
    return [];
  };

  return (
    <div className="date-range-picker-container" ref={timeRangePickerRef}>
      <div className="date-picker-header">
        <div
          className={`header-start ${
            activeDatePicker === 'start' ? 'show-active-border' : ''
          }`}
          onClick={() => {
            setActiveDatePicker('start');
          }}
        >
          Start Date
        </div>
        <div
          className={`header-end ${
            activeDatePicker === 'end' ? 'show-active-border' : ''
          }`}
          onClick={() => {
            setActiveDatePicker('end');
          }}
        >
          End Date
        </div>
      </div>
      <div className="calendar-picker">
        {activeDatePicker === 'start' && (
          <div id="start-calendar-container">
            <DatePicker
              showToday={false}
              className="custom-daterange-picker"
              open={activeDatePicker === 'start' ? true : false}
              value={startDate}
              format={'DD/MM/YYYY'}
              onChange={(m) => setDate(m, 'start')}
              getPopupContainer={() => {
                return document.getElementById('start-calendar-container');
              }}
              disabledDate={(current) => disabledDate(current, 'start')}
              disabledTime={false}
              dropdownClassName="custom-calendar-dropdown"
              renderExtraFooter={() => {
                return (
                  <div>
                    <div
                      className="time-picker-container"
                      id="time-picker-start-time"
                    >
                      <TimePicker
                        value={startTime}
                        className="time-picker"
                        onChange={(m) => setTime(m, 'start')}
                        use12Hours={true}
                        minuteStep={5}
                        format="hh:mm A"
                        disabledHours={() => disabledHours('start')}
                        disabledMinutes={(selectedHour) =>
                          disabledMinutes(selectedHour, 'start')
                        }
                        showNow={false}
                        getPopupContainer={() => {
                          return document.getElementById(
                            'time-picker-start-time',
                          );
                        }}
                      />
                    </div>
                    <div className="time-picker-action-button">
                      <Button onClick={saveTimeDuration}>Apply</Button>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}
        {activeDatePicker === 'end' && (
          <div id="end-calendar-container" className="datepicker-container">
            <DatePicker
              showToday={false}
              className="custom-daterange-picker"
              open={activeDatePicker === 'end' ? true : false}
              value={endDate}
              format={'DD/MM/YYYY'}
              onChange={(m) => setDate(m, 'end')}
              getPopupContainer={() => {
                return document.getElementById('end-calendar-container');
              }}
              disabledDate={(current) => disabledDate(current, 'end')}
              disabledTime={false}
              dropdownClassName="custom-calendar-dropdown"
              renderExtraFooter={() => {
                return (
                  <div>
                    <div
                      className="time-picker-container"
                      id="time-picker-end-time"
                    >
                      <TimePicker
                        value={moment(endTime, 'HH:mm')}
                        className="time-picker"
                        onChange={(m) => setTime(m, 'end')}
                        use12Hours={true}
                        minuteStep={5}
                        format="hh:mm A"
                        disabledHours={() => disabledHours('end')}
                        disabledMinutes={(selectedHour) =>
                          disabledMinutes(selectedHour, 'end')
                        }
                        showNow={false}
                        getPopupContainer={() => {
                          return document.getElementById(
                            'time-picker-end-time',
                          );
                        }}
                      />
                    </div>
                    <div className="time-picker-action-button">
                      <Button
                        onClick={() => {
                          setActiveDatePicker('start');
                          saveTimeDuration();
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
DateRangeTimePicker.propTypes = {
  startDate: PropTypes.object,
  setStartDate: PropTypes.func,
  endDate: PropTypes.object,
  setEndDate: PropTypes.func,
  startTime: PropTypes.object,
  endTime: PropTypes.object,
  setStartTime: PropTypes.func,
  setEndTime: PropTypes.func,
  saveTimeDuration: PropTypes.func,
  setShowDatePicker: PropTypes.func,
  timeRangePickerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  roles: PropTypes.array,
  tenant: PropTypes.string,
};
export default DateRangeTimePicker;
