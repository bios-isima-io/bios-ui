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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import EmptyPlaceholder from 'components/EmptyPlaceholder';
import styles from 'containers/Integrations/components/IntegrationContents/styles';
import { PANEL_PROCESS } from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import {
  getNewProcessDetails,
  parseProcessorConf,
} from 'containers/Integrations/utils';
import { Button } from 'containers/components';
import { getMethodNameFromCode } from './utils';

const { userClicks } = ipxl;
const EMPTY_BUTTON_NAME = 'Add Process';

const { setRightPanelActive, setRightPanelType, setProcessDetails } =
  integrationActions;

function ImportDataProcessors({
  setRightPanelActive,
  setRightPanelType,
  importDataProcessorsCopy,
  setProcessDetails,
  processName,
  history,
}) {
  const importDataProc = importDataProcessorsCopy?.filter((idp) => {
    return idp?.shouldDelete ? false : true;
  });
  return (
    <div className={css(styles.integrationContainer)}>
      {importDataProc?.length === 0 ? (
        <EmptyPlaceholder
          onClick={() => {
            setRightPanelActive(true);
            setRightPanelType(PANEL_PROCESS);
            setProcessDetails(getNewProcessDetails());
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: `New Process`,
              rightSection: 'None',
              mainSection: 'integrationSource',
              leftSection: 'integration',
            });
          }}
          buttonText={EMPTY_BUTTON_NAME}
          message={'Define pre-ingestion processing'}
          icon="icon-EMPTY-STATE-1"
        />
      ) : (
        <div>
          <Button
            type="primary"
            alignRight={true}
            onClick={() => {
              setRightPanelActive(true);
              setRightPanelType(PANEL_PROCESS);
              setProcessDetails(getNewProcessDetails());
              userClicks({
                pageURL: history?.location?.pathname,
                pageTitle: document.title,
                pageDomain: window?.location?.origin,
                eventLabel: `New Functions`,
                rightSection: 'None',
                mainSection: 'integrationSource',
                leftSection: 'integration',
              });
            }}
          >
            New Process
          </Button>
          <div
            className={css(
              styles.integrationListItem,
              styles.integrationListHeader,
            )}
          >
            <div>Name</div>
            <div className={css(commonStyles.centerText)}>Method</div>
          </div>
          {importDataProc?.map((processor) => {
            const processDetail = parseProcessorConf(processor);
            return (
              <div
                className={css(
                  styles.integrationListItem,
                  styles.integrationListRow,
                  processName === processor.processorName &&
                    styles.activeIntegrationListRow,
                )}
                onClick={() => {
                  setRightPanelActive(true);
                  setRightPanelType(PANEL_PROCESS);
                  setProcessDetails(processDetail);
                  userClicks({
                    pageURL: history?.location?.pathname,
                    pageTitle: document.title,
                    pageDomain: window?.location?.origin,
                    eventLabel: `Show Process`,
                    rightSection: 'None',
                    mainSection: 'integrationSource',
                    leftSection: 'integration',
                  });
                }}
              >
                <div className={css(styles.integrationListItemText)}>
                  {processor.processorName}
                </div>
                <div className={css(commonStyles.centerText)}>
                  {getMethodNameFromCode(processDetail.processCode)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setRightPanelActive,
  setRightPanelType,
  setProcessDetails,
};

const mapStateToProps = (state) => {
  const { importDataProcessorsCopy, processName } =
    state?.integration?.integrationConfig;
  return {
    importDataProcessorsCopy,
    processName,
  };
};

ImportDataProcessors.propTypes = {
  setRightPanelActive: PropTypes.func,
  setRightPanelType: PropTypes.func,
  importDataProcessorsCopy: PropTypes.array,
  setProcessDetails: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportDataProcessors);
