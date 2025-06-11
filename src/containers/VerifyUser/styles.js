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
import { isimaLargeDeviceBreakpoint } from 'app/styles/globalVariable';

const styles = StyleSheet.create({
  controlsPanel: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'none',
    justifyContent: 'normal',
    gridGap: '32px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridTemplateColumns: '400px 115px',
      justifyContent: 'space-between',
    },
  },
  verifyUserSignUpContainer: {
    paddingTop: '50px',
    minHeight: 'calc(100vh - 250px)',
  },
  confirmTickContainer: {
    marginTop: '150px',
    textAlign: 'center',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      marginTop: '100px',
    },
  },
  confirmTickIcon: {
    fontSize: '120px',
  },
  verifiedUserMessage: {
    marginTop: '60px',
    fontSize: '18px',
    color: '#3E3E3C',
    textAlign: 'center',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      margin: '40px 20px',
    },
  },
  userDetailsForm: {
    maxWidth: '815px',
    textAlign: 'center',
    margin: 'auto',
    marginTop: '52px',
  },
  Row: {
    flexDirection: 'column',
    width: '100%',
    display: 'grid',
    marginLeft: '25%',
    gridTemplateColumns: '43% 32%',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridTemplateColumns: '100%',
      marginLeft: '0',
    },
  },
  formControl: {
    display: 'flex',
    marginTop: '26px',
  },
  formInputContainer: {
    width: '100%',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      width: '80%',
      marginLeft: '10%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  formLabel: {
    minWidth: '120px',
    marginTop: '10px',
    fontSize: '12px',
    color: '#706E6B',
    textAlign: 'left',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      display: 'none',
    },
  },
  formError: {
    marginLeft: '28px',
    textAlign: 'left',
    marginTop: '33px',
    fontSize: '10px',
    color: '#ABABAB',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      marginTop: '10px',
      marginLeft: '12%',
      marginRight: '12%',
    },
  },
  termsAndCondition: {
    marginTop: '33px',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      marginLeft: '12%',
      marginRight: '12%',
    },
  },

  passwordStrengthControl: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordStrengthWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, [col-start] minmax(31px, 1fr) [col-end])',
    gridGap: '10px',
    marginTop: '10px',
  },
  passwordStrengthIndicator: {
    background: '#E3E3E3',
    borderRadius: '4px',
    height: '13px',
    transition: 'background 0.5s ease-in-out, background 0.25s',
  },
  green: {
    background: '#72C850',
  },
  red: {
    background: '#941100',
  },

  footer: {
    borderTop: '1px solid #9F9D9B',
    maxWidth: '815px',
    margin: 'auto',
    marginTop: '30px',
    paddingTop: '60px',
    paddingBottom: '60px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#3E3E3C',
  },
});

export default styles;
