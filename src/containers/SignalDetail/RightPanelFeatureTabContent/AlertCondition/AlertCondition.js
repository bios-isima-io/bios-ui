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
import { Select, Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import commonStyles from 'app/styles/commonStyles';
import SwitchWrapper from 'components/Switch';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Input } from '../../../components';
import styles, { menuWrapper } from '../styles';

const AlertCondition = ({
  index,
  selectedFeature,
  relation,
  violation,
  onChange,
  onDelete,
}) => {
  const [attributesToRetrieveOption, setAttributesToRetrieveOption] = useState(
    [],
  );
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [operators, setOperators] = useState([]);
  const [inputValue, setInputValue] = useState(0);
  const [isNum, setIsNum] = useState(false);

  useEffect(() => {
    const attributeOptions = [];

    selectedFeature?.dimensions.forEach((attributeName) => {
      attributeOptions.push({ value: attributeName, label: attributeName });
    });
    attributeOptions.push({ value: 'count()', label: 'count()' });
    selectedFeature?.attributes.forEach((attributes) => {
      attributeOptions.push(
        { value: `sum(${attributes})`, label: `sum(${attributes})` },
        { value: `min(${attributes})`, label: `min(${attributes})` },
        { value: `max(${attributes})`, label: `max(${attributes})` },
      );
    });
    setAttributesToRetrieveOption(attributeOptions);
  }, [selectedFeature?.dimensions, selectedFeature?.attributes]);

  const getAllowedOperatorsStr = () => ['==', 'CONTAINS'];
  const getAllowedOperatorsNum = () => ['==', '<', '<=', '>', '>='];

  useEffect(() => {
    if (relation) {
      const selectedAttribute = relation.lhs;
      const selectedOperator = relation.op;
      const isNum = relation.isNum;
      let inputValue = relation.rhs;
      if (isNum !== undefined) {
        setIsNum(isNum);
        const possibleOps = isNum
          ? getAllowedOperatorsNum()
          : getAllowedOperatorsStr();
        const op = possibleOps.find((op) => op === selectedOperator);
        setSelectedOperator(op);
        const allowedOperators = possibleOps.map((op) => {
          return { value: op, label: op };
        });
        setOperators(allowedOperators);
        if (!isNum && inputValue.startsWith("'") && inputValue.endsWith("'")) {
          inputValue = inputValue.substring(1, inputValue.length - 1);
        }
      } else {
        setOperators([]);
      }
      setSelectedAttribute(selectedAttribute);

      setInputValue(inputValue);
    } else {
      setSelectedAttribute('');
      setSelectedOperator('');
      setOperators([]);
      setInputValue('');
    }
  }, [relation]);

  const filterSelect = (input, option) =>
    option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const andOr = (isAnd) => (isAnd ? 'AND' : 'OR');

  return (
    <div className={css(styles.mb30)}>
      <div className={css(styles.mb15)}>
        {index > 0 ? (
          <div className={css(styles.switchLabelWrapper)}>
            <div>{andOr(relation.isAnd)}</div>
            <SwitchWrapper
              checked={relation.isAnd}
              onChange={(value) => {
                onChange({
                  ...relation,
                  isAnd: value,
                  isNum,
                });
              }}
              offLabel=""
              onLabel=""
            />
          </div>
        ) : (
          <div>IF</div>
        )}
      </div>

      <div className={css(styles.selectWrapper)}>
        <Tooltip title={violation?.var}>
          <Select
            dropdownStyle={menuWrapper}
            showSearch
            optionFilterProp="children"
            size="large"
            value={selectedAttribute}
            onChange={(value) => onChange({ ...relation, lhs: value, isNum })}
            filterOption={filterSelect}
            style={{ color: !!violation?.var ? 'red' : 'black' }}
          >
            {attributesToRetrieveOption.map((attribute, index) => (
              <Select.Option
                onClick={() => {}}
                key={attribute.label}
                value={attribute.value}
              >
                <span>{attribute.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Tooltip>
        <Tooltip title={violation?.op}>
          <Select
            showSearch
            optionFilterProp="children"
            size="large"
            value={selectedOperator}
            onChange={(value) => {
              setSelectedOperator(value);
              onChange({ ...relation, op: value, isNum });
            }}
            filterOption={filterSelect}
            dropdownStyle={menuWrapper}
            style={{ color: !!violation?.op ? 'red' : 'black' }}
          >
            {operators.map((operator, index) => (
              <Select.Option
                onClick={() => {}}
                key={operator.value}
                value={operator.value}
              >
                <span>{operator.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Tooltip>
        <Tooltip title={violation?.value}>
          <Input
            onChange={(event) => {
              onChange({
                ...relation,
                rhs: event?.target?.value,
                isNum,
              });
            }}
            value={inputValue}
            size="large"
            hideSuffix={true}
            style={{
              width: '10.5rem',
              color: !!violation?.value ? 'red' : 'black',
            }}
          />
        </Tooltip>
        <i
          className={`icon-trash ${css(commonStyles.icon)}`}
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

AlertCondition.propTypes = {
  attributesToRetrieve: PropTypes.array,
  condition: PropTypes.object,
  logicalOp: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default AlertCondition;
