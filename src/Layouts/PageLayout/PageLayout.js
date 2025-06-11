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
import React, { useEffect, useState } from 'react';
import { css } from 'aphrodite';
import { Tooltip } from 'antdlatest';
import PropTypes from 'prop-types';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import styles from './styles';
import useScrollPercentage from 'common/hooks/useScrollPercentage';
import useFooterPosition from 'common/hooks/useFooterPosition';
import PageProgressBar from 'components/PageProgressBar';
import Footer from 'components/Footer';

const PageLayout = ({
  MainContent,
  RightPanelContent,
  showRightPanel,
  onCollapseAbleClick,
  showCollapsibleAction = false,
}) => {
  const [scrollRef, scrollPercentage, showScrollBottom] = useScrollPercentage();
  const [mainContentRef, showFooterAtBottom] = useFooterPosition();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < isimaLargeDeviceBreakpointNumber,
  );

  const updateDimensions = () => {
    const isMobileRes = window.innerWidth < isimaLargeDeviceBreakpointNumber;
    // if (isMobile !== isMobileRes) {
    setIsMobile(isMobileRes);
    // }
  };

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return function cleanup() {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className={css(styles.pageWrapper)}>
      {showScrollBottom && (
        <PageProgressBar
          scrollPercentage={scrollPercentage}
          scrollRef={scrollRef}
        />
      )}
      <div
        className={`${css(styles.mainSection)} page-main-section`}
        ref={scrollRef}
      >
        <div className={`${css(styles.mainSectionContent)} page-main-content`}>
          <div ref={mainContentRef}>{MainContent && MainContent()}</div>
          <Footer showFooterAtBottom={showFooterAtBottom} />
        </div>
      </div>
      <div className={css(styles.rightWrapper)}>
        {!isMobile && (
          <div className={css(styles.desktopWrapper)}>
            <div
              className={css(
                styles.rightContentWrapper,
                showRightPanel
                  ? styles.showDesktopContent
                  : styles.hideDesktopContent,
              )}
            >
              <div className={css(styles.rightContent)}>
                {RightPanelContent && showRightPanel && RightPanelContent()}
                {showCollapsibleAction && (
                  <Tooltip
                    title={
                      showRightPanel
                        ? 'Collapse right panel'
                        : 'Expand right panel'
                    }
                    placement="left"
                  >
                    <div
                      onClick={() => {
                        onCollapseAbleClick && onCollapseAbleClick();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '23px',
                        height: '70px',
                        cursor: 'pointer',
                        borderRight: '1px solid #D4D4D4',
                        boxShadow: ' 0px 1px 4px rgb(0 0 0 / 30%)',
                        borderRadius: '8px 0px 0px 8px',
                        background:
                          'rgba(255,255,255,1) 7px center/7px 10px no-repeat',
                        position: 'absolute',
                        top: '50%',
                        left: '-22px',
                        zIndex: '1',
                      }}
                    >
                      <span
                        className={
                          showRightPanel
                            ? 'icon-chevron-right'
                            : 'icon-chevron-left'
                        }
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className={css(styles.mobileWrapper)}>
            <div
              className={css(
                styles.rightContentWrapper,
                showRightPanel
                  ? styles.showMobileContent
                  : styles.hideMobileContent,
              )}
            >
              <div className={css(styles.rightContent)}>
                {RightPanelContent && RightPanelContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PageLayout.propTypes = {
  MainContent: PropTypes.instanceOf(Object),
  RightPanelContent: PropTypes.instanceOf(Object),
  showRightPanel: PropTypes.bool,
};

export default PageLayout;
