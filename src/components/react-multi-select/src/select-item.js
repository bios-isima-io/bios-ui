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

// @flow
/**
 * This component represents an individual item in the multi-select drop-down
 */
import React, { Component } from 'react';

export type Option = {
  value: any,
  label: string,
  key?: string,
  disabled?: boolean,
};

type DefaultItemRendererProps = {
  checked: boolean,
  option: Option,
  disabled?: boolean,

  onClick: (event: MouseEvent) => void,
};

class DefaultItemRenderer extends Component<DefaultItemRendererProps> {
  render() {
    const { checked, option, onClick, disabled } = this.props;

    const style = {
      ...styles.label,
      ...styles.customlabel,
      ...(disabled ? styles.labelDisabled : undefined),
      ...(!checked ? styles.labelUnActive : undefined),
    };

    return (
      <span
        className="item-renderer"
        style={{ display: 'flex', alignItems: 'center', minWidth: '170px' }}
      >
        <span
          onClick={!disabled && onClick}
          tabIndex="-1"
          style={{
            opacity: disabled ? '0.2' : '1.0',
          }}
        >
          {checked ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
                fill="#AA8C68"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.44403 8.46664C4.2708 8.27425 3.97441 8.25871 3.78202 8.43194C3.58963 8.60517 3.5741 8.90156 3.74733 9.09395L5.95554 11.5464C6.12877 11.7388 6.42516 11.7543 6.61755 11.5811C6.80993 11.4079 6.82547 11.1115 6.65224 10.9191L4.44403 8.46664Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.5629 4.70577C11.7361 4.51338 12.0325 4.49785 12.2249 4.67108C12.4173 4.8443 12.4328 5.14069 12.2596 5.33308L6.66918 11.5419C6.49595 11.7343 6.19956 11.7498 6.00717 11.5766C5.81478 11.4033 5.79925 11.107 5.97248 10.9146L11.5629 4.70577Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H2C1.17157 15.5 0.5 14.8284 0.5 14V2Z"
                stroke="#AA8C68"
              />
            </svg>
          )}
        </span>

        <span style={style}>
          <span
            style={{
              marginRight: '15px',
            }}
          >
            {option.label}
          </span>
          <span>{option.count && `${option.count}`}</span>
        </span>
      </span>
    );
  }
}

type SelectItemProps = {
  ItemRenderer: Function,
  option: Option,
  checked: boolean,
  focused?: boolean,
  disabled?: boolean,
  onSelectionChanged: (checked: boolean) => void,
  onClick: (event: MouseEvent) => void,
};
type SelectItemState = {
  hovered: boolean,
};

class SelectItem extends Component<SelectItemProps, SelectItemState> {
  static defaultProps = {
    ItemRenderer: DefaultItemRenderer,
  };

  state = {
    hovered: false,
  };

  componentDidMount() {
    this.updateFocus();
  }

  componentDidUpdate() {
    this.updateFocus();
  }

  itemRef: ?HTMLElement;

  onChecked = (e: { target: { checked: boolean } }) => {
    const { onSelectionChanged } = this.props;
    const { checked } = e.target;

    onSelectionChanged(checked);
  };

  toggleChecked = () => {
    const { checked, onSelectionChanged } = this.props;
    onSelectionChanged(!checked);
  };

  handleClick = (e: MouseEvent) => {
    const { onClick } = this.props;
    this.toggleChecked();
    onClick(e);
  };

  updateFocus() {
    const { focused } = this.props;

    if (focused && this.itemRef) {
      this.itemRef.focus();
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.which) {
      case 13: // Enter
      case 32: // Space
        this.toggleChecked();
        break;
      default:
        return;
    }

    e.preventDefault();
  };

  render() {
    const { ItemRenderer, option, checked, focused, disabled } = this.props;
    const { hovered } = this.state;

    const focusStyle = hovered ? styles.itemContainerHover : undefined;

    return (
      <label
        className="select-item"
        role="option"
        aria-selected={checked}
        selected={checked}
        tabIndex="-1"
        style={{ ...styles.itemContainer, ...focusStyle }}
        ref={(ref) => (this.itemRef = ref)}
        onKeyDown={this.handleKeyDown}
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseOut={() => this.setState({ hovered: false })}
      >
        <ItemRenderer
          option={option}
          checked={checked}
          onClick={this.handleClick}
          disabled={disabled}
        />
      </label>
    );
  }
}

const styles = {
  itemContainer: {
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#666666',
    cursor: 'pointer',
    display: 'block',
    padding: '8px 16px',
  },
  itemContainerHover: {
    backgroundColor: '#CEC0B0',
    outline: 0,
  },
  customlabel: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 'calc(100% - 30px)',
  },
  label: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderBottomRightRadius: '2px',
    borderTopRightRadius: '2px',
    cursor: 'default',
    padding: '2px 5px',
    whiteSpace: 'nowrap',
    color: '#2B2826',
  },
  labelDisabled: {
    color: '#706E6B',
  },
  labelUnActive: {
    color: '#706E6B',
  },
};

export default SelectItem;
