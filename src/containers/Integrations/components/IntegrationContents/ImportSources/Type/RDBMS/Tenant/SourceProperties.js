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
import { useEffect } from 'react';

import SwitchWrapper from 'components/Switch';
import { Input } from 'containers/components';
import InputPassword from 'containers/components/Input/InputPassword';
import {
  FIELD_FOR_IMPORT_SRC_RDBMS,
  INTEGRATION_TYPE_MYSQL_CDC,
  INTEGRATION_TYPE_MYSQL_PULL,
  INTEGRATION_TYPE_POSTGRES_CDC,
} from 'containers/Integrations/const';
import styles from 'containers/Integrations/styles';
import { RenderUneditableText } from 'containers/Onboarding/ImportSources/helperComponent';
import { removeObjectKey } from 'utils/index';

function SourceProperties({
  srcUser,
  srcPassword,
  setRdbmsData,
  setSSLMode,
  databaseHost,
  databasePort,
  databaseName,
  type,
  ssl,
  pollingInterval,
  integrationType,
  errors = {},
  setErrors = () => {},
  disableFieldEdit,
  page,
}) {
  useEffect(() => {
    setRdbmsData('type', integrationType);
  }, [integrationType, type, setRdbmsData]);

  let portNumberPlaceholder = null;
  switch (integrationType) {
    case INTEGRATION_TYPE_POSTGRES_CDC:
      portNumberPlaceholder = 5432;
      break;
    case INTEGRATION_TYPE_MYSQL_PULL:
      portNumberPlaceholder = 3306;
      break;
    case INTEGRATION_TYPE_MYSQL_CDC:
      portNumberPlaceholder = 3306;
      break;
    default:
      portNumberPlaceholder = 3000;
  }

  return (
    <div>
      {FIELD_FOR_IMPORT_SRC_RDBMS?.[type]?.includes('databaseHost') && (
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Database Host</div>
          <div>
            {disableFieldEdit ? (
              <RenderUneditableText text={databaseHost} />
            ) : (
              <Input
                error={errors.databaseHost}
                hideSuffix={true}
                placeholder="127.0.0.1"
                onChange={(event) => {
                  setErrors(removeObjectKey(errors, 'databaseHost'));
                  setRdbmsData('databaseHost', event.target.value);
                }}
                value={databaseHost}
              />
            )}
          </div>
        </div>
      )}
      {FIELD_FOR_IMPORT_SRC_RDBMS?.[type]?.includes('databasePort') && (
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Database Port</div>
          <div>
            {disableFieldEdit ? (
              <RenderUneditableText text={databasePort} />
            ) : (
              <Input
                error={errors.databasePort}
                hideSuffix={true}
                placeholder={portNumberPlaceholder}
                onChange={(event) => {
                  setErrors(removeObjectKey(errors, 'databasePort'));
                  setRdbmsData('databasePort', event.target.value);
                }}
                value={databasePort}
              />
            )}
          </div>
        </div>
      )}
      {FIELD_FOR_IMPORT_SRC_RDBMS?.[type]?.includes('databaseName') && (
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Database Name</div>
          <div>
            {disableFieldEdit ? (
              <RenderUneditableText text={databaseName} />
            ) : (
              <Input
                error={errors.databaseName}
                hideSuffix={true}
                placeholder="Enter database name..."
                onChange={(event) => {
                  setErrors(removeObjectKey(errors, 'databaseName'));
                  setRdbmsData('databaseName', event.target.value);
                }}
                value={databaseName}
              />
            )}
          </div>
        </div>
      )}
      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>User Name</div>
        <div>
          {disableFieldEdit ? (
            <RenderUneditableText text={srcUser} />
          ) : (
            <Input
              error={errors.srcUser}
              hideSuffix={true}
              placeholder="Enter user name..."
              value={srcUser}
              onChange={(event) => {
                setErrors(removeObjectKey(errors, 'srcUser'));
                setRdbmsData('srcUser', event.target.value);
              }}
            />
          )}
        </div>
      </div>
      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Password</div>
        <div>
          {disableFieldEdit ? (
            <RenderUneditableText text={'******'} />
          ) : (
            <InputPassword
              error={errors.srcPassword}
              hideSuffix={true}
              autoComplete="new-password"
              placeholder="Enter password..."
              value={srcPassword}
              onChange={(event) => {
                setErrors(removeObjectKey(errors, 'srcPassword'));
                setRdbmsData('srcPassword', event.target.value);
              }}
            />
          )}
        </div>
      </div>
      {FIELD_FOR_IMPORT_SRC_RDBMS?.[type]?.includes('ssl') && (
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Enable SSL</div>

          <div className={css(styles.toggleContainer)}>
            <SwitchWrapper
              checked={ssl?.mode === 'Enabled'}
              onChange={(value) => {
                setSSLMode('ssl', value ? 'Enabled' : 'Disabled');
              }}
              onLabel="YES"
              offLabel="NO"
              disabled={disableFieldEdit}
            />
          </div>
        </div>
      )}

      {FIELD_FOR_IMPORT_SRC_RDBMS?.[type]?.includes('pollingInterval') && (
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>
            Polling Interval(sec)
          </div>
          <div>
            {disableFieldEdit ? (
              <RenderUneditableText text={pollingInterval} />
            ) : (
              <Input
                error={errors.pollingInterval}
                type={'number'}
                hideSuffix={true}
                placeholder="Polling Interval"
                onChange={(event) => {
                  setErrors(removeObjectKey(errors, 'pollingInterval'));
                  setRdbmsData(
                    'pollingInterval',
                    parseFloat(event.target.value),
                  );
                }}
                value={pollingInterval}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

SourceProperties.propTypes = {
  srcUser: PropTypes.string,
  srcPassword: PropTypes.string,
  setRdbmsData: PropTypes.func,
  databaseHost: PropTypes.string,
  databasePort: PropTypes.string,
  databaseName: PropTypes.string,
  type: PropTypes.string,
  pollingInterval: PropTypes.number,
  integrationType: PropTypes.string,
  disableFieldEdit: PropTypes.bool,
};

export default SourceProperties;
