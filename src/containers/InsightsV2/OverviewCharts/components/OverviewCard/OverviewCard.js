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
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Tooltip } from 'antdlatest';
import OverviewChart from './OverviewChart';
import { insightsGridActions } from 'containers/InsightsV2/InsightsGrid/reducers';
import { buildDataForInsights } from '../../../../ReportV2/components/ReportInsights/utils/buildDataForInsights';
import { queryHasPlottableData } from 'containers/ReportV2/components/ReportGraph/utils';
import NoDataInsights from 'containers/InsightsV2/components/NoDataInsights';
import { isCyclicalComparisonOn } from 'containers/ReportV2/components/AdvanceSettings/Duration/CyclicalComparison/utils';
import ipxl from '@bios/ipxl';
import './styles.scss';

const { userClicks } = ipxl;
const { setInsightsGridData, updateInsightsConfig } = insightsGridActions;

function OverviewCard({
  history,
  plotData,
  report,
  selectApiResponse,
  setInsightsGridData,
  updateInsightsConfig,
  gridData,
  metricsModifiers,
}) {
  const { reportName, metrics, cyclicalComparisonStart, cyclicalDelta, dimensions } =
    report.report;
  const insightsData = buildDataForInsights(
    selectApiResponse.datasketches,
    metricsModifiers,
  );
  let durationMessage = '';
  if (report.duration === 3600000) {
    durationMessage = 'Last 1 hr';
  } else if (report.duration === 86400000) {
    durationMessage = 'Last 1 day';
  }

  const unfavReport = () => {
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: `Un-Fav ${reportName} report`,
      rightSection: 'None',
      mainSection: 'insight',
      leftSection: 'insight',
    });

    let rowId = report?.duration === 3600000 ? '1-hr' : null;
    rowId = report?.duration === 86400000 ? '1-day' : rowId;
    let reportId = report?.report?.reportId;
    let cardId;
    gridData.forEach((section) => {
      if (section.id === rowId) {
        section.cards.forEach((card) => {
          if (card.reportId === reportId) {
            cardId = card.id;
          }
        });
      }
    });
    updateFavState(rowId, cardId, false);
  };

  const updateFavState = (rowId, cardId, newFav) => {
    const newData = cloneDeep(gridData);
    newData.forEach((section) => {
      if (section.id === rowId) {
        section.cards.forEach((card) => {
          if (card.id === cardId) {
            card.fav = newFav;
          }
        });
      }
    });
    updateInsightsConfig({ gridData: newData });
    setInsightsGridData(newData);
  };

  return (
    <div className="insight-overview-container">
      <Tooltip placement="top" title={reportName}>
        <div className="title">{reportName}</div>
      </Tooltip>
      <div className="report-duration">{durationMessage}</div>
      <div className="overview-chart">
        {plotData?.series?.length === 0 ||
        !queryHasPlottableData(selectApiResponse?.statementData) ? (
          <NoDataInsights />
        ) : (
          <OverviewChart
            plotData={plotData}
            selectedMetrics={metrics}
            cyclicalComparisonOn={isCyclicalComparisonOn({
              cyclicalComparisonStart,
              cyclicalDelta,
            })}
            groupByY={dimensions?.[1]}
          />
        )}
      </div>
      <div className="overview-chart-data-wrapper">
        {insightsData.slice(0, 3).map((insightDataDetails) => {
          const value = insightDataDetails?.value;
          return (
            <Tooltip placement="top" title={insightDataDetails?.hover ?? ''}>
              <div className="overview-properties">
                <div className="value">{value}</div>
                <div className="prop">{insightDataDetails?.message}</div>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div className="fav-container">
        <i
          className="icon-fav"
          onClick={(e) => {
            e.stopPropagation();
            unfavReport();
          }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { signals, gridData } = state?.insights?.insightsGrid;
  const { metricsModifiers } = state?.signalMultiSelect;
  return {
    signals,
    gridData,
    metricsModifiers,
  };
};

const mapDispatchToProps = {
  setInsightsGridData,
  updateInsightsConfig,
};

OverviewCard.propTypes = {
  signals: PropTypes.array,
  metricsModifiers: PropTypes.array,
  gridData: PropTypes.array,
  plotData: PropTypes.object,
  report: PropTypes.object,
  selectApiResponse: PropTypes.object,
  setInsightsGridData: PropTypes.func,
  updateInsightsConfig: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCard);
