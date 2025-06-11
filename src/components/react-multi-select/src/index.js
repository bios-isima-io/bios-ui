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
 * This component is designed to be a multi-select component which supports
 * the selection of several items in a pick list.  It was meant to mimic the
 * style of react-select but the multi-select behavior didn't work for our
 * our needs.
 *
 * Arguments:
 * - options: The {value, label}[] options to be displayed
 * - values: The currently selected values []
 * - onSelectedChanged: An event to notify the caller of new values
 * - valueRenderer: A fn to support overriding the message in the component
 * - isLoading: Show a loading indicator
 */
import React, { Component } from 'react';

import Dropdown from './dropdown.js';
import SelectPanel from './select-panel.js';
import getString from './get-string.js';
import SelectItem from './select-item.js';

import type { Option } from './select-item.js';

type Props = {
  options: Array<Option>,
  selected: Array<any>,
  onSelectedChanged?: (selected: Array<any>) => void,
  onDropdownToggle?: (boolean) => void,
  valueRenderer?: (selected: Array<any>, options: Array<Option>) => string,
  ItemRenderer?: Function,
  selectAllLabel?: string,
  isLoading?: boolean,
  disabled?: boolean,
  disableSearch?: boolean,
  shouldToggleOnHover: boolean,
  hasSelectAll: boolean,
  filterOptions?: (options: Array<Option>, filter: string) => Array<Option>,
  overrideStrings?: { [string]: string },
  labelledBy: string,
};

class MultiSelect extends Component<Props> {
  static defaultProps = {
    hasSelectAll: true,
    shouldToggleOnHover: false,
  };

  getSelectedText() {
    const { options, selected } = this.props;

    const selectedOptions = selected.map((s) =>
      options.find((o) => o.value === s),
    );

    const selectedLabels = selectedOptions.map((s) => (s ? s.label : ''));

    return selectedLabels.join(', ');
  }

  renderHeader() {
    const { options, selected, valueRenderer, overrideStrings } = this.props;

    const noneSelected = selected.length === 0;
    const allSelected = selected.length === options.length;

    const customText = valueRenderer && valueRenderer(selected, options);

    if (noneSelected) {
      return (
        <span style={styles.noneSelected}>
          {customText || getString('selectSomeItems', overrideStrings)}
        </span>
      );
    }

    if (customText) {
      return <span>{customText}</span>;
    }

    return (
      <span>
        {allSelected
          ? getString('allItemsAreSelected', overrideStrings)
          : this.getSelectedText()}
      </span>
    );
  }

  handleSelectedChanged = (selected: Array<any>) => {
    const { onSelectedChanged, disabled } = this.props;

    if (disabled) {
      return;
    }

    if (onSelectedChanged) {
      onSelectedChanged(selected);
    }
  };

  render() {
    const {
      ItemRenderer,
      options,
      selected,
      selectAllLabel,
      isLoading,
      disabled,
      disableSearch,
      filterOptions,
      shouldToggleOnHover,
      hasSelectAll,
      overrideStrings,
      labelledBy,
      onDropdownToggle,
    } = this.props;

    return (
      <div className="multi-select">
        <Dropdown
          isLoading={isLoading}
          contentComponent={SelectPanel}
          onDropdownToggle={onDropdownToggle}
          shouldToggleOnHover={shouldToggleOnHover}
          contentProps={{
            ItemRenderer,
            options,
            selected,
            hasSelectAll,
            selectAllLabel,
            onSelectedChanged: this.handleSelectedChanged,
            disabled,
            disableSearch,
            filterOptions,
            overrideStrings,
          }}
          disabled={disabled}
          labelledBy={labelledBy}
        >
          {this.renderHeader()}
        </Dropdown>
      </div>
    );
  }
}

const styles = {
  noneSelected: {
    color: '#aaa',
  },
};

export default MultiSelect;
export { Dropdown, SelectPanel, SelectItem };
