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

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _createSuper2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createSuper'),
);

var _rcTrigger = _interopRequireDefault(require('rc-trigger'));

var React = _interopRequireWildcard(require('react'));

var _DropdownMenu = _interopRequireDefault(require('./DropdownMenu'));

var BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

var KeywordTrigger = /*#__PURE__*/ (function (_React$Component) {
  (0, _inherits2.default)(KeywordTrigger, _React$Component);

  var _super = (0, _createSuper2.default)(KeywordTrigger);

  function KeywordTrigger() {
    var _this;

    (0, _classCallCheck2.default)(this, KeywordTrigger);
    _this = _super.apply(this, arguments);

    _this.getDropdownPrefix = function () {
      return ''.concat(_this.props.prefixCls, '-dropdown');
    };

    _this.getDropdownElement = function () {
      var options = _this.props.options;
      return React.createElement(_DropdownMenu.default, {
        prefixCls: _this.getDropdownPrefix(),
        options: options,
      });
    };

    _this.getDropDownPlacement = function () {
      var _this$props = _this.props,
        placement = _this$props.placement,
        direction = _this$props.direction;
      var popupPlacement = 'topRight';

      if (direction === 'rtl') {
        popupPlacement = placement === 'top' ? 'topLeft' : 'bottomLeft';
      } else {
        popupPlacement = placement === 'top' ? 'topRight' : 'bottomRight';
      }

      return popupPlacement;
    };

    return _this;
  }

  (0, _createClass2.default)(KeywordTrigger, [
    {
      key: 'render',
      value: function render() {
        var _this$props2 = this.props,
          children = _this$props2.children,
          visible = _this$props2.visible,
          transitionName = _this$props2.transitionName,
          getPopupContainer = _this$props2.getPopupContainer;
        var popupElement = this.getDropdownElement();
        return React.createElement(
          _rcTrigger.default,
          {
            prefixCls: this.getDropdownPrefix(),
            popupVisible: visible,
            popup: popupElement,
            popupPlacement: this.getDropDownPlacement(),
            popupTransitionName: transitionName,
            builtinPlacements: BUILT_IN_PLACEMENTS,
            getPopupContainer: getPopupContainer,
          },
          children,
        );
      },
    },
  ]);
  return KeywordTrigger;
})(React.Component);

var _default = KeywordTrigger;
exports.default = _default;
