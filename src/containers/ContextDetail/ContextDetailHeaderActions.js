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
import { getTransformedAttribute } from 'containers/SignalDetail/RightPanelAttributeTabContent/utils';
import styles from 'containers/SignalDetail/styles';
import { removeInternalProps } from 'containers/utils';
import messages from 'utils/notificationMessages';
import {
  createContext,
  deleteContext,
  endContextCreation,
  revertLocalChanges,
  setContextDetailModified,
  setFlowSpecsModified,
  updateContext,
} from './actions';
import { getDefaultValueByType } from 'utils';

const { deleteImportFlowByNameAndType, setImportFlowCopy } = integrationActions;
const { userClicks } = ipxl;

const ContextDetailHeaderActions = ({
  // Data props
  history,
  contextDetail,
  contextDetailCopy,
  updatingContextDetail,
  parentFlow,
  contextDetailModified,
  flowSpecsModified,

  //Methods props
  createContext,
  updateContext,
  deleteContext,
  onCreateNewContext,
  onDeleteCreatedContext,
  onCancel,
  revertLocalChanges,
  deleteImportFlowByNameAndType,
  setImportFlowCopy,
  importFlowSpecs,
  importFlowSpecsCopy,
  resetOnboarding,
  isLastOnboardingStep,
  setShowRightPanel,
  setContextDetailModified,
  setFlowSpecsModified,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    return () => endContextCreation();
  }, []);

  useEffect(() => {
    const modified = !_.isEqual(
      removeInternalProps(makeContextConfig(contextDetail)),
      removeInternalProps(makeContextConfig(contextDetailCopy)),
    );
    setContextDetailModified(modified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextDetail, contextDetailCopy]);

  useEffect(() => {
    setFlowSpecsModified(!_.isEqual(importFlowSpecs, importFlowSpecsCopy));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importFlowSpecs, importFlowSpecsCopy]);

  const isSavingEnabled =
    contextDetailModified || flowSpecsModified || contextDetail?.isNewEntry;

  const onCreateNewContextCb = (name) => {
    endContextCreation();
    if (parentFlow === 'onboarding') {
      setShowSuccessDialog(true);
    }
    onCreateNewContext && onCreateNewContext(name);
  };

  const makeContextConfig = (srcContextDetail) => {
    if (!srcContextDetail) {
      return {};
    }
    const cloneContextDetail = cloneDeep(srcContextDetail);
    if (!cloneContextDetail.hasOwnProperty('missingLookupPolicy')) {
      cloneContextDetail.missingLookupPolicy = 'FailParentLookup';
    }

    if (cloneContextDetail?.missingAttributePolicy === 'StoreDefaultValue') {
      cloneContextDetail.attributes?.forEach((attribute) => {
        if (!attribute?.default) {
          attribute.default = getDefaultValueByType(attribute?.type);
          attribute.defaultEnabled = true;
        }
      });
    }

    const updatedContextDetail = {
      ...cloneContextDetail,
      attributes: (cloneContextDetail.attributes || []).map((attribute) => {
        const attribute_obj = getTransformedAttribute(attribute);

        if (
          attribute_obj.hasOwnProperty('allowedValues') &&
          attribute_obj.allowedValues.length === 0
        ) {
          delete attribute_obj.allowedValues;
        }
        if (attribute_obj.defaultEnabled) {
          delete attribute_obj.defaultEnabled;
        } else if (attribute_obj.defaultEnabled === false) {
          delete attribute_obj.defaultEnabled;
          delete attribute_obj.default;
        }
        if (attribute_obj.hasOwnProperty('disabled')) {
          delete attribute_obj.disabled;
        }
        delete attribute_obj.label;
        return attribute_obj;
      }),
      enrichments: cloneContextDetail?.enrichments
        ? cloneContextDetail?.enrichments.map((enrichment) => {
            delete enrichment.label;
            return enrichment;
          })
        : [],
    };

    return updatedContextDetail;
  };

  const saveContextDetailChanges = () => {
    const updatedContextDetail = makeContextConfig(contextDetail);
    if (parentFlow !== 'onboarding') {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: contextDetail.isNewEntry
          ? 'Create New Context'
          : 'Update Context',
        rightSection: 'None',
        mainSection: 'contextDetail',
        leftSection: 'context',
      });
    }
    setContextDetailModified(false);
    setFlowSpecsModified(false);
    if (contextDetail.isNewEntry) {
      createContext(updatedContextDetail, onCreateNewContextCb, parentFlow);
    } else {
      const origContextDetail = makeContextConfig(contextDetailCopy);
      const contextModified = !_.isEqual(
        removeInternalProps(updatedContextDetail),
        removeInternalProps(origContextDetail),
      );
      updateContext(updatedContextDetail, contextModified);
    }
  };

  const onRevert = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'Revert Context Changes',
      rightSection: 'None',
      mainSection: 'contextDetail',
      leftSection: 'context',
    });
    revertLocalChanges(contextDetailCopy);
    setImportFlowCopy(importFlowSpecs);
    setShowRightPanel(false);
  };

  const deleteContextDetail = () => {
    if (contextDetail.isNewEntry) {
      // Note: Context Detail state will be flushed out
      // on componentWillUnmount automatically using cleanUp
      if (parentFlow === 'onboarding') {
        onCancel && onCancel();
      } else {
        history.push('/contexts');
      }
    } else {
      deleteContext &&
        deleteContext(
          contextDetail?.contextName,
          history,
          parentFlow,
          onCancel,
          onDeleteCreatedContext,
        );
      deleteImportFlowByNameAndType({
        name: contextDetail?.contextName,
        type: 'Context',
      });
    }
    if (parentFlow !== 'onboarding') {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: 'Delete Context',
        rightSection: 'None',
        mainSection: 'contextDetail',
        leftSection: 'context',
      });
    }
    setShowConfirmation(false);
  };

  const saveDisabledStyle =
    (!isSavingEnabled || updatingContextDetail) && commonStyles.disabled;

  const revertDisabledStyle =
    (!isSavingEnabled || updatingContextDetail || contextDetail.isNewEntry) &&
    commonStyles.disabled;

  return (
    <div className={css(styles.actionControlWrapper)}>
      <div className={css(styles.actionControlItemPadding)}>
        <HeaderAnnotation
          isSaving={updatingContextDetail}
          hasUnsavedChanges={isSavingEnabled}
        />
      </div>

      {updatingContextDetail ? (
        <Spin size="medium" />
      ) : (
        <Tooltip title="Save">
          <i
            className={`icon-check-circle ${css(
              commonStyles.icon,
              saveDisabledStyle,
              styles.actionControlItemPadding,
            )}`}
            onClick={saveContextDetailChanges}
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
            (contextDetail.isNewEntry || updatingContextDetail) &&
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
        onOk={deleteContextDetail}
        onCancelText="No, Keep Context"
        onOkText="Yes, Delete Context"
        headerTitleText="Delete Context"
        helperText="Deleting the context would permanently remove this context from bi(OS) database"
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
            history.push('/insights');
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Onboarding Complete',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceShowEntityContextDetail',
              leftSection: 'onboarding',
            });
          } else {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Onboard Context',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceShowEntityContextDetail',
              leftSection: 'onboarding',
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
        headerTitleText={messages.context.INGESTION_SETUP_SUCCESS_TITLE}
        helperText={messages.context.ingestionSetupSuccessMessage(
          contextDetail?.contextName,
        )}
      />
    </div>
  );
};

ContextDetailHeaderActions.propTypes = {
  history: PropTypes.instanceOf(Object),
  contextDetail: PropTypes.instanceOf(Object),
  parentFlow: PropTypes.string,
  contextDetailCopy: PropTypes.instanceOf(Object),
  updatingContextDetail: PropTypes.bool,
  createContext: PropTypes.func,
  updateContext: PropTypes.func,
  deleteContext: PropTypes.func,
  revertLocalChanges: PropTypes.func,
  deleteImportFlowByNameAndType: PropTypes.func,
  setImportFlowCopy: PropTypes.func,
  onCreateNewContext: PropTypes.func,
};

const mapDispatchToProps = {
  createContext,
  updateContext,
  deleteContext,
  revertLocalChanges,
  deleteImportFlowByNameAndType,
  setImportFlowCopy,
  setContextDetailModified,
  setFlowSpecsModified,
};

const mapStateToProps = (state) => {
  const {
    contextDetail,
    contextDetailCopy,
    updatingContextDetail,
    contextDetailModified,
    flowSpecsModified,
  } = state.contextDetail;

  const { importFlowSpecs, importFlowSpecsCopy } =
    state?.integration?.integrationConfig;
  return {
    contextDetail,
    contextDetailCopy,
    updatingContextDetail,
    contextDetailModified,
    flowSpecsModified,
    importFlowSpecs,
    importFlowSpecsCopy,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContextDetailHeaderActions);
