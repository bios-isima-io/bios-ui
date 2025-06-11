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

import { Button, Input } from 'containers/components';
import styles from 'containers/Integrations/styles';
import {
  RenderBootstrapServerText,
  RenderUneditableText,
} from 'containers/Onboarding/ImportSources/helperComponent';
import SwitchWrapper from 'components/Switch/Switch';
import InputPassword from 'containers/components/Input/InputPassword';
import { removeObjectKey } from 'utils/index';

function SourceProperties({
  srcUser,
  srcPassword,
  endpoints,
  setMongodbEndpointsData,
  mongodbEndpointsRemove,
  mongodbEndpointsAdd,
  setSSLMode,
  replicaSet,
  databaseName,
  useDnsSeedList,
  authSource,
  ssl,
  setMongodbData,
  errors = {},
  setErrors = () => {},
  disableFieldEdit,
}) {
  return (
    <div>
      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>
          Use DNS Seed List
        </div>

        <div className={css(styles.toggleContainer)}>
          <SwitchWrapper
            checked={useDnsSeedList}
            onChange={(value) => {
              setMongodbData('useDnsSeedList', value);
            }}
            onLabel="YES"
            offLabel="NO"
            disabled={disableFieldEdit}
          />
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.bootStrapServerContainer)}>Endpoints</div>
        <div>
          {endpoints.map((server, index) => {
            return (
              <div key={index}>
                {disableFieldEdit ? (
                  <RenderBootstrapServerText text={server} />
                ) : (
                  <div className={css(styles.inputWrapper)}>
                    <Input
                      error={errors.endpoints}
                      hideSuffix={true}
                      placeholder="Eg. 34.93.18.170:27017"
                      onChange={(event) => {
                        setErrors(removeObjectKey(errors, 'endpoints'));
                        setMongodbEndpointsData(
                          'endpoints',
                          index,
                          event.target.value,
                        );
                      }}
                      value={server}
                      disabled={disableFieldEdit}
                    />
                    <div className={css(styles.inputDeleteIcon)}>
                      <i
                        className={`icon-trash ${css(styles.trashIcon)}`}
                        onClick={() => {
                          if (disableFieldEdit) {
                            return;
                          }
                          mongodbEndpointsRemove('endpoints', index);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {!disableFieldEdit && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                mongodbEndpointsAdd('endpoints');
              }}
            >
              Add Endpoint
            </Button>
          )}
        </div>
      </div>

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
              value={databaseName}
              onChange={(event) => {
                setErrors(removeObjectKey(errors, 'databaseName'));
                setMongodbData('databaseName', event.target.value);
              }}
              disabled={disableFieldEdit}
            />
          )}
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Replica Set</div>
        <div>
          {disableFieldEdit ? (
            <RenderUneditableText text={replicaSet} />
          ) : (
            <Input
              error={errors.replicaSet}
              hideSuffix={true}
              placeholder="Enter replica set..."
              value={replicaSet}
              onChange={(event) => {
                setErrors(removeObjectKey(errors, 'replicaSet'));
                setMongodbData('replicaSet', event.target.value);
              }}
              disabled={disableFieldEdit}
            />
          )}
        </div>
      </div>

      <div className={css(styles.rPanelSubSectionRow)}>
        <div className={css(styles.rPanelSubSectionCol1)}>Auth Source:</div>
        <div>
          {disableFieldEdit ? (
            <RenderUneditableText text={authSource} />
          ) : (
            <Input
              error={errors.authSource}
              hideSuffix={true}
              placeholder="Enter Auth Source..."
              value={authSource}
              onChange={(event) => {
                setErrors(removeObjectKey(errors, 'authSource'));
                setMongodbData('authSource', event.target.value);
              }}
              disabled={disableFieldEdit}
            />
          )}
        </div>
      </div>

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
                setMongodbData('srcUser', event.target.value);
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
                setMongodbData('srcPassword', event.target.value);
              }}
            />
          )}
        </div>
      </div>

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
    </div>
  );
}

SourceProperties.propTypes = {
  endpoints: PropTypes.array,
  setMongodbEndpointsData: PropTypes.func,
  mongodbEndpointsRemove: PropTypes.func,
  mongodbEndpointsAdd: PropTypes.func,
  setMongodbData: PropTypes.func,
  disableFieldEdit: PropTypes.bool,
};

export default SourceProperties;
