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
import { TAB_SOURCE } from 'containers/Integrations/const';
import {
  CLEAR_INTEGRATION_CONFIG,
  CLEAR_SOURCE_INDEX_TO_SHOW,
  FETCH_INTEGRATION_CONFIG,
  FETCH_INTEGRATION_CONFIG_ERROR,
  SAVE_INTEGRATIONS,
  SAVE_INTEGRATIONS_RESULT,
  RESET_SAVE_INTEGRATIONS_RESULT,
  SET_EXISTING_INTEGRATION,
  SET_IMPORT_DATA_PROCESSORS_COPY,
  SET_IMPORT_DESTINATIONS_COPY,
  SET_IMPORT_FLOW_COPY,
  SET_IMPORT_SOURCES_COPY,
  SET_INTEGRATION_CONFIG,
  SET_INTEGRATION_NAME,
  SET_PROCESS_DETAILS,
  SET_RIGHT_PANEL_ACTIVE,
  SET_RIGHT_PANEL_TYPE,
  SET_SOURCE_INDEX_TO_SHOW,
  UPDATE_SELECTED_TAB,
  SET_INTEGRATION_SOURCE_QUALITY,
} from './actionTypes';

const initState = {
  loading: false,
  error: false,
  importSources: null,
  importSourcesCopy: null,
  sourceIndexToShow: null,
  processorIndexToShow: null,
  importDestinations: null,
  importDestinationsCopy: null,
  importFlowSpecs: null,
  importFlowSpecsCopy: null,
  importDataProcessors: null,
  importDataProcessorsCopy: null,
  exportDestinations: null,
  exportDestinationsCopy: null,
  integrationConfig: null,
  existingIntegration: false,
  rightPanelActive: false,
  rightPanelType: '',
  integrationActive: true,
  integrationType: 'Webhook',
  integrationName: '',
  integrationId: '',
  savingSrcDest: null,
  saveIntegrationResult: null,

  processName: '',
  processCode: '',
  existingProcess: false,
  selectedTab: TAB_SOURCE,
  sourceQualityData: null,
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case FETCH_INTEGRATION_CONFIG:
      return {
        ...state,
        loading: true,
        ...action.payload,
      };
    case SET_INTEGRATION_CONFIG:
      return {
        ...state,
        loading: false,
        error: false,
        savingSrcDest: false,
        ...action.payload,
      };

    case CLEAR_INTEGRATION_CONFIG:
      return {
        ...initState,
      };

    case SET_IMPORT_SOURCES_COPY:
      return {
        ...state,
        importSourcesCopy: action.payload,
        rightPanelActive: false,
      };

    case SET_SOURCE_INDEX_TO_SHOW:
      return {
        ...state,
        sourceIndexToShow: action.index,
      };

    case CLEAR_SOURCE_INDEX_TO_SHOW:
      return {
        ...state,
        sourceIndexToShow: null,
      };

    case SET_IMPORT_DESTINATIONS_COPY:
      return {
        ...state,
        importDestinationsCopy: action.payload,
        rightPanelActive: false,
      };

    case SET_IMPORT_DATA_PROCESSORS_COPY:
      return {
        ...state,
        importDataProcessorsCopy: action.payload,
        rightPanelActive: false,
      };

    case SET_IMPORT_FLOW_COPY:
      return {
        ...state,
        importFlowSpecsCopy: action.payload,
        rightPanelActive: false,
      };

    case SAVE_INTEGRATIONS:
      return {
        ...state,
        savingSrcDest: true,
      };

    case SAVE_INTEGRATIONS_RESULT:
      return {
        ...state,
        saveIntegrationResult: action.payload,
      };

    case RESET_SAVE_INTEGRATIONS_RESULT:
      return {
        ...state,
        saveIntegrationResult: null,
      };

    case FETCH_INTEGRATION_CONFIG_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    case SET_EXISTING_INTEGRATION:
      return {
        ...state,
        ...action.payload,
      };

    case SET_INTEGRATION_NAME:
      return {
        ...state,
        ...action.payload,
      };

    case SET_RIGHT_PANEL_ACTIVE:
      return {
        ...state,
        ...action.payload,
      };

    case SET_RIGHT_PANEL_TYPE:
      return {
        ...state,
        ...action.payload,
      };

    case SET_PROCESS_DETAILS:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload,
      };
    case SET_INTEGRATION_SOURCE_QUALITY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
