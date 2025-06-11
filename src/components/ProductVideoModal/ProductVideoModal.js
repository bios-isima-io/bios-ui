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
import React, { useRef } from 'react';
import { Tooltip } from 'antd';
import SVGIcon from 'components/SVGIcon';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useOnClickOutside } from 'common/hooks';
import { onboardingActions } from '../../reducers/onboarding';

import './ProductVideoModal.scss';

const { showVideoPanel, hideVideoPanel } = onboardingActions;

const chaptersTimeMap = ['0m0s', '9m55s', '11m36s'];

const ProductVideoModal = ({
  showVideo,
  hideVideoPanel,
  showVideoPanel,
  currentChapter,
}) => {
  const ref = useRef();

  useOnClickOutside(ref, () => {
    showVideo && hideVideoPanel();
  });

  const srcUrl = `https://player.vimeo.com/video/440759527#t=${chaptersTimeMap[currentChapter]}?autoplay=1&loop=1&autopause=0`;

  return (
    <div className="onboarding-video-wrapper" ref={ref}>
      <span
        className={`trigger-link${showVideo ? ' active' : ''}`}
        onClick={() => {
          showVideo ? hideVideoPanel() : showVideoPanel();
        }}
      >
        <Tooltip title="Video">
          <span>
            <SVGIcon
              name="YouTube"
              strokeColor={showVideo ? '#FFFFFF' : '#5A5A5A'}
              width="24"
              height="24"
            />
          </span>
        </Tooltip>
      </span>
      {showVideo && (
        <div className="onboarding-video-modal">
          <div className="embed-container">
            <iframe
              src={srcUrl}
              width="640"
              height="316"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  const { onboarding } = state;
  return {
    showVideo: onboarding.showVideo,
    currentChapter: onboarding.currentChapter,
  };
}

const mapDispatchToProps = (dispatch) => ({
  showVideoPanel: () => dispatch(showVideoPanel()),
  hideVideoPanel: () => dispatch(hideVideoPanel()),
});

ProductVideoModal.propTypes = {
  fetchSignals: PropTypes.bool.isRequired,
  showVideoPanel: PropTypes.func.isRequired,
  hideVideoPanel: PropTypes.func.isRequired,
  currentChapter: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductVideoModal);
