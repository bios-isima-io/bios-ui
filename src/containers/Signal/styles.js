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

// Note: this style file is common for signal and context homepage
import { StyleSheet } from 'aphrodite';
import { isimaLargeDeviceBreakpoint } from 'app/styles/globalVariable';

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '95px',
    alignItems: 'center',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      justifyContent: 'space-between',
      paddingTop: '65px',
    },
  },
  paddingLeft: {
    paddingLeft: '0px',
  },
  headertext: {
    color: '#2B2826',
    fontSize: '36px',
  },
  headerAction: {
    position: 'absolute',
    right: '30px',
    top: '40px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      position: 'relative',
      right: 'auto',
      top: 'auto',
    },
  },
  controlsPanel: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'none',
    justifyContent: 'normal',
    gridGap: '24px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridTemplateColumns: '400px 115px',
      justifyContent: 'space-between',
      gridGap: '32px',
    },
  },
  leftSection: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'normal',
    gridTemplateColumns: 'none',
    gridGap: '12px',
    order: '1',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridTemplateColumns: '281px 190px',
      justifyContent: 'space-between',
      order: '0',
    },
  },
  dropdownLabelWrapper: {
    width: '100%',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid rgb(221, 221, 221)',
    background: 'transparent',
    borderRadius: '5px',
    padding: '0px 12px',
    cursor: 'pointer',
  },
  leftSectionItemWrapper: {
    display: 'grid',
    gridTemplateColumns: '100px 120px 150px',
    gridGap: '20px',
    marginBottom: '30px',
    alignItems: 'center',
    minHeight: '38px',
    textAlign: 'left',
  },
  twoColGrid: {
    gridTemplateColumns: 'auto auto',
  },
  actionControlWrapper: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto',
    alignItems: 'center',
    gridGap: '20px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridGap: '30px',
    },
  },
  activeSetting: {
    background: '#2B2826',
    padding: '9px 14px',
    borderRadius: '5px',
    ':before': {
      color: '#ffffff',
    },
  },
  inactiveSetting: {
    background: 'transparent',
    padding: '9px 14px',
    borderRadius: '5px',
  },
});

export default styles;
