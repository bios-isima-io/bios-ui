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
import React, { useEffect } from 'react';
import { css } from 'aphrodite';
import { connect } from 'react-redux';
import styles from './styles';
import { fetchSignalConfig, fetchSignals } from 'containers/Signal/actions';
import Footer from '../FirstStep/components/Footer';
import Actions from '../../../Onboarding/components/Actions';
import commonStyles from '../../../../app/styles/commonStyles';
import { cloneDeep } from 'lodash-es';

const ThirdStep = ({
  SignalConfig,
  signals,
  fetchSignals,
  fetchSignalConfig,
  attributes,
  createEntity,
  setShowRightPanel,
  setSelectedAttribute,
  selectedAttribute,
  updateCurrentStep,
  parentFlow,
  onCancel,
  onBack,
  isOntologyTeachBios,
  updateAttributes,
  flowMapping,
  updateFlowMapping,
}) => {
  useEffect(() => {
    signals.length === 0 &&
      fetchSignals({
        onlyFetchSignals: true,
      });
    !SignalConfig && fetchSignalConfig();
  }, []);

  const onNextButtonClick = () => {
    createEntity && createEntity();
  };

  const noDataToInfer = attributes?.every((item) =>
    item?.data?.every((d) => d === null),
  );

  const deleteAttribute = (e, i) => {
    e.stopPropagation();
    let prevName = null;
    const updatedAttributes = attributes.filter((attribute, index) => {
      if (index !== i) {
        return true;
      } else {
        prevName = attribute.attributeName;
      }
    });
    updateAttributes(updatedAttributes);
    if (flowMapping && updateFlowMapping && prevName !== null) {
      const mapping = cloneDeep(flowMapping);
      const currentAttributeMapping = cloneDeep(mapping.attributeMapping);
      delete currentAttributeMapping[prevName];
      const updatedMapping = {
        ...flowMapping,
        attributeMapping: currentAttributeMapping,
      };
      updateFlowMapping({ flowMapping: updatedMapping });
    }
    setSelectedAttribute(null);
    setShowRightPanel(false);
  };

  return (
    <>
      <div className={css(styles.wrapper, noDataToInfer && styles.flexbox)}>
        <table
          className={`bios-custom-scroll ${css(
            styles.tableWrapper,
            noDataToInfer && styles.halfWidth,
          )}`}
        >
          <tr className={`${css(styles.headerRow)}`}>
            <th
              className={css(
                styles.tableCell,
                styles.header,
                styles.headerBg,
                styles.tableHeaderCell,
              )}
            >
              bi(OS) learned
            </th>
            {!noDataToInfer && (
              <th className={css(styles.tableCell, styles.tableHeaderCell)}>
                Inferred from
              </th>
            )}

            {!noDataToInfer && attributes?.[0]?.data?.length > 1 && (
              <>
                {attributes?.[0]?.data?.slice(1)?.map((item) => (
                  <th
                    className={css(styles.tableCell, styles.tableHeaderCell)}
                    key={item}
                  ></th>
                ))}
              </>
            )}
          </tr>
          {attributes.map((item, index) => (
            <tr
              className={`${css(styles.tableRow)} ${
                selectedAttribute && selectedAttribute.index === index
                  ? css(styles.activeRow)
                  : ''
              }`}
              onClick={() => {
                setShowRightPanel(true);
                setSelectedAttribute({
                  ...item,
                  index,
                });
              }}
            >
              <td
                className={`ts_learned ${css(
                  styles.tableCell,
                  styles.header,
                  styles.bodyCell,
                )}`}
              >
                <div
                  style={{
                    borderRight: '1px solid #E0E0E0',
                    borderBottom: '1px solid #E0E0E0',
                    padding: '13px 16px',
                  }}
                >
                  {item.attributeName}
                </div>
              </td>
              {!noDataToInfer && (
                <>
                  {item.data.map((entity) => (
                    <td
                      className={`ts_inferred ${css(
                        styles.tableCell,
                        styles.bodyCell,
                      )}`}
                    >
                      <div
                        style={{
                          borderLeft: '1px solid #E0E0E0',
                          borderBottom: '1px solid #E0E0E0',
                          padding: '13px 16px',
                        }}
                      >
                        {' '}
                        {entity}
                      </div>
                    </td>
                  ))}
                </>
              )}
              <div className={`hoverAction ${css(styles.hoverAction)}`}>
                <i
                  className={`icon-trash ${css(commonStyles.icon)}`}
                  onClick={(event) => {
                    deleteAttribute && deleteAttribute(event, index);
                  }}
                />
              </div>
            </tr>
          ))}
        </table>
        {noDataToInfer && (
          <div className={css(styles.noDataToInfer)}>
            <div>
              <i
                className={`icon-error-connecting ${css(
                  styles.iconErrorConnecting,
                )}`}
              />
            </div>
            <div>Uh oh - no data in the source to infer from</div>
          </div>
        )}
      </div>

      {parentFlow === 'onboarding' ? (
        <Actions
          className={css(styles.mt130)}
          nextDisabled={false}
          nextButtonName="Next"
          onNextClick={onNextButtonClick}
          onBackClick={() => {
            if (isOntologyTeachBios) {
              updateCurrentStep(0);
              setShowRightPanel(false);
              setSelectedAttribute(null);
            } else {
              onBack && onBack();
            }
          }}
          onCancel={() => {
            onCancel && onCancel();
          }}
        />
      ) : (
        <Footer
          onNextClick={onNextButtonClick}
          onCancelClick={() => {
            if (parentFlow === 'onboarding') {
              onCancel && onCancel();
            } else {
              updateCurrentStep(0);
              setShowRightPanel(false);
              setSelectedAttribute(null);
            }
          }}
          disableNext={false}
        />
      )}
    </>
  );
};

const mapDispatchToProps = {
  fetchSignals: (options) => fetchSignals(options),
  fetchSignalConfig: (options) => fetchSignalConfig(options),
};

const mapStateToProps = (state) => {
  const { SignalConfig, signals } = state.signals;
  return { SignalConfig, signals };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStep);
