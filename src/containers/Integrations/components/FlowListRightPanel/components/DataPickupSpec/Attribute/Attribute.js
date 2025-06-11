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
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import styles from '../../../../../styles';
import { Input, Button, InputNumber } from '../../../../../../components';
import { flowSpecsActions } from '../../../reducers';
import { cloneDeep } from 'lodash';
import attributeStyles from './styles';
import { Switch, Tooltip } from 'antdlatest';
import messages from 'utils/notificationMessages';

const { setDataPickupSpec } = flowSpecsActions;

const getSwitchStatus = (val) => {
  return val ? 'Yes' : 'No';
};

function Attribute({
  setDataPickupSpec,
  dataPickupSpec,
  signalDetail,
  contextDetail,
  pageType,
  payloadType,
  headerPresent,
}) {
  const { attributes, attributeSearchPath } = dataPickupSpec;
  const details = pageType === 'Signal' ? signalDetail : contextDetail;
  const allAvailableAttributes = details?.attributes?.map(
    (att) => att?.attributeName,
  );
  const [attributeMap, setAttributeMap] = useState(
    attributes?.reduce((acc, att, att_index) => {
      acc[att_index] = false;
      if (att?.sourceAttributeName) {
        if (
          !att?.as &&
          allAvailableAttributes?.includes(att?.sourceAttributeName)
        ) {
          acc[att_index] = true;
        } else if (att?.as) {
          acc[att_index] = true;
        }
      }
      return acc;
    }, {}),
  );
  const [attributeRename, setAttributeRename] = useState(
    attributes?.reduce((acc, att, att_index) => {
      acc[att_index] = false;
      if (att?.sourceAttributeName && !att?.as) {
        acc[att_index] = false;
      } else {
        acc[att_index] = true;
      }
      return acc;
    }, {}),
  );

  const addAttribute = () => {
    const newAttribute =
      attributes && Array.isArray(attributes) ? attributes : [];
    newAttribute.push({ sourceAttributeName: '' });
    setDataPickupSpec({ attributes: newAttribute });
  };

  const deleteAttribute = (index) => {
    const newAttribute = cloneDeep(attributes);
    newAttribute.splice(index, 1);
    setDataPickupSpec({ attributes: newAttribute });
  };

  const updateAttribute = (key, value, index) => {
    const newAttribute = cloneDeep(attributes);
    newAttribute[index][key] = value;
    setDataPickupSpec({ attributes: newAttribute });
  };

  const deleteAsValue = (index) => {
    const newAttribute = cloneDeep(attributes);
    delete newAttribute?.[index]?.['as'];
    setDataPickupSpec({ attributes: newAttribute });
  };

  const setDataPickUp = (key, value) => {
    setDataPickupSpec({ [key]: value });
  };

  return (
    <div className={css(attributeStyles.DataMappingContainer)}>
      {payloadType === 'Json' && (
        <div className={css(attributeStyles.attributeContainer)}>
          <div className={css(styles.threeColDelete)}>
            <div className={css(styles.rPanelSubSectionCol1)}>
              Attribute Search Path
            </div>
            <div>
              <Input
                onChange={(event) =>
                  setDataPickUp('attributeSearchPath', event.target.value)
                }
                value={attributeSearchPath}
                hideSuffix={true}
                placeholder=""
              ></Input>
            </div>
            <Tooltip
              title={`Example: /bios.*.key`}
              className={`${css(attributeStyles.iconWrapper)}`}
            >
              <i className={`icon-Info ${css(styles.IconInfo)}`} />
            </Tooltip>
          </div>
        </div>
      )}

      {attributes &&
        attributes.length > 0 &&
        attributes.reduce((acc, attribute, index) => {
          if (attribute?.sourceAttributeNames) {
            return acc;
          }
          const allowDelete = attribute?.transforms?.length > 0 ? false : true;
          const att = (
            <div className={css(attributeStyles.attributeContainer)}>
              <div className={css(styles.threeColDelete)}>
                <div className={css(styles.rPanelSubSectionCol1)}>
                  {payloadType === 'Json' ||
                  (payloadType === 'Csv' && headerPresent)
                    ? 'Source Attribute'
                    : 'Source Column Index'}
                </div>
                {payloadType === 'Json' ||
                (payloadType === 'Csv' && headerPresent) ? (
                  <>
                    <Input
                      hideSuffix={true}
                      placeholder="Enter attribute..."
                      value={attribute?.sourceAttributeName}
                      onChange={(event) => {
                        updateAttribute(
                          'sourceAttributeName',
                          event.target.value,
                          index,
                        );
                      }}
                    ></Input>
                    <div className={css(attributeStyles.attributeDeleteButton)}>
                      <Tooltip
                        title={
                          !allowDelete
                            ? messages?.integration
                                ?.REMOVE_TRANSFORM_TOOLTIP_MESSAGE
                            : ''
                        }
                      >
                        <i
                          className={`icon-trash ${
                            !allowDelete &&
                            css(attributeStyles.attributeDeleteButtonDisabled)
                          }`}
                          onClick={() => allowDelete && deleteAttribute(index)}
                        />
                      </Tooltip>
                    </div>
                  </>
                ) : (
                  <>
                    <InputNumber
                      key="Decimal"
                      placeholder="Enter attribute..."
                      min={0}
                      max={
                        pageType === 'Signal'
                          ? signalDetail?.attributes?.length
                          : contextDetail?.attributes?.length
                      }
                      step={1}
                      value={attribute?.sourceAttributeName}
                      onChange={(value) => {
                        updateAttribute('sourceAttributeName', value, index);
                      }}
                    />
                    <div className={css(attributeStyles.attributeDeleteButton)}>
                      <i
                        className={`icon-trash`}
                        onClick={() => deleteAttribute(index)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div
                className={css(
                  attributeStyles.rPanelTwoCol,
                  styles.rPanelSubSectionKey,
                )}
              >
                <div className={css(attributeStyles.toggleButtonCol)}>
                  1:1 Mapped
                  <span className={css(attributeStyles.toggleButtonStatus)}>
                    {getSwitchStatus(attributeMap?.[index])}
                  </span>
                  <Switch
                    className={css(attributeStyles.RowRadioButton)}
                    checked={attributeMap?.[index]}
                    onChange={(value) => {
                      if (attributeMap?.[index]) {
                        setAttributeRename({
                          ...attributeRename,
                          [index]: value,
                        });
                      }
                      deleteAsValue(index);

                      setAttributeMap({
                        ...attributeMap,
                        [index]: value,
                      });
                    }}
                  />
                </div>
                {attributeMap?.[index] && (
                  <div className={css(attributeStyles.toggleButtonCol)}>
                    Rename
                    <div className={css(attributeStyles.toggleButtonStatus)}>
                      {getSwitchStatus(attributeRename?.[index])}
                    </div>
                    <Switch
                      className={css(attributeStyles.RowRadioButton)}
                      checked={attributeRename?.[index]}
                      onChange={(value) => {
                        if (value) {
                          setAttributeMap({
                            ...attributeMap,
                            [index]: value,
                          });
                        }
                        updateAttribute('as', '', index);
                        setAttributeRename({
                          ...attributeRename,
                          [index]: value,
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              {attributeRename?.[index] && (
                <div className={css(styles.threeColDelete)}>
                  <div className={css(styles.rPanelSubSectionCol1)}>
                    {pageType === 'Context'
                      ? 'Context Attribute'
                      : 'Signal Attribute'}
                  </div>
                  <Input
                    disabled={!attributeRename[index]}
                    hideSuffix={true}
                    placeholder="Enter ‘as’ attribute value..."
                    value={attribute?.as}
                    onChange={(event) =>
                      updateAttribute('as', event.target.value, index)
                    }
                  ></Input>
                </div>
              )}
            </div>
          );
          acc.push(att);
          return acc;
        }, [])}

      <div
        className={css(
          styles.rPanelSubSectionRow,
          attributeStyles.addAttributeButtonWrapper,
        )}
      >
        <Button
          type="secondary-no-border"
          size="small"
          onClick={() => addAttribute()}
        >
          Add Attribute
        </Button>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setDataPickupSpec,
};

const mapStateToProps = (state) => {
  const { signalDetail } = state.signalDetail;
  const { contextDetail } = state.contextDetail;
  const { dataPickupSpec, sourceDataSpec } = state.integration.importFlowSpecs;
  const { payloadType, headerPresent } = sourceDataSpec;
  return {
    dataPickupSpec,
    signalDetail,
    contextDetail,
    payloadType,
    headerPresent,
  };
};

Attribute.propTypes = {
  setDataPickupSpec: PropTypes.func,
  dataPickupSpec: PropTypes.object,
  signalDetail: PropTypes.object,
  contextDetail: PropTypes.object,
  pageType: PropTypes.string,
  payloadType: PropTypes.string,
  headerPresent: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attribute);
