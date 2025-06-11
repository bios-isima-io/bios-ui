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
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LeftSectionText from '../components/LeftSection/LeftSection';
import {
  requestResetLinkValidationNew,
  signInValidationNew,
} from 'containers/Login/MobileLogin/utils';
import {
  userLogin,
  userRequestResetPassword,
  userRequestResetPasswordFailure,
  userLoginFailure,
} from 'containers/Login/actions';
import Footer from 'containers/Website/components/Footer';
import { SIGNUP } from 'containers/Website/const';
import './styles.scss';

function LoginContent({
  userLogin,
  userLoginFailure,
  loginFailureMessage,
  loginStatus,
  userRequestResetPassword,
  userRequestResetPasswordFailure,
  requestPasswordStatus,
  requestPasswordFailureMessage,
}) {
  const { search, state } = useLocation();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [sid, setSid] = useState('');

  useEffect(() => {
    const queryParamsObj = queryString.parse(search);
    if (queryParamsObj['sid']) {
      setSid(queryParamsObj['sid']);
    }
  }, [search]);

  useEffect(() => {
    setForgetPasswordEmail('');
  }, [showPasswordReset]);

  const signIn = () => {
    signInValidationNew(email, password, userLoginFailure) &&
      userLogin({
        email,
        password,
        history,
        sid,
        redirectTo: state?.from?.pathname,
      });
  };

  const requestResetLink = () => {
    if (
      requestResetLinkValidationNew(
        forgetPasswordEmail,
        userRequestResetPasswordFailure,
      )
    ) {
      setForgetPasswordEmail('');
      userRequestResetPassword({
        email: forgetPasswordEmail,
      });
    }
  };

  return showPasswordReset ? (
    <div className="forget-password-content">
      <div className="left-content">
        <LeftSectionText />
      </div>
      <div className="right-content">
        <div className="fgt-ps-text">Forgot Password?</div>

        <div className="right-content-form">
          <div className="fgt-ps-message">
            No worries! Provide your registered business email address below and
            we will send you a password reset link.
          </div>

          <div className="login-email-text">Enter your work email</div>
          <div>
            <input
              type="email"
              placeholder="Enter your work email"
              required="required"
              id="username"
              onChange={(event) => {
                setForgetPasswordEmail(event?.target?.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  requestResetLink();
                }
              }}
            ></input>
          </div>

          <div className="login-button headerCtaBtn" onClick={requestResetLink}>
            <span className="button waves-effect waves-red header-button">
              Request reset link
            </span>
          </div>
          {requestPasswordStatus === 'success' && (
            <p className="password-reset-mail-sent">
              Password reset email sent.
            </p>
          )}
          {requestPasswordStatus === 'failure' && (
            <p className="password-reset-mail-failed">
              {requestPasswordFailureMessage
                ? requestPasswordFailureMessage
                : 'Failed sending password reset email. Please try again.'}
            </p>
          )}

          <div
            className="go-to-login"
            onClick={() => {
              setShowPasswordReset(false);
            }}
          >
            Back to login
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="login-content">
      <div className="left-content">
        <LeftSectionText />
      </div>
      <div className="right-content">
        <div className="login-text">Login</div>

        {loginStatus === 'success' && (
          <p className="log-in-message-success">Logged in successfully.</p>
        )}

        <p className="log-in-message-failed">
          {loginStatus === 'failure' && (
            <>
              <img
                src="https://www.isima.io/wp-content/uploads/Error-Warning.svg"
                alt="warning-icon"
              />
              {loginFailureMessage
                ? loginFailureMessage
                : 'The password or the email is incorrect.'}
            </>
          )}
        </p>

        <div className="login-email-text">Enter your work email</div>
        <div>
          <input
            type="email"
            placeholder="Enter your work email"
            required="required"
            id="username"
            onChange={(event) => {
              setEmail(event?.target?.value);
            }}
          ></input>
        </div>
        <div className="login-password-text">Enter your password</div>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            required="required"
            onChange={(event) => {
              setPassword(event?.target?.value);
            }}
          ></input>
          {showPassword ? (
            <img
              src={
                'https://www.isima.io/wp-content/uploads/Password-Eye-Open.svg'
              }
              className="password-input-indicator password-input-indicator-show"
              alt="hide password"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <img
              src={
                'https://www.isima.io/wp-content/uploads/Password-Eye-Closed.svg'
              }
              className="password-input-indicator password-input-indicator-hide"
              alt="show password"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        <div
          className="login-forget-pass-text"
          onClick={() => {
            setShowPasswordReset(true);
          }}
        >
          Forgot password?
        </div>

        <div className="login-button headerCtaBtn">
          <span
            className="button waves-effect waves-red header-button"
            onClick={() => {
              signIn();
            }}
          >
            Login
          </span>
        </div>

        <a href={SIGNUP} className="go-to-login">
          Don't have an account? Sign up
        </a>

        <Footer />
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  userLogin,
  userLoginFailure,
  userRequestResetPassword,
  userRequestResetPasswordFailure,
};

const mapStateToProps = (state) => {
  const {
    loginStatus,
    loginFailureMessage,
    loginLoading,
    requestPasswordLoading,
    requestPasswordStatus,
    requestPasswordFailureMessage,
  } = state.user;

  return {
    loginStatus,
    loginFailureMessage,
    loginLoading,
    requestPasswordLoading,
    requestPasswordStatus,
    requestPasswordFailureMessage,
  };
};

LoginContent.propTypes = {
  loginStatus: PropTypes.string,
  loginFailureMessage: PropTypes.string,
  loginLoading: PropTypes.bool,
  userLogin: PropTypes.func,
  userLoginFailure: PropTypes.func,
  requestPasswordLoading: PropTypes.bool,
  userRequestResetPassword: PropTypes.func,
  userRequestResetPasswordFailure: PropTypes.func,
  requestPasswordStatus: PropTypes.string,
  requestPasswordFailureMessage: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContent);
