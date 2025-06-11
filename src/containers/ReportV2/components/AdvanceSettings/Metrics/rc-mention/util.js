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
'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getBeforeSelectionText = getBeforeSelectionText;
exports.getLastMeasureIndex = getLastMeasureIndex;
exports.replaceWithMeasure = replaceWithMeasure;
exports.setInputSelection = setInputSelection;
exports.validateSearch = validateSearch;
exports.filterOption = filterOption;
exports.omit = void 0;

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

var omit = function omit(obj) {
  var clone = (0, _objectSpread2.default)({}, obj);

  for (
    var _len = arguments.length,
      keys = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    keys[_key - 1] = arguments[_key];
  }

  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
};
/**
 * Cut input selection into 2 part and return text before selection start
 */

exports.omit = omit;

function getBeforeSelectionText(input) {
  var selectionStart = input.selectionStart;
  return input.value.slice(0, selectionStart);
}
/**
 * Find the last match prefix index
 */

function getLastMeasureIndex(text) {
  var prefix =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return prefixList.reduce(
    function (lastMatch, prefixStr) {
      var lastIndex = text.lastIndexOf(prefixStr);

      if (lastIndex > lastMatch.location) {
        return {
          location: lastIndex,
          prefix: prefixStr,
        };
      }

      return lastMatch;
    },
    {
      location: -1,
      prefix: '',
    },
  );
}

function lower(char) {
  return (char || '').toLowerCase();
}

function reduceText(text, targetText, split) {
  var firstChar = text[0];

  if (!firstChar || firstChar === split) {
    return text;
  } // Reuse rest text as it can

  var restText = text;
  var targetTextLen = targetText.length;

  for (var i = 0; i < targetTextLen; i += 1) {
    if (lower(restText[i]) !== lower(targetText[i])) {
      restText = restText.slice(i);
      break;
    } else if (i === targetTextLen - 1) {
      restText = restText.slice(targetTextLen);
    }
  }

  return restText;
}
/**
 * Paint targetText into current text:
 *  text: little@litest
 *  targetText: light
 *  => little @light test
 */

function replaceWithMeasure(text, measureConfig) {
  var measureLocation = measureConfig.measureLocation,
    prefix = measureConfig.prefix,
    targetText = measureConfig.targetText,
    selectionStart = measureConfig.selectionStart,
    split = measureConfig.split; // Before text will append one space if have other text

  var beforeMeasureText = text.slice(0, measureLocation);

  if (beforeMeasureText[beforeMeasureText.length - split.length] === split) {
    beforeMeasureText = beforeMeasureText.slice(
      0,
      beforeMeasureText.length - split.length,
    );
  }

  if (beforeMeasureText) {
    beforeMeasureText = ''.concat(beforeMeasureText).concat(split);
  } // Cut duplicate string with current targetText

  var restText = reduceText(
    text.slice(selectionStart),
    targetText.slice(selectionStart - measureLocation - prefix.length),
    split,
  );

  if (restText.slice(0, split.length) === split) {
    restText = restText.slice(split.length);
  }

  var connectedStartText = ''
    .concat(beforeMeasureText)
    .concat(prefix)
    .concat(targetText)
    .concat(split);
  return {
    text: ''.concat(connectedStartText).concat(restText),
    selectionLocation: connectedStartText.length,
  };
}

function setInputSelection(input, location) {
  input.setSelectionRange(location, location);
  /**
   * Reset caret into view.
   * Since this function always called by user control, it's safe to focus element.
   */

  input.blur();
  input.focus();
}

function validateSearch(text, props) {
  var split = props.split;
  return !split || text.indexOf(split) === -1;
}

function filterOption(input, _ref) {
  var _ref$value = _ref.value,
    value = _ref$value === void 0 ? '' : _ref$value;
  var lowerCase = input.toLowerCase();
  return value.toLowerCase().indexOf(lowerCase) !== -1;
}
