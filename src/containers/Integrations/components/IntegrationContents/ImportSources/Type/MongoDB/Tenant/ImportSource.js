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
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { CollapsableWrapper } from 'containers/components';
import BiosDestination from 'containers/Integrations/components/BiosDestination';
import { mongodbIntegrationActions } from 'containers/Integrations/components/IntegrationContents/ImportSources/Type/MongoDB/reducers';
import styles from 'containers/Integrations/styles';
import SourceProperties from './SourceProperties';

const { setMongoDBIntegration } = mongodbIntegrationActions;

function ImportSource({
  srcUser,
  srcPassword,
  setMongoDBIntegration,
  endpoints,
  replicaSet,
  databaseName,
  useDnsSeedList,
  authSource,
  ssl,
}) {
  const [activeRightPanelSection, setActiveRightPanelSection] = useState('');
  useEffect(() => {
    return () => {
      setMongodbData('srcUser', '');
      setMongodbData('srcPassword', '');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMongodbData = (key, value) => {
    setMongoDBIntegration({ [key]: value });
  };

  const setMongodbEndpointsData = (key, index, value) => {
    const endpointsCopy = cloneDeep(endpoints);
    endpointsCopy[index] = value;
    setMongoDBIntegration({ [key]: endpointsCopy });
  };

  const mongodbEndpointsAdd = (key) => {
    const endpointsCopy = cloneDeep(endpoints);
    endpointsCopy.push('');
    setMongoDBIntegration({ [key]: endpointsCopy });
  };

  const mongodbEndpointsRemove = (key, index) => {
    const endpointsCopy = cloneDeep(endpoints);
    endpointsCopy.splice(index, 1);
    setMongoDBIntegration({ [key]: endpointsCopy });
  };

  const setSSLMode = useCallback(
    (key, value) => {
      setMongoDBIntegration({ [key]: { mode: value } });
    },
    [setMongoDBIntegration],
  );

  const getActivePanel = () => {
    const panels = [
      {
        component: (
          <div className={css(styles.collapsableDiv)}>
            <SourceProperties
              srcUser={srcUser}
              srcPassword={srcPassword}
              endpoints={endpoints}
              setMongodbEndpointsData={setMongodbEndpointsData}
              mongodbEndpointsRemove={mongodbEndpointsRemove}
              mongodbEndpointsAdd={mongodbEndpointsAdd}
              setSSLMode={setSSLMode}
              replicaSet={replicaSet}
              databaseName={databaseName}
              useDnsSeedList={useDnsSeedList}
              authSource={authSource}
              ssl={ssl}
              setMongodbData={setMongodbData}
            />
          </div>
        ),
        header: 'Source Properties',
        key: 'source_properties',
      },
      {
        component: (
          <div className={css(styles.collapsableDiv)}>
            <BiosDestination />
          </div>
        ),
        header: 'Bios Authentication',
        key: 'bios_auth',
      },
    ];

    return panels;
  };

  const panels = getActivePanel();

  return (
    <div className={css(styles.rightPanelSectionContainer)}>
      <div className={css(styles.collapsableWrapper)}>
        <CollapsableWrapper
          activePanel={activeRightPanelSection}
          panels={panels}
          setActiveRightPanel={setActiveRightPanelSection}
        />
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setMongoDBIntegration,
};

const mapStateToProps = (state) => {
  const {
    useDnsSeedList,
    endpoints,
    replicaSet,
    databaseName,
    authSource,
    srcUser,
    srcPassword,
    ssl,
  } = state?.integration?.mongodb;
  return {
    useDnsSeedList,
    replicaSet,
    databaseName,
    endpoints,
    authSource,
    srcUser,
    srcPassword,
    ssl,
  };
};

ImportSource.propTypes = {
  setMongoDBIntegration: PropTypes.func,
  srcUser: PropTypes.string,
  srcPassword: PropTypes.string,
  endpoints: PropTypes.array,
  replicaSet: PropTypes.string,
  databaseName: PropTypes.string,
  useDnsSeedList: PropTypes.bool,
  authSource: PropTypes.string,
  ssl: PropTypes.instanceOf(Object),
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportSource);
