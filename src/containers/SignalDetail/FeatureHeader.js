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
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { clearValidationErrors } from './actions';
import styles from './styles';
import {
  buildLastNContextConfig,
  buildAccumulatingCountContextConfig,
} from './utils';

const { userClicks } = ipxl;

const FeatureHeader = ({
  history,
  signalDetail,
  contexts,
  selectedFeature,
  setShowRightPanel,
  setSelectedAttribute,
  setSelectedFeature,
  validateFeature,
  setSelectedEnrichment,
  updateSignalDetail,
  cloneFeature,
  validationErrors,
  clearValidationErrors,
}) => {
  const saveFeature = () => {
    if (!validateFeature(selectedFeature, { force: true, notify: true })) {
      return;
    }

    const isNewFeature = selectedFeature?.isNewEntry;
    delete selectedFeature.isNewEntry;
    // Build a temporary config for LastN context if configured.
    // This is used when creating/updating the signal with LastN FaC
    if (selectedFeature?.materializedAs === 'AccumulatingCount') {
      selectedFeature._context = buildAccumulatingCountContextConfig(
        selectedFeature.featureAsContextName,
        signalDetail,
        selectedFeature,
        contexts,
      );
    } else if (selectedFeature?.materializedAs === 'LastN') {
      selectedFeature._context = buildLastNContextConfig(
        selectedFeature.featureAsContextName,
        signalDetail,
        selectedFeature,
        contexts,
      );
    }

    const currentFeatures = signalDetail?.postStorageStage?.features
      ? signalDetail.postStorageStage.features
      : [];

    if (isNewFeature) {
      updateSignalDetail({
        ...signalDetail,
        postStorageStage: {
          features: currentFeatures.concat(selectedFeature),
        },
      });
    } else {
      updateSignalDetail({
        ...signalDetail,
        postStorageStage: {
          features: currentFeatures.map((feature) => {
            if (feature.label === selectedFeature?.label) {
              return selectedFeature;
            }
            return feature;
          }),
        },
      });
    }

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: isNewFeature ? 'Add Feature' : 'Update Feature',
      rightSection: 'feature',
      mainSection: 'SignalDetailFeature',
      leftSection: 'signal',
    });

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
  };

  const deleteFeature = () => {
    let signalDetailCopy = cloneDeep(signalDetail);
    const updatedFeatures = signalDetailCopy.postStorageStage.features.filter(
      (feature) => {
        return feature.label !== selectedFeature.label;
      },
    );

    signalDetailCopy = {
      ...signalDetailCopy,
      postStorageStage: {
        features: updatedFeatures,
      },
    };

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Delete Feature',
      rightSection: 'feature',
      mainSection: 'SignalDetailFeature',
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
      eventLabel: 'Close Feature Panel',
      rightSection: 'feature',
      mainSection: 'SignalDetailFeature',
      leftSection: 'signal',
    });

    setShowRightPanel(false);
    setSelectedAttribute(null);
    setSelectedEnrichment(null);
    setSelectedFeature(null);
    clearValidationErrors();
  };

  const onCloneFeature = () => {
    cloneFeature && cloneFeature(selectedFeature);
  };

  return (
    <div
      className={css(
        styles.actionControlWrapper,
        !selectedFeature.isNewEntry ? styles.fourColGrid : styles.threeColGrid,
      )}
    >
      <Tooltip title="Apply">
        <i
          className={`icon-check ${css(commonStyles.icon)}`}
          onClick={saveFeature}
        />
      </Tooltip>
      {!selectedFeature.isNewEntry && (
        <Tooltip title="Clone">
          <i
            className={`icon-clone ${css(commonStyles.icon)}`}
            onClick={onCloneFeature}
          />
        </Tooltip>
      )}
      <Tooltip title="Delete">
        <i
          className={`icon-trash ${css(commonStyles.icon)}`}
          onClick={deleteFeature}
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

const mapDispatchToProps = {
  clearValidationErrors,
};

const mapStateToProps = (state) => {
  const { validationErrors } = state.signalDetail;
  return {
    validationErrors,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatureHeader);
