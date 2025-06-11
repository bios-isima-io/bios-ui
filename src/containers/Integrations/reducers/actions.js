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
import {
  CLEAR_INTEGRATION_CONFIG,
  CLEAR_SOURCE_INDEX_TO_SHOW,
  DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE,
  FETCH_INTEGRATION_CONFIG,
  FETCH_INTEGRATION_CONFIG_ERROR,
  GET_IMPORT_FLOW_SPEC,
  RESET_INTEGRATION_CONFIG,
  SAVE_INTEGRATIONS,
  SAVE_INTEGRATIONS_RESULT,
  RESET_SAVE_INTEGRATIONS_RESULT,
  SET_EXISTING_INTEGRATION,
  SET_IMPORT_DATA_PROCESSORS_COPY,
  SET_IMPORT_DESTINATIONS_COPY,
  SET_IMPORT_FLOW_COPY,
  SET_IMPORT_SOURCES_COPY,
  SET_INTEGRATION_ACTIVE,
  SET_INTEGRATION_CONFIG,
  SET_INTEGRATION_NAME,
  SET_INTEGRATION_TYPE,
  SET_PROCESS_DETAILS,
  SET_RIGHT_PANEL_ACTIVE,
  SET_RIGHT_PANEL_TYPE,
  SET_SOURCE_INDEX_TO_SHOW,
  UPDATE_SELECTED_TAB,
  FETCH_INTEGRATION_SOURCE_QUALITY,
  SET_INTEGRATION_SOURCE_QUALITY,
} from './actionTypes';

const actions = {
  fetchIntegrationConfig: (payload) => ({
    type: FETCH_INTEGRATION_CONFIG,
    payload,
  }),
  updateSelectedTab: (tabId) => ({
    type: UPDATE_SELECTED_TAB,
    payload: tabId,
  }),
  fetchIntegrationConfigError: () => ({
    type: FETCH_INTEGRATION_CONFIG_ERROR,
  }),
  setIntegrationConfig: (payload) => ({
    type: SET_INTEGRATION_CONFIG,
    payload,
  }),
  clearIntegrationConfig: (payload) => ({
    type: CLEAR_INTEGRATION_CONFIG,
    payload,
  }),
  resetIntegrationConfig: () => ({
    type: RESET_INTEGRATION_CONFIG,
  }),
  setExistingIntegration: (existingIntegration) => ({
    type: SET_EXISTING_INTEGRATION,
    payload: {
      existingIntegration,
    },
  }),
  setRightPanelActive: (rightPanelActive) => ({
    type: SET_RIGHT_PANEL_ACTIVE,
    payload: {
      rightPanelActive,
    },
  }),
  setRightPanelType: (rightPanelType) => ({
    type: SET_RIGHT_PANEL_TYPE,
    payload: {
      rightPanelType,
    },
  }),
  setIntegrationActive: (payload) => ({
    type: SET_INTEGRATION_ACTIVE,
    payload,
  }),
  setIntegrationType: (payload) => ({
    type: SET_INTEGRATION_TYPE,
    payload,
  }),
  setIntegrationName: (integrationName) => ({
    type: SET_INTEGRATION_NAME,
    payload: {
      integrationName,
    },
  }),
  setImportSourcesCopy: (payload) => ({
    type: SET_IMPORT_SOURCES_COPY,
    payload,
  }),
  setSourceIndexToShow: (index) => ({
    type: SET_SOURCE_INDEX_TO_SHOW,
    index,
  }),
  clearSourceIndexToShow: () => ({
    type: CLEAR_SOURCE_INDEX_TO_SHOW,
  }),
  setImportDestinationsCopy: (payload) => ({
    type: SET_IMPORT_DESTINATIONS_COPY,
    payload,
  }),
  setImportDataProcessorsCopy: (payload) => ({
    type: SET_IMPORT_DATA_PROCESSORS_COPY,
    payload,
  }),
  saveIntegrations: (payload) => ({
    type: SAVE_INTEGRATIONS,
    payload,
  }),
  getImportFlow: (id) => ({
    type: GET_IMPORT_FLOW_SPEC,
    payload: {
      id,
    },
  }),
  setImportFlowCopy: (payload) => ({
    type: SET_IMPORT_FLOW_COPY,
    payload,
  }),
  deleteImportFlowByNameAndType: (payload) => ({
    type: DELETE_IMPORT_FLOW_BY_NAME_AND_TYPE,
    payload,
  }),
  setProcessDetails: (data) => ({
    type: SET_PROCESS_DETAILS,
    payload: {
      ...data,
    },
  }),

  saveIntegrationsResult: (data) => ({
    type: SAVE_INTEGRATIONS_RESULT,
    payload: {
      ...data,
    },
  }),

  resetSaveIntegrationsResult: (data) => ({
    type: RESET_SAVE_INTEGRATIONS_RESULT,
  }),

  fetchIntegrationSourceQuality: (payload) => ({
    type: FETCH_INTEGRATION_SOURCE_QUALITY,
    payload,
  }),
  setIntegrationSourceQuality: (data) => ({
    type: SET_INTEGRATION_SOURCE_QUALITY,
    payload: {
      ...data,
    },
  }),
};

export default actions;
