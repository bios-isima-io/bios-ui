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

/*
 * Signals Page
 *
 * List, Add, Update, Delete Signals
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Popover, Checkbox } from 'antd';
import './style.scss';

class PermissionsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
      selected: [],
    };
  }

  componentDidMount() {
    const { permissions } = this.props;
    this.setState({ permissions });
  }

  shouldComponentUpdate(nextProps) {
    const { permissions, selected } = this.state;
    if (permissions !== nextProps.permissions) {
      this.setState({ permissions: nextProps.permissions });
      return true;
    }
    if (selected !== nextProps.selected) {
      this.setState({ selected: nextProps.selected });
      return true;
    }
    return true;
  }

  updateSelect = (is, perm) => {
    let { selected } = this.state;
    const { onChange } = this.props;
    if (is) {
      selected.push(perm);
    } else if (perm) {
      selected = selected.filter((sel) => sel.id !== perm.id);
    }
    this.setState({ selected });
    onChange(selected);
  };

  isChecked = (selected, perm) =>
    selected !== undefined &&
    selected.find((sel) => sel.id === perm.id) !== undefined;

  getContent = () => {
    const { updateSelect, isChecked } = this;
    const { permissions, selected } = this.state;
    const { title } = this.props;
    return (
      <div className="permissions-select">
        <Row className="perm-select-title">
          <h4>Set role for {title}</h4>
        </Row>
        <div>
          {permissions &&
            permissions.map((perm) => (
              <Row key={permissions.name} className="perm-select-item">
                <Checkbox
                  size="large"
                  onChange={(event) => {
                    updateSelect(event.target.checked, perm);
                  }}
                  checked={isChecked(selected, perm)}
                >
                  {perm.name}
                </Checkbox>
              </Row>
            ))}
          {selected.length === 1 && (
            <Row className="perm-select-item">
              <i>*User must have at least one role.</i>
            </Row>
          )}
        </div>
      </div>
    );
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  render() {
    const { getContent } = this;
    const { controls } = this.props;
    const { visible } = this.state;
    return (
      <Popover
        onVisibleChange={this.handleVisibleChange}
        visible={visible}
        placement="bottomLeft"
        content={getContent()}
        trigger="click"
      >
        <span>{controls}</span>
      </Popover>
    );
  }
}

PermissionsEditor.propTypes = {
  controls: PropTypes.node,
  onChange: PropTypes.func,
  permissions: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  title: PropTypes.string,
};

export default PermissionsEditor;
