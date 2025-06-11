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
import { cloneDeep } from 'lodash';

import { assignIds } from 'containers/utils';

import {
  CLEAN_UP,
  CLEAR_VALIDATION_ERRORS,
  CREATE_SIGNAL,
  CREATE_SIGNAL_ERROR,
  END_INITIAL_CREATION,
  ENRICHED_ATTRIBUTES_DATA_SKETCHES_SUCCESS,
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

// Note : signalDetail will contain changes that user makes on client side.
// The signalDetailCopy is a copy of the original signal config received by the server.

const initState = {
  signalDetail: null,
  signalDetailCopy: null,
  loading: true,
  error: false,
  errorMessage: null,
  updatingSignalDetail: false,
  enrichedAttributesDataSketchesLoaded: false,
  selectedTab: 0,
  validationErrors: {},
  initialCreation: false,
};

export default function signalDetailReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_SIGNAL_DETAIL:
      return {
        ...state,
        signalDetail: null,
        signalDetailCopy: null,
        loading: true,
        error: false,
        errorMessage: null,
      };
    case FETCH_SIGNAL_DETAIL_SUCCESS: {
      // We ensure here that every object in signalDetail has its ID to be used by components.
      // The ID's will be stripped off right before sending the config to the server.
      const signalDetail = assignIds(action.payload);
      return {
        ...state,
        signalDetail,
        signalDetailCopy: cloneDeep(signalDetail),
        loading: false,
        error: false,
        errorMessage: null,
        updatingSignalDetail: false,
        validationErrors: {},
      };
    }
    case FETCH_SIGNAL_DETAIL_FAILURE:
      return {
        ...state,
        signalDetail: null,
        signalDetailCopy: null,
        loading: false,
        error: true,
        errorMessage: action.payload,
        validationErrors: {},
      };
    case UPDATE_SIGNAL_DETAIL:
      return {
        ...state,
        signalDetail: assignIds(action.payload),
        loading: false,
        error: false,
        errorMessage: null,
      };
    case REVERT_LOCAL_CHANGES:
      return {
        ...state,
        signalDetail: action?.payload,
        validationErrors: {},
      };
    case CREATE_SIGNAL:
      return {
        ...state,
        updatingSignalDetail: true,
      };
    case UPDATE_SIGNAL:
      return {
        ...state,
        updatingSignalDetail: true,
      };
    case CREATE_SIGNAL_ERROR:
      return {
        ...state,
        updatingSignalDetail: false,
      };
    case UPDATE_SIGNAL_ERROR:
      return {
        ...state,
        updatingSignalDetail: false,
      };
    case ENRICHED_ATTRIBUTES_DATA_SKETCHES_SUCCESS:
      return {
        ...state,
        enrichedAttributesDataSketchesLoaded: true,
      };
    case UPDATE_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload,
      };
    case SET_VALIDATION_ERROR: {
      const nextState = { ...state };
      const nextErrors = { ...state.validationErrors };
      const path = action.path;
      let current = nextErrors;
      for (let i = 0; i < path.length - 1; ++i) {
        const element = path[i];
        current[element] = { ...(current[element] || {}) };
        current = current[element];
      }
      current[path[path.length - 1]] = action.errors;
      nextState.validationErrors = nextErrors;
      return nextState;
    }
    case UNSET_VALIDATION_ERROR: {
      const nextState = { ...state };
      nextState.validationErrors = { ...state.validationErrors };
      const nextErrors = { ...state.validationErrors };
      const path = action.path;
      let current = nextErrors;
      for (let i = 0; i < path.length - 1 && current !== undefined; ++i) {
        const element = path[i];
        current = current[element];
      }
      if (current !== undefined) {
        delete current[path[path.length - 1]];
      }
      nextState.validationErrors = nextErrors;
      return nextState;
    }
    case CLEAR_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: {},
      };
    case START_INITIAL_CREATION:
      return {
        ...state,
        initialCreation: true,
      };
    case END_INITIAL_CREATION:
      return {
        ...state,
        initialCreation: false,
      };
    case CLEAN_UP:
      return initState;
    default:
      return state;
  }
}
