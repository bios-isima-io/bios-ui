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
 * Verify Constants
 */

export const LOAD_TOKEN = 'isima/token/LOAD_TOKEN';
export const LOAD_TOKEN_SUCCESS = 'isima/token/LOAD_TOKEN_SUCCESS';
export const LOAD_TOKEN_ERROR = 'isima/token/LOAD_TOKEN_ERROR';

// The initial state of the App
export const initialStateVerify = {
  loading: false,
  error: false,
  verified: false,
  resetToken: undefined,
};

/**
 * Verify Reducers
 */

function verifyReducer(state = initialStateVerify, action) {
  switch (action.type) {
    case LOAD_TOKEN: {
      return {
        ...state,
        loading: true,
        error: false,
        verified: false,
        resetToken: undefined,
      };
    }
    case LOAD_TOKEN_SUCCESS: {
      return {
        ...state,
        loading: false,
        verified: true,
        resetToken: action.token,
      };
    }

    case LOAD_TOKEN_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
        verified: false,
        resetToken: undefined,
      };
    }
    default:
      return state;
  }
}

export default verifyReducer;

/**
 * Verify Actions
 */

/**
 * Load the auth, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadToken(token) {
  return {
    type: LOAD_TOKEN,
    token,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {Object} token The repository data
 *
 * @return {object} An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function tokenLoaded(token) {
  return {
    type: LOAD_TOKEN_SUCCESS,
    token,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function tokenLoadingError(error) {
  return {
    type: LOAD_TOKEN_ERROR,
    error,
  };
}

/**
 * Verify Sagas
 */

async function validateToken({ token }) {
  return bios.verifySignupToken(token);
}

function* workerValidateTokenSaga({ token }) {
  try {
    const verified = yield call(validateToken.bind(this, token));
    yield put(tokenLoaded(verified));
  } catch (error) {
    yield put(tokenLoadingError(error));
  }
}

export function* watchValidateTokenSaga() {
  yield takeLatest(LOAD_TOKEN, workerValidateTokenSaga);
}
