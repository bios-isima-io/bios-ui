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
  CLEAN_UP,
  CREATE_CONTEXT,
  CREATE_CONTEXT_ERROR,
  DELETE_CONTEXT,
  END_INITIAL_CREATION,
  FETCH_CONTEXT_DETAIL,
  FETCH_CONTEXT_DETAIL_FAILURE,
  FETCH_CONTEXT_DETAIL_SUCCESS,
  REVERT_LOCAL_CHANGES,
  SET_CONTEXT_DETAIL_MODIFIED,
  SET_FLOW_SPECS_MODIFIED,
  SET_FEATURES_STATUS,
  SET_VALIDATION_ERROR,
  CLEAR_VALIDATION_ERRORS,
  START_INITIAL_CREATION,
  UNSET_VALIDATION_ERROR,
  UPDATE_CONTEXT,
  UPDATE_CONTEXT_DETAIL,
  UPDATE_CONTEXT_ERROR,
  UPDATE_SELECTED_TAB,
  UPLOAD_CONTEXT_DATA,
  UPLOAD_CONTEXT_DATA_FAILURE,
  UPLOAD_CONTEXT_DATA_SUCCESS,
} from './actionTypes';

export const fetchContextDetail = (contextName) => ({
  type: FETCH_CONTEXT_DETAIL,
  contextName,
});

export const updateSelectedTab = (tabId) => ({
  type: UPDATE_SELECTED_TAB,
  payload: tabId,
});

export const setContextDetail = (data) => ({
  type: FETCH_CONTEXT_DETAIL_SUCCESS,
  payload: data,
});

export const setContextDetailError = (errorMsg = '') => ({
  type: FETCH_CONTEXT_DETAIL_FAILURE,
  payload: errorMsg,
});

export const deleteContext = (
  contextName,
  history,
  parentFlow,
  onCancel,
  onDeleteCreatedContext,
) => ({
  type: DELETE_CONTEXT,
  payload: {
    contextName,
    history,
    parentFlow,
    onCancel,
    onDeleteCreatedContext,
  },
});

export const createContext = (payload, onCreateNewContext, parentFlow) => ({
  type: CREATE_CONTEXT,
  payload,
  onCreateNewContext,
  parentFlow,
});

export const createContextError = () => ({
  type: CREATE_CONTEXT_ERROR,
});

export const updateContext = (payload, contextModified) => ({
  type: UPDATE_CONTEXT,
  payload,
  contextModified,
});

export const uploadContextData = (payload) => ({
  type: UPLOAD_CONTEXT_DATA,
  payload,
});

export const uploadContextDataSuccess = (payload) => ({
  type: UPLOAD_CONTEXT_DATA_SUCCESS,
});

export const uploadContextDataFailure = (payload) => ({
  type: UPLOAD_CONTEXT_DATA_FAILURE,
});

export const updateContextError = () => ({
  type: UPDATE_CONTEXT_ERROR,
});

export const updateContextDetail = (data) => ({
  type: UPDATE_CONTEXT_DETAIL,
  payload: data,
});

export const revertLocalChanges = (contextDetail) => ({
  type: REVERT_LOCAL_CHANGES,
  payload: contextDetail,
});

export const startContextCreation = () => ({
  type: START_INITIAL_CREATION,
});

export const endContextCreation = () => ({
  type: END_INITIAL_CREATION,
});

export const cleanUp = () => ({
  type: CLEAN_UP,
});

export const setContextDetailModified = (value) => ({
  type: SET_CONTEXT_DETAIL_MODIFIED,
  value,
});

export const setFlowSpecsModified = (value) => ({
  type: SET_FLOW_SPECS_MODIFIED,
  value,
});

/**
 * Sets validation error(s) at the specified path.
 *
 * @param path {list<string>} Path in the validation error state where the errors are put.
 * The path length must be more than zero.
 * @param errors {any} Error to set. The value may be a string or an object.
 */
export const setValidationError = (path, errors) => ({
  type: SET_VALIDATION_ERROR,
  path,
  errors,
});

export const clearValidationErrors = () => ({
  type: CLEAR_VALIDATION_ERRORS,
});

/**
 * Unsets validation error(s) at the specified path.
 *
 * @param path {list<string>} Path in the validation error state where the errors are put.
 * The path length must be more than zero. The specified errors can be either a collection (object)
 * or an entry (string).
 */
export const unsetValidationError = (path) => ({
  type: UNSET_VALIDATION_ERROR,
  path,
});

export const setFeaturesStatus = (featuresStatus) => ({
  type: SET_FEATURES_STATUS,
  payload: {
    featuresStatus,
  },
});
