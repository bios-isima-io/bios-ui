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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Select, Button, Icon, Col } from 'antd';
import './SelectOrApplyStream.scss';
import { capitalize } from '../../utils';

const { Option } = Select;
const filterSignals = (input, option) =>
  option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;

const SelectOrApplyStream = ({
  type,
  streams,
  activeIndex,
  setActiveStream,
  applyLoading,
  applyChanges,
  toggleStreamDelete,
  discardChanges,
  onAddStream,
}) => {
  const [activeStreamName, setActiveStreamName] = useState(
    streams[activeIndex].name,
  );
  const [hoveringNewStream, setHoveringNewStream] = useState(false);
  useEffect(() => setActiveStreamName(streams[activeIndex].name), [
    streams[activeIndex],
  ]);

  const getApplyDisableState = () => {
    let disable = false;
    if (
      !(
        streams[activeIndex].delta ||
        streams[activeIndex].deleted ||
        streams[activeIndex].new
      )
    ) {
      disable = true;
    }
    if (
      type === 'context' &&
      streams[activeIndex].attributes &&
      streams[activeIndex].attributes.length < 2
    ) {
      disable = true;
    }
    return disable;
  };

  return (
    <>
      <Row
        className="select-row"
        type="flex"
        style={{ margin: '4.1rem 0', alignItems: 'center' }}
      >
        <Col span={3}>
          <h3 style={{ margin: 0 }}>Select a {type}</h3>
        </Col>
        <Col span={18}>
          {streams.length !== 0 && (
            <Select
              showSearch
              style={{ width: '21rem' }}
              defaultValue={activeStreamName}
              optionFilterProp="children"
              size="large"
              value={activeStreamName}
              filterOption={filterSignals}
            >
              {streams.map((stream, index) => (
                <Option
                  onClick={() => setActiveStream(index)}
                  key={stream.name}
                  value={stream.name}
                >
                  <span
                    style={{
                      textDecoration: stream.deleted
                        ? 'line-through'
                        : 'initial',
                    }}
                  >
                    {stream.name}
                    {stream.delta && (
                      <h3 style={{ float: 'right', width: 'content-width' }}>
                        draft
                      </h3>
                    )}
                  </span>
                </Option>
              ))}
            </Select>
          )}

          {(streams[activeIndex].delta || streams[activeIndex].new) && (
            <Button
              style={{ marginLeft: '2rem', fontWeight: 'normal' }}
              type="primary"
              size="large"
              loading={applyLoading}
              onClick={applyChanges}
              disabled={getApplyDisableState()}
            >
              {streams[activeIndex].new ? 'Create' : 'Update'}
            </Button>
          )}

          {(streams[activeIndex].delta || streams[activeIndex].new) && (
            <Button
              style={{
                marginLeft: '1rem',
                paddingTop: '1px',
                paddingBottom: '1px',
              }}
              size="large"
              onClick={discardChanges}
              title="Discard Changes"
              disabled={
                !(streams[activeIndex].delta || streams[activeIndex].new)
              }
              type="primary"
              ghost
            >
              Discard
            </Button>
          )}
          <Button
            style={{
              marginLeft:
                streams[activeIndex].delta || streams[activeIndex].new
                  ? '1rem'
                  : '2rem',
              paddingTop: '1px',
              paddingBottom: '1px',
            }}
            size="large"
            onClick={() => {
              toggleStreamDelete(streams[activeIndex]);
            }}
            title="delete"
            type="primary"
            ghost
          >
            Delete
          </Button>
        </Col>
        <Col
          span={3}
          style={{ textAlign: 'right', position: 'relative', top: 1 }}
        >
          <Button
            icon="plus"
            size="large"
            ghost
            type="primary"
            className="hover-effect"
            onClick={onAddStream}
          >
            {`New ${capitalize(type)}`}
          </Button>
        </Col>
      </Row>
    </>
  );
};

SelectOrApplyStream.propTypes = {
  type: PropTypes.oneOf(['signal', 'context']).isRequired,
  streams: PropTypes.array,
  activeIndex: PropTypes.number,
  applyLoading: PropTypes.bool,
  applyChanges: PropTypes.func.isRequired,
  toggleStreamDelete: PropTypes.func.isRequired,
  setActiveStream: PropTypes.func.isRequired,
};

export default SelectOrApplyStream;
