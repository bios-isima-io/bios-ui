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
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import { Dropdown, Menu, Spin, Tooltip } from 'antdlatest';
import { Button, Input } from 'containers/components';
import { inviteUsersActions } from './reducers';
import {
  ErrorNotification,
  validateEmail,
  validatePrivateEmail,
} from 'containers/utils';
import messages from 'utils/notificationMessages';
import { availableUserRole } from 'containers/Users/constant';
import commonStyles from 'app/styles/commonStyles';
import styles from './styles';

const { sendInviteToUser } = inviteUsersActions;

const DEFAULT_ROLE = 'Report';

function InviteUsers({
  closeRightPanel,
  sendInviteToUser,
  sendingInvite,
  showRightPanel,
}) {
  const [inviteUsers, setInviteUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState(DEFAULT_ROLE);

  useEffect(() => {
    if (!showRightPanel) {
      setInviteUsers([]);
      setNewUserEmail('');
      setNewUserRole(DEFAULT_ROLE);
    }
  }, [showRightPanel]);

  const removeInviteUser = (index) => {
    setInviteUsers([...inviteUsers.filter((_, i) => i !== index)]);
  };

  const roleMenu = (
    <Menu
      onClick={(val) => {
        setNewUserRole(val?.key);
      }}
    >
      {availableUserRole?.map((role) => (
        <Menu.Item key={role?.name}>{role?.label}</Menu.Item>
      ))}
    </Menu>
  );

  const sendInviteButtonClick = () => {
    if (!validateEmail(newUserEmail)) {
      ErrorNotification({ message: messages.inviteUser.ADD_VALID_EMAIL });
      return;
    }
    if (validatePrivateEmail(newUserEmail)) {
      ErrorNotification({
        message: messages.inviteUser.DISALLOW_PUBLIC_EMAIL,
      });
      return;
    }
    if (inviteUsers.some((iu) => iu.email === newUserEmail)) {
      ErrorNotification({
        message: messages.inviteUser.EMAIL_ALREADY_PRESENT,
      });
      return;
    }

    let users = [...inviteUsers, { email: newUserEmail, roles: [newUserRole] }];

    let invalidEmail = false;
    if (users.length === 0) {
      ErrorNotification({
        message: messages.inviteUser.INVITE_VALIDATION_TEXT,
      });
      return;
    }
    users.forEach((iu) => {
      if (!validateEmail(iu.email)) {
        invalidEmail = true;
      }
    });
    if (invalidEmail) {
      ErrorNotification({ message: messages.inviteUser.ADD_VALID_EMAIL });
      return;
    }

    //Add reports access for all roles other than Data Engineer
    users = users.map((iu) => {
      if (!(iu.roles.includes('Report') || iu.roles.includes('Ingest'))) {
        iu.roles.push('Report');
      }
      return iu;
    });

    sendInviteToUser({
      inviteUsers: users,
      closeRightPanel: () => {
        closeRightPanel();
        setInviteUsers([]);
      },
    });
  };

  return (
    <div
      className={`invite_user_container ${css(styles.inviteUsersContainer)}`}
    >
      <div className={css(styles.inviteUsersHeader)}>
        <div className={css(styles.inviteUsersHeaderText)}>Invite User</div>
        <div className={css(styles.inviteUsersHeaderOptions)}>
          <div className={css(styles.inviteUsersClose)}>
            <Tooltip title="Close">
              <i
                className={`icon-close ${css(commonStyles.icon)}`}
                onClick={() => {
                  setInviteUsers([]);
                  setNewUserEmail('');
                  setNewUserRole(DEFAULT_ROLE);
                  closeRightPanel();
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {inviteUsers?.map((iu, iu_index) => {
        return (
          <div className={css(styles.inviteUserAdded)}>
            <div className={css(styles.inviteUsersItem)}>
              <div className={css(styles.inviteUsersCol1)}>User Email</div>
              <div className={css(styles.inviteUsersCol2)}>
                <div>{iu.email}</div>
                <i
                  className={`icon-trash ${css(commonStyles.icon)}`}
                  onClick={() => removeInviteUser(iu_index)}
                />
              </div>
            </div>

            <div className={css(styles.inviteUsersItem)}>
              <div className={css(styles.inviteUsersCol1)}>Role</div>
              <div className={css(styles.inviteUsersCol2)}>
                <div>
                  {
                    availableUserRole?.filter(
                      (role) => role?.name === iu?.roles?.[0],
                    )?.[0]?.label
                  }
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div>
        <div className={css(styles.inviteUsersItem)}>
          <div className={css(styles.inviteUsersCol1)}>User Email</div>
          <Input
            placeholder="Enter email..."
            hideSuffix={true}
            value={newUserEmail}
            onChange={(event) => {
              setNewUserEmail(event?.target?.value);
            }}
            type="email"
          />
        </div>

        <div className={css(styles.inviteUsersItem)}>
          <div className={css(styles.inviteUsersCol1)}>Role</div>
          <Dropdown overlay={roleMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>
                {newUserRole && newUserRole !== ''
                  ? availableUserRole?.filter(
                      (role) => role?.name === newUserRole,
                    )?.[0]?.label
                  : 'Select Role'}
              </div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>
      </div>
      <div className={css(styles.addUserButtonContainer)}>
        <Button
          type="primary"
          onClick={() => sendInviteButtonClick()}
          disabled={sendingInvite}
        >
          {sendingInvite ? <Spin size="small" /> : 'Send Invite'}
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { sendingInvite } = state?.inviteUsers;
  return {
    sendingInvite,
  };
};

const mapDispatchToProps = {
  sendInviteToUser,
};

InviteUsers.propTypes = {
  sendInviteToUser: PropTypes.func,
  closeRightPanel: PropTypes.func,
  sendingInvite: PropTypes.bool,
  showRightPanel: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteUsers);
