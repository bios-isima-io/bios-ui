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
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import styles from '../../../../styles';
import { Dropdown, Menu } from 'antdlatest';
import { Input } from '../../../../../components';
import { cloneDeep, isString } from 'lodash';
import { updateSourceChange } from '../../utils';
import { flowSpecsActions } from '../../reducers';

const { setSourceDataSpec, setDataPickupSpec } = flowSpecsActions;

const HIBERNATE_OPERATION_TYPES = ['Create', 'Read', 'Update', 'Delete'];
const HIBERNATE_ADDITIONAL_ATTRIBUTES = [
  'operationType',
  'operationLatency',
  'operationResult',
  'sqlStatement',
  'deltaChanges',
];

function ImportFlow({
  setSourceDataSpec,
  sourceDataSpec,
  signalDetail,
  contextDetail,
  dataPickupSpec,
  setDataPickupSpec,
  isOnboarding,
}) {
  let {
    payloadType,
    hibernateEntity,
    hibernateOperationTypes,
    hibernateAdditionalAttributes,
  } = sourceDataSpec;

  if (!hibernateOperationTypes) {
    hibernateOperationTypes = [];
  }
  if (!hibernateAdditionalAttributes) {
    hibernateAdditionalAttributes = [];
  }

  const setHibernateAdditionalAttributes = (value) => {
    setSourceDataSpec({ hibernateAdditionalAttributes: value });
  };

  const setHibernateOperationTypes = (value) => {
    setSourceDataSpec({ hibernateOperationTypes: value });
  };

  const updateSourceData = (key, value) => {
    updateSourceChange({
      key,
      value,
      sourceDataSpec,
      dataPickupSpec,
      signalDetail,
      contextDetail,
      setDataPickupSpec,
      setSourceDataSpec,
      isOnboarding,
    });
  };

  const typeMenu = (
    <Menu onClick={(val) => updateSourceData('payloadType', val.key)}>
      <Menu.Item key="Json">JSON</Menu.Item>
      <Menu.Item key="Csv">CSV</Menu.Item>
    </Menu>
  );

  const hibernateOperationTypesMenu = (
    <Menu
      onClick={(val) =>
        setHibernateOperationTypes([...hibernateOperationTypes, val.key])
      }
    >
      {HIBERNATE_OPERATION_TYPES.filter(
        (n) => !hibernateOperationTypes?.includes(n),
      ).map((val) => (
        <Menu.Item key={val}>{val}</Menu.Item>
      ))}
    </Menu>
  );

  const hibernateAdditionalAttributesMenu = (
    <Menu
      onClick={(val) =>
        setHibernateAdditionalAttributes([
          ...hibernateAdditionalAttributes,
          val.key,
        ])
      }
    >
      {HIBERNATE_ADDITIONAL_ATTRIBUTES.filter(
        (n) => !hibernateAdditionalAttributes?.includes(n),
      ).map((val) => (
        <Menu.Item key={val}>{val}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={css(styles.rightPanelSectionContainer)}>
      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Payload Type</div>
        <div>
          <Dropdown overlay={typeMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>
                {payloadType === undefined && !isString(payloadType)
                  ? ''
                  : payloadType.toUpperCase()}
              </div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Hibernate Entity</div>
        <div>
          <Input
            hideSuffix={true}
            placeholder=""
            onChange={(event) =>
              updateSourceData('hibernateEntity', event.target.value)
            }
            value={hibernateEntity}
          ></Input>
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionKey)}>
          Hibernate Operation Types
        </div>
        <div>
          <Dropdown overlay={hibernateOperationTypesMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>Select</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
          {hibernateOperationTypes.map((val, index) => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '10px',
                }}
              >
                {val}
                <div style={{ marginLeft: '5px' }}>
                  <i
                    className={`icon-trash ${css(styles.trashIcon)}`}
                    onClick={() => {
                      const values = cloneDeep(hibernateOperationTypes);
                      values.splice(index, 1);
                      setHibernateOperationTypes(values);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionKey)}>
          Hibernate Additional Attributes
        </div>
        <div>
          <Dropdown
            overlay={hibernateAdditionalAttributesMenu}
            trigger={['click']}
          >
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>Select</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
          {hibernateAdditionalAttributes.map((val, index) => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '10px',
                }}
              >
                {val}
                <div style={{ marginLeft: '5px' }}>
                  <i
                    className={`icon-trash ${css(styles.trashIcon)}`}
                    onClick={() => {
                      const values = cloneDeep(hibernateAdditionalAttributes);
                      values.splice(index, 1);
                      setHibernateAdditionalAttributes(values);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setSourceDataSpec,
  setDataPickupSpec,
};

const mapStateToProps = (state) => {
  const { sourceDataSpec, dataPickupSpec } = state.integration.importFlowSpecs;
  const { signalDetail } = state.signalDetail;
  const { contextDetail } = state.contextDetail;
  return {
    sourceDataSpec,
    dataPickupSpec,
    signalDetail,
    contextDetail,
  };
};

ImportFlow.propTypes = {
  setSourceDataSpec: PropTypes.func,
  sourceDataSpec: PropTypes.array,
  signalDetail: PropTypes.object,
  contextDetail: PropTypes.object,
  dataPickupSpec: PropTypes.object,
  setDataPickupSpec: PropTypes.func,
  isOnboarding: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFlow);
