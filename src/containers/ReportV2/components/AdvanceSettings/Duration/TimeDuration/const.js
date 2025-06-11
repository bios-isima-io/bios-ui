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
import { css } from 'aphrodite';
import styles from './styles';

const CUSTOM_TIME_ICON = (
  <i className={`icon-Settings ${css(styles.customTimeIcon)}`}></i>
);

// const TIME_RANGE_MAPPING = [
//   { text: '1 h', value: '3600000', message: 'Last 1 hour' },
//   { text: '6 h', value: '21600000', message: 'Last 6 hours' },
//   { text: '1 d', value: '86400000', message: 'Last 1 day' },
//   { text: '3 d', value: '259200000', message: 'Last 3 days' },
//   { text: '7 d', value: '604800000', message: 'Last 7 days' },
//   { text: CUSTOM_TIME_ICON, value: 'custom', message: '' },
// ];

export const DURATION_1_HR = 3600000;
export const DURATION_6_HR = 21600000;
export const DURATION_12_HR = 43200000;
export const DURATION_1_DAY = 86400000;
export const DURATION_3_DAY = 259200000;
export const DURATION_7_DAY = 604800000;

export const TIME_LIMITED_RANGE_MAPPING = [
  { text: '1 h', value: '3600000', message: 'Last 1 hour' },
  { text: '6 h', value: '21600000', message: 'Last 6 hours' },
  { text: '12 h', value: '43200000', message: 'Last 12 hours' },
  { text: '1 d', value: '86400000', message: 'Last 1 day' },
  { text: CUSTOM_TIME_ICON, value: 'custom', message: '' },
];

const TIME_RANGE_MAPPING = [
  { text: '1 h', value: '3600000', message: 'Last 1 hour' },
  { text: '6 h', value: '21600000', message: 'Last 6 hours' },
  { text: '12 h', value: '43200000', message: 'Last 12 hours' },
  { text: '1 d', value: '86400000', message: 'Last 1 day' },
  { text: '3 d', value: '259200000', message: 'Last 3 days' },
  { text: CUSTOM_TIME_ICON, value: 'custom', message: '' },
];

const TIME_RANGE_MAPPING_INCREASED_RANGE = [
  { text: '1 h', value: '3600000', message: 'Last 1 hour' },
  { text: '6 h', value: '21600000', message: 'Last 6 hours' },
  { text: '12 h', value: '43200000', message: 'Last 12 hours' },
  { text: '1 d', value: '86400000', message: 'Last 1 day' },
  { text: '3 d', value: '259200000', message: 'Last 3 days' },
  { text: '7 d', value: '604800000', message: 'Last 7 days' },
  { text: CUSTOM_TIME_ICON, value: 'custom', message: '' },
];

const SYSTEM_ADMIN = 'SystemAdmin';
const INCREASED_TIME_RANGE_TENANT = [];

const getTimeRangeMapping = (roles, tenant) => {
  if (
    roles.includes(SYSTEM_ADMIN) ||
    INCREASED_TIME_RANGE_TENANT.includes(tenant)
  ) {
    return TIME_RANGE_MAPPING_INCREASED_RANGE;
  }
  return TIME_RANGE_MAPPING;
};

const ALLOWED_TIME_DURATION_DAYS = 3;
const ALLOWED_TIME_DURATION_DAYS_INCREASED_RANGE = 6;
const ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_DURATION =
  'On-the-fly supports only one hour duration';
const ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_METRIC_TYPES =
  'On-the-fly disabled when advanced metrics are used';

const getAllowedTimeDurationDays = (roles, tenant) => {
  if (
    roles.includes(SYSTEM_ADMIN) ||
    INCREASED_TIME_RANGE_TENANT.includes(tenant)
  ) {
    return ALLOWED_TIME_DURATION_DAYS_INCREASED_RANGE;
  }
  return ALLOWED_TIME_DURATION_DAYS;
};
export {
  TIME_RANGE_MAPPING,
  TIME_RANGE_MAPPING_INCREASED_RANGE,
  CUSTOM_TIME_ICON,
  ALLOWED_TIME_DURATION_DAYS,
  ALLOWED_TIME_DURATION_DAYS_INCREASED_RANGE,
  ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_DURATION,
  ON_THE_FLY_TOOLTIP_MESSAGE_DISABLED_FOR_METRIC_TYPES,
  getTimeRangeMapping,
  getAllowedTimeDurationDays,
};
