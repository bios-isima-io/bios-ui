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

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import {
  newIFSAddAttribute,
  newIFSDeleteAttribute,
  newIFSUpdateAttribute,
} from 'containers/Integrations/utils';
import {
  DEFAULT_MISSING_IN_ALLOWED_VALUE_MSG,
  EMPTY_DEFAULT_VALUE_MSG,
  EMPTY_SIGNAL_ATTRIBUTE_WARNING_MSG,
  EMPTY_TIME_LAG_ATTRIBUTE_NAME,
  makeDuplicateNameMessage,
  makeInvalidNameMessage,
  MISSING_UNIT_DISPLAY_NAME,
} from 'containers/SignalDetail/constant';
import styles from 'containers/SignalDetail/styles';
import { WarningNotification } from 'containers/utils';
import { isValidStreamName } from 'utils';

const { userClicks } = ipxl;

const AttributeHeader = ({
  history,
  signalDetail,
  selectedAttribute,
  setShowRightPanel,
  updateSignalDetail,
  setSelectedAttribute,
  setSelectedFeature,
  setSelectedEnrichment,
  disableUpdateAction,
  importFlowSpecsCopy,
  setImportFlowCopy,
}) => {
  const timeLagAttribute = selectedAttribute.enrichedAttributes?.find(
    (enrichedAttribute) => enrichedAttribute._isTimeLag,
  );

  const validateAttribute = () => {
    if (selectedAttribute?.attributeName === '') {
      WarningNotification({
        message: EMPTY_SIGNAL_ATTRIBUTE_WARNING_MSG,
      });
      return false;
    }

    if (!isValidStreamName(selectedAttribute?.attributeName)) {
      WarningNotification({
        message: makeInvalidNameMessage('Attribute Name'),
      });
      return false;
    }

    if (selectedAttribute.defaultEnabled) {
      if (signalDetail.isNewEntry === true) {
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

    const duplicateAttributeName =
      selectedAttribute.isNewEntry === true &&
      signalDetail.attributes.some(
        (attribute) =>
          attribute.attributeName.toLowerCase() ===
          selectedAttribute.attributeName.toLowerCase(),
      );

    if (duplicateAttributeName) {
      WarningNotification({
        message: makeDuplicateNameMessage('attribute name'),
      });
      return false;
    }

    if (
      selectedAttribute.unit === 'OtherUnit' &&
      selectedAttribute.unitDisplayName === ''
    ) {
      WarningNotification({
        message: MISSING_UNIT_DISPLAY_NAME,
      });
      return false;
    }

    if (!verifyTimeLag()) {
      return false;
    }

    return true;
  };

  const verifyTimeLag = () => {
    if (!timeLagAttribute?._isEnabled) {
      return true;
    }

    if (!(timeLagAttribute.attributeName?.length > 0)) {
      WarningNotification({
        message: EMPTY_TIME_LAG_ATTRIBUTE_NAME,
      });
      return false;
    }

    if (!isValidStreamName(timeLagAttribute.attributeName)) {
      WarningNotification({
        message: makeInvalidNameMessage('Time lag attribute name'),
      });
      return false;
    }

    const canonLagName = timeLagAttribute.attributeName.toLowerCase();
    if (
      signalDetail.attributes.some(
        (attribute) => attribute.attributeName.toLowerCase() === canonLagName,
      ) ||
      signalDetail.enrich?.ingestTimeLag?.some(
        (tl) =>
          tl.attribute.toLowerCase() !==
            selectedAttribute.attributeName.toLowerCase() &&
          tl.as.toLowerCase() === canonLagName,
      )
    ) {
      WarningNotification({
        message: makeDuplicateNameMessage('time lag attribute name'),
      });
      return false;
    }

    return true;
  };

  const saveAttribute = () => {
    if (!validateAttribute()) {
      return;
    }

    const updatedAttribute = cloneDeep(selectedAttribute);
    const isNewAttribute = updatedAttribute?.isNewEntry;
    delete updatedAttribute.isNewEntry;
    if (
      updatedAttribute.hasOwnProperty('allowedValues') &&
      updatedAttribute.allowedValues === ''
    ) {
      delete updatedAttribute?.allowedValues;
    }

    const updatedSignalDetail = cloneDeep(signalDetail);
    handleTimeLag(updatedSignalDetail, updatedAttribute);

    if (isNewAttribute) {
      updatedSignalDetail.attributes =
        signalDetail.attributes.concat(updatedAttribute);
      const newIFSCopy = newIFSAddAttribute({
        importFlowSpecsCopy,
        name: signalDetail?.signalName,
        newAttribute: updatedAttribute.attributeName,
        type: 'Signal',
      });
      setImportFlowCopy(newIFSCopy);
    } else {
      updatedSignalDetail.attributes = signalDetail.attributes.map(
        (attribute) => {
          if (attribute.label === updatedAttribute?.label) {
            return updatedAttribute;
          }
          return attribute;
        },
      );

      if (updatedAttribute.attributeName !== updatedAttribute?.label) {
        const newIFSCopy = newIFSUpdateAttribute({
          importFlowSpecsCopy,
          name: signalDetail?.signalName,
          oldAttribute: updatedAttribute?.label,
          newAttribute: updatedAttribute.attributeName,
          type: 'Signal',
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
      mainSection: 'SignalDetailAttribute',
      leftSection: 'signal',
    });

    updateSignalDetail(updatedSignalDetail);
    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
  };

  /**
   * Converts source attribute's timestamp unit to time lag duration unit.
   */
  const convertUnit = (attrUnit) =>
    attrUnit === 'UnixSecond'
      ? 'Second'
      : attrUnit === 'UnixMillisecond'
      ? 'Millisecond'
      : null;

  /**
   * Handles time lag on save.
   */
  const handleTimeLag = (updatedSignalDetail, updatedAttribute) => {
    let isTimeLagEnabled = timeLagAttribute?._isEnabled;
    if (isTimeLagEnabled) {
      const newPart = {
        as: timeLagAttribute.attributeName,
        fillIn: 0,
        tags: convertUnit(updatedAttribute.unit) && {
          category: 'Quantity',
          kind: 'Duration',
          unit: convertUnit(updatedAttribute.unit),
        },
      };
      let isTimeLagExisting = false;
      updatedSignalDetail.enrich.ingestTimeLag = (
        signalDetail.enrich?.ingestTimeLag || []
      ).map((timeLag) => {
        if (
          timeLag.attribute.toLowerCase() ===
          updatedAttribute.attributeName.toLowerCase()
        ) {
          isTimeLagExisting = true;
          return {
            ...timeLag,
            ...newPart,
          };
        }
        return timeLag;
      });
      if (!isTimeLagExisting) {
        updatedSignalDetail.enrich.ingestTimeLag.push({
          ingestTimeLagName: `${updatedAttribute.attributeName}TimeLag`,
          attribute: updatedAttribute.attributeName,
          ...newPart,
        });
      }
    } else {
      delete updatedAttribute._timeLag;
      const ingestTimeLag = signalDetail.enrich?.ingestTimeLag?.filter(
        (timeLag) =>
          timeLag.attribute.toLowerCase() !==
          updatedAttribute.attributeName.toLowerCase(),
      );
      if (ingestTimeLag?.length > 0) {
        signalDetail.enrich.ingestTimeLag = ingestTimeLag;
      } else if (!!updatedSignalDetail?.enrich) {
        delete updatedSignalDetail.enrich.ingestTimeLag;
      }
      updatedAttribute.enrichedAttributes =
        updatedAttribute.enrichedAttributes?.filter(
          (attr) => attr._id !== timeLagAttribute?._id,
        );
      if (updatedAttribute.enrichedAttributes?.length === 0) {
        delete updatedAttribute.enrichedAttributes;
      }
    }
  };

  const deleteAttribute = () => {
    const updatedSignalDetail = {
      ...signalDetail,
      attributes: signalDetail.attributes.filter((attribute) => {
        return attribute.label !== selectedAttribute?.label;
      }),
    };
    const newIFSCopy = newIFSDeleteAttribute({
      importFlowSpecsCopy,
      name: signalDetail?.signalName,
      deleteAttribute: selectedAttribute.label,
      type: 'Signal',
    });

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Attribute',
      rightSection: 'attribute',
      mainSection: 'SignalDetailAttribute',
      leftSection: 'signal',
    });

    setImportFlowCopy(newIFSCopy);
    updateSignalDetail(updatedSignalDetail);
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
      eventLabel: 'Close Attribute Panel',
      rightSection: 'attribute',
      mainSection: 'SignalDetailAttribute',
      leftSection: 'signal',
    });

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
  };

  return (
    <div
      className={css(
        styles.actionControlWrapper,
        !disableUpdateAction ? styles.threeColGrid : styles.singleColGrid,
      )}
    >
      {!disableUpdateAction && (
        <Tooltip title="Apply">
          <i
            className={`icon-check ${css(commonStyles.icon)}`}
            onClick={saveAttribute}
          />
        </Tooltip>
      )}

      {!disableUpdateAction && (
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

AttributeHeader.propTypes = {
  signalDetail: PropTypes.instanceOf(Object),
  selectedAttribute: PropTypes.instanceOf(Object),
  setShowRightPanel: PropTypes.func,
  updateSignalDetail: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
  setSelectedFeature: PropTypes.func,
  setSelectedEnrichment: PropTypes.func,
  disableUpdateAction: PropTypes.bool,
  importFlowSpecsCopy: PropTypes.array,
  setImportFlowCopy: PropTypes.func,
};

export default AttributeHeader;
