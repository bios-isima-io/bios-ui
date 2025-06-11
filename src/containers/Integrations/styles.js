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
  integrationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      display: 'block',
    },
  },
  integrationHeaderActionWrapper: {
    marginTop: '75px',
    display: 'flex',
    ['@media (max-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      position: 'absolute',
      top: '0px',
      right: '20px',
      marginRight: '0px',
      marginTop: '38px',
    },
  },
  headerAnnotationWrapper: {
    marginTop: '1px',
    marginRight: '5px',
  },
  IconInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    background: '#c4c4c4',
    borderRadius: '50%',
    height: '18px',
    width: '18px',
    color: '#ffffff',
    cursor: 'pointer',
  },
  saveIntegrationsButton: {
    marginLeft: '10px',
    marginRight: '15px',
  },
  integrationHeaderInviteUserBtn: {
    marginRight: '0px',
    position: 'relative',
    top: '-2px',
    marginLeft: '15px',
  },

  // right panel subsection
  // right panel header
  actionControlWrapper: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    alignItems: 'center',
    gridGap: '20px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      gridGap: '20px',
    },
  },

  fourColGrid: {
    gridTemplateColumns: 'auto auto auto auto',
  },
  threeColDelete: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 5px',
    paddingTop: '10px',
    paddingBottom: '10px',
    gridGap: '5px',
  },
  twoColAdd: {
    display: 'grid',
    gridTemplateColumns: '120px calc(100% - 120px)',
    paddingTop: '10px',
    paddingBottom: '10px',
    gridGap: '5px',
  },
  // right panel header end

  // right panel subsection
  rightPanelSectionContainer: {
    margin: '14px 0px 10px 0px',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '15px',
  },

  dropdownLabelWrapper: {
    width: '100%',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #bbb',
    background: 'white',
    borderRadius: '5px',
    padding: '0px 12px',
    cursor: 'pointer',

    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  collapsableDiv: {
    marginTop: '20px',
    marginLeft: '18px',
  },
  collapsableWrapper: {
    marginTop: '30px',
  },

  dropdownLabelValue: {
    width: '85%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  rPanelSubSectionRow: {
    display: 'grid',
    gridTemplateColumns: '124px auto',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  rPanelSubSectionRowFilter: {
    display: 'grid',
    gap: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  rPanelSubSectionCol1: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    minWidth: '120px',
    maxWidth: '140px',
  },
  rPanelSubSectionCol1Onboarding: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
  onboardingIntegrationTitle: {
    fontSize: '12px',
    fontWeight: 700,
  },
  rPanelSubSectionCol2TextOnboarding: {
    paddingLeft: '12px',
    paddingTop: '8px',
    paddingBottom: '9px',
    color: '#878787',
  },
  rPanelSubSectionCol2TextOnboardBootstrap: {
    paddingLeft: '12px',
    paddingTop: '9px',
    paddingBottom: '9px',
    marginBottom: '9px',
    color: '#878787',
  },
  rPanelSubSectionCol2Text: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rPanelSubSectionKey: {
    color: '#706E6B',
    fontSize: '12px',
    marginTop: '10px',
  },
  rPanelSubHeader: {
    color: '#706E6B',
    fontSize: '12px',
    fontWeight: 600,
    marginTop: '20px',
  },
  rPanelSubHeaderCol1: {
    marginTop: '20px',
  },
  inputWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px',
  },
  inputDeleteIcon: {
    marginTop: '2px',
    marginLeft: '5px',
    fontSize: '24px',
    ['@media (min-width: ' + isimaLargeDeviceBreakpoint + ')']: {
      marginTop: '0px',
      marginLeft: '0px',
      marginRight: '-25px',
      transform: 'translateX(10px)',
      cursor: 'pointer',
    },
  },
  // end right panel subsection

  editButton: {
    cursor: 'pointer',
  },
  toggleContainer: {
    paddingLeft: '10px',
  },
  addSourceBtn: {
    position: 'absolute',
    top: '0px',
    right: '-55px',
  },
  relativePosition: {
    position: 'relative',
    maxWidth: 'calc(100% - 60px)',
  },
  relativePositionOnboarding: {
    position: 'relative',
  },
  plus: {
    fontSize: '24px',
    top: '-2px',
    position: 'relative',
  },

  // Kafka source specific
  bootStrapServerContainer: {
    fontSize: '12px',
    marginTop: '10px',
  },
});

export default styles;
