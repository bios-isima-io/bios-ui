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
const FETCH_INTEGRATION_CONFIG = 'INTEGRATION/FETCH_INTEGRATION_CONFIG';
const FETCH_INTEGRATION_CONFIG_ERROR =
  'INTEGRATION/FETCH_INTEGRATION_CONFIG_ERROR';
const SET_INTEGRATION_CONFIG = 'INTEGRATION/SET_INTEGRATION_CONFIG';
const CLEAR_INTEGRATION_CONFIG = 'INTEGRATION/CLEAR_INTEGRATION_CONFIG';
const RESET_INTEGRATION_CONFIG = 'INTEGRATION/RESET_INTEGRATION_CONFIG';
const SET_EXISTING_INTEGRATION = 'INTEGRATION/SET_EXISTING_INTEGRATION';
const SET_IMPORT_SOURCES_COPY = 'INTEGRATION/SET_IMPORT_SOURCES_COPY';
const SET_IMPORT_DESTINATIONS_COPY = 'INTEGRATION/SET_IMPORT_DESTINATIONS_COPY';
const SET_IMPORT_DATA_PROCESSORS_COPY =
  'INTEGRATION/SET_IMPORT_DATA_PROCESSORS_COPY';
const SAVE_INTEGRATIONS = 'INTEGRATION/SAVE_INTEGRATIONS';
const SAVE_INTEGRATIONS_RESULT = 'INTEGRATION/SAVE_INTEGRATIONS_RESULT';
const RESET_SAVE_INTEGRATIONS_RESULT =
  'INTEGRATION/RESET_SAVE_INTEGRATIONS_RESULT';
const SET_RIGHT_PANEL_ACTIVE = 'INTEGRATION/SET_RIGHT_PANEL_ACTIVE';
const SET_RIGHT_PANEL_TYPE = 'INTEGRATION/SET_RIGHT_PANEL_TYPE';
const SET_INTEGRATION_ACTIVE = 'INTEGRATION/SET_INTEGRATION_ACTIVE';
const SET_INTEGRATION_TYPE = 'INTEGRATION/SET_INTEGRATION_TYPE';
const SET_INTEGRATION_NAME = 'INTEGRATION/SET_INTEGRATION_NAME';
const SET_SOURCE_INDEX_TO_SHOW = 'INTEGRATION/SET_SOURCE_INDEX_TO_SHOW';
const CLEAR_SOURCE_INDEX_TO_SHOW = 'INTEGRATION/CLEAR_SOURCE_INDEX_TO_SHOW';

const GET_IMPORT_FLOW_SPEC = 'INTEGRATION/GET_IMPORT_FLOW_SPEC';

const SET_PROCESS_DETAILS = 'INTEGRATION/SET_PROCESS_DETAILS';

const CREATE_DATA_PROCESSOR = 'INTEGRATION/CREATE_DATA_PROCESSOR';
const UPDATE_DATA_PROCESSOR = 'INTEGRATION/UPDATE_DATA_PROCESSOR';
const DELETE_DATA_PROCESSOR = 'INTEGRATION/DELETE_DATA_PROCESSOR';

const SET_IMPORT_FLOW_COPY = 'INTEGRATION/SET_IMPORT_FLOW_COPY';

const DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE =
  'INTEGRATION/DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE';
const UPDATE_SELECTED_TAB = 'INTEGRATION/UPDATE_SELECTED_TAB';

const FETCH_INTEGRATION_SOURCE_QUALITY =
  'INTEGRATION/FETCH_INTEGRATION_SOURCE_QUALITY';
const SET_INTEGRATION_SOURCE_QUALITY =
  'INTEGRATION/SET_INTEGRATION_SOURCE_QUALITY';

export {
  FETCH_INTEGRATION_CONFIG,
  FETCH_INTEGRATION_CONFIG_ERROR,
  SET_INTEGRATION_CONFIG,
  CLEAR_INTEGRATION_CONFIG,
  RESET_INTEGRATION_CONFIG,
  SET_EXISTING_INTEGRATION,
  SET_RIGHT_PANEL_ACTIVE,
  SET_RIGHT_PANEL_TYPE,
  SET_INTEGRATION_ACTIVE,
  SET_INTEGRATION_TYPE,
  SET_INTEGRATION_NAME,
  SET_SOURCE_INDEX_TO_SHOW,
  CLEAR_SOURCE_INDEX_TO_SHOW,
  GET_IMPORT_FLOW_SPEC,
  SET_PROCESS_DETAILS,
  CREATE_DATA_PROCESSOR,
  UPDATE_DATA_PROCESSOR,
  DELETE_DATA_PROCESSOR,
  SET_IMPORT_SOURCES_COPY,
  SET_IMPORT_DESTINATIONS_COPY,
  SET_IMPORT_DATA_PROCESSORS_COPY,
  SET_IMPORT_FLOW_COPY,
  SAVE_INTEGRATIONS,
  SAVE_INTEGRATIONS_RESULT,
  RESET_SAVE_INTEGRATIONS_RESULT,
  DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE,
  UPDATE_SELECTED_TAB,
  FETCH_INTEGRATION_SOURCE_QUALITY,
  SET_INTEGRATION_SOURCE_QUALITY,
};
