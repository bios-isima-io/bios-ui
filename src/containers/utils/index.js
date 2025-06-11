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
import bios, { BiosErrorType } from '@bios/bios-sdk';

import { notification } from 'antdlatest';
import shortid from 'shortid';
import zxcvbn from 'zxcvbn';

import { VALIDATION_REGEX } from './constants';

const ErrorNotification = ({ message = '', title = 'Error', ...rest }) => {
  notification.open({
    message: title,
    description: message,
    top: 24,
    className: 'bios-toast toast-error',
    duration: 15,
    ...rest,
  });
};

const SuccessNotification = ({ message = '', title = 'Success', ...rest }) => {
  notification.open({
    message: title,
    description: message,
    top: 24,
    className: 'bios-toast toast-success',
    duration: 5,
    ...rest,
  });
};

const WarningNotification = ({ message = '', title = 'Warning', ...rest }) => {
  notification.open({
    message: title,
    description: message,
    top: 24,
    className: 'bios-toast toast-warn',
    duration: 15,
    ...rest,
  });
};

const InfoNotification = ({ message = '', title = 'Info', ...rest }) => {
  notification.open({
    message: title,
    description: message,
    top: 24,
    className: 'bios-toast toast-info',
    duration: 5,
    ...rest,
  });
};

const handleAPIError = (
  e,
  defaultMessage = 'API error',
  suppressNotification = false,
) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(e?.stack);
  }
  let message = '';
  try {
    if (
      [
        BiosErrorType.UNAUTHORIZED.errorCode,
        BiosErrorType.INVALID_PASSWORD.errorCode,
      ].includes(e?.errorCode)
    ) {
      message = 'The password or the email is incorrect';
    } else if (typeof e?.message === 'string') {
      message = e?.message;
    } else {
      let data = e.error[0];
      if (data instanceof ArrayBuffer) {
        const payload = String.fromCharCode.apply(
          null,
          new Uint8Array(data, 0, data.byteLength),
        );
        data = JSON.parse(payload);
        if (data?.message !== '') {
          message = data.message;
        }
      } else if (e?.['error']?.[0]?.message) {
        message = e?.['error']?.[0]?.message;
      } else if (e?.['error']?.[0]) {
        message = e?.['error']?.[0];
      } else {
        message = defaultMessage;
      }
    }
  } catch {
    message = defaultMessage;
  }
  if (!suppressNotification) {
    ErrorNotification({
      message,
    });
  }
  return message;
};

const validateEmail = (email) => {
  /* eslint-disable */
  if (
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )
  ) {
    return true;
  }
  return false;
  /* eslint-enable */
};

const validatePrivateEmail = (email) => {
  /* eslint-disable */
  const freeRegex =
    /^[\w-\.]+@([hotmail+\.]|[yahoo+\.]|[gmail+\.])+[\w-]{2,4}$/;
  /* eslint-enable */
  if (email.match(freeRegex)) {
    return true;
  }
  return false;
};

/**
 * Assign IDs to all properties of an object (e.g. signalDetail) recursively.
 *
 * The name of the property is '_id'. Existing IDs are preserved.
 *
 * @param targetObject {object} object to be assigned IDs
 * @returns {object} Clone of the object with IDs assigned to object properties
 */
const assignIds = (targetObject) => {
  if (Array.isArray(targetObject)) {
    return targetObject.map((element) => assignIds(element));
  }
  if (targetObject instanceof Object) {
    const entries = Object.entries(targetObject);
    if (entries?.length > 0 && targetObject?._id === undefined) {
      const result = { _id: shortid.generate() };
      for (const [name, value] of entries) {
        result[name] = assignIds(value);
      }
      return result;
    }
  }
  // scalar, null, or undefined
  return targetObject;
};

/**
 * Removes locally-added properties from an object, e.g. signalDetail.
 *
 * The method assumes that any local properties start with underscore ('_').
 *
 * @param streamConfig {object} - The source stream config
 * @returns {object} Clone of the source stream config with local properties stripped off
 */
const removeInternalProps = (streamConfig) => {
  if (Array.isArray(streamConfig)) {
    return streamConfig.map((element) => removeInternalProps(element));
  }
  if (streamConfig instanceof Object) {
    const result = {};
    for (const [name, value] of Object.entries(streamConfig)) {
      if (name.startsWith('_') || name === 'isNewEntry') {
        // local properties
        continue;
      }
      result[name] = removeInternalProps(value);
    }
    return result;
  }
  // scalar
  return streamConfig;
};

/**
 * Checks if the user role contains any allowed role.
 *
 * @param {array} allowedRoles - Allowed role names
 * @param {array} userRoles - User's role names
 * @returns {bool} If the user includes an allowed role
 */
const isAccessAllowed = (allowedRoles, userRoles) => {
  return userRoles?.some((role) => allowedRoles.includes(role));
};

const validatePassword = (password) => {
  const hasLower = VALIDATION_REGEX.small.test(password);
  const hasUpper = VALIDATION_REGEX.capital.test(password);
  const hasSymbol = VALIDATION_REGEX.special.test(password);
  const hasNumber = VALIDATION_REGEX.digit.test(password);
  const lengthGood = password.length >= 8;
  const valid = hasLower && hasUpper && hasSymbol && hasNumber && lengthGood;
  const score = zxcvbn(password).score;

  return {
    hasLower,
    hasUpper,
    hasSymbol,
    hasNumber,
    lengthGood,
    valid,
    score,
  };
};

/**
 * Fetches active streams by querying _usage or _operation signal.
 *
 * @param {string} tenantName - Target tenant name
 * @returns {object} key: stream name (all lower case), value: object with properties -
 * successCount and failureCount
 */
const fetchActiveStreams = async (tenantName, duration) => {
  let signalName = '_usage';
  let whereClause =
    "request IN ('INSERT', 'INSERT_BULK', 'UPSERT', 'UPDATE', 'DELETE')";
  if (tenantName === '_system') {
    signalName = '_operations';
    whereClause += " AND tenant = '_system'";
  }

  const start = bios.time.now();
  if (!duration) {
    duration = bios.time.minutes(15);
  }
  const interval = bios.time.minutes(5);

  const statement = bios
    .iSqlStatement()
    .select(
      'stream',
      'sum(numSuccessfulOperations)',
      'sum(numValidationErrors)',
    )
    .from(signalName)
    .groupBy('stream')
    .where(whereClause)
    .tumblingWindow(duration)
    .snappedTimeRange(start, -duration, interval)
    .build();

  const response = await bios.multiExecute(statement);

  const systemInternalSignals = [
    'audit_log',
    '_allClientMetrics',
    '_allOperationFailure',
    '_failureReport',
    '_operations',
    '_query',
  ];
  const regularInternalSignals = ['_usage', '_clientMetrics'];

  const signalStatuses = {};
  // put dummy data for internal signals
  const internalSignals =
    tenantName === '_system' ? systemInternalSignals : regularInternalSignals;
  internalSignals.forEach((signal) => {
    signalStatuses[signal.toLowerCase()] = {
      successCount: 1,
      failureCount: 0,
    };
  });

  response?.[0]?.dataWindows?.[0]?.records?.forEach((record) => {
    const value = {
      successCount: record[1],
      failureCount: record[2],
    };
    signalStatuses[record[0].toLowerCase()] = value;
  });

  return signalStatuses;
};

/**
 * Resolves error percentage zone.
 *
 * Zones:
 *      - 1% : low_error
 *  1% - 10% : medium_errors
 * 10% - 30% : high_errors
 * 30% -     : extreme_high_errors
 *
 * @param {number} errorPercentage - Error percentage
 * @returns {string} Error percentage zone
 *
 */
const getErrorPercentageZone = (errorPercentage) => {
  let errorStatus;
  switch (true) {
    case errorPercentage > 30:
      errorStatus = 'extreme_high_errors';
      break;
    case errorPercentage > 10:
      errorStatus = 'high_errors';
      break;
    case errorPercentage > 1:
      errorStatus = 'medium_errors';
      break;
    case errorPercentage > 0:
      errorStatus = 'low_errors';
      break;
    default:
      errorStatus = 'low_errors';
  }
  return errorStatus;
};

/**
 * Incorporates an attribute synopsis into an attributeDetails object.
 *
 * @param {object} attributesSynopses - Map of lower-case attribute name and synopsis
 * @param {object} attributeDetails - Target attribute details object
 *
 * @returns {object} Incorporated attribute details
 */
const incorporateAttributeSynopsis = (attributesSynopses, attributeDetails) => {
  const data = attributesSynopses[attributeDetails.attributeName.toLowerCase()];

  if (data) {
    attributeDetails.showTrendLine = true;
    attributeDetails.showPercentageChange = true;
    attributeDetails.trendPercentChange = data.firstSummaryTrendPercent
      ? Math.floor(Math.abs(data.firstSummaryTrendPercent))
      : undefined;
    attributeDetails.positiveTrend = data.firstSummaryTrendDesirability;

    attributeDetails.trendLineData = {
      startTime: data.startTime,
      count: data.count,
      distinctCount: data.distinctCount,
    };

    attributeDetails.synopsisTags = {
      firstSummary: data.firstSummary,
    };

    attributeDetails.distinctCountSummaryNumber = data.distinctCountCurrent;
    attributeDetails.trendLineData = {
      ...attributeDetails.trendLineData,
      sum: data.sum,
      max: data.max,
      min: data.min,
      avg: data.avg,
      kurtosis: data.kurtosis,
      skewness: data.skewness,
      stddev: data.stddev,
      median: data.median,
      p1: data.p1,
      p25: data.p25,
      p75: data.p75,
      p99: data.p99,
      sample: data.sample ?? data.samples,
      sampleCount: data.sampleCount ?? data.sampleCounts,
      sampleLength: data.sampleLength ?? data.sampleLengths,
    };

    if (data.timestampLagMinutes) {
      attributeDetails.trendLineData = {
        ...attributeDetails.trendLineData,
        timestamp_lag: data.timestampLagMinutes,
      };
    }
  }
  return attributeDetails;
};

export {
  ErrorNotification,
  SuccessNotification,
  WarningNotification,
  InfoNotification,
  handleAPIError,
  validateEmail,
  validatePrivateEmail,
  assignIds,
  removeInternalProps,
  isAccessAllowed,
  validatePassword,
  fetchActiveStreams,
  getErrorPercentageZone,
  incorporateAttributeSynopsis,
};
