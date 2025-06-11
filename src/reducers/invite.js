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
import bios from '@bios/bios-sdk';
import { call, put, takeLatest } from 'redux-saga/effects';

/**
 * Signup Constants
 */

export const LOAD_INVITE = 'isima/invite/LOAD_INVITE';
export const LOAD_INVITE_SUCCESS = 'isima/invite/LOAD_INVITE_SUCCESS';
export const LOAD_INVITE_ERROR = 'isima/invite/LOAD_TEACH_ERROR';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  is: false,
  invite: undefined,
};

/**
 * Signup Reducer
 */

function inviteReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_INVITE: {
      return {
        ...state,
        loading: true,
        error: false,
        is: false,
      };
    }
    case LOAD_INVITE_SUCCESS: {
      return {
        ...state,
        loading: false,
        is: action.invite && true,
        invite: action.invite,
        error: false,
      };
    }

    case LOAD_INVITE_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
        invite: undefined,
        is: false,
      };
    }
    default:
      return state;
  }
}

export default inviteReducer;

/**
 * Signup Actions
 */

/**
 * Load the signup, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_TEACH with credentials
 */
export function loadInvite(invite) {
  return {
    type: LOAD_INVITE,
    invite,
  };
}

/**
 * Dispatched when the signup is loaded by the request saga
 *
 * @param  {object} signup The response from signup load
 *
 * @return {object} An action object with a type of LOAD_SIGNUP_SUCCESS passing the signup
 */
export function inviteLoaded(invite) {
  return {
    type: LOAD_INVITE_SUCCESS,
    invite,
  };
}

/**
 * Dispatched when loading the signup fails
 *
 * @param  {object} error The error
 *
 * @return {object}  An action object with a type of LOAD_SIGNUP_ERROR passing the error
 */
export function inviteLoadingError(error) {
  return {
    type: LOAD_INVITE_ERROR,
    error,
  };
}

/**
 * Signup Sagas
 */

async function inviteUser(invite) {
  return bios.inviteUser(invite);
}

function* workerInviteUserSaga({ invite }) {
  try {
    const response = yield call(inviteUser.bind(this, invite));
    yield put(inviteLoaded(response));
  } catch (error) {
    yield put(inviteLoadingError(error));
  }
}

export function* watchInviteUserSaga() {
  yield takeLatest(LOAD_INVITE, workerInviteUserSaga);
}
