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
import React, { useEffect } from 'react';
import loginUI from './isima-esl';
import config from '../../config';
import TitleHelmet from '../../components/TitleHelmet';
import face from './face.svg';
import FullLogo from '../../components/FullLogo';
import { Carousel, Col, Row } from 'antd';
import experiencebios from './experiencebios.svg';
import onebios from './onebios.svg';
import boom from './boom.svg';
import SVGIcon from '../../components/SVGIcon';
import './style.scss';
import './isima-esl.scss';

const DesktopLogin = ({ history }) => {
  useEffect(() => {
    loginUI.isimaLoginUI(config.backend, history);
    loginUI.isimaTestimonial();
    // TODO: This is a temporary fix so that it does not effect other page vertical scroll.
    //  This page scroll should be fixed properly for this page
    document.getElementsByTagName('html')[0].classList.add('login-html');
    // on unmount remove class for scroll.
    return () => {
      document.getElementsByTagName('html')[0].classList.remove('login-html');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-page">
      <TitleHelmet title="Login" />
      <img className="face" src={face} alt="" />
      <a
        aria-label="isima.io web url"
        href="https://isima.io"
        rel="noopener noreferrer"
      >
        <FullLogo className="page-item logo" color="#000" />
      </a>
      <Row
        gutter={23}
        type="flex"
        style={{ alignItems: 'center', justifyContent: 'left' }}
      >
        <Col xs={24} md={24} lg={12} xl={12}>
          <Carousel autoplay>
            <div>
              <img width="100%" src={experiencebios} alt="" />
            </div>
            <div>
              <img width="100%" src={onebios} alt="" />
            </div>
            <div>
              <img width="100%" src={boom} alt="" />
            </div>
          </Carousel>
        </Col>
        <Col xs={24} md={24} lg={12} xl={12}>
          <div
            className="right-pan"
            style={{
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ margin: '1rem 0' }} id="esl-login-signup-wrapper" />
            <div id="esl-testimonials-wrapper" />
          </div>
        </Col>
      </Row>
      <footer>
        <a href="https://twitter.com/isimaio">
          <SVGIcon
            name="Twitter"
            strokeColor="#706E6B"
            width="16"
            height="16"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/isimalabs/about"
          style={{ margin: '0px 20px 0px 25px' }}
        >
          <SVGIcon
            name="Linkedin"
            strokeColor="#706E6B"
            width="16"
            height="16"
          />
        </a>
        <span>
          <a href="https://www.isima.io/legal">Legal</a> | Copyright © 2023
          Isima Inc. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default DesktopLogin;
