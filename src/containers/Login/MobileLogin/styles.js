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
import { StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  wrapper: {
    padding: '45px 30px 20px 30px',
    display: 'grid',
    flexDirection: 'column',
    gridTemplateRows: '55px auto 200px',
    height: '100vh',
    boxSizing: 'border-box',
    background: '#FFFFFF',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
  },
  logoImage: {
    width: '125px',
    height: '53px',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formLabel: {
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#1D1D1D',
    fontSize: '20px',
  },
  passwordFieldWrapper: {
    marginBottom: '25px',
    position: 'relative',
  },
  passwordField: {
    width: '100%',
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
  passwordEyeIcon: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    cursor: 'pointer',
  },
  emailHelper: {
    color: '#A2A2A2',
    fontSize: '12px',
    paddingLeft: '12px',
  },
  forgetPasswordLink: {
    display: 'inline-block',
    float: 'right',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  signUpHelper: {
    color: '#A2A2A2',
    fontSize: '12px',
    marginBottom: '15px',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '38px',
    borderRadius: '5px',
    backgroundColor: 'rgb(43, 40, 38)',
    borderColor: 'rgb(43, 40, 38)',
    color: 'rgb(214, 214, 214)',
    width: '146px',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '18px',
  },
  requestRestLinkButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '38px',
    borderRadius: '5px',
    backgroundColor: 'rgb(43, 40, 38)',
    borderColor: 'rgb(43, 40, 38)',
    color: 'rgb(214, 214, 214)',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '18px',
  },
  loginBar: {
    position: 'relative',
    height: '1px',
    width: '26px',
    background: '#FFFFFF',
    marginLeft: '10px',
  },
  signUpButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    width: '146px',
    height: '50px',
    color: '#000000',
    fontWeight: '600',
    fontSize: '14px',
  },
  signUpBar: {
    position: 'relative',
    height: '1px',
    width: '26px',
    background: '#000000',
    marginLeft: '10px',
  },
  bottomBar: {
    background: '#000000',
    height: '5px',
    width: '135px',
    marginTop: '30px',
  },
  signupSuccess: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  labelOne: {
    fontWeight: '600',
    marginBottom: '10px',
    marginTop: '25px',
  },
  labelTwo: {
    fontSize: '12px',
    color: '#A2A2A2',
  },
  circularLoader: {
    display: 'flex',
    alignItems: 'center',
    width: '26px',
    height: '26px',
    transform: 'scale(0.25)',
  },
  forgetPasswordInput: {
    marginBottom: '25px',
    padding: '4px 10px',
    color: '#706E6B',
    fontSize: '14px',
    border: '1px solid rgb(118, 118, 118)',
    width: '100%',
    ':focus': {
      outline: 'none',
    },
  },
  forgetPasswordLabel: {
    fontSize: '12px',
    color: '#A2A2A2',
  },
});

export default styles;
