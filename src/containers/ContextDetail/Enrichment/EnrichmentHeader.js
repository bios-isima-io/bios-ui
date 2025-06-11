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
import cloneDeep from 'lodash-es/cloneDeep';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { DUPLICATE_ENRICHMENT_NAME } from 'containers/SignalDetail/constant';
import styles from 'containers/SignalDetail/styles';
import { WarningNotification, assignIds } from 'containers/utils';
import { isValidStreamName } from 'utils';
import messages from 'utils/notificationMessages';
import { validateEnrichedAttributeAndAliasDuplicates } from './validation/utils';
import { getFillInValue } from './utils';

const { userClicks } = ipxl;

const EnrichmentHeader = ({
  setShowRightPanel,
  contextDetail,
  selectedEnrichment,
  updateContextDetail,
  setSelectedEnrichment,
  setSelectedAttribute,
  history,
  currentEnrichmentName,
  currentForeignKey,
  currentEnrichedAttributes,
  remoteContexts,
  contexts,
}) => {
  const validateAttribute = () => {
    if (currentEnrichmentName === '') {
      WarningNotification({
        message: messages.context.EMPTY_ENRICHMENT_NAME,
      });
      return false;
    }

    if (!isValidStreamName(currentEnrichmentName)) {
      WarningNotification({
        message: messages.context.INVALID_ENRICHMENT_NAME,
      });
      return false;
    }

    if (currentForeignKey.length === 0 || currentForeignKey[0].length === 0) {
      WarningNotification({
        message: messages.context.EMPTY_PICK_A_KEY,
      });
      return false;
    }

    if (currentEnrichedAttributes.length === 0) {
      WarningNotification({
        message: messages.context.EMPTY_ATTRIBUTE_LIST,
      });
      return false;
    }

    if (
      remoteContexts.length > 1 &&
      currentEnrichedAttributes.some((attribute) => attribute.alias === '')
    ) {
      WarningNotification({
        message: messages.context.REQUIRED_ATTRIBUTE_ALIAS_MULTI_SHIM,
      });
      return false;
    }

    if (
      remoteContexts.length > 1 &&
      currentEnrichedAttributes.some((attribute) =>
        attribute.source.some((src) => src.attribute === ''),
      )
    ) {
      WarningNotification({
        message: messages.context.ATTRIBUTE_VALUE_NOT_SELECTED,
      });
      return false;
    }

    if (
      currentEnrichedAttributes.some(
        (attribute) => attribute.source.length === 0,
      )
    ) {
      WarningNotification({
        message: messages.context.EMPTY_SOURCE_ATTRIBUTES,
      });
      return false;
    }

    if (
      !validateEnrichedAttributeAndAliasDuplicates({
        contextDetail,
        currentEnrichedAttributes,
      })
    ) {
      return false;
    }

    if (
      contextDetail?.enrichments?.some(
        (enrichment) =>
          enrichment._id !== selectedEnrichment._id &&
          enrichment.enrichmentName.toLowerCase() ===
            currentEnrichmentName.toLowerCase(),
      )
    ) {
      WarningNotification({ message: DUPLICATE_ENRICHMENT_NAME });
      return false;
    }

    return true;
  };

  const saveEnrichment = () => {
    if (!validateAttribute()) {
      return;
    }

    selectedEnrichment = assignIds(selectedEnrichment);
    const nextEnrichment = {
      _id: selectedEnrichment._id,
      enrichmentName: currentEnrichmentName,
      foreignKey: currentForeignKey,
      enrichedAttributes: currentEnrichedAttributes.map((attribute) => {
        let fillInVal = attribute?.fillIn;
        const shouldUpdateFillIn =
          !attribute?.fillIn || attribute?.fillIn === '';

        if (shouldUpdateFillIn) {
          fillInVal = getFillInValue({
            contexts,
            attributeDetails: attribute?.source?.[0],
          });
        }
        const attr = {
          _id: attribute._id,
          fillIn: fillInVal,
          ...(attribute?.alias && attribute?.alias !== ''
            ? { as: attribute.alias }
            : {}),
        };
        if (remoteContexts.length > 1) {
          attr.valuePickFirst = attribute?.source?.map(
            (src) => `${src.context}.${src.attribute}`,
          );
        } else {
          attr.value = `${attribute?.source[0].context}.${attribute.source[0].attribute}`;
        }
        return attr;
      }),
    };

    const currentEnrichment = contextDetail.enrichments || [];

    const contextDetailCopy = cloneDeep(contextDetail);
    let replaced = false;
    contextDetailCopy.enrichments = currentEnrichment.map((enrichment) => {
      if (enrichment._id === nextEnrichment._id) {
        replaced = true;
        return nextEnrichment;
      }
      return enrichment;
    });
    if (!replaced) {
      contextDetailCopy.enrichments.push(nextEnrichment);
    }

    setShowRightPanel(false);
    updateContextDetail(contextDetailCopy);
    setSelectedEnrichment(null);
  };

  const deleteEnrichment = () => {
    let contextDetailCopy = cloneDeep(contextDetail);
    const currentEnrichment = contextDetail.enrichments || [];
    const updatedEnrichments = currentEnrichment.filter((enrichment) => {
      return enrichment._id !== selectedEnrichment._id;
    });

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Enrichment',
      rightSection: 'enrichment',
      mainSection: 'contextDetailEnrichment',
      leftSection: 'context',
    });

    contextDetailCopy = {
      ...contextDetailCopy,
      enrichments: updatedEnrichments,
    };

    updateContextDetail(contextDetailCopy);

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
  };

  const onClose = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Close Enrichment Panel',
      rightSection: 'enrichment',
      mainSection: 'contextDetailEnrichment',
      leftSection: 'context',
    });

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
  };

  return (
    <div className={css(styles.actionControlWrapper, styles.threeColGrid)}>
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
      <Tooltip title="Close">
        <i
          className={`icon-close ${css(commonStyles.icon)}`}
          onClick={onClose}
        />
      </Tooltip>
    </div>
  );
};

export default EnrichmentHeader;
