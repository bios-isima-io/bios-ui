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
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Dropdown, Menu } from 'antdlatest';
import { AuthLogin } from 'containers/Integrations/components/Auth';
import {
  AUTH_TYPE_HTTP_AUTH_HEADER,
  AUTH_TYPE_HTTP_HEADER_PLAIN,
  AUTH_TYPE_INMESSAGE,
  AUTH_TYPE_LOGIN,
} from 'containers/Integrations/const';
import styles from 'containers/Integrations/styles';
import { biosDestinationIntegrationActions } from './reducers';

const { setBiosDestinationIntegration } = biosDestinationIntegrationActions;
function BiosDestination({
  destAuthType,
  key1,
  key2,
  value1,
  value2,
  setBiosDestinationIntegration,
  integrationType,
}) {
  const setData = (key, value) => {
    setBiosDestinationIntegration({ [key]: value, hasChanges: true });
  };
  const resetAuthData = (authType, value1, value2) => {
    switch (authType) {
      case 'Login':
        setBiosDestinationIntegration({
          key1: 'user',
          key2: 'password',
          value1,
          value2,
          destAuthType: 'Login',
        });
        break;
      case 'InMessage':
        setBiosDestinationIntegration({
          key1: 'inMessageUserAttribute',
          key2: 'inMessagePasswordAttribute',
          value1,
          value2,
          destAuthType: 'InMessage',
        });
        break;
      case 'HttpHeadersPlain':
        setBiosDestinationIntegration({
          key1: 'userHeader',
          key2: 'passwordHeader',
          value1,
          value2,
          destAuthType: 'HttpHeadersPlain',
        });
        break;
      case 'HttpAuthorizationHeader':
        setBiosDestinationIntegration({
          key1: '',
          key2: '',
          value1,
          value2,
          destAuthType: 'HttpAuthorizationHeader',
        });
        break;
      default:
        break;
    }
  };

  const biosAuthMenu =
    integrationType === 'Webhook' ? (
      <Menu
        onClick={(val) => {
          setData('destAuthType', val?.key);
          resetAuthData(val?.key, '', '');
        }}
      >
        <Menu.Item key={AUTH_TYPE_LOGIN}>{AUTH_TYPE_LOGIN}</Menu.Item>
        <Menu.Item key={AUTH_TYPE_INMESSAGE}>{AUTH_TYPE_INMESSAGE}</Menu.Item>
        <Menu.Item key={AUTH_TYPE_HTTP_HEADER_PLAIN}>
          {AUTH_TYPE_HTTP_HEADER_PLAIN}
        </Menu.Item>
        <Menu.Item key={AUTH_TYPE_HTTP_AUTH_HEADER}>
          {AUTH_TYPE_HTTP_AUTH_HEADER}
        </Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={(val) => setData('destAuthType', val?.key)}>
        <Menu.Item key={AUTH_TYPE_LOGIN}>{AUTH_TYPE_LOGIN}</Menu.Item>
      </Menu>
    );

  return (
    <div>
      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Type</div>
        <div>
          <Dropdown overlay={biosAuthMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>{destAuthType === null ? '' : destAuthType}</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>
      </div>

      {[
        AUTH_TYPE_INMESSAGE,
        AUTH_TYPE_HTTP_HEADER_PLAIN,
        AUTH_TYPE_LOGIN,
      ].includes(destAuthType) && (
        <AuthLogin
          key1={key1}
          key2={key2}
          value1={value1}
          value2={value2}
          setIntegrationData={setData}
        />
      )}
    </div>
  );
}

BiosDestination.propTypes = {
  setBiosDestinationIntegration: PropTypes.func,
  destAuthType: PropTypes.string,
  key1: PropTypes.string,
  key2: PropTypes.string,
  value1: PropTypes.string,
  value2: PropTypes.string,
  integrationType: PropTypes.string,
  existingDestination: PropTypes.string,
};

const mapDispatchToProps = {
  setBiosDestinationIntegration,
};

const mapStateToProps = (state) => {
  const { destAuthType, key1, key2, value1, value2, existingDestination } =
    state?.integration?.biosDestination;

  const { integrationType } = state?.integration?.integrationConfig;

  return {
    destAuthType,
    key1,
    key2,
    value1,
    value2,
    integrationType,
    existingDestination,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BiosDestination);
