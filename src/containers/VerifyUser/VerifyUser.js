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

/*
 * Verify User
 *
 * Verifies previously signup user
 */
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Component } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

import TitleHelmet from 'components/TitleHelmet';
import { Button, Input } from 'containers/components';
import { validatePassword as vPass } from 'containers/utils';
import { loadAuth } from 'reducers/login';
import { loadResetPassword } from 'reducers/resetpasswordsignup';
import { loadToken } from 'reducers/verify';
import NotFoundPage from 'containers/NotFoundPage';
import Footer from './Footer';
import Header from './Header';
import './style.scss';
import verifyUserStyles from './styles';

class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidSecond: undefined,
      userName: undefined,
      invalid: undefined,
      capital: undefined,
      small: undefined,
      special: undefined,
      digit: undefined,
      length: undefined,
      name: undefined,
      firstPass: undefined,
      secondPass: undefined,
      invalidUrl: undefined,
    };
  }

  componentDidMount() {
    const { onVerifyLoad } = this.props;
    const search = window?.location?.search;
    const queryParamsObj = queryString.parse(search);

    if (
      Object.hasOwn(queryParamsObj, 'token') &&
      queryParamsObj['token'] != ''
    ) {
      onVerifyLoad(queryParamsObj);
    } else {
      this.setState({
        invalidUrl: true,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    if (
      nextProps.verify &&
      !nextProps.verify.loading &&
      nextProps.verify.error
    ) {
      setTimeout(() => {
        window.open('/', '_self');
      }, 12000);
      return true;
    }
    if (nextProps.passwordresetsignup !== props.passwordresetsignup) {
      const { history, passwordresetsignup } = nextProps;
      if (
        passwordresetsignup &&
        passwordresetsignup.is &&
        passwordresetsignup.finished
      ) {
        props.onLogin(passwordresetsignup.finished.email, this.state.firstPass);
        setTimeout(() => {
          history.push('/');
        }, 500);
      }
    }
    return true;
  }

  resetPassword = () => {
    const { verify, onResetPass } = this.props;
    const { invalid, invalidSecond, userName } = this.state;
    if (invalid || invalidSecond || userName) {
      return;
    }
    if (
      !validator.isEmpty(this.state.firstPass) &&
      !validator.isEmpty(this.state.name) &&
      !validator.isEmpty(this.state.secondPass) &&
      this.state.firstPass === this.state.secondPass
    ) {
      onResetPass(
        this.state.firstPass,
        verify.resetToken.token,
        this.state.name,
      );
    }
  };

  validatePassword = (e) => {
    const { value } = e.target;
    this.setState({ firstPass: value });

    const { hasLower, hasUpper, hasSymbol, hasNumber, lengthGood, valid } =
      vPass(value);

    this.setState({
      small: hasLower,
      capital: hasUpper,
      special: hasSymbol,
      digit: hasNumber,
      length: lengthGood,
      invalid: !valid,
    });

    if (this?.state?.secondPass && this.state.secondPass !== '') {
      this.setState({ invalidSecond: !(this.state.secondPass === value) });
    }
  };

  validatePasswordSecond = (e) => {
    this.setState({
      secondPass: e.target.value,
      invalidSecond: this.state.firstPass !== e.target.value,
    });
  };

  validateUserName = (e) => {
    this.setState({
      userName: !/[a-zA-Z0-9./s]+/.test(e.target.value),
      name: e.target.value,
    });
  };

  render() {
    const {
      resetPassword,
      validatePassword,
      validatePasswordSecond,
      validateUserName,
    } = this;
    const {
      capital,
      digit,
      invalid,
      invalidSecond,
      small,
      special,
      length,
      userName,
      invalidUrl,
    } = this.state;

    const { verify } = this.props;
    const score = [capital, digit, small, special, length].filter(
      Boolean,
    ).length;
    const headerMessage =
      verify && !verify.loading && verify.error
        ? 'Sorry! Your verification link is expired! Please sign-up again to get a new link'
        : 'Congrats! Provide your full name and a password to complete signup to bi(OS)';
    if (invalidUrl) {
      return <NotFoundPage />;
    }
    return (
      <div className="verify-user-page">
        <div className={css(verifyUserStyles.verifyUserSignUpContainer)}>
          <TitleHelmet title="Verify user" />
          <Header message={headerMessage} error={verify.error}></Header>

          {verify && !verify.loading && verify.resetToken !== undefined && (
            <div>
              <div className={css(verifyUserStyles.userDetailsForm)}>
                <div className={css(verifyUserStyles.Row)}>
                  <div className={css(verifyUserStyles.formControl)}>
                    <div className={css(verifyUserStyles.formLabel)}>Name</div>
                    <div className={css(verifyUserStyles.formInputContainer)}>
                      <Input
                        placeholder="Enter full name..."
                        hideSuffix={true}
                        onChange={validateUserName}
                      />
                    </div>
                  </div>
                  <div
                    className={`test_username_error ${css(
                      verifyUserStyles.formError,
                    )}`}
                  >
                    {userName && 'Example John Smith, Jane Doe'}
                  </div>
                </div>

                <div className={css(verifyUserStyles.Row)}>
                  <div className={css(verifyUserStyles.formControl)}>
                    <div className={css(verifyUserStyles.formLabel)}>
                      Password
                    </div>
                    <div
                      className={css(
                        verifyUserStyles.formInputContainer,
                        verifyUserStyles.passwordStrengthControl,
                      )}
                    >
                      <Input
                        placeholder="Enter password..."
                        hideSuffix={true}
                        type="password"
                        size="large"
                        onChange={validatePassword}
                      />
                      <div
                        className={css(
                          verifyUserStyles.passwordStrengthWrapper,
                        )}
                      >
                        {[...Array(4)].map((item, i) => {
                          return (
                            <div
                              className={css(
                                verifyUserStyles.passwordStrengthIndicator,
                                invalid
                                  ? i < 3 && score > i && verifyUserStyles.red
                                  : score > i && verifyUserStyles.green,
                              )}
                              key={i}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`test_password_error ${css(
                      verifyUserStyles.formError,
                    )}`}
                  >
                    {invalid &&
                      `${length ? '' : '8 characters min. '}${
                        small ? '' : 'At least 1 lowercase. '
                      }${capital ? '' : '1 uppercase. '}${
                        digit ? '' : '1 number. '
                      }${special ? '' : '1 special character.'}`}
                  </div>
                </div>

                <div className={css(verifyUserStyles.Row)}>
                  <div className={css(verifyUserStyles.formControl)}>
                    <div className={css(verifyUserStyles.formLabel)}>
                      Re - Password
                    </div>
                    <div className={css(verifyUserStyles.formInputContainer)}>
                      <Input
                        placeholder="Confirm Password"
                        hideSuffix={true}
                        type="password"
                        size="large"
                        onChange={validatePasswordSecond}
                      />
                    </div>
                  </div>
                  <div
                    className={`test_verify_password_error ${css(
                      verifyUserStyles.formError,
                    )}`}
                  >
                    {invalidSecond && 'Both password must match.'}
                  </div>
                </div>

                <div className={css(verifyUserStyles.Row)}>
                  <div className={css(verifyUserStyles.formControl)}>
                    <div className={css(verifyUserStyles.formLabel)}></div>
                    <div className={css(verifyUserStyles.formInputContainer)}>
                      <Button
                        type="primary"
                        disabled={
                          userName === undefined ||
                          userName ||
                          invalid === undefined ||
                          invalid ||
                          invalidSecond === undefined ||
                          invalidSecond
                        }
                        onClick={resetPassword}
                        className={css(verifyUserStyles.button)}
                      >
                        Complete signup to bi(OS)
                      </Button>
                    </div>
                  </div>
                  <div className={css(verifyUserStyles.formError)}></div>
                </div>
                <div className={css(verifyUserStyles.termsAndCondition)}>
                  By clicking complete signup, you agree to the{' '}
                  <a href="https://www.isima.io/terms/" target="_blank">
                    terms and conditions
                  </a>{' '}
                  of{' '}
                  <a href="https://www.isima.io/" target="_blank">
                    Isima
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

VerifyUser.propTypes = {
  verify: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  location: PropTypes.instanceOf(Object),
  passwordreset: PropTypes.instanceOf(Object),
  passwordresetsignup: PropTypes.instanceOf(Object),
  onLogin: PropTypes.func.isRequired,
  onResetPass: PropTypes.func.isRequired,
  onVerifyLoad: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  onLogin: (email, password) => loadAuth(email, password),
  onVerifyLoad: (token) => loadToken(token),
  onResetPass: (password, token, username) =>
    loadResetPassword(password, token, username),
};

const mapStateToProps = ({ verify, passwordresetsignup }) => ({
  verify,
  passwordresetsignup,
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyUser);
