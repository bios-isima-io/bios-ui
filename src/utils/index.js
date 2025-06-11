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
const generateId = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const isDate = (dateStr) => isNaN(dateStr) && !isNaN(Date.parse(dateStr));
const parseDate = (dateStr) =>
  (isNaN(dateStr) && !isNaN(Date.parse(dateStr) && Date.parse(dateStr))) ||
  null;

const ellipsesAttributeName = (name) => {
  if (name && name.length <= 13) {
    return name;
  }
  return name
    ? `${name.substring(0, 5)}...${name.substring(name.length - 5)}`
    : '';
};

const getErrorMessages = (error) => {
  const errorMessages = [];
  let errorMessage;
  if (error !== undefined) {
    if (Array.isArray(error)) {
      error = error[0];
    }
    Object.keys(error).forEach((key) => {
      if (Array.isArray(error[key])) {
        error[key].forEach((err) => errorMessages.push(err.message));
      }
    });
  }
  if (errorMessages.length !== 0) {
    errorMessage = errorMessages.join(',');
  } else {
    errorMessage = error.message ? error.message : '';
  }
  return errorMessage;
};

const compareNames = (a, b) => {
  // Use toUpperCase() to ignore character casing
  const bandA = a.name.toUpperCase();
  const bandB = b.name.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const arrayContainsDuplicates = (array) => array.length !== new Set(array).size;

const removeExtraChar = (str, char) => {
  return str.replace(/\s+/g, char).trim();
};

const replaceAt = function (str, index, original, replacement) {
  return (
    str.substr(0, index) + replacement + str.substr(index + original.length)
  );
};

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Tests if a container contains all of items in another container.
 *
 * @param {iterable} container - The container to test
 * @param {iterable} another - Another container
 * @returns {boolean} true if the container contains all of the items in another one
 */
const containsAll = (container, another) => {
  if (!container) {
    return false;
  }
  if (!another) {
    return true;
  }
  return [...another].every((v) => [...container].includes(v));
};

const getIntersectionForArrays = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  return data.reduce((a, b) => a?.filter((c) => b.includes(c)));
};

const isValidName = (name) => /^[0a-zA-Z0-9][a-zA-Z0-9_]+$\S*$/.test(name);

const isValidStreamName = (name) => name.length <= 40 && isValidName(name);

const isValidReportName = (name) =>
  /^[0a-zA-Z0-9][a-zA-Z0-9_ ]+$\S*$/.test(name);

const getViewPortHeight = () => {
  return Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
};

const getViewPortWidth = () => {
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );
};

const getDefaultValueByType = (type) => {
  if (type === 'Integer') {
    return 0;
  } else if (type === 'Decimal') {
    return 0.0;
  } else if (type === 'String') {
    return 'MISSING';
  } else if (type === 'Boolean') {
    return false;
  }
};

const getDefaultValueByID = (Id) => {
  if (Id === 1) {
    return 0.0;
  } else if (Id === 2) {
    return 0;
  } else if (Id === 3) {
    return '';
  } else if (Id === 4) {
    return false;
  }
};

const removeObjectKey = (obj, key) => {
  if (obj.hasOwnProperty(key)) {
    delete obj[key];
    return obj;
  }
  return obj;
};

const RedirectUnAuthUser = () => {
  window.location = window.location.origin + '/login';
};

export {
  generateId,
  removeObjectKey,
  isDate,
  parseDate,
  ellipsesAttributeName,
  getErrorMessages,
  compareNames,
  isValidName,
  capitalize,
  arrayContainsDuplicates,
  removeExtraChar,
  replaceAt,
  arraysEqual,
  containsAll,
  getIntersectionForArrays,
  isValidStreamName,
  isValidReportName,
  getViewPortHeight,
  getViewPortWidth,
  getDefaultValueByType,
  getDefaultValueByID,
  RedirectUnAuthUser,
};
