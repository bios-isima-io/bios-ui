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

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import {
  EMPTY_CONTEXT_ATTRIBUTE_WARNING_MSG,
  INVALID_CONTEXT_ATTRIBUTE_WARNING_MSG,
} from 'containers/ContextDetail/constant';
import {
  newIFSAddAttribute,
  newIFSDeleteAttribute,
  newIFSUpdateAttribute,
} from 'containers/Integrations/utils';
import {
  ALLOWED_VALUE_CANT_REMOVE_MSG,
  DEFAULT_MISSING_IN_ALLOWED_VALUE_MSG,
  EMPTY_DEFAULT_VALUE_MSG,
  makeDuplicateNameMessage,
} from 'containers/SignalDetail/constant';
import styles from 'containers/SignalDetail/styles';
import { WarningNotification } from 'containers/utils';
import { isValidStreamName } from 'utils';

const { userClicks } = ipxl;

const AttributeHeader = ({
  contextDetail,
  contextDetailCopy,
  selectedAttribute,
  setShowRightPanel,
  updateContextDetail,
  setSelectedAttribute,
  disableUpdateAction,
  importFlowSpecsCopy,
  setImportFlowCopy,
  isFACContext,
  history,
}) => {
  const validateAttribute = () => {
    if (selectedAttribute?.attributeName === '') {
      WarningNotification({
        message: EMPTY_CONTEXT_ATTRIBUTE_WARNING_MSG,
      });
      return false;
    }

    if (!isValidStreamName(selectedAttribute?.attributeName)) {
      WarningNotification({
        message: INVALID_CONTEXT_ATTRIBUTE_WARNING_MSG,
      });
      return false;
    }

    if (selectedAttribute.defaultEnabled) {
      if (contextDetail.isNewEntry === true) {
        if (
          selectedAttribute.default === null ||
          selectedAttribute.default === undefined ||
          (selectedAttribute.default === '' &&
            selectedAttribute.type !== 'String')
        ) {
          WarningNotification({
            message: EMPTY_DEFAULT_VALUE_MSG,
          });
          return false;
        }
      } else {
        if (
          selectedAttribute.default === null ||
          selectedAttribute.default === undefined ||
          (selectedAttribute.default === '' &&
            selectedAttribute.type !== 'String')
        ) {
          WarningNotification({
            message: EMPTY_DEFAULT_VALUE_MSG,
          });
          return false;
        }

        const exitingContextAttribute = contextDetailCopy?.attributes?.find(
          (att) => att._id === selectedAttribute?._id,
        );
        if (
          exitingContextAttribute &&
          exitingContextAttribute?.default &&
          !selectedAttribute?.default
        ) {
          WarningNotification({
            message: EMPTY_DEFAULT_VALUE_MSG,
          });
          return false;
        }

        const checkIfExistingValuesRemoved = (arr1, arr2) =>
          arr1.every((v) => arr2.includes(v));

        if (
          exitingContextAttribute &&
          exitingContextAttribute?.allowedValues &&
          !checkIfExistingValuesRemoved(
            exitingContextAttribute?.allowedValues,
            selectedAttribute?.allowedValues,
          )
        ) {
          WarningNotification({
            message: ALLOWED_VALUE_CANT_REMOVE_MSG,
          });
          return false;
        }
      }
    }

    if (
      selectedAttribute.defaultEnabled === true &&
      selectedAttribute?.type === 'String' &&
      selectedAttribute?.allowedValues &&
      Array.isArray(selectedAttribute?.allowedValues) &&
      selectedAttribute?.allowedValues.length > 0 &&
      !selectedAttribute?.allowedValues?.some(
        (entry) => entry.trim() === selectedAttribute?.default?.trim(),
      )
    ) {
      WarningNotification({
        message: DEFAULT_MISSING_IN_ALLOWED_VALUE_MSG,
      });
      return false;
    }

    const duplicateAttributeName = contextDetail.attributes.some(
      (attribute) => {
        if (
          selectedAttribute._id !== attribute._id &&
          attribute.attributeName === selectedAttribute.attributeName
        ) {
          return true;
        }
        return false;
      },
    );

    if (duplicateAttributeName) {
      WarningNotification({
        message: makeDuplicateNameMessage('attribute name'),
      });
      return false;
    }

    return true;
  };

  const saveAttribute = () => {
    if (!validateAttribute()) {
      return;
    }
    const isNewAttribute = selectedAttribute?.isNewEntry;
    // delete selectedAttribute.isNewEntry;

    if (
      selectedAttribute.hasOwnProperty('allowedValues') &&
      selectedAttribute.allowedValues === ''
    ) {
      delete selectedAttribute?.allowedValues;
    }
    let updatedContextDetail = {};
    let primaryKey = [];
    if (contextDetail?.attributes?.length === 0) {
      primaryKey = [selectedAttribute?.attributeName];
    } else {
      primaryKey = contextDetail.primaryKey;
    }

    if (isNewAttribute) {
      const doesAttributeExist = contextDetail.attributes.some((attribute) => {
        if (attribute._id === selectedAttribute._id) {
          return true;
        }
        return false;
      });
      if (doesAttributeExist) {
        updatedContextDetail = {
          ...contextDetail,
          attributes: contextDetail.attributes.map((attribute) => {
            if (attribute?._id === selectedAttribute?._id) {
              return selectedAttribute;
            }
            return attribute;
          }),
          primaryKey: primaryKey,
        };
      } else {
        updatedContextDetail = {
          ...contextDetail,
          attributes: contextDetail.attributes.concat(selectedAttribute),
          primaryKey: primaryKey,
        };
      }

      const newIFSCopy = newIFSAddAttribute({
        importFlowSpecsCopy,
        name: contextDetail?.contextName,
        newAttribute: selectedAttribute.attributeName,
        type: 'Context',
      });
      setImportFlowCopy(newIFSCopy);
    } else {
      updatedContextDetail = {
        ...contextDetail,
        attributes: contextDetail.attributes.map((attribute) => {
          if (attribute.label === selectedAttribute?.label) {
            return selectedAttribute;
          }
          return attribute;
        }),
        primaryKey: primaryKey,
      };
      if (selectedAttribute.attributeName !== selectedAttribute?.label) {
        const newIFSCopy = newIFSUpdateAttribute({
          importFlowSpecsCopy,
          name: contextDetail?.contextName,
          oldAttribute: selectedAttribute?.label,
          newAttribute: selectedAttribute.attributeName,
          type: 'Context',
        });
        setImportFlowCopy(newIFSCopy);
      }
    }
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: isNewAttribute ? 'Add Attribute' : 'Update Attribute',
      rightSection: 'attribute',
      mainSection: 'contextDetailAttribute',
      leftSection: 'context',
    });
    updateContextDetail(updatedContextDetail);
    setShowRightPanel(false);
    setSelectedAttribute(null);
  };

  const deleteAttribute = () => {
    const updatedContextDetail = {
      ...contextDetail,
      attributes: contextDetail.attributes.filter((attribute) => {
        return attribute.label !== selectedAttribute?.label;
      }),
    };
    const newIFSCopy = newIFSDeleteAttribute({
      importFlowSpecsCopy,
      name: contextDetail?.contextName,
      deleteAttribute: selectedAttribute.label,
      type: 'Context',
    });
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Attribute',
      rightSection: 'attribute',
      mainSection: 'contextDetailAttribute',
      leftSection: 'context',
    });
    setImportFlowCopy(newIFSCopy);
    updateContextDetail(updatedContextDetail);
    setShowRightPanel(false);
    setSelectedAttribute(null);
  };

  const onClose = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Close Attribute Panel',
      rightSection: 'attribute',
      mainSection: 'contextDetailAttribute',
      leftSection: 'context',
    });
    setShowRightPanel(false);
    setSelectedAttribute(null);
  };

  return (
    <div
      className={css(
        styles.actionControlWrapper,
        !disableUpdateAction ? styles.threeColGrid : styles.singleColGrid,
      )}
    >
      {!disableUpdateAction && !isFACContext && (
        <Tooltip title="Apply">
          <i
            className={`icon-check ${css(commonStyles.icon)}`}
            onClick={saveAttribute}
          />
        </Tooltip>
      )}
      {!disableUpdateAction && !isFACContext && (
        <Tooltip title="Delete">
          <i
            className={`icon-trash ${css(commonStyles.icon)}`}
            onClick={deleteAttribute}
          />
        </Tooltip>
      )}
      <Tooltip title="Close">
        <i
          className={`icon-close ${css(commonStyles.icon)}`}
          onClick={onClose}
        />
      </Tooltip>
    </div>
  );
};

export default AttributeHeader;
