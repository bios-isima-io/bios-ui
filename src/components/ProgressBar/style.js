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
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottom: '1px solid #E0E0E0',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      paddingTop: '70px',
    },
  },
  progressbar: {
    display: 'flex',
    counterReset: 'step',
    marginBottom: '0px',
    width: '100%',
    paddingInlineStart: '0px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      width: '1000px',
      marginTop: '10px',
      marginLeft: '0px',
    },
  },
  progressbarItem: {
    listStyleType: 'none',
    position: 'relative',
    textAlign: 'center',
    float: 'left',
    zIndex: '10',
    flexBasis: '100%',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      height: '120px',
    },

    ':before': {
      content: 'Counter(step)',
      counterIncrement: 'step',
      width: '24px',
      height: '24px',
      lineHeight: '22px',
      border: '1px solid #727272',
      display: 'block',
      textAlign: 'center',
      borderRadius: '50%',
      margin: '0 auto 20px auto',
      backgroundColor: '#F5F6F7',
    },

    ':after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '1px',
      backgroundColor: '#727272',
      top: '12px',
      left: '-50%',
      zIndex: '-20',
      marginLeft: '12px',
    },

    ':first-child': {
      ':after': {
        content: 'none',
      },
    },
  },

  active: {
    paddingBottom: '20px',
    ':before': {
      color: 'white',
      backgroundColor: 'black',
    },
  },
  activeUnderline: {
    borderBottom: '3px solid black',
  },
  stepHidden: {
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      display: 'none',
    },
  },
});

export default styles;
