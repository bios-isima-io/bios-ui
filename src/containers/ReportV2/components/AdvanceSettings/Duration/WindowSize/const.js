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
const ALLOWED_WINDOW_SIZES = [
  300000, 900000, 1800000, 3600000, 10800000, 86400000,
];

const WINDOW_5_MIN = 300000;
const WINDOW_15_MIN = 900000;
const WINDOW_1_DAY = 86400000;
const WINDOW_3_DAY = 10800000;

const WINDOW_SIZE_MAPPING = [
  { text: '5 m', value: '300000', message: '5 minutes', disabled: false },
  { text: '15 m', value: '900000', message: '15 minutes', disabled: false },
  { text: '30 m', value: '1800000', message: '30 minutes', disabled: false },
  { text: '1 h', value: '3600000', message: '1 hour', disabled: false },
  { text: '3 h', value: '10800000', message: '3 hours', disabled: false },
  { text: '1 d', value: '86400000', message: '1 day', disabled: false },
];

const DURATION_MIN_WINDOW_SIZE_ALLOWED = {
  3600000: 300000, // 1hr => all window sizes
  21600000: 900000, // 6hr => all window sizes
  86400000: 1800000, // 1day => equal to greater than 30 min
  259200000: 3600000, // 3day => equal to greater than 1 hr
  604800000: 10800000, // 7day => equal to greater than 3 hr
};

export {
  WINDOW_SIZE_MAPPING,
  ALLOWED_WINDOW_SIZES,
  DURATION_MIN_WINDOW_SIZE_ALLOWED,
  WINDOW_5_MIN,
  WINDOW_15_MIN,
  WINDOW_1_DAY,
  WINDOW_3_DAY,
};
