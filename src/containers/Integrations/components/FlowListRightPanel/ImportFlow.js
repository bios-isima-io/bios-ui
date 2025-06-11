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
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import styles from '../../styles';
import SourceList from './components/IntegrationTypes/SourceList';
import { WebhookImportFlow } from './components/Webhook';
import { KafkaImportFlow } from './components/Kafka';
import { HibernateImportFlow } from './components/Hibernate';
import { S3ImportFlow } from './components/S3';
import { FileImportFlow } from './components/File';
import { DatabasesImportFlow } from './components/Databases';
import { RestClientImportFlow } from './components/RestClient';
import { SocialImportFlow } from './components/Social';
import {
  ACTIVE_INTEGRATIONS,
  INTEGRATION_TYPE_DISPLAY_NAME,
  INTEGRATION_TYPE_GOOGLE,
  INTEGRATION_TYPE_FACEBOOK,
} from 'containers/Integrations/const';
import sourceFlow from './styles';
// import { Button } from 'containers/components';
import { integrationActions } from 'containers/Integrations/reducers';
import { flowSpecsActions } from './reducers';

const { resetIntegrationConfig } = integrationActions;

const { setNewSourceDataSpec } = flowSpecsActions;
function ImportFlow({
  importSourcesCopy,
  sourceDataSpec,
  setNewSourceDataSpec,
  setShowIntegration,
  resetIntegrationConfig,
  onboardingStep,
}) {
  const [sourceType, setSourceType] = useState('');

  const { importSourceId } = sourceDataSpec;

  const isOnboarding = onboardingStep > 0;

  const setSourceInfo = () => {
    if (importSourceId === '' || importSourceId === undefined) {
      setSourceType('');
      return;
    }
    const srcType = importSourcesCopy?.find(
      (src) => src.importSourceId === importSourceId,
    )?.['type'];
    if (ACTIVE_INTEGRATIONS?.includes(srcType)) {
      setSourceType(srcType);
    }
  };

  // is having two useEffect hooks appropriate?
  useEffect(() => {
    setSourceInfo();
    // to suppress the eslint warning, you have to move the setSourceInfo def inside the hook,
    // but it's shared. As a workaround, we disable the lint here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSourceInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importSourceId]);

  return (
    <div className={css(sourceFlow.PickASourceContainer)}>
      <div className={css(styles.rightPanelSectionContainer)}>
        <SourceList
          importSourceId={importSourceId}
          sources={importSourcesCopy}
          setSourceData={setNewSourceDataSpec}
          addSource={() => {
            resetIntegrationConfig();
            setShowIntegration(true);
          }}
        />
        {sourceType !== undefined && sourceType !== '' && (
          <div className={css(styles.rPanelSubSectionRow)}>
            <div className={css(styles.rPanelSubSectionCol1)}>Type</div>
            <div className={css(styles.rPanelSubSectionCol2Text)}>
              {INTEGRATION_TYPE_DISPLAY_NAME?.[sourceType]}
            </div>
          </div>
        )}
      </div>

      {/* <div>
        <div className={css(styles.rPanelSubSectionRow)}>
          <div className={css(styles.rPanelSubSectionCol1)}>Or</div>
          <div className={css(styles.rPanelSubSectionCol2Text)}>
            <Button
              type="primary"
              onClick={() => {
                resetIntegrationConfig();
                setShowIntegration(true);
              }}
            >
              Add Source
            </Button>
          </div>
        </div>
      </div> */}

      {sourceType === 'Webhook' && (
        <WebhookImportFlow isOnboarding={isOnboarding} />
      )}
      {sourceType === 'Kafka' && (
        <KafkaImportFlow isOnboarding={isOnboarding} />
      )}
      {sourceType === 'Hibernate' && (
        <HibernateImportFlow isOnboarding={isOnboarding} />
      )}
      {sourceType === 'S3' && <S3ImportFlow isOnboarding={isOnboarding} />}
      {sourceType === 'File' && <FileImportFlow isOnboarding={isOnboarding} />}
      {sourceType === 'RestClient' && (
        <RestClientImportFlow isOnboarding={isOnboarding} />
      )}
      {sourceType === INTEGRATION_TYPE_GOOGLE && (
        <SocialImportFlow isOnboarding={isOnboarding} />
      )}
      {sourceType === INTEGRATION_TYPE_FACEBOOK && (
        <SocialImportFlow isOnboarding={isOnboarding} />
      )}
      {(sourceType === 'Mysql' ||
        sourceType === 'MysqlPull' ||
        sourceType === 'Postgres' ||
        sourceType === 'Mongodb') && (
        <DatabasesImportFlow
          sourceType={sourceType}
          isOnboarding={isOnboarding}
        />
      )}
    </div>
  );
}

const mapDispatchToProps = {
  resetIntegrationConfig,
  setNewSourceDataSpec,
};

const mapStateToProps = (state) => {
  const { importSourcesCopy } = state?.integration?.integrationConfig;
  const { sourceDataSpec } = state?.integration?.importFlowSpecs;
  const { currentStep: onboardingStep } = state?.onboardinge2e?.global;

  return {
    importSourcesCopy,
    sourceDataSpec,
    onboardingStep,
  };
};

ImportFlow.propTypes = {
  importSourcesCopy: PropTypes.array,
  sourceDataSpec: PropTypes.object,
  setNewSourceDataSpec: PropTypes.func,
  setShowIntegration: PropTypes.func,
  resetIntegrationConfig: PropTypes.func,
  onboardingStep: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportFlow);
