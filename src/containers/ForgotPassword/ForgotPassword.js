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
 * Forgot Password
 *
 * Forgot page for password of your ISIMA Account.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button, Input } from 'antd';
import './style.scss';
import { loadForgot } from 'reducers/forgot';
import classNames from 'classnames';
import validator from 'validator';
import PropTypes from 'prop-types';
import TitleHelmet from '../../components/TitleHelmet';

class ForgotPassword extends Component {
  // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component

  constructor(props) {
    super(props);
    this.state = {
      isMail: undefined,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    if (nextProps.forgot !== props.forgot) {
      const { forgot, history } = nextProps;
      if (forgot && forgot.is) {
        history.push('/postforgot');
      }
    }
    return true;
  }

  validateMail = (email) => {
    const isMail = validator.isEmail(email);
    this.setState({ isMail });
    return isMail;
  };

  onForgot = () => {
    const { email } = this;
    if (!this.validateMail(email.state.value)) {
      return;
    }
    if (
      email.state.value &&
      !validator.isEmpty(email.state.value) &&
      validator.isEmail(email.state.value)
    ) {
      const { onLoadForgot } = this.props;
      onLoadForgot(email.state.value);
    }
  };

  clearInvalidEmail = () => {
    const { isEmail } = this.state;
    if (isEmail === false) {
      this.setState({ isEmail: undefined });
    }
  };

  render() {
    const { isMail } = this.state;
    const { clearInvalidEmail } = this;
    return (
      <div className="forgot-password-page">
        <TitleHelmet title="Forgot Password" />
        <div className="content page center-page">
          <Link to="">
            Forgot your password? No worries! Provide your email address below
            and we will send a verification link to your inbox. Click on the
            link to be verified!
          </Link>
          <span className="page-item">
            <Input
              onChange={clearInvalidEmail}
              type="email"
              ref={(ref) => {
                this.email = ref;
              }}
              size="large"
              className={classNames('page-item', { error: isMail === false })}
              placeholder="Email address"
            />
          </span>
          <Button
            type="primary"
            ghost
            className="page-item"
            size="large"
            onClick={this.onForgot}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  history: PropTypes.instanceOf(Object),
  forgot: PropTypes.instanceOf(Object),
  onLoadForgot: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  onLoadForgot: (email) => loadForgot(email),
};

const mapStateToProps = ({ forgot }) => ({ forgot });

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
