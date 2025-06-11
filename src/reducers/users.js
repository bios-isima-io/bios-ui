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
import { put, takeLatest, call } from 'redux-saga/effects';
import bios from '@bios/bios-sdk';
import { ErrorNotification, SuccessNotification } from '../containers/utils';
import messages from 'utils/notificationMessages';

/**
 * Verify Constants
 */

export const LOAD_USERS = 'isima/users/LOAD_USERS';
export const LOAD_USERS_SUCCESS = 'isima/users/LOAD_USERS_SUCCESS';
export const LOAD_USERS_ERROR = 'isima/users/LOAD_USERS_ERROR';

export const LOAD_POST_USERS = 'isima/users/LOAD_POST_USERS';
export const LOAD_POST_USERS_SUCCESS = 'isima/users/LOAD_POST_USERS_SUCCESS';
export const LOAD_POST_USERS_ERROR = 'isima/users/LOAD_POST_USERS_ERROR';

export const LOAD_DELETE_USERS = 'isima/users/LOAD_DELETE_USERS';
export const LOAD_DELETE_USERS_SUCCESS =
  'isima/users/LOAD_DELETE_USERS_SUCCESS';
export const LOAD_DELETE_USERS_ERROR = 'isima/users/LOAD_DELETE_USERS_ERROR';

export const LOAD_POST_USERS_RESET = 'isima/users/LOAD_POST_USERS_RESET';

// The initial state of the App
export const initialStateUserGet = {
  loadingGet: false,
  errorGet: false,
  isGet: false,
  usersGet: undefined,
};
// The initial state of the App
export const initialStateUserPost = {
  loadingPost: false,
  errorPost: false,
  isPost: false,
  usersPost: undefined,
};

export const initialStateUserDelete = {
  loadingDelete: false,
  errorDelete: false,
  isDelete: false,
  usersDelete: undefined,
};

/**
 * Verify Reducers
 */

function usersReducer(
  state = {
    ...initialStateUserGet,
    ...initialStateUserPost,
    ...initialStateUserDelete,
  },
  action,
) {
  switch (action.type) {
    case LOAD_USERS: {
      return {
        ...state,
        loadingGet: true,
        errorGet: false,
        isGet: false,
      };
    }
    case LOAD_USERS_SUCCESS: {
      return {
        ...state,
        loadingGet: false,
        usersGet: action.users,
        isGet: action.users && true,
      };
    }

    case LOAD_USERS_ERROR: {
      return {
        ...state,
        errorGet: true,
        loadingGet: false,
        usersGet: undefined,
        isGet: false,
      };
    }
    case LOAD_POST_USERS: {
      return {
        ...state,
        loadingPost: true,
        errorPost: false,
        usersPost: undefined,
        isPost: false,
      };
    }
    case LOAD_POST_USERS_SUCCESS: {
      return {
        ...state,
        loadingPost: false,
        usersPost: true,
        isPost: action.users && true,
      };
    }

    case LOAD_POST_USERS_ERROR: {
      return {
        ...state,
        errorPost: true,
        loadingPost: false,
        usersPost: undefined,
        isPost: false,
      };
    }

    case LOAD_DELETE_USERS: {
      return {
        ...state,
        loadingDelete: true,
        errorDelete: false,
        usersDelete: undefined,
        isDelete: false,
      };
    }
    case LOAD_DELETE_USERS_SUCCESS: {
      return {
        ...state,
        loadingDelete: false,
        usersDelete: true,
        isDelete: action.users && true,
      };
    }

    case LOAD_DELETE_USERS_ERROR: {
      return {
        ...state,
        errorDelete: true,
        loadingDelete: false,
        usersDelete: undefined,
        isDelete: false,
      };
    }

    case LOAD_POST_USERS_RESET: {
      return {
        ...state,
        ...initialStateUserPost,
      };
    }
    default:
      return state;
  }
}

export default usersReducer;

/**
 * Verify Actions
 */

/**
 * Load the auth, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadDeleteUsers(userId) {
  return {
    type: LOAD_DELETE_USERS,
    userId,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {Object} token The repository data
 *
 * @return {object} An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function usersDeleteLoaded(users) {
  return {
    type: LOAD_DELETE_USERS_SUCCESS,
    users,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function usersDeleteError(error) {
  return {
    type: LOAD_DELETE_USERS_ERROR,
    error,
  };
}

/**
 * Verify Sagas
 */

async function deleteUsers(userId) {
  await bios.deleteUser({ userId });
  return await bios.getUsers();
}

function* workerDeleteUsersSaga({ userId }) {
  try {
    const users = yield call(deleteUsers.bind(this, userId));
    yield put(usersDeleteLoaded(users));
  } catch (error) {
    yield put(usersDeleteError(error));
  }
}

export function* watchDeleteUsersSaga() {
  yield takeLatest(LOAD_DELETE_USERS, workerDeleteUsersSaga);
}

/**
 * Verify Actions
 */

/**
 * Load the auth, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadUsers() {
  return {
    type: LOAD_USERS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {Object} token The repository data
 *
 * @return {object} An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function usersLoaded(users) {
  return {
    type: LOAD_USERS_SUCCESS,
    users,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function usersLoadingError(error) {
  return {
    type: LOAD_USERS_ERROR,
    error,
  };
}

/**
 * Verify Sagas
 */

async function getUsers() {
  const response = await bios.getUsers();
  return response;
}

function* workerGetUsersSaga() {
  try {
    const users = yield call(getUsers);
    yield put(usersLoaded(users));
  } catch (error) {
    yield put(usersLoadingError(error));
  }
}

export function* watchGetUsersSaga() {
  yield takeLatest(LOAD_USERS, workerGetUsersSaga);
}

/**
 * Load the auth, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadPostUsers(user) {
  return {
    type: LOAD_POST_USERS,
    user,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {Object} token The repository data
 *
 * @return {object} An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function usersPostLoaded(user) {
  return {
    type: LOAD_POST_USERS_SUCCESS,
    user,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function usersPostLoadingError(error) {
  return {
    type: LOAD_POST_USERS_ERROR,
    error,
  };
}

/**
 * Verify Sagas
 */

async function postUsers(user, isNewUser = false) {
  if (isNewUser) {
    return await bios.createUser(user);
  }
  return await bios.modifyUser(user);
}

function* workerPostUsersSaga({ user }) {
  try {
    const userResponse = yield call(postUsers.bind(this, user, user.new));
    yield put(loadUsers());
    yield put(usersPostLoaded(userResponse));
    SuccessNotification({
      message: messages.user.USER_UPDATE_SUCCESS,
    });
  } catch (error) {
    ErrorNotification({
      message: error?.[0]?.message ? error?.[0]?.message : error?.[0],
    });
    yield put(usersPostLoadingError(error));
  }
}

export function* watchPostUsersSaga() {
  yield takeLatest(LOAD_POST_USERS, workerPostUsersSaga);
}

export function loadPostUsersReset() {
  return {
    type: LOAD_POST_USERS_RESET,
  };
}
