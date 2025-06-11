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

const commonStyles = StyleSheet.create({
  // Layout related style
  pageContentWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mobileContentWrapper: {
    padding: '0px 20px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      padding: '0px',
    },
  },
  pageContent: {
    height: '100%',
    width: 'calc(100%)',
    maxWidth: '1000px',
  },
  contentPanel: {
    maxWidth: '100%',
    background: '#FFFFFF',
    borderRadius: '5px',
    // minHeight: 'calc(100vh - 200px)',
    padding: '8px 0px 12px 0px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      marginTop: '28px',
      padding: '32px 0px 32px 0px',
    },
  },
  // General reusable style
  centerPosition: {
    //Position absolute is added to handle situation
    // when container height is not explicitly defined
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  menuWrapper: {
    background: '#E9E9E9',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  leftSectionItemWrapper: {
    display: 'grid',
    gridTemplateColumns: '100px 150px 150px',
    gridGap: '20px',
    marginBottom: '30px',
    alignItems: 'center',
    minHeight: '38px',
    textAlign: 'left',
  },
  leftSectionRowWrapper: {
    display: 'grid',
    gridTemplateColumns: 'auto max-content',
  },
  // Used for icons in enriched attribute list items
  iconWrapper: {
    display: 'grid',
    justifyContent: 'flex-end',
    gridTemplateColumns: '20px 20px',
    gridGap: '20px',
  },
  disabled: {
    pointerEvents: 'none',
    opacity: '0.4',
  },
  dragPanel: {
    height: '250px',
    border: '1px dashed #DDDDDD',
    background: '#F5F6F7',
    width: '100%',
    margin: '0 auto',
    borderRadius: '5px',
  },
  dragPanelDescription: {
    color: '#706E6B',
    fontSize: '12px',
    marginTop: '25px',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  inactiveStatus: {
    width: '15px',
    height: '15px',
    background: 'grey',
    borderRadius: '50%',
  },
});

export default commonStyles;
