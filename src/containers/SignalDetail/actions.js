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
  CLEAR_VALIDATION_ERRORS,
  CREATE_SIGNAL,
  CREATE_SIGNAL_ERROR,
  DELETE_SIGNAL,
  END_INITIAL_CREATION,
  ENRICHED_ATTRIBUTES_DATA_SKETCHES_SUCCESS,
  FETCH_ENRICHED_ATTRIBUTES_DATA_SKETCHES,
  FETCH_SIGNAL_DETAIL,
  FETCH_SIGNAL_DETAIL_FAILURE,
  FETCH_SIGNAL_DETAIL_SUCCESS,
  REVERT_LOCAL_CHANGES,
  SET_VALIDATION_ERROR,
  START_INITIAL_CREATION,
  UNSET_VALIDATION_ERROR,
  UPDATE_SELECTED_TAB,
  UPDATE_SIGNAL,
  UPDATE_SIGNAL_DETAIL,
  UPDATE_SIGNAL_ERROR,
} from './actionTypes';

export const fetchSignalDetail = (signalName) => ({
  type: FETCH_SIGNAL_DETAIL,
  signalName,
});

export const updateSelectedTab = (tabId) => ({
  type: UPDATE_SELECTED_TAB,
  payload: tabId,
});

export const setSignalDetail = (data) => ({
  type: FETCH_SIGNAL_DETAIL_SUCCESS,
  payload: data,
});

export const setSignalDetailError = (errorMsg = '') => ({
  type: FETCH_SIGNAL_DETAIL_FAILURE,
  payload: errorMsg,
});

export const deleteSignal = (
  signalName,
  history,
  parentFlow,
  onCancel,
  onDeleteCreatedSignal,
) => ({
  type: DELETE_SIGNAL,
  payload: {
    signalName,
    history,
    parentFlow,
    onCancel,
    onDeleteCreatedSignal,
  },
});

export const createSignal = (payload, onCreateNewSignal, parentFlow) => ({
  type: CREATE_SIGNAL,
  payload,
  onCreateNewSignal,
  parentFlow,
});

export const createSignalError = () => ({
  type: CREATE_SIGNAL_ERROR,
});

export const updateSignal = (
  payload,
  signalModified,
  originalSignalDetail,
) => ({
  type: UPDATE_SIGNAL,
  payload,
  signalModified,
  originalSignalDetail,
});

export const updateSignalError = () => ({
  type: UPDATE_SIGNAL_ERROR,
});

export const updateSignalDetail = (data) => ({
  type: UPDATE_SIGNAL_DETAIL,
  payload: data,
});

export const revertLocalChanges = (signalDetail) => ({
  type: REVERT_LOCAL_CHANGES,
  payload: signalDetail,
});

export const fetchEnrichedAttributesDataSketches = (payload) => ({
  type: FETCH_ENRICHED_ATTRIBUTES_DATA_SKETCHES,
  payload,
});

export const enrichedAttributesDataSketchesLoaded = () => ({
  type: ENRICHED_ATTRIBUTES_DATA_SKETCHES_SUCCESS,
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

/**
 * Clears the entire validationErrors state.
 */
export const clearValidationErrors = () => ({
  type: CLEAR_VALIDATION_ERRORS,
});

export const startSignalCreation = () => ({
  type: START_INITIAL_CREATION,
});

export const endSignalCreation = () => ({
  type: END_INITIAL_CREATION,
});

export const cleanUp = () => ({
  type: CLEAN_UP,
});
