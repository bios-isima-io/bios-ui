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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'aphrodite';
import { usePrevious } from 'common/hooks';
import { Input, SortControl, Button } from 'containers/components';
import { SORT_CONFIG } from './const';
import {
  searchImportFlowSpec,
  addImportSourceName,
  sortImportFlowSpecList,
} from './utils';
import { integrationActions } from 'containers/Integrations/reducers';
import { flowSpecsActions } from 'containers/Integrations/components/FlowListRightPanel/reducers';
import EmptyPlaceholder from 'components/EmptyPlaceholder';
import { AUTH_TYPE_LOGIN } from 'containers/Integrations/const';
import { ErrorNotification } from 'containers/utils';
import signalStyles from '../../../Signal/styles';
import styles from './styles';
import messages from 'utils/notificationMessages';
import ipxl from '@bios/ipxl';
import { createImportFlowDataMapping } from 'containers/Integrations/utils';

const { userClicks } = ipxl;
const { getImportFlow, setImportFlowCopy } = integrationActions;
const { setFlowConfig, resetFlowConfig, setDataPickupSpec } = flowSpecsActions;
const EMPTY_BUTTON_NAME = 'Add Flow';

const FlowListHeader = () => {
  return (
    <div className={css(styles.flowListHeader)}>
      <div className={css(styles.col)}>Flow</div>
      <div className={css(styles.col)}>Data Source</div>
    </div>
  );
};

const FlowListItem = ({ col1, col2 }) => {
  return (
    <div className={css(styles.flowListItem)}>
      <div className={css(styles.col)}>{col1}</div>
      <div className={css(styles.col)}>{col2}</div>
    </div>
  );
};

function FlowList({
  onAddingNewFlow,
  importFlowSpecsCopy,
  importSources,
  setFlowConfig,
  resetFlowConfig,
  getImportFlow,
  name,
  pageType,
  setSelectedImportFlow,
  importFlowSpecs,
  showRightPanel,
  signalDetail,
  contextDetail,
  setDataPickupSpec,
  selectedEntity,
  activeEntity,
  selectedEntityCreationFlow,
  importDestinations,
  setImportFlowCopy,
  flowMapping,
  mysql,
  history,
  parentFlow,
}) {
  const [sortBy, setSortBy] = useState(SORT_CONFIG?.[0]?.key);
  const [searchText, setSearchText] = useState('');
  const signalDetailOld = usePrevious(signalDetail);
  const contextDetailOld = usePrevious(contextDetail);
  const [filteredImportFlowSpecsCopy, setFilteredImportFlowSpecsCopy] =
    useState(
      sortImportFlowSpecList(importFlowSpecsCopy, SORT_CONFIG?.[0]?.key),
    );
  const [signalFlowCount, setSignalFlowCount] = useState(0);

  useEffect(() => {
    let filterList = addImportSourceName(
      importFlowSpecsCopy,
      importSources,
      name,
      pageType,
    );
    let signalFlowCount;
    if (filterList) {
      signalFlowCount = filterList?.length;
    } else {
      signalFlowCount = 0;
    }
    setSignalFlowCount(signalFlowCount);
    filterList = searchImportFlowSpec(filterList, searchText);
    filterList = sortImportFlowSpecList(filterList, sortBy);
    setFilteredImportFlowSpecsCopy(filterList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchText, importFlowSpecsCopy, importSources, name]);

  useEffect(() => {
    let shouldUpdateFlow = false;
    let oldItemName = '';
    let newItemName = '';
    if (
      pageType === 'Signal' &&
      signalDetail?.signalName !== signalDetailOld?.signalName
    ) {
      shouldUpdateFlow = true;
      oldItemName = signalDetailOld?.signalName;
      newItemName = signalDetail?.signalName;
    }
    if (
      pageType === 'Context' &&
      contextDetail?.contextName !== contextDetailOld?.contextName
    ) {
      shouldUpdateFlow = true;
      oldItemName = contextDetailOld?.contextName;
      newItemName = contextDetail?.contextName;
    }
    if (shouldUpdateFlow) {
      const newFlows = importFlowSpecsCopy?.map((ifs) => {
        if (
          ifs.destinationDataSpec.type === pageType &&
          ifs.destinationDataSpec.name === oldItemName
        ) {
          ifs.destinationDataSpec.name = newItemName;
          if (!ifs.shouldCreate) {
            ifs.shouldUpdate = true;
          }
        }
        return ifs;
      });
      Array.isArray(newFlows) && setImportFlowCopy(newFlows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalDetail, contextDetail]);

  useEffect(() => {
    const destinationName =
      pageType === 'Signal'
        ? signalDetail?.signalName
        : pageType === 'Context'
        ? contextDetail?.contextName
        : '';

    if (selectedEntityCreationFlow === 'teach_bios') {
      return;
    }

    const authLogin = importDestinations?.find(
      (id) => id?.authentication?.type === AUTH_TYPE_LOGIN,
    );

    if (authLogin?.length === 0) {
      ErrorNotification({
        message: messages.integration.AUTH_LOGIN_MISSING,
      });
    }

    let flowExists = false;
    importFlowSpecsCopy?.forEach((ifs) => {
      if (ifs.destinationDataSpec.name === destinationName) {
        flowExists = true;
      }
    });
    if (flowExists) {
      return;
    }

    Array.isArray(importFlowSpecsCopy) &&
      setImportFlowCopy([...importFlowSpecsCopy]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const autoCreateDataMapping = ({ attributeSearchPath }) => {
    const stream = pageType === 'Signal' ? signalDetail : contextDetail;

    return (
      createImportFlowDataMapping(flowMapping, stream, attributeSearchPath) ||
      stream?.attributes?.reduce((acc, att) => {
        acc.push({ sourceAttributeName: att.attributeName });
        return acc;
      }, [])
    );
  };

  const setAttributeDataMapping = () => {
    let attributeSearchPath = '';
    if (flowMapping?.attributeSearch) {
      let result = flowMapping.attributeSearchPath.map((item, index, arr) => {
        if (
          flowMapping?.attributeMapping?.[item]?.type === 'array' &&
          arr?.slice(0, index + 1)?.length ===
            flowMapping?.attributeMapping?.[item]?.path?.length
        ) {
          return arr.length - 1 === index ? item + '/*' : item + '/*/';
        } else {
          return item + '/';
        }
      });
      attributeSearchPath = result.join('');
    }
    const newAttribute = autoCreateDataMapping({ attributeSearchPath });
    if (newAttribute && Array.isArray(newAttribute)) {
      setDataPickupSpec({
        attributes: newAttribute,
        attributeSearchPath: attributeSearchPath,
      });
    }
  };

  return (
    <div className={css(styles.flowTabContent)}>
      {signalFlowCount === 0 && (
        <EmptyPlaceholder
          onClick={() => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Show Flow Panel',
              rightSection: 'None',
              mainSection:
                pageType === 'Signal'
                  ? 'SignalDetailFlow'
                  : 'contextDetailFlow',
              leftSection: pageType === 'Signal' ? 'signal' : 'context',
            });
            resetFlowConfig();
            onAddingNewFlow();
            setAttributeDataMapping();
          }}
          buttonText={EMPTY_BUTTON_NAME}
          message="No flows created"
          icon="icon-EMPTY-STATE-1"
          btnType={parentFlow === 'onboarding' ? 'primary-animated' : 'primary'}
        />
      )}
      {signalFlowCount > 0 && (
        <div>
          <div className={css(signalStyles.controlsPanel)}>
            <div className={css(signalStyles.leftSection)}>
              <Input
                placeholder="Search flows or data sources"
                onChange={(e) => {
                  userClicks({
                    pageURL: history?.location?.pathname,
                    pageTitle: document.title,
                    pageDomain: window?.location?.origin,
                    eventLabel: 'Search Flows',
                    rightSection: 'None',
                    mainSection:
                      pageType === 'Signal'
                        ? 'SignalDetailFlow'
                        : 'contextDetailFlow',
                    leftSection: pageType === 'Signal' ? 'signal' : 'context',
                  });
                  setSearchText(e.target.value);
                }}
              />
              <SortControl
                config={SORT_CONFIG}
                selected={sortBy}
                onChange={(key) => {
                  userClicks({
                    pageURL: history?.location?.pathname,
                    pageTitle: document.title,
                    pageDomain: window?.location?.origin,
                    eventLabel: 'Sort Flows',
                    rightSection: 'None',
                    mainSection:
                      pageType === 'Signal'
                        ? 'SignalDetailFlow'
                        : 'contextDetailFlow',
                    leftSection: pageType === 'Signal' ? 'signal' : 'context',
                  });
                  setSortBy(key);
                }}
              />
            </div>
            <Button
              type="primary"
              alignRight={true}
              onClick={() => {
                userClicks({
                  pageURL: history?.location?.pathname,
                  pageTitle: document.title,
                  pageDomain: window?.location?.origin,
                  eventLabel: 'Show Flow Panel',
                  rightSection: 'None',
                  mainSection:
                    pageType === 'Signal'
                      ? 'SignalDetailFlow'
                      : 'contextDetailFlow',
                  leftSection: pageType === 'Signal' ? 'signal' : 'context',
                });
                resetFlowConfig();
                onAddingNewFlow();
                setSelectedImportFlow(true);
                setAttributeDataMapping();
              }}
            >
              New Flow
            </Button>
          </div>

          <div>
            <FlowListHeader />
            {filteredImportFlowSpecsCopy?.map((ifs) => {
              const sourceName = importSources?.filter((is) => {
                return (
                  is.importSourceId === ifs?.sourceDataSpec?.importSourceId
                );
              })?.[0]?.importSourceName;
              return (
                <div
                  key={ifs.importFlowId}
                  onClick={() => {
                    userClicks({
                      pageURL: history?.location?.pathname,
                      pageTitle: document.title,
                      pageDomain: window?.location?.origin,
                      eventLabel: 'Show Flow Panel',
                      rightSection: 'None',
                      mainSection:
                        pageType === 'Signal'
                          ? 'SignalDetailFlow'
                          : 'contextDetailFlow',
                      leftSection: pageType === 'Signal' ? 'signal' : 'context',
                    });
                    resetFlowConfig();
                    onAddingNewFlow();
                    getImportFlow(ifs?.importFlowId);
                    setFlowConfig({
                      importFlowId: ifs?.importFlowId,
                      existingFlowSpecs: true,
                    });
                    setSelectedImportFlow(ifs?.importFlowId);
                  }}
                  className={css(
                    styles.flowListRow,
                    showRightPanel &&
                      importFlowSpecs?.importFlowId === ifs.importFlowId &&
                      styles.activeRow,
                  )}
                >
                  <FlowListItem
                    col1={ifs?.importFlowName}
                    col2={sourceName ? sourceName : ''}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

FlowList.propTypes = {
  importFlowSpecsCopy: PropTypes.array,
  importSources: PropTypes.array,
  importDestinations: PropTypes.array,
  setFlowConfig: PropTypes.func,
  resetFlowConfig: PropTypes.func,
  getImportFlow: PropTypes.func,
  onAddingNewFlow: PropTypes.func,
  pageType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selectedEntity: PropTypes.object,
  activeEntity: PropTypes.string,
  selectedEntityCreationFlow: PropTypes.string,
  setImportFlowCopy: PropTypes.func,
  mysql: PropTypes.object,
  parentFlow: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    importFlowSpecsCopy,
    importSources,
    importDestinations,
    flowMapping,
  } = state?.integration?.integrationConfig;
  const { importFlowSpecs } = state?.integration;
  const { signalDetail } = state?.signalDetail;
  const { contextDetail } = state?.contextDetail;
  const { selectedEntity, activeEntity, selectedEntityCreationFlow } =
    state?.onboardinge2e?.entityListing;
  const { mysql } = state?.onboardinge2e?.integration;
  return {
    importFlowSpecsCopy,
    importSources,
    importDestinations,
    importFlowSpecs,
    signalDetail,
    contextDetail,
    selectedEntity,
    activeEntity,
    selectedEntityCreationFlow,
    flowMapping,
    mysql,
  };
};

const mapDispatchToProps = {
  setFlowConfig,
  resetFlowConfig,
  getImportFlow,
  setDataPickupSpec,
  setImportFlowCopy,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlowList);
