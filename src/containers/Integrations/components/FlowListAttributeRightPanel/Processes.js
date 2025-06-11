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
import { Dropdown } from 'antdlatest';
import { css } from 'aphrodite';
import styles from './styles';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';
import EmptyCollapsable from 'components/EmptyCollapsable';
import {
  attributeSignalNameExistingMenu,
  attributeSignalNameNewMenu,
  processesMenu,
} from './menus';
import {
  checkIfAttributeExistCondition,
  removeProcessItem,
  removeAttribute,
  removeOneAttributeName,
  updateRuleByIndex,
} from './utils';
import { WarningNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';

function Processes({
  importDataProcessors,
  importFlowSpecsCopy,
  setIntegrationConfig,
  attributeName,
  name,
  type,
  defaultEnabled,
}) {
  const importFlowSpecsFiltered = importFlowSpecsCopy?.filter((ifs) => {
    return (
      ifs?.destinationDataSpec?.name === name &&
      ifs?.destinationDataSpec?.type === type
    );
  });

  const ifsAvailableAttributes = importFlowSpecsFiltered?.filter((ifs) => {
    return ifs?.dataPickupSpec?.attributes?.some((att) =>
      checkIfAttributeExistCondition(att, attributeName),
    );
  });

  if (ifsAvailableAttributes?.length === 0) {
    return <EmptyCollapsable message="No flows available." />;
  }

  return (
    <div>
      {importFlowSpecsFiltered?.reduce((acc, ifs) => {
        let shouldAddNewFlow = ifs?.dataPickupSpec?.attributes?.some((att) =>
          checkIfAttributeExistCondition(att, attributeName),
        );
        const flow = (
          <div className={css(styles.FlowContainer)}>
            <div className={css(styles.RPFieldWrapper)}>
              <div className={css(styles.RPFieldRow)}>
                <div className={css(styles.Col1)}>Associated Flow</div>
                <div className={css(styles.Col2)}>{ifs.importFlowName}</div>
              </div>
            </div>

            {!shouldAddNewFlow ? (
              <div className={css(styles.RPFieldWrapper)}>
                <div className={css(styles.RPFieldRow)}>
                  <div className={css(styles.Col1)}>Source Attribute</div>
                  <Dropdown
                    overlay={() =>
                      attributeSignalNameNewMenu({
                        importFlow: ifs,
                        importFlowSpecsCopy,
                        setIntegrationConfig,
                        attributeName,
                      })
                    }
                    trigger={['click']}
                  >
                    <div className={css(styles.addItemDropdown)}>
                      Add attribute...
                      <i className="icon-chevron-down" />
                    </div>
                  </Dropdown>
                </div>
              </div>
            ) : (
              ifs?.dataPickupSpec?.attributes?.reduce(
                (acc, att, attribute_index) => {
                  if (checkIfAttributeExistCondition(att, attributeName)) {
                    let ruleValue = att?.transforms?.filter(
                      (tf) => tf.as === attributeName,
                    )?.[0]?.rule;
                    ruleValue = ruleValue ? ruleValue : '';
                    let selectedAttributes = [];
                    if (att?.sourceAttributeName) {
                      selectedAttributes?.push(att?.sourceAttributeName);
                    }
                    if (
                      att?.sourceAttributeNames &&
                      Array.isArray(att?.sourceAttributeNames)
                    ) {
                      selectedAttributes.push(...att?.sourceAttributeNames);
                    }
                    const attribute = (
                      <div className={css(styles.processItem)}>
                        <div className={css(styles.RPFieldWrapper)}>
                          <div className={css(styles.RPFieldRow)}>
                            <div className={css(styles.Col1)}>
                              Source Attribute
                            </div>
                            <Dropdown
                              overlay={() =>
                                attributeSignalNameExistingMenu({
                                  importFlow: ifs,
                                  updateIndex: attribute_index,
                                  selectedAttributes,
                                  importFlowSpecsCopy,
                                  setIntegrationConfig,
                                })
                              }
                              trigger={['click']}
                            >
                              <div className={css(styles.addItemDropdown)}>
                                Add attribute...
                                <i className="icon-chevron-down" />
                              </div>
                            </Dropdown>
                          </div>
                        </div>

                        <div className={css(styles.RPFieldWrapper)}>
                          {att?.sourceAttributeName && (
                            <div
                              className={css(
                                styles.ThreeColField,
                                styles.SubSection,
                              )}
                            >
                              <div className={css(styles.Col1)}></div>
                              <div className={css(styles.Value)}>
                                {att?.sourceAttributeName}
                              </div>
                              <i
                                className={`icon-trash ${css(
                                  styles.processItemRemoveIcon,
                                )}`}
                                onClick={() => {
                                  if (!defaultEnabled) {
                                    WarningNotification({
                                      message:
                                        messages?.[type.toLowerCase()]
                                          ?.INGESTION_FAIL_MESSAGE,
                                    });
                                  }
                                  removeAttribute({
                                    importFlowSpecsCopy,
                                    importFlow: ifs,
                                    updateIndex: attribute_index,
                                    setIntegrationConfig,
                                  });
                                }}
                              />
                            </div>
                          )}
                          {att?.sourceAttributeNames &&
                            Array.isArray(att?.sourceAttributeNames) &&
                            att?.sourceAttributeNames?.map((san, san_index) => {
                              return (
                                <div
                                  className={css(
                                    styles.ThreeColField,
                                    styles.SubSection,
                                  )}
                                >
                                  <div className={css(styles.Col1)}></div>
                                  <div className={css(styles.Value)}>{san}</div>
                                  <i
                                    className={`icon-trash ${css(
                                      styles.processItemRemoveIcon,
                                    )}`}
                                    onClick={() =>
                                      removeOneAttributeName({
                                        importFlowSpecsCopy,
                                        importFlow: ifs,
                                        updateIndex: attribute_index,
                                        deleteSourceNameIndex: san_index,
                                        setIntegrationConfig,
                                      })
                                    }
                                  />
                                </div>
                              );
                            })}

                          <div className={css(styles.RPFieldWrapper)}>
                            <div className={css(styles.RPFieldRow)}>
                              <div className={css(styles.Col1)}>Process</div>
                              <Dropdown
                                overlay={() =>
                                  processesMenu({
                                    importFlow: ifs,
                                    updateIndex: attribute_index,
                                    importDataProcessors,
                                    importFlowSpecsCopy,
                                    setIntegrationConfig,
                                  })
                                }
                                trigger={['click']}
                              >
                                <div className={css(styles.addItemDropdown)}>
                                  <div>Add process...</div>
                                  <i className="icon-chevron-down" />
                                </div>
                              </Dropdown>
                            </div>
                          </div>

                          {att?.processes?.map((prc, prcIndex) => {
                            return (
                              <div
                                className={css(
                                  styles.ThreeColField,
                                  styles.SubSection,
                                )}
                              >
                                <div className={css(styles.Col1)}></div>
                                <div className={css(styles.Value)}>
                                  {prc?.processorName}
                                </div>
                                <i
                                  className={`icon-trash ${css(
                                    styles.processItemRemoveIcon,
                                  )}`}
                                  onClick={() =>
                                    removeProcessItem({
                                      importFlowSpecsCopy,
                                      importFlow: ifs,
                                      updateIndex: attribute_index,
                                      prcIndex,
                                      setIntegrationConfig,
                                    })
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className={css(styles.Col1, styles.RuleLabel)}>
                          Inline Transform
                        </div>
                        <AceEditor
                          placeholder="lambda parsed: parsed.year"
                          width=""
                          height="100px"
                          mode="python"
                          theme="tomorrow"
                          onChange={(rule) =>
                            updateRuleByIndex({
                              importFlowSpecsCopy,
                              importFlow: ifs,
                              attributeIndex: attribute_index,
                              as: attributeName,
                              rule,
                              setIntegrationConfig,
                            })
                          }
                          value={ruleValue}
                          editorProps={{ $blockScrolling: true }}
                          setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                          }}
                          fontSize="12px"
                          showPrintMargin={false}
                        />
                      </div>
                    );

                    acc.push(attribute);
                  }
                  return acc;
                },
                [],
              )
            )}
          </div>
        );
        acc.push(flow);
        return acc;
      }, [])}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { importDataProcessors, importFlowSpecsCopy } =
    state?.integration?.integrationConfig;

  return {
    importDataProcessors,
    importFlowSpecsCopy,
  };
};

Processes.propTypes = {
  importDataProcessors: PropTypes.array,
  importFlowSpecsCopy: PropTypes.array,
  attributeName: PropTypes.string,
  setIntegrationConfig: PropTypes.func,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  defaultEnabled: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(Processes);
