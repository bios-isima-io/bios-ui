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
import { css } from 'aphrodite';
import ipxl from '@bios/ipxl';
import PropTypes from 'prop-types';
import { useState } from 'react';
import _ from 'lodash';

import { Spin, Tooltip } from 'antdlatest';
import commonStyles from 'app/styles/commonStyles';
import { useDeviceDetect } from 'common/hooks';
import { ConfirmationDialog, Header } from 'containers/components';
import { PANEL_PROCESS, PANEL_SOURCE } from 'containers/Integrations/const';
import styles from 'containers/Integrations/styles';
import { getAffectedText } from 'containers/Integrations/components/RightPanelHeader/utils';

const { userClicks } = ipxl;

function RightPanelHeader({
  itemId,
  existing,
  name,
  setName,
  setRightPanelActive,
  rightPanelType,
  save,
  saving,
  deleteItem,
  readOnly,
  page,
  signals,
  importFlowSpecs,
  setIntegrationConfig = () => {},
  clearContent = () => {},
  history,
}) {
  const isMobile = useDeviceDetect();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const title = _.capitalize(rightPanelType);
  const saveTooltip =
    rightPanelType === PANEL_PROCESS ? 'Save' : 'Save as draft';
  const actionType = existing ? 'Update' : 'New';

  const affectedStreamText = getAffectedText({
    type: title,
    importFlowSpecs,
    signals,
    itemId,
  });
  const deleteConfirmationText = (
    <span>
      This would remove the {title.toLocaleLowerCase()} from bi(OS) database.
      {affectedStreamText}
    </span>
  );
  const updateConfirmationText = affectedStreamText;

  return (
    <Header
      title={name}
      validateReportName={'no-validation'}
      backLinkText={isMobile ? null : `${actionType} ${title}`}
      EmptyTitleText={`${title} Name`}
      placeholder={`${title} Name`}
      rightPanel={true}
      readOnly={readOnly}
      onChange={(newName) => {
        setName(newName);
      }}
      actionPanel={() => {
        return (
          <div
            className={css(
              styles.actionControlWrapper,
              existing && styles.fourColGrid,
            )}
          >
            {saving ? <Spin size="small" /> : <div></div>}
            <Tooltip title={saveTooltip}>
              <i
                className={`icon-check ${css(commonStyles.icon)}`}
                data-test-id="test-integration-save-draft"
                onClick={() => {
                  if (existing) {
                    setShowUpdateConfirmation(true);
                  } else {
                    save();
                  }
                }}
              />
            </Tooltip>
            <ConfirmationDialog
              show={showUpdateConfirmation}
              onCancel={() => {
                setShowUpdateConfirmation(false);
              }}
              onOk={() => {
                save();
              }}
              onCancelText={`No, Keep ${title}`}
              onOkText={`Yes, Update ${title}`}
              headerTitleText={`Update ${title}`}
              helperText={updateConfirmationText}
            />
            {existing && (
              <div>
                <Tooltip title={`Remove from the ${rightPanelType} list`}>
                  <i
                    className={`icon-trash ${css(commonStyles.icon)}`}
                    onClick={() => {
                      setShowConfirmation(true);
                    }}
                  />
                </Tooltip>
                <ConfirmationDialog
                  show={showConfirmation}
                  onCancel={() => {
                    setShowConfirmation(false);
                  }}
                  onOk={() => {
                    deleteItem();
                    setRightPanelActive(false);
                    setShowConfirmation(false);
                  }}
                  onCancelText={`No, Keep ${title}`}
                  onOkText={`Yes, Delete ${title}`}
                  headerTitleText={`Delete ${title}`}
                  helperText={deleteConfirmationText}
                />
              </div>
            )}
            <Tooltip title="Close">
              <i
                className={`icon-close ${css(commonStyles.icon)}`}
                onClick={() => {
                  setRightPanelActive(false);
                  setIntegrationConfig({
                    integrationId: '',
                    integrationName: '',
                    integrationType: 'Webhook',
                    integrationActive: true,
                    existingIntegration: false,
                    rightPanelActive: false,
                    processName: '',
                    processCode: '',
                    existingProcess: false,
                  });
                  clearContent();
                  userClicks({
                    pageURL: history?.location?.pathname,
                    pageTitle: document.title,
                    pageDomain: window?.location?.origin,
                    eventLabel:
                      rightPanelType === PANEL_SOURCE
                        ? 'Close Source'
                        : 'Close Process',
                    rightSection: rightPanelType,
                    mainSection: 'integration',
                    leftSection: 'integration',
                  });
                }}
              />
            </Tooltip>
          </div>
        );
      }}
    />
  );
}
RightPanelHeader.propTypes = {
  existing: PropTypes.bool,
  name: PropTypes.string,
  setName: PropTypes.func,
  setRightPanelActive: PropTypes.func,
  rightPanelType: PropTypes.string,
  save: PropTypes.func,
  saving: PropTypes.bool,
  deleteItem: PropTypes.func,
  readOnly: PropTypes.bool,
  page: PropTypes.string,
  importFlowSpecs: PropTypes.array,
  itemId: PropTypes.string,
  signals: PropTypes.array,
};

export default RightPanelHeader;
