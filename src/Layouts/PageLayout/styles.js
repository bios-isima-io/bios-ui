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
import {
  isimaLargeDeviceBreakpoint,
  rightPanelBackgroundColor,
} from 'app/styles/globalVariable';
const isimaSmallDeviceBreakpoint = '1280px'; //This breakpoint needs to be changed and style should rewrite based on mobile first approach

const styles = StyleSheet.create({
  pageWrapper: {
    display: 'flex',
    background: 'white',
    minHeight: '100vh',
  },
  mainSection: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '0px 20px',
    height: '100vh',
    overflowY: 'auto',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      padding: '0px 0px 0px 75px',
    },
  },
  rightWrapper: {
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      position: 'relative',
    },
  },
  mainSectionContent: {
    maxWidth: '1000px',
    width: '100%',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      width: 'calc(100% - 90px)',
    },
  },
  desktopWrapper: {
    ['@media (max-width: ' + isimaSmallDeviceBreakpoint + ')']: {
      display: 'none',
    },
  },
  mobileWrapper: {
    display: 'none',
    ['@media (max-width: ' + isimaSmallDeviceBreakpoint + ')']: {
      display: 'unset',
    },
  },
  rightContentWrapper: {
    ['@media (max-width: ' + isimaSmallDeviceBreakpoint + ')']: {
      width: ' 100%',
      position: 'absolute',
      top: '0',
      right: '0',
      height: '0px',
      ':nth-child(1n) .back-link': {
        paddingLeft: '0px',
      },
      zIndex: '9000',
    },
  },
  showDesktopContent: {
    width: '493px',
    transition: '0.3s ease-in-out all',
  },
  hideDesktopContent: {
    width: '0px',
    transition: '0.3s ease-in-out all',
    overflow: 'hidden',
  },
  showMobileContent: {
    ['@media (max-width: ' + isimaSmallDeviceBreakpoint + ')']: {
      height: '100%',
      transform: 'translateX(0)',
      transition: 'all 0.3s ease-in-out',
    },
  },
  hideMobileContent: {
    width: '0',
    overflow: 'hidden',
    transform: 'translateX(100%)',
    transition: 'all 0.3s ease-in-out',
  },
  rightContent: {
    width: '493px',
    borderLeft: '1px solid #E0E0E0',
    paddingRight: '45px',
    paddingLeft: '45px',
    height: '100vh',
    backgroundColor: rightPanelBackgroundColor,
    overflow: 'scroll',
    ['@media (max-width: ' + isimaSmallDeviceBreakpoint + ')']: {
      borderLeft: 'none',
      paddingRight: '20px',
      paddingLeft: '20px',
      width: '100%',
      boxSizing: 'border-box',
    },
  },
});

export default styles;
