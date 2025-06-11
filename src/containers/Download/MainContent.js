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
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { css } from 'aphrodite';
import commonStyles from 'app/styles/commonStyles';
import TitleHelmet from 'components/TitleHelmet';
import config from 'config';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import { PageTitle, Tabs } from 'containers/components';
import { getAccessibleTabs } from './utils';
import styles from './styles';
import InviteFlowButton from 'components/InviteFlowButton';
import { downloadActions } from './reducers';
import { INVITE_USERS } from './const';

const { userClicks } = ipxl;

const { setRightPanelActive, setRightPanelType } = downloadActions;

const MainContent = ({
  history,
  roles,
  loading,
  setRightPanelActive,
  setRightPanelType,
  rightPanelActive,
}) => {
  const createLinkAndDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const makeImageUrl = (dockerName) =>
    `${config.backend}/downloads/${dockerName}.tar.gz`;

  const downloadDockerImage = (dockerName) => {
    createLinkAndDownload(makeImageUrl(dockerName));
  };

  const getContent = (dockerName, makeInstruction) => {
    let commitHash = '';
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.REACT_APP_GIT_SHA
    ) {
      commitHash = process.env.REACT_APP_GIT_SHA;
    }

    return (
      <div className={css(styles.downloadCommon)}>
        <div commit-hash={commitHash} />
        <div className={css(styles.centering)}>
          <Tooltip title="Click to download docker image">
            <i
              className={`icon-download ${css(styles.icon)}`}
              onClick={() => {
                downloadDockerImage(dockerName);
                userClicks({
                  pageURL: history?.location?.pathname,
                  pageTitle: document.title,
                  pageDomain: window?.location?.origin,
                  eventLabel: `Docker Download - ${dockerName}`,
                  rightSection: 'None',
                  mainSection: 'download',
                  leftSection: 'download',
                });
              }}
            >
              <span className="path1" />
              <span className="path2" />
              <span className="path3" />
              <span className="path4" />
            </i>
          </Tooltip>
          <div className={css(styles.mt20)}>
            <a href={makeImageUrl(dockerName)}>
              Download the {dockerName} docker image to talk to bi(OS)
            </a>
          </div>
          <div className={css(styles.assistanceText)}>
            If you need any assistance with the setup do write to us on{' '}
            <u>imagine@isima.io</u>
          </div>
        </div>
        <div className={css(styles.followUpStepHeading)}>
          What's next after downloading?{' '}
        </div>
        <div className={css(styles.stepTitle)}>Step 1</div>
        <div
          className={css(styles.stepText, styles.lineSpacing)}
        >{`gunzip -c ${dockerName}.tar.gz | docker load`}</div>
        <div className={css(styles.instructions)}>
          <div>
            After successful loading, you should see a message like this:
          </div>
          <div className={css(styles.codeInstruction, styles.lineSpacing)}>
            Loaded image: us.gcr.io/bios-eng/{dockerName}:
            <span
              style={{
                color: 'rgb(0, 82, 204)',
              }}
            >
              &lt;TAG&gt;
            </span>
          </div>
          <div className={css(styles.lineSpacing)}>
            Please note the &lt;TAG&gt; at the end of the message, highlighted
            in blue above
          </div>
        </div>
        {makeInstruction(dockerName)}
      </div>
    );
  };

  if (loading) {
    return null;
  }

  if (!roles) {
    return <div>Error</div>;
  }

  let accessibleTabs = getAccessibleTabs(roles, getContent);

  const headerActions = () => {
    return (
      <InviteFlowButton
        onButtonClick={() => {
          if (rightPanelActive) {
            setRightPanelActive(false);
            setRightPanelType('');
          } else {
            setRightPanelActive(true);
            setRightPanelType(INVITE_USERS);
          }
        }}
      />
    );
  };

  return (
    <div className={css(commonStyles.pageContentWrapper)}>
      <div className={css(commonStyles.pageContent)}>
        <TitleHelmet title="Download" />
        <PageTitle label="Download" actions={headerActions} />
        <div className={css(styles.tabContentWrapper)}>
          <Tabs tabsConfig={accessibleTabs} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authMe } = state.authMe || {};
  const { roles, loading } = authMe || {};

  const { rightPanelActive } = state?.download;
  return { roles, loading, rightPanelActive };
};

const mapDispatchToProps = { setRightPanelActive, setRightPanelType };

MainContent.propTypes = {
  roles: PropTypes.array,
  loading: PropTypes.bool,
  rightPanelActive: PropTypes.bool,
  setRightPanelActive: PropTypes.func,
  setRightPanelType: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
