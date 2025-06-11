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
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import EmptyPlaceholder from 'components/EmptyPlaceholder';
import ContentListHeader from 'containers/Integrations/components/IntegrationContents/ContentListHeader';
import styles from 'containers/Integrations/components/IntegrationContents/styles';
import {
  DESTINATION_TYPE_DISPLAY_NAME,
  DESTINATION_TYPE_S3,
  EXPORT_STATUS_DISABLED,
  EXPORT_STATUS_ENABLED,
  PANEL_DESTINATION,
} from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import { listActiveEntries } from 'containers/Integrations/utils';
import { Button } from 'containers/components';
import shortid from 'shortid';
import {
  destinationCreationStarted,
  setSelectedExportDestination,
} from './actions';

const { userClicks } = ipxl;
const { setRightPanelActive, setRightPanelType } = integrationActions;

function ExportDestinations({
  // redux states
  exportDestinations,
  exportDestinationsCopy,
  selectedExportDestination,
  createDestinationRequested,

  // redux dispatches
  setSelectedExportDestination,
  destinationCreationStarted,

  // specified properties
  setRightPanelActive,
  setRightPanelType,
  history,
}) {
  const destinations = listActiveEntries(exportDestinationsCopy);

  const showDestinationConfig = (dest) => {
    setRightPanelActive(true);
    setRightPanelType(PANEL_DESTINATION);
    setSelectedExportDestination(dest);
  };

  const createNewDestination = () => {
    const newDestination = {
      exportDestinationName: '',
      storageType: DESTINATION_TYPE_S3,
      status: EXPORT_STATUS_ENABLED,
      _id: shortid.generate(),
      shouldCreate: true,
    };

    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: 'New Destination',
      rightSection: 'None',
      mainSection: 'integrations',
      leftSection: 'exportDestinations',
    });

    showDestinationConfig(newDestination);
  };

  useEffect(() => {
    if (createDestinationRequested) {
      createNewDestination();
      destinationCreationStarted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDestinationRequested]);

  const getExportStatus = (dest) => {
    const orig = exportDestinations?.find((entry) => entry._id === dest._id);
    if (!orig) {
      return false;
    }
    return orig.status === EXPORT_STATUS_ENABLED;
  };

  return (
    <div className={css(styles.integrationContainer)}>
      {destinations?.length === 0 ? (
        <EmptyPlaceholder
          onClick={createNewDestination}
          buttonText="Add Destination"
          message="Define destination to export data"
          icon="icon-EMPTY-STATE-1"
        />
      ) : (
        <div>
          <Button
            type="primary"
            alignRight={true}
            onClick={createNewDestination}
          >
            New Destination
          </Button>
          <ContentListHeader type={PANEL_DESTINATION} />
          {destinations?.map((dest) => {
            const enabled = getExportStatus(dest);
            const isActive = dest?._id === selectedExportDestination?._id;
            return (
              <div
                key={dest._id}
                className={css(
                  styles.integrationListItem,
                  styles.integrationListRow,
                  isActive && styles.activeIntegrationListRow,
                )}
                onClick={() => showDestinationConfig(dest)}
              >
                <div className={css(styles.integrationListItemText)}>
                  {dest.exportDestinationName}
                </div>
                <div
                  className={css(
                    styles.integrationListItemText,
                    commonStyles.centerText,
                  )}
                >
                  {DESTINATION_TYPE_DISPLAY_NAME[dest.storageType]}
                </div>
                <div></div>
                <div className={css(commonStyles.flexCenter)}>
                  {enabled ? (
                    <Tooltip title={EXPORT_STATUS_ENABLED}>
                      <div className="ring-container">
                        <div className="ringring"></div>
                        <div className="circle"></div>
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip title={EXPORT_STATUS_DISABLED}>
                      <div
                        className={css(
                          commonStyles.inactiveStatus,
                          commonStyles.centerText,
                        )}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

ExportDestinations.propTypes = {
  exportDestinations: PropTypes.array.isRequired,
  exportDestinationsCopy: PropTypes.array.isRequired,
  selectedExportDestination: PropTypes.object.isRequired,

  setSelectedExportDestination: PropTypes.func.isRequired,
  destinationCreationStarted: PropTypes.func.isRequired,

  setRightPanelActive: PropTypes.func.isRequired,
  setRightPanelType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { exportDestinations, exportDestinationsCopy } =
    state.integration?.integrationConfig;

  const { selectedExportDestination, createDestinationRequested } =
    state.integration?.exportDestination;

  return {
    exportDestinations,
    exportDestinationsCopy,
    selectedExportDestination,
    createDestinationRequested,
  };
};

const mapDispatchToProps = {
  setSelectedExportDestination,
  destinationCreationStarted,
  setRightPanelActive,
  setRightPanelType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportDestinations);
