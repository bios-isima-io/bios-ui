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

/*
 * Attributes page
 *
 * Let you list, add delete update attributes.
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Input, Button } from 'antd';
import PageTitle from 'components/PageTitle';
import './style.scss';

const ChangePassword = () => {
  // Since state and props are static,
  // there's no need to re-render this component
  const rowStyle = {
    padding: '1rem 0',
  };

  const notStrongStyle = {
    display: 'inline-block',
    height: '.8rem',
    width: '3.4rem',
    backgroundColor: '#e3e3e3',
    borderRadius: '3px',
    margin: '.5rem .1rem',
  };

  const strongStyle = {
    display: 'inline-block',
    height: '.8rem',
    width: '3.4rem',
    backgroundColor: 'linear-gradient(0deg, #2EBA33, #2EBA33)',
    borderRadius: '3px',
    margin: '.5rem .1rem',
  };

  return (
    <div className="changepassword">
      <Helmet>
        <title>Change Password</title>
        <meta name="description" content="Change Password" />
      </Helmet>
      <div className="content page">
        <PageTitle text="Change Password" />
        <Row style={rowStyle}>
          <Col span={4}>
            <h3>Old password</h3>
          </Col>
          <Col span={5}>
            <Input size="large" />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={4}>
            <h3>New password</h3>
          </Col>
          <Col span={5}>
            <Input size="large" />
            <span style={notStrongStyle} />
            <span style={notStrongStyle} />
            <span style={notStrongStyle} />
            <span style={notStrongStyle} />
            <span style={notStrongStyle} />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={4}>
            <h3>Confirm new password</h3>
          </Col>
          <Col span={5}>
            <Input size="large" />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col span={9} style={{ textAlign: 'right', padding: '2rem 0' }}>
            <Button type="primary" ghost size="large">
              Cancel
            </Button>
            <Button type="primary" size="large" style={{ marginLeft: '1rem' }}>
              Update
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChangePassword;
