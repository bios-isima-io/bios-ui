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
import { Dropdown, Menu } from 'antdlatest';
import DropdownField from 'containers/SignalDetail/components/DropdownField';
import TextField from 'containers/SignalDetail/components/TextField';
import {
  POSITIVE_INDICATOR_LIST,
  POSITIVE_INDICATOR_MAP,
} from 'containers/SignalDetail/RightPanelAttributeTabContent/constant';
import commonStyles from '../../../app/styles/commonStyles';
import styles from './styles';

const AttributeTags = ({
  tags,
  selectedAttribute,
  setSelectedAttribute,
  isEnriched,
}) => {
  const positiveIndicatorMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        setSelectedAttribute({
          ...selectedAttribute,
          positiveIndicator: key,
        });
      }}
    >
      {POSITIVE_INDICATOR_LIST.map(({ title, key }) => {
        return <Menu.Item key={key}>{title}</Menu.Item>;
      })}
    </Menu>
  );

  const categoriesList = tags.categories
    ? selectedAttribute.type === 'Decimal' ||
      selectedAttribute.type === 'Integer'
      ? tags.categories
      : tags.categories.slice(1)
    : [];

  let kindList = tags.kindsAndUnits ? Object.keys(tags.kindsAndUnits) : [];
  //Temporary Logic till backend provide the updated list
  kindList = kindList.filter((item) => item !== 'OtherKind');
  kindList.push('OtherKind');

  const unitList = selectedAttribute.kind
    ? tags.kindsAndUnits
      ? tags.kindsAndUnits[selectedAttribute.kind]
          .map((item) => item.unit)
          .concat('OtherUnit')
      : []
    : [];
  const summaryList = tags.summaries
    ? selectedAttribute.type === 'Decimal' ||
      selectedAttribute.type === 'Integer'
      ? tags.summaries
      : ['NONE', 'DISTINCTCOUNT', 'WORD_CLOUD']
    : [];
  const unitDisplayPositionList = tags.kindsAndUnits
    ? tags.unitDisplayPositions
    : [];

  return (
    <div className={css(styles.RPFieldWrapper)}>
      <div className={css(styles.categoryTagsWrapper)}>
        <DropdownField
          disabled={isEnriched}
          list={categoriesList}
          label="Category"
          selected={selectedAttribute.category}
          onClick={(key) => {
            if (selectedAttribute.category !== key) {
              setSelectedAttribute({
                ...selectedAttribute,
                category: key,
              });
            }
          }}
        />

        {(selectedAttribute.type === 'Decimal' ||
          selectedAttribute.type === 'Integer') &&
          selectedAttribute.category === 'Quantity' && (
            <>
              <DropdownField
                disabled={isEnriched}
                list={kindList}
                label="Kind"
                selected={selectedAttribute.kind}
                onClick={(key) => {
                  if (selectedAttribute.kind !== key) {
                    setSelectedAttribute({
                      ...selectedAttribute,
                      kind: key,
                      otherKindName: null,
                      unit: null,
                      unitDisplayName: null,
                    });
                  }
                }}
              />

              {selectedAttribute.kind === 'OtherKind' ? (
                <TextField
                  disabled={isEnriched}
                  label="Other Kind Name"
                  value={selectedAttribute.otherKindName}
                  onChange={(value) => {
                    setSelectedAttribute({
                      ...selectedAttribute,
                      otherKindName: value,
                    });
                  }}
                />
              ) : (
                <DropdownField
                  list={unitList}
                  label="Unit"
                  disabled={!!!selectedAttribute.kind || isEnriched}
                  selected={selectedAttribute.unit}
                  onClick={(key) => {
                    if (selectedAttribute.unit !== key) {
                      setSelectedAttribute({
                        ...selectedAttribute,
                        unit: key,
                      });
                    }
                  }}
                />
              )}

              <TextField
                label="Unit Display Name"
                value={selectedAttribute.unitDisplayName}
                disabled={isEnriched}
                onChange={(value) => {
                  setSelectedAttribute({
                    ...selectedAttribute,
                    unitDisplayName: value,
                  });
                }}
              />

              <DropdownField
                list={unitDisplayPositionList}
                label="Unit Display Position"
                selected={selectedAttribute.unitDisplayPosition}
                disabled={isEnriched}
                onClick={(key) => {
                  if (selectedAttribute.unitDisplayPosition !== key) {
                    setSelectedAttribute({
                      ...selectedAttribute,
                      unitDisplayPosition: key,
                    });
                  }
                }}
              />

              <div className={css(styles.RPFieldRow)}>
                <div>Positive indicator</div>
                <Dropdown
                  overlay={positiveIndicatorMenu}
                  trigger={['click']}
                  disabled={isEnriched}
                >
                  <div className={css(styles.MenuPanelWrapper)}>
                    <div>
                      {selectedAttribute?.positiveIndicator
                        ? POSITIVE_INDICATOR_MAP[
                            selectedAttribute?.positiveIndicator
                          ]
                        : 'Select positive indicator...'}
                    </div>
                    <i className="icon-chevron-down" />
                  </div>
                </Dropdown>
              </div>
            </>
          )}

        <DropdownField
          list={summaryList}
          label="Primary Metric"
          selected={selectedAttribute.firstSummary}
          disabled={isEnriched}
          onClick={(key) => {
            if (key === null) {
              setSelectedAttribute({
                ...selectedAttribute,
                firstSummary: key,
                secondSummary: null,
              });
            } else {
              setSelectedAttribute({
                ...selectedAttribute,
                firstSummary: key,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

AttributeTags.propTypes = {
  tags: PropTypes.instanceOf(Object),
  isEnriched: PropTypes.bool,
  signalDetail: PropTypes.instanceOf(Object),
  setSignalDetail: PropTypes.func,
  selectedAttribute: PropTypes.instanceOf(Object),
  setSelectedAttribute: PropTypes.func,
};

export default AttributeTags;
