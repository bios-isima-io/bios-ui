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
import { css, StyleSheet } from 'aphrodite';
import { connect } from 'react-redux';
import { Modal } from 'antdlatest';
import PropTypes from 'prop-types';
import TitleHelmet from '../../../components/TitleHelmet';
import Logo from './components/Logo';
import SuccessIcon from './components/SuccessIcon';
import EyeIcon from './components/EyeIcon';
import AndroidAppIcon from './AndroidAppIcon';
import AppleAppIcon from './AppleAppIcon';
import {
  userLogin,
  userSignUp,
  userResetState,
  userRequestResetPassword,
} from '../actions';
import { CircularLoader } from '../../components';
import { usePrevious } from 'common/hooks';
import {
  signInValidation,
  signUpValidation,
  requestResetLinkValidation,
} from './utils';
import {
  SIGN_UP_SUCCESS_TITLE,
  SIGN_UP_SUCCESS_SUB_TITLE,
  EMAIL_HELPER_TEXT,
} from './constant';
import styles from './styles';
import './style.scss';

const MobileLogin = ({
  loginLoading,
  signUpLoading,
  signUpError,
  userLogin,
  userSignUp,
  userResetState,
  requestPasswordLoading,
  userRequestResetPassword,
  history,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginActive, setLoginActive] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const prevSignUpLoading = usePrevious(signUpLoading);

  useEffect(() => {
    if (prevSignUpLoading && !signUpLoading && !signUpError) {
      setEmail('');
      setSignupSuccess(true);
    }
  }, [prevSignUpLoading, signUpError, signUpLoading]);

  const inlineStyles = StyleSheet.create({
    firstField: {
      marginBottom: isLoginActive ? '25px' : '10px',
      padding: '4px 10px',
      color: '#706E6B',
      border: '1px solid rgb(118, 118, 118)',
      fontSize: '14px',
      transition: 'border-left 0.3s',
      ':focus': {
        outline: 'none',
        borderLeft: '8px solid #941100',
      },
    },
  });

  const signIn = () => {
    signInValidation(email, password) &&
      userLogin({
        email,
        password,
        history,
      });
  };

  const signUp = () => {
    signUpValidation(email) &&
      userSignUp({
        email,
      });
  };

  const requestResetLink = () => {
    if (requestResetLinkValidation(forgetPasswordEmail)) {
      setForgetPasswordEmail('');
      userRequestResetPassword({
        email: forgetPasswordEmail,
      });
    }
  };

  const reset = () => {
    setEmail('');
    setPassword('');
    setSignupSuccess(false);
    userResetState();
  };

  return (
    <div className={css(styles.wrapper)}>
      <TitleHelmet title="Login" />
      <Logo />
      <div className={css(styles.formWrapper)}>
        <div className={css(styles.formLabel)}>
          {isLoginActive ? 'Log In' : 'Sign Up'}
        </div>
        {signupSuccess ? (
          <div className={css(styles.signupSuccess)}>
            <SuccessIcon />
            <div className={css(styles.labelOne)}>{SIGN_UP_SUCCESS_TITLE}</div>
            <div className={css(styles.labelTwo)}>
              {SIGN_UP_SUCCESS_SUB_TITLE}
            </div>
          </div>
        ) : (
          <>
            <input
              placeholder="Enter your work email..."
              disabled={signUpLoading || loginLoading}
              className={css(inlineStyles.firstField)}
              value={email}
              onKeyDown={(e) => {
                if (!isLoginActive && e.key === 'Enter') {
                  signUp();
                }
              }}
              onChange={(event) => {
                setEmail(event?.target?.value);
              }}
              type="email"
            />
          </>
        )}

        {!isLoginActive && !signupSuccess && (
          <>
            <div className={css(styles.emailHelper)}>{EMAIL_HELPER_TEXT}</div>
            <div className="mobile-app-wrapper mobile">
              <div className="coming-soon-tooltip">
                <div className="tooltiptext">Coming soon</div>
                <AndroidAppIcon />
              </div>
              <div className="coming-soon-tooltip">
                <div className="tooltiptext">Coming soon</div>
                <AppleAppIcon />
              </div>
            </div>
          </>
        )}

        {isLoginActive && (
          <div className={css(styles.passwordFieldWrapper)}>
            <input
              placeholder="Enter password..."
              type={showPassword ? 'text' : 'password'}
              disabled={loginLoading}
              value={password}
              onChange={(event) => {
                setPassword(event?.target?.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  signIn();
                }
              }}
              className={css(styles.passwordField)}
            />
            <EyeIcon
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
          </div>
        )}

        {isLoginActive && (
          <div>
            <span
              className={css(styles.forgetPasswordLink)}
              onClick={() => {
                setIsModalVisible(true);
              }}
            >
              Forgot password?
            </span>
          </div>
        )}
      </div>

      {isLoginActive ? (
        <div className={css(styles.buttonWrapper)}>
          <div className={css(styles.loginButton)} onClick={signIn}>
            Login
            {loginLoading ? (
              <CircularLoader className={css(styles.circularLoader)} />
            ) : (
              <span className={css(styles.loginBar)} />
            )}
          </div>
          <div
            className={css(styles.signUpButton)}
            onClick={() => {
              reset();
              setLoginActive(false);
            }}
          >
            Sign Up
            <span className={css(styles.signUpBar)} />
          </div>
          <div className={css(styles.bottomBar)} />
        </div>
      ) : (
        <div className={css(styles.buttonWrapper)}>
          {!signupSuccess && (
            <>
              <div className={css(styles.signUpHelper)}>
                By clicking on Sign Up I agree to the{' '}
                <a
                  href="https://www.isima.io/terms-conditions/"
                  target="_blank"
                >
                  Terms and Conditions
                </a>
                ,{' '}
                <a href="https://www.isima.io/privacy-policy/" target="_blank">
                  Privacy Policy
                </a>
              </div>
              <div className={css(styles.loginButton)} onClick={signUp}>
                Sign Up
                {signUpLoading ? (
                  <CircularLoader className={css(styles.circularLoader)} />
                ) : (
                  <span className={css(styles.loginBar)} />
                )}
              </div>
            </>
          )}
          <div
            className={css(styles.signUpButton)}
            onClick={() => {
              reset();
              setLoginActive(true);
            }}
          >
            Login
            <span className={css(styles.signUpBar)} />
          </div>
          <div className={css(styles.bottomBar)} />
        </div>
      )}

      <Modal
        closeIcon={
          <i
            className={'icon-close'}
            style={{
              fontSize: '24px',
            }}
          />
        }
        centered
        wrapClassName="reset-password-modal"
        title="Forgot Password ?"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        closable={true}
        maskClosable={false}
        footer={[]}
      >
        <p className={css(styles.forgetPasswordLabel)}>
          Enter your work email and request reset link
        </p>
        <input
          placeholder="Enter your work email..."
          className={css(styles.forgetPasswordInput)}
          value={forgetPasswordEmail}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              requestResetLink();
            }
          }}
          onChange={(event) => {
            setForgetPasswordEmail('');
            setForgetPasswordEmail(event?.target?.value);
          }}
          type="email"
        />
        <div
          className={css(styles.requestRestLinkButton)}
          onClick={requestResetLink}
        >
          Request Reset Link
          {requestPasswordLoading ? (
            <CircularLoader className={css(styles.circularLoader)} />
          ) : (
            <span className={css(styles.loginBar)} />
          )}
        </div>
        <div
          className={css(styles.signUpButton)}
          onClick={() => {
            setForgetPasswordEmail('');
            setIsModalVisible(false);
          }}
        >
          Back to Log In
          <span className={css(styles.signUpBar)} />
        </div>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = {
  userLogin,
  userSignUp,
  userResetState,
  userRequestResetPassword,
};

const mapStateToProps = (state) => {
  const { loginLoading, signUpLoading, signUpError, requestPasswordLoading } =
    state.user;

  return {
    loginLoading,
    signUpLoading,
    signUpError,
    requestPasswordLoading,
  };
};

MobileLogin.propTypes = {
  loginLoading: PropTypes.bool,
  signUpLoading: PropTypes.bool,
  signUpError: PropTypes.bool,
  userLogin: PropTypes.func,
  userSignUp: PropTypes.func,
  userResetState: PropTypes.func,
  requestPasswordLoading: PropTypes.bool,
  userRequestResetPassword: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileLogin);
