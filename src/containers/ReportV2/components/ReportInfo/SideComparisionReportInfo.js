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
import moment from 'moment-timezone';
import ReportInfo from './ReportInfo';
import { getTimeRangeMapping } from '../AdvanceSettings/Duration/TimeDuration/const';
import { getDurationString } from '../AdvanceSettings/Duration/utils';
import { WINDOW_SIZE_MAPPING } from '../AdvanceSettings/Duration/WindowSize/const';
import { getShouldAllowTop } from '../AdvanceSettings/DataGranularity/utils';
import { getCCStartTimestamp } from '../ReportGraph/utils';
import './styles.scss';

function SideComparisionReportInfo({
  selectedMetrics,

  durationType,
  duration,
  durationStart,
  queryStartTime,
  roles,
  timezone,
  windowSize,

  groupByX,
  groupByY,

  topX,
  topY,

  cyclicalComparisonOn,
  cyclicalComparisonCustom,
  cyclicalComparisonStart,
  cyclicalComparisonDisabled,

  selectedFilters,
}) {
  const timezoneText = timezone === '' ? moment.tz.guess() : timezone;

  const durationText =
    durationType === 'fixed'
      ? getTimeRangeMapping(roles).filter(
          (tr) => tr.value === String(duration),
        )?.[0]?.message
      : getDurationString(
          queryStartTime || durationStart,
          duration,
          timezoneText,
        );
  const windowSizeText =
    groupByX === ''
      ? WINDOW_SIZE_MAPPING?.find((wsm) => wsm.value === windowSize?.toString())
          ?.message
      : null;

  const ccEnabled =
    !cyclicalComparisonDisabled &&
    cyclicalComparisonOn &&
    cyclicalComparisonStart;
  const ccStart = getCCStartTimestamp(
    cyclicalComparisonStart,
    queryStartTime || durationStart,
    cyclicalComparisonCustom,
  );
  const filtersText = Object.keys(selectedFilters ?? {})?.join(', ');

  const { shouldAllowTopX, shouldAllowTopY } = getShouldAllowTop({
    groupByX,
    groupByY,
  });

  return (
    <ReportInfo
      selectedMetrics={selectedMetrics}
      ccEnabled={ccEnabled}
      ccStart={ccStart}
      duration={duration}
      topX={topX}
      topY={topY}
      durationText={durationText}
      windowSizeText={windowSizeText}
      shouldAllowTopX={shouldAllowTopX}
      shouldAllowTopY={shouldAllowTopY}
      timezoneText={timezoneText}
      filtersText={filtersText}
      header={'Side comparision report config summary'}
    />
  );
}
const mapStateToProps = (state) => {
  const { durationType, duration, durationStart } =
    state.report.duration.timeDuration;
  const { timezone } = state.report.duration.timeZone;
  const {
    cyclicalComparisonOn,
    cyclicalComparisonDisabled,
    cyclicalComparisonCustom,
    cyclicalComparisonStart,
  } = state.report.duration.cyclicalComparison;
  const { roles } = state.authMe.authMe;

  const { selectedMetrics } =
    state?.report?.reportDetails?.sideCompareReport?.metrics;
  const { topX, topY } =
    state?.report?.reportDetails?.sideCompareReport?.dataGranularity;

  const { windowSize } = state.report.duration.windowSize;

  const { queryStartTime } = state.report?.data?.sideReportGraphData;

  const { groupByX, groupByY } =
    state.report?.reportDetails?.sideCompareReport?.groupBy;

  const { selectedFilters } =
    state?.report?.reportDetails?.sideCompareReport?.filters;

  return {
    durationType,
    duration,
    durationStart,
    queryStartTime,
    roles,
    timezone,
    selectedMetrics,
    windowSize,
    groupByX,
    groupByY,
    topX,
    topY,

    cyclicalComparisonCustom,
    cyclicalComparisonStart,
    cyclicalComparisonDisabled,
    cyclicalComparisonOn,

    selectedFilters,
  };
};

export default connect(mapStateToProps, null)(SideComparisionReportInfo);
