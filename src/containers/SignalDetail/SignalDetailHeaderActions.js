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
import { Spin, Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import _, { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import HeaderAnnotation from 'components/HeaderAnnotation';
import { ConfirmationDialog } from 'containers/components';
import { integrationActions } from 'containers/Integrations/reducers';
import { removeInternalProps } from 'containers/utils';
import messages from 'utils/notificationMessages';
import {
  createSignal,
  deleteSignal,
  endSignalCreation,
  revertLocalChanges,
  updateSignal,
} from './actions';
import { getTransformedAttribute } from './RightPanelAttributeTabContent/utils';
import { getDefaultValueByType } from 'utils';
import styles from './styles';

const { userClicks } = ipxl;
const { deleteImportFlowByNameAndType, setImportFlowCopy } = integrationActions;

export const SignalDetailHeaderActions = ({
  // Data props
  history,
  signalDetail,
  parentFlow,
  signalDetailCopy,
  updatingSignalDetail,

  // Methods props
  updateSignal,
  createSignal,
  deleteSignal,
  revertLocalChanges,
  deleteImportFlowByNameAndType,
  setImportFlowCopy,
  importFlowSpecs,
  importFlowSpecsCopy,
  onCreateNewSignal,
  onDeleteCreatedSignal,
  onCancel,
  resetOnboarding,
  isLastOnboardingStep,
  endSignalCreation,
  setShowRightPanel,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [signalDetailModified, setSignalDetailModified] = useState(false);
  const [flowSpecsModified, setFlowSpecsModified] = useState(false);

  useEffect(() => {
    return () => endSignalCreation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const modified = !_.isEqual(
      removeInternalProps(makeSignalConfig(signalDetail)),
      removeInternalProps(makeSignalConfig(signalDetailCopy)),
    );
    setSignalDetailModified(modified);
  }, [signalDetail, signalDetailCopy]);

  useEffect(() => {
    setFlowSpecsModified(!_.isEqual(importFlowSpecs, importFlowSpecsCopy));
  }, [importFlowSpecs, importFlowSpecsCopy]);

  const isSavingEnabled =
    signalDetailModified || flowSpecsModified || signalDetail?.isNewEntry;

  const onCreateNewSignalCb = (name) => {
    endSignalCreation();
    if (parentFlow === 'onboarding') {
      setShowSuccessDialog(true);
    }
    onCreateNewSignal && onCreateNewSignal(name);
  };

  const makeSignalConfig = (srcSignalDetail) => {
    const cloneSignalDetail = cloneDeep(srcSignalDetail);
    cloneSignalDetail.hasOwnProperty('enrichedAttributes') &&
      delete cloneSignalDetail.enrichedAttributes;
    delete cloneSignalDetail.isDataBeingIngested;

    if (cloneSignalDetail?.missingAttributePolicy === 'StoreDefaultValue') {
      cloneSignalDetail.attributes?.forEach((attribute) => {
        if (!attribute?.default) {
          attribute.default = getDefaultValueByType(attribute?.type);
          attribute.defaultEnabled = true;
        }
      });
    }

    const updatedSignalDetail = {
      ...cloneSignalDetail,
      attributes: cloneSignalDetail?.attributes
        ? cloneSignalDetail?.attributes.map((attribute) => {
            const attribute_obj = getTransformedAttribute(attribute);
            if (
              attribute_obj.hasOwnProperty('allowedValues') &&
              attribute_obj.allowedValues.length === 0
            ) {
              delete attribute_obj.allowedValues;
            }
            attribute_obj.hasOwnProperty('label') && delete attribute_obj.label;
            attribute_obj.hasOwnProperty('isExact') &&
              delete attribute_obj.isExact;
            attribute_obj.hasOwnProperty('positiveTrend') &&
              delete attribute_obj.positiveTrend;
            attribute_obj.hasOwnProperty('showPercentageChange') &&
              delete attribute_obj.showPercentageChange;
            attribute_obj.hasOwnProperty('showTrendLine') &&
              delete attribute_obj.showTrendLine;
            attribute_obj.hasOwnProperty('trendLineData') &&
              delete attribute_obj.trendLineData;
            attribute_obj.hasOwnProperty('trendPercentChange') &&
              delete attribute_obj.trendPercentChange;
            return attribute_obj;
          })
        : [],
      enrich: {
        enrichments: cloneSignalDetail?.enrich?.enrichments
          ? cloneSignalDetail?.enrich?.enrichments.map((enrichment) => {
              enrichment.contextAttributes = enrichment.contextAttributes.map(
                (en) => {
                  if (en.as === '') {
                    delete en.as;
                  }
                  en.hasOwnProperty('minimize') && delete en.minimize;
                  return en;
                },
              );
              delete enrichment.label;
              return enrichment;
            })
          : [],
        ingestTimeLag: cloneSignalDetail?.enrich?.ingestTimeLag
          ? cloneSignalDetail?.enrich?.ingestTimeLag
          : [],
      },
      postStorageStage: {
        features: cloneSignalDetail?.postStorageStage?.features
          ? cloneSignalDetail?.postStorageStage?.features.map((feature) => {
              delete feature.label;
              return feature;
            })
          : [],
      },
    };
    return updatedSignalDetail;
  };

  const saveSignalDetailChanges = () => {
    const updatedSignalDetail = makeSignalConfig(signalDetail);
    if (parentFlow !== 'onboarding') {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: signalDetail.isNewEntry
          ? 'Create New Signal'
          : 'Update Signal',
        rightSection: 'None',
        mainSection: 'SignalDetail',
        leftSection: 'signal',
      });
    }
    setSignalDetailModified(false);
    setFlowSpecsModified(false);
    if (signalDetail.isNewEntry) {
      createSignal(updatedSignalDetail, onCreateNewSignalCb, parentFlow);
    } else {
      const origSignalDetail = removeInternalProps(
        makeSignalConfig(signalDetailCopy),
      );
      const newSignalDetail = removeInternalProps(updatedSignalDetail);
      const signalModified = !_.isEqual(newSignalDetail, origSignalDetail);
      updateSignal(updatedSignalDetail, signalModified, origSignalDetail);
    }
  };

  const onRevert = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Revert Signal Changes',
      rightSection: 'None',
      mainSection: 'SignalDetail',
      leftSection: 'signal',
    });
    revertLocalChanges(signalDetailCopy);
    setImportFlowCopy(importFlowSpecs);
    setShowRightPanel(false);
  };

  const onDeleteSignal = () => {
    if (signalDetail.isNewEntry) {
      // Note: Signal Detail state will be flushed out
      // on componentWillUnmount automatically using cleanUp
      if (parentFlow === 'onboarding') {
        onCancel && onCancel();
      } else {
        history.push('/signals');
      }
    } else {
      deleteSignal(
        signalDetail?.signalName,
        history,
        parentFlow,
        onCancel,
        onDeleteCreatedSignal,
      );
      deleteImportFlowByNameAndType({
        name: signalDetail?.signalName,
        type: 'Signal',
      });
    }
    if (parentFlow !== 'onboarding') {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: 'Delete Signal',
        rightSection: 'None',
        mainSection: 'SignalDetail',
        leftSection: 'signal',
      });
    }
    setShowConfirmation(false);
  };

  const saveDisabledStyle =
    (!isSavingEnabled || updatingSignalDetail) && commonStyles.disabled;

  const revertDisabledStyle =
    (!isSavingEnabled || updatingSignalDetail || signalDetail.isNewEntry) &&
    commonStyles.disabled;

  return (
    <div className={css(styles.actionControlWrapper)}>
      <div className={css(styles.actionControlItemPadding)}>
        <HeaderAnnotation
          isSaving={updatingSignalDetail}
          hasUnsavedChanges={isSavingEnabled}
        />
      </div>

      {updatingSignalDetail ? (
        <Spin size="medium" />
      ) : (
        <Tooltip title="Save">
          <i
            className={`icon-check-circle ${css(
              commonStyles.icon,
              saveDisabledStyle,
              styles.actionControlItemPadding,
            )}`}
            onClick={saveSignalDetailChanges}
          />
        </Tooltip>
      )}

      <Tooltip title="Revert">
        <i
          className={`icon-revert ${css(
            commonStyles.icon,
            revertDisabledStyle,
            styles.actionControlItemPadding,
          )}`}
          onClick={onRevert}
        />
      </Tooltip>

      <Tooltip title="Delete">
        <i
          className={`icon-trash ${css(
            commonStyles.icon,
            (signalDetail.isNewEntry || updatingSignalDetail) &&
              commonStyles.disabled,
            styles.actionControlItemPadding,
          )}`}
          onClick={() => {
            setShowConfirmation(true);
          }}
        />
      </Tooltip>

      <ConfirmationDialog
        type="delete"
        show={showConfirmation}
        onCancel={() => {
          setShowConfirmation(false);
        }}
        onOk={onDeleteSignal}
        onCancelText="No, Keep Signal"
        onOkText="Yes, Delete Signal"
        headerTitleText="Delete Signal"
        helperText="Deleting the signal would permanently remove this signal and its flows from bi(OS) database"
      />

      <ConfirmationDialog
        type="congrats"
        show={showSuccessDialog}
        hideCancel={!isLastOnboardingStep}
        onCancel={() => {
          resetOnboarding();
        }}
        onOk={() => {
          if (isLastOnboardingStep) {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Onboarding Complete',
              rightSection: 'None',
              mainSection: 'SignalDetail',
              leftSection: 'signal',
            });
            history.push('/insights');
          } else {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Onboard Signal',
              rightSection: 'None',
              mainSection: 'SignalDetail',
              leftSection: 'signal',
            });
            onCancel && onCancel();
          }
        }}
        onCancelText="Repeat"
        onOkText={
          isLastOnboardingStep
            ? 'Go to insights'
            : 'Continue to onboard next Stream'
        }
        headerTitleText={messages.signal.INGESTION_SETUP_SUCCESS_TITLE}
        helperText={messages.signal.ingestionSetupSuccessMessage(
          signalDetail?.signalName,
        )}
      />
    </div>
  );
};

SignalDetailHeaderActions.propTypes = {
  history: PropTypes.instanceOf(Object),
  signalDetail: PropTypes.instanceOf(Object),
  parentFlow: PropTypes.string,
  signalDetailCopy: PropTypes.instanceOf(Object),
  updatingSignalDetail: PropTypes.bool,
  updateSignal: PropTypes.func,
  createSignal: PropTypes.func,
  deleteSignal: PropTypes.func,
  revertLocalChanges: PropTypes.func,
  deleteImportFlowByNameAndType: PropTypes.func,
  setImportFlowCopy: PropTypes.func,
  onCreateNewSignal: PropTypes.func,
};

const mapDispatchToProps = {
  createSignal,
  updateSignal,
  deleteSignal,
  revertLocalChanges,
  deleteImportFlowByNameAndType,
  setImportFlowCopy,
  endSignalCreation,
};

const mapStateToProps = (state) => {
  const { signalDetail, signalDetailCopy, updatingSignalDetail } =
    state.signalDetail;
  const { importFlowSpecs, importFlowSpecsCopy } =
    state?.integration?.integrationConfig;

  return {
    signalDetail,
    signalDetailCopy,
    updatingSignalDetail,
    importFlowSpecs,
    importFlowSpecsCopy,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignalDetailHeaderActions);
