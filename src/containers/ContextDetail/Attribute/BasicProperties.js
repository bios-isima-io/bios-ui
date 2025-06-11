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
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { Radio } from 'antdlatest';
import { Input, InputNumber } from '../../components';
import { IDTypeMapping, TypeMapping } from '../../SignalDetail/constant';
import styles from './styles';
import { getDefaultValueByID, getDefaultValueByType } from '../utils';
import SwitchWrapper from 'components/Switch';

const BasicProperties = ({
  selectedAttribute,
  contextDetail,
  isEnriched,
  contextDetailCopy,
  setSelectedAttribute,
}) => {
  const exitingContextAttribute = contextDetailCopy?.attributes?.find(
    (att) => att._id === selectedAttribute?._id,
  );

  const disableDefaultEnable =
    exitingContextAttribute && exitingContextAttribute?.default;
  const onAllowedValueChange = (event) => {
    const allowedValues = event?.target?.value
      ? event.target.value.trim().split(',')
      : [];
    setSelectedAttribute({
      ...selectedAttribute,
      allowedValues,
    });
  };

  const onAttributeTypeChange = (event) => {
    const valueId = event.target.value;
    let rest = {
      type: IDTypeMapping[valueId - 1],
    };
    if (selectedAttribute.defaultEnabled) {
      rest['default'] = getDefaultValueByID(valueId);
    }

    if (valueId === 3) {
      rest['allowedValues'] = '';
    }

    setSelectedAttribute({
      ...selectedAttribute,
      ...rest,
    });
  };

  const onUseDefaultChange = (checked) => {
    const defaultValue = checked
      ? getDefaultValueByType(selectedAttribute.type)
      : null;
    setSelectedAttribute({
      ...selectedAttribute,
      default: defaultValue,
      defaultEnabled: checked,
    });
  };

  return (
    <div className={css(styles.RPFieldWrapper)}>
      <div className={css(styles.RPFieldRow)}>
        <div>Type</div>
        <Radio.Group
          disabled={
            selectedAttribute.disabled || !selectedAttribute?.isNewEntry
          }
          value={TypeMapping[selectedAttribute?.type]}
          onChange={onAttributeTypeChange}
          className={css(styles.typeFieldWrapper, styles.typeField)}
        >
          <Radio value={1} className={css(styles.radioLabel)}>
            Decimal
          </Radio>

          <Radio value={2} className={css(styles.radioLabel)}>
            Number
          </Radio>

          <Radio value={3} className={css(styles.radioLabel)}>
            Text
          </Radio>

          <Radio value={4} className={css(styles.radioLabel)}>
            Boolean
          </Radio>
        </Radio.Group>
      </div>

      {selectedAttribute.type === 'String' && (
        <div className={css(styles.RPFieldRow)}>
          <div>Allowed values</div>
          <Input
            disabled={
              (!selectedAttribute?.isNewEntry &&
                !selectedAttribute?.allowedValues) ||
              isEnriched
            }
            placeholder="Separate values by commas"
            hideSuffix={true}
            value={selectedAttribute?.allowedValues}
            onChange={onAllowedValueChange}
          />
        </div>
      )}

      <div className={css(styles.RPFieldRow)}>
        <div>Use Defaults?</div>
        <SwitchWrapper
          checked={selectedAttribute.defaultEnabled}
          disabled={
            selectedAttribute.disabled ||
            (selectedAttribute.defaultEnabled &&
              selectedAttribute?.allowedValues?.length > 0) ||
            disableDefaultEnable ||
            isEnriched
          }
          onChange={onUseDefaultChange}
          offLabel="NO"
          onLabel="YES"
        />
      </div>

      <div className={css(styles.RPFieldRow)}>
        <div>Default value</div>
        {selectedAttribute.type === 'String' ? (
          <Input
            disabled={
              !selectedAttribute.defaultEnabled ||
              selectedAttribute.disabled ||
              isEnriched
            }
            placeholder="Default value"
            hideSuffix={true}
            value={selectedAttribute?.default}
            onChange={(event) => {
              setSelectedAttribute({
                ...selectedAttribute,
                default: event.target.value,
              });
            }}
          />
        ) : selectedAttribute.type === 'Boolean' ? (
          <Radio.Group
            disabled={
              !selectedAttribute.defaultEnabled ||
              selectedAttribute.disabled ||
              isEnriched
            }
            value={selectedAttribute?.default}
            onChange={(event) => {
              setSelectedAttribute({
                ...selectedAttribute,
                default: event.target.value,
              });
            }}
            className={css(styles.flexCenter)}
          >
            <Radio value={true} className={css(styles.flexCenter)}>
              True
            </Radio>

            <Radio value={false} className={css(styles.flexCenter)}>
              false
            </Radio>
          </Radio.Group>
        ) : selectedAttribute.type === 'Decimal' ? (
          <InputNumber
            key="Decimal"
            disabled={
              !selectedAttribute.defaultEnabled ||
              selectedAttribute.disabled ||
              isEnriched
            }
            placeholder="Default value"
            step={0.1}
            value={selectedAttribute?.default}
            onChange={(value) => {
              setSelectedAttribute({
                ...selectedAttribute,
                default: value,
              });
            }}
          />
        ) : (
          <InputNumber
            key="Integer"
            disabled={
              !selectedAttribute.defaultEnabled ||
              selectedAttribute.disabled ||
              isEnriched
            }
            placeholder="Default value"
            step={1}
            value={selectedAttribute?.default}
            onChange={(value) => {
              setSelectedAttribute({
                ...selectedAttribute,
                default: value,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

BasicProperties.propTypes = {
  selectedAttribute: PropTypes.instanceOf(Object),
  contextDetail: PropTypes.instanceOf(Object),
  setSelectedAttribute: PropTypes.func,
};

export default BasicProperties;
