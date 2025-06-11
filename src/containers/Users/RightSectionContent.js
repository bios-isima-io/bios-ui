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
import { Dropdown, Menu, Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import { useDeviceDetect, usePrevious } from 'common/hooks';
import SwitchWrapper from 'components/Switch';
import {
  ConfirmationDialog,
  Header,
  ThreeDotAnimation,
} from 'containers/components';
import { availableUserRole } from './constant';
import './style.scss';
import styles from './styles';
import { convertRoleToReadableNames } from './utils';

const { userClicks } = ipxl;

const RightSectionContent = ({
  history,
  selectedUser,
  setSelectedUser,
  loggedInUserEmail,
  setRightPanelType,
  setShowRightPanel,
  onLoadDeleteUsers,
  postUser,
  loadingDelete,
  loadingPost,
}) => {
  const isMobile = useDeviceDetect();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const prevLoadingPost = usePrevious(loadingPost);

  useEffect(() => {
    if (showConfirmation && !loadingDelete) {
      setShowConfirmation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDelete]);

  useEffect(() => {
    if (prevLoadingPost && !loadingPost) {
      setShowRightPanel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingPost]);

  const onUserRoleSelectItem = (key) => {
    const roles = [key];
    // Add reports access for all roles other than Data Engineer
    if (!(key === 'Report' || key === 'Ingest')) {
      roles.push('Report');
    }
    setSelectedUser({
      ...selectedUser,
      roles,
    });
  };

  const menu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        onUserRoleSelectItem(key);
      }}
    >
      {availableUserRole.map(({ name, label }) => {
        return <Menu.Item key={name}>{label}</Menu.Item>;
      })}
    </Menu>
  );

  if (!!!selectedUser) {
    return null;
  }

  const roles = selectedUser?.roles;
  const currentRole = roles ? convertRoleToReadableNames(roles) : null;

  return (
    <div className="users-right-section">
      <Header
        title={selectedUser?.fullName}
        backLinkText={isMobile ? null : 'User'}
        EmptyTitleText="Untitled_User"
        placeholder="User name..."
        rightPanel={true}
        readOnly={loggedInUserEmail === selectedUser?.email}
        onChange={(value) => {
          setSelectedUser({
            ...selectedUser,
            fullName: value,
          });
        }}
        actionPanel={() => {
          return (
            <div
              className={css(
                styles.actionControlWrapper,
                loggedInUserEmail !== selectedUser?.email
                  ? loadingPost
                    ? styles.singleCol
                    : styles.threeColGrid
                  : styles.singleCol,
              )}
            >
              {loggedInUserEmail !== selectedUser?.email && (
                <>
                  {loadingPost ? (
                    <div className={css(styles.savingChanges)}>
                      Saving changes <ThreeDotAnimation />
                    </div>
                  ) : (
                    <>
                      <Tooltip title="Save">
                        <i
                          className={`icon-check ${css(
                            styles.icon,
                            loadingPost && styles.disabled,
                          )}`}
                          onClick={() => {
                            postUser(selectedUser);
                            userClicks({
                              pageURL: history?.location?.pathname,
                              pageTitle: document.title,
                              pageDomain: window?.location?.origin,
                              eventLabel: `Update User`,
                              rightSection: 'user',
                              mainSection: 'users',
                              leftSection: 'user',
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <i
                          className={`icon-trash ${css(
                            styles.icon,
                            loadingPost && styles.disabled,
                          )}`}
                          onClick={() => {
                            setShowConfirmation(true);
                            userClicks({
                              pageURL: history?.location?.pathname,
                              pageTitle: document.title,
                              pageDomain: window?.location?.origin,
                              eventLabel: `Delete User`,
                              rightSection: 'user',
                              mainSection: 'users',
                              leftSection: 'user',
                            });
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              )}
              {!loadingPost && (
                <Tooltip title="Close">
                  <i
                    className={`icon-close ${css(
                      styles.icon,
                      loadingPost && styles.disabled,
                    )}`}
                    onClick={() => {
                      setShowRightPanel(false);
                      setSelectedUser(null);
                      setRightPanelType('');
                      userClicks({
                        pageURL: history?.location?.pathname,
                        pageTitle: document.title,
                        pageDomain: window?.location?.origin,
                        eventLabel: `Close User Detail`,
                        rightSection: 'user',
                        mainSection: 'users',
                        leftSection: 'user',
                      });
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        }}
      />
      <div className={css(styles.mt50)}>
        <div className={css(styles.fieldRow)}>
          <div>Email</div>
          <div>{selectedUser?.email}</div>
        </div>

        <div className={css(styles.fieldRow)}>
          <div>Active</div>
          <SwitchWrapper
            disabled={loggedInUserEmail === selectedUser?.email}
            checked={selectedUser?.status === 'Active'}
            onChange={(checked) => {
              setSelectedUser({
                ...selectedUser,
                status: checked ? 'Active' : 'Suspended',
              });
            }}
            offLabel="NO"
            onLabel="YES"
          />
        </div>

        <div className={css(styles.fieldRow)}>
          <div>Role</div>
          <Dropdown
            overlayClassName="test_role_dropdown_overlay"
            disabled={loggedInUserEmail === selectedUser?.email}
            overlay={menu}
            trigger={['click']}
          >
            <div
              className={`test_role_label ${css(styles.dropdownLabelWrapper)}`}
            >
              <div>{currentRole ? currentRole : 'Select Role'}</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>
      </div>
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={() => {
          setShowConfirmation(false);
        }}
        onOk={() => {
          onLoadDeleteUsers(selectedUser.userId);
        }}
        loading={loadingDelete}
        onCancelText="No, Keep User"
        onOkText="Yes, Delete User"
        headerTitleText="Delete Confirmation"
        helperText="User Ingest will be deleted from the system permanently."
      />
    </div>
  );
};

RightSectionContent.propTypes = {
  loadingDelete: PropTypes.bool,
  loadingPost: PropTypes.bool,
  selectedUser: PropTypes.instanceOf(Object),
  postUser: PropTypes.func,
  setSelectedUser: PropTypes.func,
  loggedInUserEmail: PropTypes.string,
  setShowRightPanel: PropTypes.func,
  setRightPanelType: PropTypes.func,
  onLoadDeleteUsers: PropTypes.func,
};

export default RightSectionContent;
