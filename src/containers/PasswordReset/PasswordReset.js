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
 * Password Reset for already created user
 *
 * Let's you reset password of user
 */
import { Button, Input } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import TitleHelmet from 'components/TitleHelmet';
import { validatePassword as vPass } from 'containers/utils';
import { loadResetUserPassword } from 'reducers/resetpassword';
import './style.scss';

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidSecond: undefined,
      invalid: undefined,
      capital: undefined,
      small: undefined,
      special: undefined,
      digit: undefined,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    if (nextProps.passwordreset !== props.passwordreset) {
      const { history, passwordreset } = nextProps;
      if (passwordreset && passwordreset.is) {
        history.push('/login');
      }
    }
    return true;
  }

  resetPassword = () => {
    const { onResetPass } = this.props;
    const { invalid, invalidSecond } = this.state;
    if (invalid || invalidSecond) {
      return;
    }
    const {
      location: { search },
    } = this.props;
    const { token } = queryString.parse(search);
    if (token) {
      onResetPass(this.firstPass.state.value, token);
    }
  };

  validatePassword = () => {
    const result = vPass(this.firstPass.state.value);
    this.setState({
      small: result.hasLower,
      capital: result.hasUpper,
      special: result.hasSymbol,
      digit: result.hasNumber,
      invalid: !result.valid,
    });
  };

  validatePasswordSecond = () => {
    this.setState({
      invalidSecond: this.firstPass.state.value !== this.secondPass.state.value,
    });
  };

  render() {
    const { resetPassword, validatePassword, validatePasswordSecond } = this;
    const { invalid, small, capital, special, digit, invalidSecond } =
      this.state;
    return (
      <div className="password-reset-page">
        <TitleHelmet title="User verified password reset" />
        <div className="page-content">
          <Link to="">
            Please provide a new password to reset password to our system:
          </Link>
          <span className="page-item">
            <Input
              ref={(ref) => {
                this.firstPass = ref;
              }}
              type="password"
              size="large"
              onKeyUp={validatePassword}
              className="page-item"
              placeholder="New password"
            />
            <Button
              type="danger"
              className={classNames({
                error: invalid === true,
                'no-error': !invalid,
              })}
            >
              {`8 characters min${small ? '' : '. At least 1 lowercase'}${
                capital ? '' : ', 1 uppercase'
              }${digit ? '' : ', 1 number'}${
                special ? '' : ', and 1 special character'
              }.`}
            </Button>
          </span>
          {invalid === false && (
            <span className="page-item">
              <Input
                ref={(ref) => {
                  this.secondPass = ref;
                }}
                type="password"
                size="large"
                onKeyUp={validatePasswordSecond}
                className="page-item"
                placeholder="New password again"
              />
              <Button
                type="danger"
                className={classNames({
                  error: invalidSecond === true,
                  'no-error': !invalidSecond,
                })}
              >
                Both password must match.
              </Button>
            </span>
          )}
          {invalidSecond === false && invalid === false && (
            <Button
              type="primary"
              ghost
              className="page-item"
              size="large"
              onClick={resetPassword}
            >
              Reset Password
            </Button>
          )}
        </div>
      </div>
    );
  }
}

PasswordReset.propTypes = {
  history: PropTypes.instanceOf(Object),
  passwordreset: PropTypes.instanceOf(Object),
  location: PropTypes.instanceOf(Object),
  onResetPass: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  onResetPass: (password, token) => loadResetUserPassword(password, token),
};

const mapStateToProps = ({ passwordreset }) => ({ passwordreset });

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
