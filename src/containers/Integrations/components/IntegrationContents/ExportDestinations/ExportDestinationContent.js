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
import { Dropdown, Menu } from 'antdlatest';
import { css } from 'aphrodite';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';

import SwitchWrapper from 'components/Switch';
import RightPanelHeader from 'containers/Integrations/components/RightPanelHeader';
import {
  DESTINATION_TYPE_DISPLAY_NAME,
  DESTINATION_TYPE_S3,
  EXPORT_STATUS_ENABLED as ENABLED,
  EXPORT_STATUS_DISABLED as DISABLED,
  MESSAGES,
} from 'containers/Integrations/const';
import { integrationActions } from 'containers/Integrations/reducers';
import styles from 'containers/Integrations/styles';
import { removeInternalProps, WarningNotification } from 'containers/utils';
import {
  clearSelectedExportDestination,
  setSelectedExportDestination,
} from './actions';
import S3ExportDestination, { validateS3Config } from './S3ExportDestination';

const { setIntegrationConfig } = integrationActions;

const ExportDestinationContent = ({
  // redux states
  rightPanelType,
  exportDestinations,
  exportDestinationsCopy,
  selectedExportDestination,
  signals,

  // redux dispatches
  setIntegrationConfig,
  setSelectedExportDestination,
  clearSelectedExportDestination,

  // specified props
  setRightPanelActive,
  page,
  history,
}) => {
  const [isEntryInList, setEntryInList] = useState(false);

  useEffect(() => {
    setEntryInList(
      exportDestinationsCopy.some(
        (entry) => entry._id === selectedExportDestination._id,
      ),
    );
  }, [exportDestinationsCopy, selectedExportDestination._id]);

  // destination config properties
  const destinationName = selectedExportDestination.exportDestinationName;
  const destinationType = selectedExportDestination.storageType;
  const existingDestination = !selectedExportDestination.shouldCreate;

  // actions
  const changeDestinationConfig = (prop, value) => {
    const nextSelectedExportDestination = {
      ...selectedExportDestination,
      [prop]: value,
    };
    setSelectedExportDestination(nextSelectedExportDestination);
  };

  const setDestinationName = (name) => {
    changeDestinationConfig('exportDestinationName', name);
  };

  const strip = (entity) => {
    const result = removeInternalProps(entity);
    delete result.shouldCreate;
    delete result.shouldUpdate;
    delete result.shouldDelete;
    return result;
  };

  /**
   * Validates export destination configuration.
   *
   * @returns Array of violation error messages, empty if validated
   */
  const validate = () => {
    const violations = [];
    const name = selectedExportDestination.exportDestinationName;
    if (!(name?.length > 0)) {
      violations.push(MESSAGES.EMPTY_DESTINATION_NAME);
    }

    if (!(selectedExportDestination.status?.length > 0)) {
      violations.push(MESSAGES.propertyMissing('Status'));
    }

    const destinationType = selectedExportDestination.storageType;
    if (!(destinationType?.length > 0)) {
      violations.push(MESSAGES.propertyMissing('Type'));
    }

    if (destinationType === DESTINATION_TYPE_S3) {
      validateS3Config(selectedExportDestination, violations);
    }

    return violations;
  };

  const onApply = () => {
    const violations = validate();
    if (violations.length > 0) {
      violations.forEach((message) => WarningNotification({ message }));
      return;
    }

    const currentId = selectedExportDestination._id;
    const origDestination = exportDestinations.find(
      (dest) => dest._id === currentId,
    );
    const shouldUpdate =
      origDestination &&
      !_.isEqual(strip(origDestination), strip(selectedExportDestination));

    let replaced = false;
    const newExportDestinationsCopy = (exportDestinationsCopy || []).map(
      (dest) => {
        if (dest._id === selectedExportDestination._id) {
          replaced = true;
          return {
            ...selectedExportDestination,
            shouldUpdate,
          };
        }
        return dest;
      },
    );
    if (!replaced) {
      newExportDestinationsCopy.push({
        ...selectedExportDestination,
        shouldCreate: true,
      });
    }
    setIntegrationConfig({ exportDestinationsCopy: newExportDestinationsCopy });
    setRightPanelActive(false);
  };

  const onDelete = () => {
    const newExportDestinationsCopy = (exportDestinationsCopy || []).reduce(
      (acc, dest) => {
        if (dest._id !== selectedExportDestination._id) {
          acc.push(dest);
        } else if (!selectedExportDestination.shouldCreate) {
          const newDest = { ...dest, shouldDelete: true };
          delete newDest.shouldUpdate;
          acc.push(newDest);
        }
        return acc;
      },
      [],
    );
    setIntegrationConfig({ exportDestinationsCopy: newExportDestinationsCopy });
    clearSelectedExportDestination();
  };

  // contents
  const destinationTypeMenu = (
    <Menu onClick={(val) => changeDestinationConfig('storageType', val?.key)}>
      <Menu.Item key={DESTINATION_TYPE_S3}>
        {DESTINATION_TYPE_DISPLAY_NAME[DESTINATION_TYPE_S3]}
      </Menu.Item>
    </Menu>
  );

  const getContent = () => {
    switch (destinationType) {
      case DESTINATION_TYPE_S3:
        return <S3ExportDestination />;
      default:
        return null;
    }
  };

  return (
    <div>
      <RightPanelHeader
        history={history}
        setRightPanelActive={setRightPanelActive}
        save={onApply}
        name={destinationName}
        setName={setDestinationName}
        rightPanelType={rightPanelType}
        existing={isEntryInList}
        deleteItem={onDelete}
        clearContent={clearSelectedExportDestination}
        page={page}
        signals={signals}
        itemId={selectedExportDestination?.exportDestinationId}
      />
      <div className={css(styles.rightPanelSectionContainer)}>
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Status</div>
          <SwitchWrapper
            checked={selectedExportDestination.status === ENABLED}
            onChange={(enabled) =>
              changeDestinationConfig('status', enabled ? ENABLED : DISABLED)
            }
            onLabel={ENABLED}
            offLabel={DISABLED}
          />
        </div>
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Type</div>
          <div>
            {existingDestination ? (
              DESTINATION_TYPE_DISPLAY_NAME?.[destinationType]
            ) : (
              <Dropdown
                overlay={destinationTypeMenu}
                trigger={['click']}
                disabled={existingDestination}
              >
                <div className={css(styles.dropdownLabelWrapper)}>
                  <div>{DESTINATION_TYPE_DISPLAY_NAME?.[destinationType]}</div>
                  <i className="icon-chevron-down" />
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
      {getContent()}
    </div>
  );
};

ExportDestinationContent.propTypes = {
  rightPanelType: PropTypes.string.isRequired,
  exportDestinations: PropTypes.array.isRequired,
  exportDestinationsCopy: PropTypes.array.isRequired,
  selectedExportDestination: PropTypes.object.isRequired,

  setIntegrationConfig: PropTypes.func.isRequired,
  setSelectedExportDestination: PropTypes.func.isRequired,
  clearSelectedExportDestination: PropTypes.func.isRequired,

  setRightPanelActive: PropTypes.func.isRequired,
  page: PropTypes.string,

  signals: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const {
    rightPanelType,
    existingIntegration,
    exportDestinations,
    exportDestinationsCopy,
  } = state.integration?.integrationConfig;

  const { selectedExportDestination } = state.integration?.exportDestination;

  return {
    existingIntegration,
    rightPanelType,
    exportDestinations,
    exportDestinationsCopy,
    selectedExportDestination,
  };
};

const mapDispatchToProps = {
  setIntegrationConfig,
  setSelectedExportDestination,
  clearSelectedExportDestination,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportDestinationContent);
