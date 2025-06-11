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
 * This component represents the entire panel which gets dropped down when the
 * user selects the component.  It encapsulates the search filter, the
 * Select-all item, and the list of options.
 */
import React, {Component} from 'react';

import SelectItem from './select-item.js';
import SelectList from './select-list.js';
import getString from "./get-string.js";

import type {Option} from './select-item.js';

type Props = {
    ItemRenderer?: Function,
    options: Array<Option>,
    selected: Array<any>,
    selectAllLabel?: string,
    onSelectedChanged: (selected: Array<any>) => void,
    disabled?: boolean,
    disableSearch?: boolean,
    hasSelectAll: boolean,
    overrideStrings?: {[string]: string}
};

type State = {
    searchHasFocus: boolean,
    searchText: string,
    focusIndex: number
};

class SelectPanel extends Component<Props, State> {
    state = {
        searchHasFocus: false,
        searchText: "",
        focusIndex: 0,
    }

    selectAll = () => {
        const {onSelectedChanged, options} = this.props;
        const allValues = options.map(o => o.value);

        onSelectedChanged(allValues);
    }

    selectNone = () => {
        const {onSelectedChanged} = this.props;

        onSelectedChanged([]);
    }

    selectAllChanged = (checked: boolean) => {
        if (checked) {
            this.selectAll();
        } else {
            this.selectNone();
        }
    }

    handleSearchChange = (e: {target: {value: any}}) => {
        this.setState({
            searchText: e.target.value,
            focusIndex: -1,
        });
    }

    handleItemClicked = (index: number) => {
        this.setState({focusIndex: index});
    }

    clearSearch = () => {
        this.setState({searchText: ""});
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.which) {
            case 38: // Up Arrow
                if (e.altKey) {
                    return;
                }

                this.updateFocus(-1);
                break;
            case 40: // Down Arrow
                if (e.altKey) {
                    return;
                }

                this.updateFocus(1);
                break;
            default:
                return;
        }

        e.stopPropagation();
        e.preventDefault();
    }

    handleSearchFocus = (searchHasFocus: boolean) => {
        this.setState({
            searchHasFocus,
            focusIndex: -1,
        });
    }

    allAreSelected() {
        const {options, selected} = this.props;
        return options.length === selected.length;
    }

    filteredOptions() {
        const {searchText} = this.state;
        const {options} = this.props;

        if (searchText){
            const result = options.filter(item => {
                const text = typeof (item.value) === "number"
                    ? item.value.toString()
                    : item.value;
                return text.includes(searchText);
            });

            return result;
        } else {
            return options;
        }
    }

    updateFocus(offset: number) {
        const {focusIndex} = this.state;
        const {options} = this.props;

        let newFocus = focusIndex + offset;
        newFocus = Math.max(0, newFocus);
        newFocus = Math.min(newFocus, options.length);

        this.setState({focusIndex: newFocus});
    }

    render() {
        const {focusIndex, searchHasFocus} = this.state;
        const {
            ItemRenderer,
            selectAllLabel,
            disabled,
            disableSearch,
            hasSelectAll,
            overrideStrings,
        } = this.props;

        const selectAllOption = {
            label: selectAllLabel || getString("selectAll", overrideStrings),
            value: "",
        };

        const focusedSearchStyle = searchHasFocus
            ? styles.searchFocused
            : undefined;

        return <div
            className="select-panel"
            style={styles.panel}
            role="listbox"
            onKeyDown={this.handleKeyDown}
        >
            {!disableSearch && <div style={styles.searchContainer}>
                <input
                    placeholder={getString("search", overrideStrings)}
                    type="text"
                    onChange={this.handleSearchChange}
                    style={{...styles.search, ...focusedSearchStyle}}
                    onFocus={() => this.handleSearchFocus(true)}
                    onBlur={() => this.handleSearchFocus(false)}
                />
            </div>}

            <div style={{
                overflowY: 'auto',
                maxHeight: '300px',
            }}
            >
                {hasSelectAll &&
                <SelectItem
                    focused={focusIndex === 0}
                    checked={this.allAreSelected()}
                    option={selectAllOption}
                    onSelectionChanged={this.selectAllChanged}
                    onClick={() => this.handleItemClicked(0)}
                    ItemRenderer={ItemRenderer}
                    disabled={disabled}
                />
                }

                <SelectList
                    {...this.props}
                    options={this.filteredOptions()}
                    focusIndex={focusIndex - 1}
                    onClick={(e, index) => this.handleItemClicked(index + 1)}
                    ItemRenderer={ItemRenderer}
                    disabled={disabled}
                />
            </div>
        </div>;
    }
}

const styles = {
    panel: {
        boxSizing : 'border-box',
    },
    search: {
        fontSize: '12px',
        display: "block",
        maxWidth: "100%",
        borderRadius: "5px",
        boxSizing : 'border-box',
        height: '32px',
        lineHeight: '24px',
        border: '1px solid #B0ADAB',
        padding: '10px',
        width: "100%",
        outline: "none",
        color: '#706E6B',
    },
    searchFocused: {
        borderColor: "#A96E76",
    },
    searchContainer: {
        width: "100%",
        boxSizing : 'border-box',
        padding: '16px 20px 16px 16px',
    },
};

export default SelectPanel;
