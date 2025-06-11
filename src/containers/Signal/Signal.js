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
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import commonStyles from 'app/styles/commonStyles';
import EmptyPlaceholder from 'components/EmptyPlaceholder';
import InviteFlowButton from 'components/InviteFlowButton';
import TitleHelmet from 'components/TitleHelmet';
import MobileDropdown from 'components/MobileDropdown';
import FilteredListing from 'components/FilteredListing';
import {
  Button,
  Input,
  Listing,
  PageTitle,
  SortControl,
} from 'containers/components';
import InviteUsers from 'containers/InviteUsers';
import PageLayout from 'Layouts/PageLayout';
import { useDeviceDetect } from 'common/hooks';
import { fetchSignalConfig, fetchSignals } from './actions';
import {
  SIGNAL_HEADER,
  KEY,
  SORT_CONFIG,
  RELOAD_SIGNAL_DATA_INTERVAL_MS,
} from './constant';
import StreamHomePageLoader from './StreamHomePageLoader';
import styles from './styles';
import {
  getFilterSignal,
  separateAuditAndNormalSignal,
  sortSignalList,
  transform,
} from './utils';

const { userClicks } = ipxl;

const Signal = ({
  fetchSignals,
  fetchSignalConfig,
  signals,
  SignalConfig,
  history,
  loading,
  error,
}) => {
  const [showRightPanel, setShowRightPanel] = useState(false);

  const [sortBy, setSortBy] = useState(KEY.CHANGE_DESC);

  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const isMobile = useDeviceDetect();

  useEffect(() => {
    fetchSignals();
    !SignalConfig && fetchSignalConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignals();
    }, RELOAD_SIGNAL_DATA_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  const getContent = () => {
    // eslint-disable-next-line
    const [searchText, setSearchText] = useState('');

    if (loading) {
      return <StreamHomePageLoader />;
    }
    if (error) {
      return (
        <div className={css(commonStyles.centerPosition)}>
          Error in loading signals....
        </div>
      );
    }

    let filterSignalList = getFilterSignal(signals, searchText);
    filterSignalList = sortSignalList(filterSignalList, sortBy);
    filterSignalList = transform(filterSignalList);

    let filteredAuditList;

    ({ filterSignalList, filteredAuditList } =
      separateAuditAndNormalSignal(filterSignalList));

    if (signals.length === 0) {
      return (
        <EmptyPlaceholder
          buttonText="New Signal"
          message="Create a Signal"
          onClick={() => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'New Signal',
              rightSection: 'None',
              mainSection: 'signalHome',
              leftSection: 'signal',
            });
            history.push('/signals/new');
          }}
          icon="icon-EMPTY-STATE-1"
        />
      );
    }

    const signalHeader = SIGNAL_HEADER.map((headerItem) => {
      return isMobile ? { title: headerItem.title } : headerItem;
    });

    return (
      <>
        <div className={css(styles.controlsPanel)}>
          <div className={css(styles.leftSection)}>
            {isMobile && (
              <MobileDropdown
                showSection={showFilterOptions}
                setShowSection={setShowFilterOptions}
                textContent="Search and Sort"
              />
            )}
            {(!isMobile || (isMobile && showFilterOptions)) && (
              <>
                <Input
                  placeholder="Search signals"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    userClicks({
                      pageURL: history?.location?.pathname,
                      pageTitle: document.title,
                      pageDomain: window?.location?.origin,
                      eventLabel: 'Search Signals',
                      rightSection: 'None',
                      mainSection: 'signalHome',
                      leftSection: 'signal',
                    });
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
                      eventLabel: 'Sorting Signals',
                      rightSection: 'None',
                      mainSection: 'signalHome',
                      leftSection: 'signal',
                    });
                    setSortBy(key);
                  }}
                />
              </>
            )}
          </div>
          {signals.length > 0 && (
            <Button
              type="primary"
              alignRight={true}
              onClick={() => {
                userClicks({
                  pageURL: history?.location?.pathname,
                  pageTitle: document.title,
                  pageDomain: window?.location?.origin,
                  eventLabel: 'New Signal',
                  rightSection: 'None',
                  mainSection: 'signalHome',
                  leftSection: 'signal',
                });
                history.push('/signals/new');
              }}
            >
              New Signal
            </Button>
          )}
        </div>

        <Listing
          summaryType="dynamics"
          noItemMsg="No signal found"
          header={signalHeader}
          data={filterSignalList}
          itemClick={({ item }) => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Show Signal Detail',
              rightSection: 'None',
              mainSection: 'signalHome',
              leftSection: 'signal',
            });
            history.push(`/signal/${item.signalName}`);
          }}
          trendLineKey="sum"
        />

        {filteredAuditList?.length > 0 && (
          <FilteredListing
            data={filteredAuditList}
            header={signalHeader}
            title="Audit Signals"
            noItemMsg="No signal found"
            itemClick={({ item }) => {
              userClicks({
                pageURL: history?.location?.pathname,
                pageTitle: document.title,
                pageDomain: window?.location?.origin,
                eventLabel: 'Show Signal Detail',
                rightSection: 'None',
                mainSection: 'signalHome',
                leftSection: 'signal',
              });
              history.push(`/signal/${item.signalName}`);
            }}
          />
        )}
      </>
    );
  };

  const headerActions = () => {
    return (
      <InviteFlowButton
        onButtonClick={() => {
          if (showRightPanel) {
            setShowRightPanel(false);
          } else {
            setShowRightPanel(true);
          }
        }}
      />
    );
  };

  const LeftSectionContent = () => {
    return (
      <div className={css(commonStyles.pageContentWrapper)}>
        <div className={css(commonStyles.pageContent)}>
          <TitleHelmet title="Signals" />
          <PageTitle label="Signals" actions={headerActions} />
          <div className={css(commonStyles.contentPanel, styles.paddingLeft)}>
            {getContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      MainContent={() => {
        return <LeftSectionContent />;
      }}
      RightPanelContent={() => {
        return (
          <InviteUsers
            showRightPanel={showRightPanel}
            closeRightPanel={() => {
              setShowRightPanel(false);
            }}
          />
        );
      }}
      showRightPanel={showRightPanel}
    />
  );
};

Signal.propTypes = {
  fetchSignals: PropTypes.func.isRequired,
  fetchSignalConfig: PropTypes.func.isRequired,
  signals: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  SignalConfig: PropTypes.instanceOf(Object),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

const mapDispatchToProps = {
  fetchSignals: (options) => fetchSignals(options),
  fetchSignalConfig: (options) => fetchSignalConfig(options),
};

const mapStateToProps = (state) => {
  const { signals, loading, error, SignalConfig } = state.signals;
  return { signals, loading, error, SignalConfig };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signal);
