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
import { Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { DUPLICATE_ENRICHMENT_NAME } from 'containers/SignalDetail/constant';
import styles from 'containers/SignalDetail/styles';
import {
  buildDataTypeForEnrichment,
  getAttributeConfig,
} from 'containers/SignalDetail/utils';
import { assignIds, WarningNotification } from 'containers/utils';
import { isValidStreamName } from 'utils';
import messages from 'utils/notificationMessages';

const { userClicks } = ipxl;

const EnrichmentHeader = ({
  history,
  setShowRightPanel,
  selectedEnrichment,
  signalDetail,
  updateSignalDetail,
  setSelectedAttribute,
  setSelectedFeature,
  setSelectedEnrichment,
  selectedContext,
  contexts,
}) => {
  const validateAttribute = () => {
    if (selectedEnrichment?.enrichmentName === '') {
      WarningNotification({
        message: messages.signal.EMPTY_ENRICHMENT_NAME,
      });
      return false;
    }

    if (!isValidStreamName(selectedEnrichment?.enrichmentName)) {
      WarningNotification({
        message: messages.signal.INVALID_ENRICHMENT_NAME,
      });
      return false;
    }

    if (selectedEnrichment.contextAttributes.length === 0) {
      WarningNotification({
        message: messages.signal.EMPTY_CONTEXT_ATTRIBUTE_LIST,
      });
      return false;
    }

    const fillInMissingAttribute = selectedEnrichment.contextAttributes.find(
      (attribute) => {
        return (
          selectedEnrichment.missingLookupPolicy === 'StoreFillInValue' &&
          (!Object.hasOwn(attribute, 'fillIn') || attribute?.fillIn === '')
        );
      },
    );

    if (fillInMissingAttribute) {
      WarningNotification({
        message: messages.signal.EMPTY_FILL_IN_VALUES,
      });
      return false;
    }

    const AttributeAliasList = selectedEnrichment.contextAttributes.reduce(
      (result, attribute) => {
        if (attribute.hasOwnProperty('as') && attribute.as !== null) {
          result = [...result, attribute.as];
        }
        return result;
      },
      [],
    );

    const duplicateAliasInAttribute =
      new Set(AttributeAliasList).size !== AttributeAliasList.length;

    if (duplicateAliasInAttribute) {
      WarningNotification({
        message: messages.signal.DUPLICATE_ALIAS_VALUE,
      });
      return false;
    }

    const getDataType = (value) => {
      if (!isNaN(Number(value))) {
        if (value?.toString()?.indexOf('.') == -1) {
          return 'Integer';
        } else {
          return 'Decimal';
        }
      } else {
        return 'String';
      }
    };

    let expectedType = null;
    const fillInWrongDataType = selectedEnrichment.contextAttributes.find(
      (attribute) => {
        let selectedAttr = selectedContext.attributes.find((att) => {
          return att.attributeName === attribute.attributeName;
        });

        // If it's an enriched attribute, get the data type from
        // that context attribute
        if (selectedAttr === undefined) {
          let selectedAttrDetail = null;
          selectedContext.enrichments.forEach((enrichment) => {
            selectedAttrDetail = enrichment.enrichedAttributes.find(
              (enrichedAttribute) => {
                return enrichedAttribute?.value?.includes(
                  attribute.attributeName,
                );
              },
            );
          });
          if (selectedAttrDetail?.value) {
            const [context, attributeValue] =
              selectedAttrDetail?.value?.split('.');
            const currentContext = contexts.find(
              (ctx) => ctx.contextName === context,
            );
            currentContext?.attributes?.forEach((item) => {
              if (item.attributeName === attributeValue) {
                selectedAttr = item;
              }
            });
          }
        }

        const fillInType = getDataType(attribute.fillIn);
        if (
          selectedEnrichment.missingLookupPolicy === 'StoreFillInValue' &&
          !!!attribute.fillIn
        ) {
          if (selectedAttr?.type === 'Boolean') {
            return Boolean(attribute.fillIn);
          } else if (selectedAttr?.type === fillInType) {
            return false;
          } else {
            expectedType = selectedAttr?.type;
            return true;
          }
        }
        return false;
      },
    );

    if (
      fillInWrongDataType &&
      fillInWrongDataType?.attributeName &&
      expectedType
    ) {
      WarningNotification({
        message: messages.signal.needFillInValueOfType(
          fillInWrongDataType,
          expectedType,
        ),
      });
      return false;
    }

    const duplicateEnrichment =
      selectedEnrichment?.isNewEntry === true &&
      signalDetail?.enrich?.enrichments?.some((enrichment) => {
        if (enrichment.enrichmentName === selectedEnrichment.enrichmentName) {
          return true;
        }
        return false;
      });

    if (duplicateEnrichment) {
      WarningNotification({
        message: DUPLICATE_ENRICHMENT_NAME,
      });
      return false;
    }

    return true;
  };

  const saveEnrichment = () => {
    if (!validateAttribute()) {
      return;
    }

    const isNewEnrichment = selectedEnrichment?.isNewEntry;

    delete selectedEnrichment.isNewEntry;
    selectedEnrichment = assignIds(selectedEnrichment);

    const currentEnrich = signalDetail?.enrich || {};
    const currentEnrichments = currentEnrich.enrichments || [];
    const newSignalDetail = { ...signalDetail, enrich: { ...currentEnrich } };

    if (isNewEnrichment) {
      newSignalDetail.enrich.enrichments =
        currentEnrichments.concat(selectedEnrichment);
    } else {
      newSignalDetail.enrich.enrichments = currentEnrichments.map(
        (enrichment) => {
          if (selectedEnrichment._id === enrichment._id) {
            return selectedEnrichment;
          }
          return enrichment;
        },
      );
    }

    newSignalDetail.enrich.enrichments?.forEach((enrichment) => {
      enrichment?.contextAttributes.forEach((attr) => {
        delete attr.minimize;
      });
    });

    // Update enriched attributes of the foreign key
    newSignalDetail.attributes = newSignalDetail.attributes.map((attr) => {
      if (
        attr.attributeName.toLowerCase() ===
        selectedEnrichment.foreignKey[0].toLowerCase()
      ) {
        return {
          ...attr,
          enrichedAttributes: selectedEnrichment.contextAttributes.map(
            (ctxAttr) => {
              const remoteCtx = contexts.find(
                (ctx) =>
                  ctx.contextName.toLowerCase() ===
                  selectedEnrichment.contextName.toLowerCase(),
              );
              let ctxAttrConf = !remoteCtx
                ? null
                : getAttributeConfig(remoteCtx, null, ctxAttr.attributeName);

              if (!ctxAttrConf) {
                const enrichAttributesMap = buildDataTypeForEnrichment(
                  remoteCtx?.enrichments,
                  contexts,
                );
                if (enrichAttributesMap?.[ctxAttr.attributeName]) {
                  ctxAttrConf = enrichAttributesMap?.[ctxAttr.attributeName];
                }
              }

              return {
                _id: shortid.generate(),
                attributeName: ctxAttr.as || ctxAttr.attributeName,
                label: ctxAttr.as || ctxAttr.attributeName,
                type: ctxAttrConf.type || 'String',
              };
            },
          ),
        };
      }
      return attr;
    });

    updateSignalDetail(newSignalDetail);

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: isNewEnrichment ? 'Add Enrichment' : 'Update Enrichment',
      rightSection: 'enrichment',
      mainSection: 'SignalDetailEnrichment',
      leftSection: 'signal',
    });

    setShowRightPanel(false);
    setSelectedEnrichment(null);
  };

  const deleteEnrichment = () => {
    let signalDetailCopy = cloneDeep(signalDetail);
    const currentEnrichment = signalDetail?.enrich?.enrichments
      ? signalDetail.enrich.enrichments
      : [];
    const updatedEnrichments = currentEnrichment.filter((enrichment) => {
      return enrichment.enrichmentName !== selectedEnrichment.enrichmentName;
    });

    signalDetailCopy = {
      ...signalDetailCopy,
      enrich: {
        enrichments: updatedEnrichments,
      },
    };

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Enrichment',
      rightSection: 'enrichment',
      mainSection: 'SignalDetailEnrichment',
      leftSection: 'signal',
    });

    updateSignalDetail(signalDetailCopy);
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
  };

  const onClose = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Close Enrichment Panel',
      rightSection: 'enrichment',
      mainSection: 'SignalDetailEnrichment',
      leftSection: 'signal',
    });

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
  };

  return (
    <div className={css(styles.actionControlWrapper, styles.threeColGrid)}>
      <>
        <Tooltip title="Apply">
          <i
            className={`icon-check ${css(commonStyles.icon)}`}
            onClick={saveEnrichment}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <i
            className={`icon-trash ${css(commonStyles.icon)}`}
            onClick={deleteEnrichment}
          />
        </Tooltip>
      </>
      <Tooltip title="Close">
        <i
          className={`icon-close ${css(commonStyles.icon)}`}
          onClick={onClose}
        />
      </Tooltip>
    </div>
  );
};

EnrichmentHeader.propTypes = {
  selectedEnrichment: PropTypes.instanceOf(Object),
  signalDetail: PropTypes.instanceOf(Object),
  setShowRightPanel: PropTypes.func,
  updateSignalDetail: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
  setSelectedFeature: PropTypes.func,
  setSelectedEnrichment: PropTypes.func,
  selectedContext: PropTypes.instanceOf(Object),
  contexts: PropTypes.array,
  isExistingAuditSignal: PropTypes.bool,
};

export default EnrichmentHeader;
