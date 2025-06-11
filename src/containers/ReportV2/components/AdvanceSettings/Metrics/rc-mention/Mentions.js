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

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
);

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

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

var _classnames = _interopRequireDefault(require('classnames'));

var _toArray = _interopRequireDefault(require('rc-util/lib/Children/toArray'));

var _KeyCode = _interopRequireDefault(require('rc-util/lib/KeyCode'));

var React = _interopRequireWildcard(require('react'));

var _rcTextarea = _interopRequireDefault(require('rc-textarea'));

var _KeywordTrigger = _interopRequireDefault(require('./KeywordTrigger'));

var _MentionsContext = require('./MentionsContext');

var _Option = _interopRequireDefault(require('./Option'));

var _util = require('./util');

var Mentions = /*#__PURE__*/ (function (_React$Component) {
  (0, _inherits2.default)(Mentions, _React$Component);

  var _super = (0, _createSuper2.default)(Mentions);

  function Mentions(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Mentions);
    _this = _super.call(this, props);
    _this.focusId = undefined;

    _this.triggerChange = function (value) {
      var onChange = _this.props.onChange;

      if (!('value' in _this.props)) {
        _this.setState({
          value: value,
        });
      }

      if (onChange) {
        onChange(value);
      }
    };

    _this.onChange = function (_ref) {
      var value = _ref.target.value;

      _this.triggerChange(value);
    }; // Check if hit the measure keyword

    _this.onKeyDown = function (event) {
      var which = event.which;
      var _this$state = _this.state,
        activeIndex = _this$state.activeIndex,
        measuring = _this$state.measuring; // Skip if not measuring

      if (!measuring) {
        return;
      }

      if (which === _KeyCode.default.UP || which === _KeyCode.default.DOWN) {
        // Control arrow function
        var optionLen = _this.getOptions().length;

        var offset = which === _KeyCode.default.UP ? -1 : 1;
        var newActiveIndex = (activeIndex + offset + optionLen) % optionLen;

        _this.setState({
          activeIndex: newActiveIndex,
        });

        event.preventDefault();
      } else if (which === _KeyCode.default.ESC) {
        _this.stopMeasure();
      } else if (which === _KeyCode.default.ENTER) {
        // Measure hit
        event.preventDefault();

        var options = _this.getOptions();

        if (!options.length) {
          _this.stopMeasure();

          return;
        }

        var option = options[activeIndex];

        _this.selectOption(option);
      }
    };
    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */

    _this.onKeyUp = function (event) {
      var key = event.key,
        which = event.which;
      var _this$state2 = _this.state,
        prevMeasureText = _this$state2.measureText,
        measuring = _this$state2.measuring;
      var _this$props = _this.props,
        _this$props$prefix = _this$props.prefix,
        prefix = _this$props$prefix === void 0 ? '' : _this$props$prefix,
        onSearch = _this$props.onSearch,
        validateSearch = _this$props.validateSearch;
      var target = event.target;
      var selectionStartText = (0, _util.getBeforeSelectionText)(target);

      var _getLastMeasureIndex = (0, _util.getLastMeasureIndex)(
          selectionStartText,
          prefix,
        ),
        measureIndex = _getLastMeasureIndex.location,
        measurePrefix = _getLastMeasureIndex.prefix; // Skip if match the white key list

      if (
        [
          _KeyCode.default.ESC,
          _KeyCode.default.UP,
          _KeyCode.default.DOWN,
          _KeyCode.default.ENTER,
        ].indexOf(which) !== -1
      ) {
        return;
      }

      if (measureIndex !== -1) {
        var measureText = selectionStartText.slice(
          measureIndex + measurePrefix.length,
        );
        var validateMeasure = validateSearch(measureText, _this.props);
        var matchOption = !!_this.getOptions(measureText).length;

        if (validateMeasure) {
          if (
            key === measurePrefix ||
            key === 'Shift' ||
            measuring ||
            (measureText !== prevMeasureText && matchOption)
          ) {
            _this.startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          _this.stopMeasure();
        }
        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */

        if (onSearch && validateMeasure) {
          onSearch(measureText, measurePrefix);
        }
      } else if (measuring) {
        _this.stopMeasure();
      }
    };

    _this.onPressEnter = function (event) {
      var measuring = _this.state.measuring;
      var onPressEnter = _this.props.onPressEnter;

      if (!measuring && onPressEnter) {
        onPressEnter(event);
      }
    };

    _this.onInputFocus = function (event) {
      _this.onFocus(event);
    };

    _this.onInputBlur = function (event) {
      _this.onBlur(event);
    };

    _this.onDropdownFocus = function () {
      _this.onFocus();
    };

    _this.onDropdownBlur = function () {
      _this.onBlur();
    };

    _this.onFocus = function (event) {
      window.clearTimeout(_this.focusId);
      var isFocus = _this.state.isFocus;
      var onFocus = _this.props.onFocus;

      if (!isFocus && event && onFocus) {
        onFocus(event);
      }

      _this.setState({
        isFocus: true,
      });
    };

    _this.onBlur = function (event) {
      _this.focusId = window.setTimeout(function () {
        var onBlur = _this.props.onBlur;

        _this.setState({
          isFocus: false,
        });

        _this.stopMeasure();

        if (onBlur) {
          onBlur(event);
        }
      }, 0);
    };

    _this.selectOption = function (option) {
      var _this$state3 = _this.state,
        value = _this$state3.value,
        measureLocation = _this$state3.measureLocation,
        measurePrefix = _this$state3.measurePrefix,
        measureText = _this$state3.measureText;
      var _this$props2 = _this.props,
        split = _this$props2.split,
        onSelect = _this$props2.onSelect;
      var _option$value = option.value,
        mentionValue = _option$value === void 0 ? '' : _option$value;

      var _replaceWithMeasure = (0, _util.replaceWithMeasure)(value, {
          measureLocation: measureLocation,
          targetText: mentionValue,
          prefix: measurePrefix,
          selectionStart: _this.textarea.selectionStart,
          split: split,
        }),
        text = _replaceWithMeasure.text,
        selectionLocation = _replaceWithMeasure.selectionLocation;

      _this.triggerChange(text);

      _this.stopMeasure(function () {
        // We need restore the selection position
        (0, _util.setInputSelection)(_this.textarea, selectionLocation);
      });

      if (onSelect) {
        onSelect(option, measurePrefix, measureText);
      }
    };

    _this.setActiveIndex = function (activeIndex) {
      _this.setState({
        activeIndex: activeIndex,
      });
    };

    _this.setTextAreaRef = function (element) {
      var _element$resizableTex;

      _this.textarea =
        element === null || element === void 0
          ? void 0
          : (_element$resizableTex = element.resizableTextArea) === null ||
            _element$resizableTex === void 0
          ? void 0
          : _element$resizableTex.textArea;
    };

    _this.setMeasureRef = function (element) {
      _this.measure = element;
    };

    _this.getOptions = function (measureText) {
      //TODO : add search functionality code here
      var targetMeasureText = measureText || _this.state.measureText || '';
      var _this$props3 = _this.props,
        children = _this$props3.children,
        filterOption = _this$props3.filterOption;
      var list = (0, _toArray.default)(children)
        .map(function (_ref2) {
          var props = _ref2.props,
            key = _ref2.key;
          return (0, _objectSpread2.default)(
            (0, _objectSpread2.default)({}, props),
            {},
            {
              key: key || props.value,
            },
          );
        })
        .filter(function (option) {
          var _option$value2, _option$value2$toLowe;

          /** Return all result if `filterOption` is false. */
          if (filterOption === false || option.type === 'heading') {
            return true;
          }

          return option === null || option === void 0
            ? void 0
            : (_option$value2 = option.value) === null ||
              _option$value2 === void 0
            ? void 0
            : (_option$value2$toLowe = _option$value2.toLowerCase()) === null ||
              _option$value2$toLowe === void 0
            ? void 0
            : _option$value2$toLowe.includes(
                targetMeasureText === null || targetMeasureText === void 0
                  ? void 0
                  : targetMeasureText.toLowerCase(),
              );
        });
      return list;
    };

    _this.state = {
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    };
    return _this;
  }

  (0, _createClass2.default)(
    Mentions,
    [
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          var measuring = this.state.measuring; // Sync measure div top with textarea for rc-trigger usage

          if (measuring) {
            this.measure.scrollTop = this.textarea.scrollTop;
          }
        },
      },
      {
        key: 'startMeasure',
        value: function startMeasure(
          measureText,
          measurePrefix,
          measureLocation,
        ) {
          this.setState({
            measuring: true,
            measureText: measureText,
            measurePrefix: measurePrefix,
            measureLocation: measureLocation,
            activeIndex: 0,
          });
        },
      },
      {
        key: 'stopMeasure',
        value: function stopMeasure(callback) {
          this.setState(
            {
              measuring: false,
              measureLocation: 0,
              measureText: null,
            },
            callback,
          );
        },
      },
      {
        key: 'focus',
        value: function focus() {
          this.textarea.focus();
        },
      },
      {
        key: 'blur',
        value: function blur() {
          this.textarea.blur();
        },
      },
      {
        key: 'render',
        value: function render() {
          var _this$state4 = this.state,
            value = _this$state4.value,
            measureLocation = _this$state4.measureLocation,
            measurePrefix = _this$state4.measurePrefix,
            measuring = _this$state4.measuring,
            activeIndex = _this$state4.activeIndex;
          var _this$props4 = this.props,
            prefixCls = _this$props4.prefixCls,
            placement = _this$props4.placement,
            direction = _this$props4.direction,
            transitionName = _this$props4.transitionName,
            className = _this$props4.className,
            style = _this$props4.style,
            autoFocus = _this$props4.autoFocus,
            notFoundContent = _this$props4.notFoundContent,
            getPopupContainer = _this$props4.getPopupContainer,
            restProps = (0, _objectWithoutProperties2.default)(_this$props4, [
              'prefixCls',
              'placement',
              'direction',
              'transitionName',
              'className',
              'style',
              'autoFocus',
              'notFoundContent',
              'getPopupContainer',
            ]);
          var inputProps = (0, _util.omit)(
            restProps,
            'value',
            'defaultValue',
            'prefix',
            'split',
            'children',
            'validateSearch',
            'filterOption',
            'onSelect',
            'onSearch',
          );
          var options = measuring ? this.getOptions() : [];
          return React.createElement(
            'div',
            {
              className: (0, _classnames.default)(prefixCls, className),
              style: style,
            },
            React.createElement(
              _rcTextarea.default,
              Object.assign(
                {
                  autoFocus: autoFocus,
                  ref: this.setTextAreaRef,
                  value: value,
                },
                inputProps,
                {
                  onChange: this.onChange,
                  onKeyDown: this.onKeyDown,
                  onKeyUp: this.onKeyUp,
                  onPressEnter: this.onPressEnter,
                  onFocus: this.onInputFocus,
                  onBlur: this.onInputBlur,
                },
              ),
            ),
            measuring &&
              React.createElement(
                'div',
                {
                  ref: this.setMeasureRef,
                  className: ''.concat(prefixCls, '-measure'),
                },
                value.slice(0, measureLocation),
                React.createElement(
                  _MentionsContext.MentionsContextProvider,
                  {
                    value: {
                      notFoundContent: notFoundContent,
                      activeIndex: activeIndex,
                      setActiveIndex: this.setActiveIndex,
                      selectOption: this.selectOption,
                      onFocus: this.onDropdownFocus,
                      onBlur: this.onDropdownBlur,
                    },
                  },
                  React.createElement(
                    _KeywordTrigger.default,
                    {
                      prefixCls: prefixCls,
                      transitionName: transitionName,
                      placement: placement,
                      direction: direction,
                      options: options,
                      visible: true,
                      getPopupContainer: getPopupContainer,
                    },
                    React.createElement('span', null, measurePrefix),
                  ),
                ),
                value.slice(measureLocation + measurePrefix.length),
              ),
          );
        },
      },
    ],
    [
      {
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(props, prevState) {
          var newState = {};

          if ('value' in props && props.value !== prevState.value) {
            newState.value = props.value || '';
          }

          return newState;
        },
      },
    ],
  );
  return Mentions;
})(React.Component);

Mentions.Option = _Option.default;
Mentions.defaultProps = {
  prefixCls: 'rc-mentions',
  prefix: '@',
  split: ' ',
  validateSearch: _util.validateSearch,
  filterOption: _util.filterOption,
  notFoundContent: 'Not Found',
  rows: 1,
};
var _default = Mentions;
exports.default = _default;
