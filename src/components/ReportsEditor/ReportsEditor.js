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
 * Attribute Adder Component
 *
 * It helps to add update or delete the attribute
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Row, Divider, Popover, InputNumber } from 'antd';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Button from 'components/Button';
import './style.scss';

class ReportsEditor extends Component {
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.attribute !== state.attribute) {
      return {
        attribute: props.attribute,
      };
    }
    return null;
  }

  shouldComponentUpdate() {
    const { attribute } = this.state;
    if (attribute !== undefined) {
      if (attribute.defaultValue && this.input && this.input.state) {
        this.input.current.state.value = attribute.defaultValue;
      }
    }
    return true;
  }

  handleTypeChange = (type) => {
    const { attribute } = this.state;
    attribute.type = type === 'Number' ? 'double' : 'string';
    this.setState({ attribute });
  };

  handleTypeChangeDecimal = (is) => {
    const { attribute } = this.state;
    attribute.type = is === 'Yes' ? 'double' : 'long';
    this.setState({ attribute });
  };

  handleNameChange = () => {
    const { attribute } = this.state;
    attribute.name = this.name.current.state.value;
    this.setState(attribute);
  };

  handleSpecificValueChange = (change) => {
    const { attribute } = this.state;
    const { type } = attribute;
    let defaultValue;
    if (type === 'string') {
      defaultValue = change.target.value;
    } else if (type === 'double') {
      defaultValue = +change;
    } else {
      defaultValue = +change.target.value;
    }
    attribute.defaultValue = defaultValue;
    this.setState({ attribute });
  };

  handleSave = () => {
    const { onSave } = this.props;
    const { attribute } = this.state;
    onSave({ ...attribute });
    this.setState({
      attribute: {
        name: '',
        type: 'double',
        defaultValue: undefined,
      },
      visible: false,
    });
  };

  getDefaultValue = () => {
    const {
      attribute: { defaultValue, type },
    } = this.state;
    switch (type) {
      case 'number':
      case 'int':
      case 'long':
        if (defaultValue && Number.isInteger(+defaultValue)) {
          return Number.parseInt(defaultValue, 10);
        }
        return 0;
      case 'double':
        if (defaultValue && Number.isInteger(+defaultValue)) {
          return Number.parseFloat(defaultValue);
        }
        return 0.1;
      default:
        return defaultValue;
    }
  };

  getContent = () => {
    const { withName, onDelete, newAttr } = this.props;
    const {
      attribute: { type, defaultValue, name },
    } = this.state;
    const {
      handleTypeChange,
      handleTypeChangeDecimal,
      handleSpecificValueChange,
      handleNameChange,
      getDefaultValue,
      handleSave,
    } = this;
    return (
      <div className="attribute-adder">
        <Row>
          {!newAttr && <h4>Edit an attribute</h4>}
          {newAttr && <h4>Add an attribute</h4>}
        </Row>
        <Divider />
        {withName && (
          <Row>
            Name
            <Input
              type="text"
              defaultValue={name}
              ref={this.name}
              onKeyUp={handleNameChange}
            />
          </Row>
        )}
        <Row>
          <RadioGroup
            type="row"
            values={['Number', 'Text']}
            selected={type === 'string' ? 'Text' : 'Number'}
            onChange={handleTypeChange}
            label="Type"
          />
        </Row>
        <Divider />
        {type !== 'string' && (
          <>
            <Row>Store decimal?</Row>
            <Row>
              <RadioGroup
                type="row"
                values={['Yes', 'No']}
                selected={type === 'int' ? 'No' : 'Yes'}
                onChange={handleTypeChangeDecimal}
              />
            </Row>
            <Row>
              Default Value
              {type === 'int' && (
                <Input
                  type="number"
                  ref={this.input}
                  defaultValue={getDefaultValue('number')}
                  onChange={(event) => {
                    event.persist();
                    handleSpecificValueChange(event);
                  }}
                />
              )}
              {type === 'double' && (
                <InputNumber
                  ref={this.input}
                  defaultValue={getDefaultValue('double')}
                  step={0.1}
                  onChange={handleSpecificValueChange}
                />
              )}
            </Row>
          </>
        )}
        {type === 'string' && (
          <>
            <Row>Default Value</Row>
            <Row>
              <Input
                className="full-width"
                type="text"
                ref={this.input}
                defaultValue={defaultValue}
                onChange={(event) => {
                  event.persist();
                  handleSpecificValueChange(event);
                }}
              />
            </Row>
          </>
        )}
        <Divider />
        <Row className="controls">
          {!newAttr && (
            <Button
              type="primary"
              onClick={onDelete}
              icon="delete"
              ghost
              style={{ position: 'relative', top: '-2px', marginRight: '1rem' }}
            />
          )}
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Row>
      </div>
    );
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
    if (visible) {
      setTimeout(() => {
        this.name.current.focus();
      });
    }
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
        {controls}
      </Popover>
    );
  }
}

ReportsEditor.defaultProps = {
  attribute: {
    name: '',
    type: 'double',
    defaultValue: undefined,
  },
};

ReportsEditor.propTypes = {
  controls: PropTypes.node,
  withName: PropTypes.bool,
  newAttr: PropTypes.bool,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  attribute: PropTypes.instanceOf(Object),
};

export default ReportsEditor;
