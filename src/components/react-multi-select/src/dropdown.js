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
 * A generic dropdown component.  It takes the children of the component
 * and hosts it in the component.  When the component is selected, it
 * drops-down the contentComponent and applies the contentProps.
 */
import React, {Component} from 'react';

import LoadingIndicator from './loading-indicator.js';

type Props = {
    children?: Object,
    onDropdownToggle?: (boolean) => void,
    contentComponent: Object,
    contentProps: Object,
    isLoading?: boolean,
    disabled?: boolean,
    shouldToggleOnHover?: boolean,
    labelledBy?: string
};

type State = {
    expanded: boolean,
    hasFocus: boolean
};

class Dropdown extends Component<Props, State> {
    state = {
        expanded: false,
        hasFocus: false,
    }

    componentWillUpdate() {
        document.addEventListener('touchstart', this.handleDocumentClick);
        document.addEventListener('mousedown', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('touchstart', this.handleDocumentClick);
        document.removeEventListener('mousedown', this.handleDocumentClick);
    }

    wrapper: ?Object

    handleDocumentClick = (event: Event) => {
        const {onDropdownToggle} = this.props;
        const {expanded} = this.state;

        if (expanded && this.wrapper && !this.wrapper.contains(event.target)) {
            this.setState({expanded: false});
            onDropdownToggle(false);
        }
    }

    handleFocus = (e: {target: any}) => {
        const {hasFocus} = this.state;

        if (e.target === this.wrapper && !hasFocus) {
            this.setState({hasFocus: true});
        }
    }

    handleBlur = (e: {target: any}) => {
        const {hasFocus} = this.state;

        if (hasFocus) {
            this.setState({hasFocus: false});
        }
    }

    handleMouseEnter = (e: {target: any}) => {
        this.handleHover(true);
    }

    handleMouseLeave = (e: {target: any}) => {
        this.handleHover(false);
    }

    handleHover = (toggleExpanded: boolean) => {
        const {shouldToggleOnHover} = this.props;

        if (shouldToggleOnHover) {
            this.toggleExpanded(toggleExpanded);
        }
    }

    toggleExpanded = (value: ?boolean) => {
        const {isLoading, onDropdownToggle} = this.props;
        const {expanded} = this.state;

        if (isLoading) {
            return;
        }

        const newExpanded = value === undefined ? !expanded : !!value;

        newExpanded ? onDropdownToggle(true) : onDropdownToggle(false);

        this.setState({expanded: newExpanded});

        if (!newExpanded && this.wrapper) {
            this.wrapper.focus();
        }
    }

    renderPanel() {
        const {contentComponent: ContentComponent, contentProps} = this.props;

        return <div
            className="dropdown-content"
            style={styles.panelContainer}
        >
            <ContentComponent {...contentProps} />
        </div>;
    }

    render() {
        const {expanded} = this.state;
        const {children, isLoading, disabled, labelledBy, contentProps} = this.props;
        const {options, selected} = contentProps;

        const arrowStyle = expanded
            ? styles.dropdownArrowUp
            : styles.dropdownArrowDown;

        const expandedArrowStyle = expanded
            ? styles.dropdownArrowDownFocused
            : undefined;
        const headingStyle = {
            ...styles.dropdownChildren,
            ...(disabled ? styles.disabledDropdownChildren : {}),
        };

        return <div
            className="dropdown"
            tabIndex="0"
            role="combobox"
            aria-labelledby={labelledBy}
            aria-expanded={expanded}
            aria-readonly="true"
            aria-disabled={disabled}
            style={styles.dropdownContainer}
            ref={ref => this.wrapper = ref}
            // onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
        >
            <div
                className="dropdown-heading"
                style={{
                    boxSizing: 'border-box',
                    backgroundColor: selected.length > 0 && selected.length < options.length ? '#F1ECE6' : '#fff',
                    border: expanded ?
                        '1px solid #CEC0B0' :
                        '1px solid #DDDBDA',
                    borderRadius: 5,
                    color: '#2B2826',
                    display: 'table',
                    height: 36,
                    outline: 'none',
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    fontSize: '12px',
                    cursor: disabled ? "not-allowed" : 'default',
                }}
                onClick={() => {
                    !disabled && this.toggleExpanded();
                }}
            >
                <span
                    className="dropdown-heading-value"
                    style={headingStyle}
                >
                    {children}
                </span>
                <span
                    className="dropdown-heading-loading-container"
                    style={styles.loadingContainer}
                >
                    {isLoading && <LoadingIndicator />}
                </span>
                <span
                    className="dropdown-heading-dropdown-arrow"
                    style={styles.dropdownArrow}
                >
                    <span style={{
                        ...arrowStyle,
                        ...expandedArrowStyle,
                    }}
                    />
                </span>
            </div>
            {expanded && this.renderPanel()}
        </div>;
    }
}

const focusColor = '#CEC0B0';

const styles = {
    dropdownArrow: {
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'table-cell',
        position: 'relative',
        textAlign: 'center',
        verticalAlign: 'middle',
        width: 25,
        paddingRight: 5,
    },
    dropdownArrowDown: {
        boxSizing: 'border-box',
        borderColor: '#999 transparent transparent',
        borderStyle: 'solid',
        borderWidth: '5px 5px 2.5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative',
    },
    dropdownArrowUp: {
        boxSizing: 'border-box',
        top: '-2px',
        borderColor: 'transparent transparent #999',
        borderStyle: 'solid',
        borderWidth: '0px 5px 5px',
        display: 'inline-block',
        height: 0,
        width: 0,
        position: 'relative',
    },
    dropdownChildren: {
        boxSizing: 'border-box',
        bottom: 0,
        color: '#333',
        left: 0,
        lineHeight: '34px',
        paddingLeft: 10,
        paddingRight: 10,
        position: 'relative',
        right: 0,
        top: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    disabledDropdownChildren: {
        opacity: 0.5,
    },
    dropdownContainer: {
        position: 'relative',
        boxSizing: 'border-box',
        outline: 'none',
    },
    loadingContainer: {
        cursor: 'pointer',
        display: 'table-cell',
        verticalAlign: 'middle',
        width: '16px',
    },
    panelContainer: {
        borderRadius: '5px',
        backgroundColor: '#fff',
        border: '1px solid #CEC0B0',
        boxShadow: '0px 10px 20px rgba(216, 216, 216, 0.4)',
        boxSizing: 'border-box',
        marginTop: '0px',
        position: 'absolute',
        top: 'calc(100% + 2px)',
        width: 'max-content',
        zIndex: 1,
    },
};

export default Dropdown;
