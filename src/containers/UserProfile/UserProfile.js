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
import { default as PropTypes, default as Proptypes } from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import ipxl from '@bios/ipxl';

import PageLayout from 'Layouts/PageLayout';
import commonStyles from 'app/styles/commonStyles';
import { useDeviceDetect, usePrevious } from 'common/hooks';
import TitleHelmet from 'components/TitleHelmet';
import styles from 'containers/SignalDetail/styles';
import { convertRoleToReadableNames } from 'containers/Users/utils';
import { Header, Input, ThreeDotAnimation } from 'containers/components';
import { WarningNotification, validatePassword } from 'containers/utils';
import { loadAuthenticateMe } from 'reducers/authenticate';
import { loadLogout } from 'reducers/logout';
import messages from 'utils/notificationMessages';
import { resetPassword } from './actions';
import changePasswordIcon from './change_password.svg';
import './style.scss';
import userProfileStyles from './styles';

const { userClicks } = ipxl;

const UserProfile = ({
  loading,
  error,
  roles,
  name,
  email,
  tenant,
  resetPassword,
  updatingPassword,
  onLogout,
  history,
}) => {
  const isMobile = useDeviceDetect();
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const prevUpdatingPassword = usePrevious(updatingPassword);

  const { hasLower, hasUpper, hasSymbol, hasNumber, lengthGood, valid, score } =
    validatePassword(newPassword);

  const requiredFieldsMessage = useMemo(() => {
    return [
      {
        value: lengthGood,
        message: 'Be a minimum of 8 characters',
      },
      {
        value: hasLower,
        message: 'Include at least one lowercase letter (a-z)',
      },
      {
        value: hasUpper,
        message: 'Include at least one uppercase letter (A-Z)',
      },
      {
        value: hasSymbol,
        message: 'Include at least one special character',
      },
      {
        value: hasNumber,
        message: 'Include at least one number (0-9)',
      },
    ];
  }, [hasLower, hasUpper, hasSymbol, hasNumber, lengthGood]);

  useEffect(() => {
    if (prevUpdatingPassword && !updatingPassword) {
      clearFormFields();
      setShowRightPanel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingPassword]);

  const clearFormFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const okLine = (message) => (
    <div style={{ color: 'green' }}>
      <i className="icon-tick-confirm" /> {message}
    </div>
  );
  const errLine = (message) => (
    <div style={{ color: 'red' }}>
      <i className="icon-conflict" /> {message}
    </div>
  );
  const okNo = (check, message) => {
    return check ? okLine(message) : errLine(message);
  };

  const validate = () => {
    if (currentPassword.trim() === '') {
      WarningNotification({
        message: messages.userProfile.EMPTY_CURRENT_PASSWORD,
      });
      return false;
    }

    if (newPassword.trim() === '') {
      WarningNotification({
        message: messages.userProfile.EMPTY_NEW_PASSWORD,
      });
      return false;
    }

    if (confirmPassword.trim() === '') {
      WarningNotification({
        message: messages.userProfile.EMPTY_CONFIRM_PASSWORD,
      });
      return false;
    }

    if (!valid) {
      const messageLower = okNo(
        hasLower,
        'Must contain at least one lowercase letter',
      );
      const messageUpper = okNo(
        hasUpper,
        'Must contain at least one uppercase letter',
      );
      const messageNumeric = okNo(
        hasNumber,
        'Must contain at least one number',
      );
      const messageSymbol = okNo(
        hasSymbol,
        'Must contain at least one special character',
      );
      const messageLength = okNo(
        lengthGood,
        'Length must be at least 8 characters',
      );
      const message = (
        <>
          <div>Invalid Password</div>
          {messageLower}
          {messageUpper}
          {messageNumeric}
          {messageSymbol}
          {messageLength}
        </>
      );
      WarningNotification({
        message,
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      WarningNotification({
        message: messages.userProfile.PASSWORD_NOT_MATCHING,
      });
      return false;
    }

    return true;
  };

  return (
    <PageLayout
      MainContent={() => {
        if (loading) {
          return null;
        }
        if (error) {
          return (
            <div className={css(commonStyles.centerPosition)}>
              Error in loading User Profile....
            </div>
          );
        }

        return (
          <div className={css(commonStyles.pageContentWrapper)}>
            <div className={css(commonStyles.pageContent)}>
              <TitleHelmet title="Profile" />
              <div className={css(userProfileStyles.headerWrapper)}>
                <div className={css(userProfileStyles.justifyCenter)}>
                  {name}
                </div>

                <div className={css(userProfileStyles.rightHeaderPanel)}>
                  <Tooltip title="Logout">
                    <i
                      className={`icon-log-out ${css(
                        userProfileStyles.logoutIcon,
                      )}`}
                      onClick={() => {
                        onLogout(history);
                        userClicks({
                          pageURL: history?.location?.pathname,
                          pageTitle: document.title,
                          pageDomain: window?.location?.origin,
                          eventLabel: `Logout`,
                          rightSection: 'None',
                          mainSection: 'profile',
                          leftSection: 'Profile',
                        });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Change Password">
                    <img
                      className={css(userProfileStyles.changePasswordIcon)}
                      src={changePasswordIcon}
                      onClick={() => {
                        setShowRightPanel(true);
                        userClicks({
                          pageURL: history?.location?.pathname,
                          pageTitle: document.title,
                          pageDomain: window?.location?.origin,
                          eventLabel: `Open Change Password`,
                          rightSection: 'None',
                          mainSection: 'profile',
                          leftSection: 'Profile',
                        });
                      }}
                      alt=""
                    />
                  </Tooltip>
                </div>
              </div>
              <div className={css(userProfileStyles.contentPanel)}>
                <div className={css(userProfileStyles.informationLabel)}>
                  Basic Information
                </div>
                <div className={css(userProfileStyles.informationWrapper)}>
                  <div>Name</div>
                  <div className={css(userProfileStyles.wordBreak)}>{name}</div>

                  <div>Email</div>
                  <div className={css(userProfileStyles.wordBreak)}>
                    {email}
                  </div>

                  <div>Tenant</div>
                  <div className={css(userProfileStyles.wordBreak)}>
                    {tenant}
                  </div>

                  <div>Role</div>
                  <div className={css(userProfileStyles.wordBreak)}>
                    {roles ? convertRoleToReadableNames(roles) : 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
      RightPanelContent={() => {
        return (
          <div className="user-profile-right-section">
            <Header
              title="Change Password"
              backLinkText={isMobile ? null : 'Profile'}
              EmptyTitleText=""
              placeholder=""
              rightPanel={true}
              readOnly={true}
              onChange={(value) => {}}
              actionPanel={() => {
                return (
                  <div
                    className={css(
                      styles.actionControlWrapper,
                      updatingPassword
                        ? styles.updatingPassword
                        : styles.twoColumnGrid,
                    )}
                  >
                    {updatingPassword ? (
                      <div className={css(styles.savingChanges)}>
                        Saving changes <ThreeDotAnimation />
                      </div>
                    ) : (
                      <>
                        <Tooltip title="Apply">
                          <i
                            className={`icon-check ${css(commonStyles.icon)}`}
                            onClick={() => {
                              if (validate()) {
                                resetPassword({
                                  newPassword,
                                  currentPassword,
                                });
                                userClicks({
                                  pageURL: history?.location?.pathname,
                                  pageTitle: document.title,
                                  pageDomain: window?.location?.origin,
                                  eventLabel: `Update Change Password`,
                                  rightSection: 'changePassword',
                                  mainSection: 'profile',
                                  leftSection: 'Profile',
                                });
                              }
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Close">
                          <i
                            className={`icon-close ${css(commonStyles.icon)}`}
                            onClick={() => {
                              setShowRightPanel(false);
                              clearFormFields();
                              userClicks({
                                pageURL: history?.location?.pathname,
                                pageTitle: document.title,
                                pageDomain: window?.location?.origin,
                                eventLabel: `Close Change Password`,
                                rightSection: 'changePassword',
                                mainSection: 'profile',
                                leftSection: 'Profile',
                              });
                            }}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                );
              }}
            />

            <div className={css(userProfileStyles.RPFieldWrapper)}>
              <div className={css(userProfileStyles.RPFieldRow)}>
                <div>Old password</div>
                <Input
                  value={currentPassword}
                  placeholder="Enter current password..."
                  type="password"
                  hideSuffix={true}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                  }}
                />
              </div>
              <div className={css(userProfileStyles.RPFieldRow)}>
                <div>New password</div>
                <Input
                  value={newPassword}
                  type="password"
                  placeholder="Enter new password..."
                  hideSuffix={true}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                  }}
                />
              </div>
              <div className={css(userProfileStyles.passwordStrengthContainer)}>
                <div
                  className={css(
                    userProfileStyles.passwordStrengthInnerContainer,
                  )}
                >
                  <div className={css(userProfileStyles.strengthLabel)}>
                    Strength
                  </div>

                  <div
                    className={css(userProfileStyles.passwordStrengthWrapper)}
                  >
                    {[...Array(4)].map((item, i) => {
                      return (
                        <div
                          className={css(
                            userProfileStyles.passwordStrengthIndicator,
                            valid
                              ? score > i && userProfileStyles.green
                              : i < 3 && score > i && userProfileStyles.red,
                          )}
                          key={i}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={css(userProfileStyles.RPFieldRow)}>
                <div>Confirm new password</div>
                <Input
                  value={confirmPassword}
                  type="password"
                  placeholder="Enter new password..."
                  hideSuffix={true}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                />
              </div>
              <div>
                <div>
                  <div>Password must:</div>
                  {requiredFieldsMessage?.length > 0 &&
                    requiredFieldsMessage.map((field, index) => {
                      return (
                        <div key={index}>
                          <i
                            className={`icon-check-circle password-strength-icon ${
                              field.value
                                ? 'password-strength-success'
                                : 'password-strength-failure'
                            }`}
                          />
                          {field.message}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        );
      }}
      showRightPanel={showRightPanel}
    />
  );
};

UserProfile.propTypes = {
  loading: Proptypes.bool,
  error: Proptypes.bool,
  roles: Proptypes.array,
  name: Proptypes.string,
  email: Proptypes.string,
  updatingPassword: Proptypes.bool,
  resetPassword: Proptypes.func,
  onLogout: Proptypes.func,
  onAuthenticateMe: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { authMe, userProfile } = state;
  const { loading, error } = authMe;
  const { updatingPassword } = userProfile;
  const { roles, name, email, tenant } = authMe.authMe;
  return {
    loading,
    error,
    roles,
    tenant,
    name,
    email,
    updatingPassword,
  };
};

const mapDispatchToProps = {
  resetPassword: (options) => resetPassword(options),
  onLogout: (history) => loadLogout(history),
  onAuthenticateMe: () => loadAuthenticateMe(),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
