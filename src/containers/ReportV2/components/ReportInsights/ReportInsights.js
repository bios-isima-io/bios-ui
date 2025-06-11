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
import { Spin, Tooltip } from 'antdlatest';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';

import MobileDropdown from 'components/MobileDropdown';
import { assignIds } from 'containers/utils';
import { reportInsightsActions } from './reducers';
import './styles.scss';
import { buildDataForInsights } from './utils/buildDataForInsights';

const emptyBoxes = [
  { _id: shortid() },
  { _id: shortid() },
  { _id: shortid() },
  { _id: shortid() },
];

const { fetchReportInsights } = reportInsightsActions;
function ReportInsights({
  fetchReportInsights,
  selectedMetrics,
  duration,
  durationStart,
  timezone,
  windowSize,
  groupByX,
  topX,
  selectedSignals,
  metricsModifiers,
  reportInsights,
  cyclicalComparisonOn,
  cyclicalComparisonDisabled,
  cyclicalComparisonStart,
  cyclicalComparisonCustom,
  selectedFilters,
  isMobile,
}) {
  const [reportInsightsBoxes, setReportInsightsBoxes] = useState(emptyBoxes);
  const [loaderReportInsightBoxes, setLoaderReportInsightBoxes] =
    useState(false);
  const [showReportInsights, setShowReportInsights] = useState(
    isMobile ? false : true,
  );
  useEffect(() => {
    if (!isMobile && !showReportInsights) {
      setShowReportInsights(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (selectedMetrics.length > 0) {
      setLoaderReportInsightBoxes(true);
      fetchReportInsights({
        selectedSignals,
        selectedMetrics,
        duration,
        durationStart,
        timezone,
        windowSize,
        groupByX,
        topX,
        cyclicalComparisonOn,
        cyclicalComparisonStart,
        cyclicalComparisonCustom,
        cyclicalComparisonDisabled,
        selectedFilters,
        calledFrom: 'report',
      });
    } else {
      setReportInsightsBoxes(emptyBoxes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMetrics,
    duration,
    durationStart,
    windowSize,
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    selectedFilters,
    groupByX,
    topX,
  ]);

  useEffect(() => {
    if (Object.keys(reportInsights).length > 0) {
      setReportInsightsBoxes(
        assignIds(buildDataForInsights(reportInsights, metricsModifiers)),
      );
    } else {
      setReportInsightsBoxes(emptyBoxes);
    }
    setLoaderReportInsightBoxes(false);
  }, [metricsModifiers, reportInsights]);

  return (
    <div className="report-insight-container">
      {isMobile && (
        <MobileDropdown
          showSection={showReportInsights}
          setShowSection={setShowReportInsights}
          textContent="Insights"
        />
      )}
      {showReportInsights && (
        <div className="report-insight">
          {reportInsightsBoxes?.map((box) => (
            <div className="card" key={box._id}>
              {loaderReportInsightBoxes ? (
                <Spin />
              ) : (
                <Tooltip placement="bottom" title={box?.hover ?? ''}>
                  <div className="title">{box?.value}</div>
                  <div className="sub-title">{box?.message}</div>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { selectedSignals, metricsModifiers } = state?.signalMultiSelect;
  const { selectedMetrics } = state?.report?.metrics;
  const { duration, durationStart } = state.report.duration.timeDuration;
  const { timezone } = state.report.duration.timeZone;
  const { windowSize } = state.report.duration.windowSize;
  const { groupByX } = state?.report?.groupBy;
  const { topX } = state?.report?.dataGranularity;
  const { selectedFilters } = state.report.filters;
  const {
    cyclicalComparisonOn,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    cyclicalComparisonDisabled,
  } = state.report.duration.cyclicalComparison;
  const { reportInsights } = state?.report.reportInsights;
  return {
    selectedSignals,
    metricsModifiers,
    selectedMetrics,
    duration,
    durationStart,
    timezone,
    windowSize,
    groupByX,
    topX,
    reportInsights,
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonStart,
    cyclicalComparisonCustom,
    selectedFilters,
  };
};

const mapDispatchToProps = {
  fetchReportInsights,
};

ReportInsights.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReportInsights);
