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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tooltip } from 'antdlatest';
import { insightsGridActions } from 'containers/InsightsV2/InsightsGrid/reducers';
import { cloneDeep, isNumber } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ErrorNotification, InfoNotification } from 'containers/utils';
import { reportHeaderActions } from '../reducers';
import {
  REPORT_PAGE_SAVE_TO_INSIGHTS,
  REPORT_PAGE_SAVE_TO_INSIGHTS_FAILURE,
  REPORT_PAGE_SAVE_TO_INSIGHTS_SUCCESS,
} from './const';

const { fetchInsightsGridData, updateInsightsConfig } = insightsGridActions;
const { resetSaveReportToInsights } = reportHeaderActions;

function SaveToInsights({
  reportType,
  activeReportId,

  signals,
  gridData,
  duration,
  saveReportToInsightsMessage,

  fetchInsightsGridData,
  updateInsightsConfig,
  resetSaveReportToInsights,
}) {
  const [saving, setSaving] = useState(false);
  const section =
    duration === 3600000 ? '1-hr' : isNumber(duration) ? '1-day' : null;
  let row = null;
  switch (section) {
    case '1-hr':
      row = gridData?.[0];
      break;

    case '1-day':
      row = gridData?.[1];
      break;

    default:
      row = null;
  }
  const cardPresentInSection = row?.cards?.find(
    (card) => card.reportId === activeReportId,
  );

  useEffect(() => {
    if (saveReportToInsightsMessage && section) {
      if (
        saveReportToInsightsMessage === REPORT_PAGE_SAVE_TO_INSIGHTS_SUCCESS
      ) {
        const duration = section === '1-hr' ? 'hour' : 'day';
        InfoNotification({ message: `Report saved to 1 ${duration} insights` });
      } else if (
        saveReportToInsightsMessage === REPORT_PAGE_SAVE_TO_INSIGHTS_FAILURE
      ) {
        ErrorNotification({ message: `Failed saving report to insights` });
      }
    }
  }, [saveReportToInsightsMessage, section]);

  useEffect(() => {
    if (saveReportToInsightsMessage) {
      fetchInsightsGridData({ signals, avoidRefetchingReports: true });
      resetSaveReportToInsights();
    }
  }, [
    saveReportToInsightsMessage,
    fetchInsightsGridData,
    signals,
    resetSaveReportToInsights,
  ]);
  useEffect(() => {
    if (!saveReportToInsightsMessage) {
      resetSaveReportToInsights();
      setSaving(false);
    }
  }, [saveReportToInsightsMessage, signals, resetSaveReportToInsights]);

  useEffect(() => {
    if (signals?.length > 0) {
      fetchInsightsGridData({ signals, avoidRefetchingReports: true });
    }
  }, [fetchInsightsGridData, signals]);

  const moveToInsightsDisabled =
    cardPresentInSection || !section || !row || !activeReportId || saving;
  const saveToInsights = () => {
    if (moveToInsightsDisabled) {
      return;
    }
    setSaving(true);
    const newData = cloneDeep(gridData);
    const sectionIndex = section === '1-hr' ? 0 : 1;
    newData?.[sectionIndex].cards?.push({
      id: uuidv4(),
      reportId: activeReportId,
      fav: false,
    });
    updateInsightsConfig({
      gridData: newData,
      calledFrom: REPORT_PAGE_SAVE_TO_INSIGHTS,
    });
  };

  return reportType === 'existing' ? (
    <Tooltip
      placement="top"
      title={
        cardPresentInSection
          ? 'Already Present in Insights'
          : 'Save to Insights'
      }
    >
      <i
        className={`icon-clone icon-clone-custom ${
          moveToInsightsDisabled && 'icon-disabled'
        }`}
        onClick={() => saveToInsights()}
      />
    </Tooltip>
  ) : null;
}

const mapStateToProps = (state) => {
  const { gridData } = state?.insights?.insightsGrid;
  const { signals } = state?.signalMultiSelect;
  const { duration } = state?.report?.duration?.timeDuration;
  const { saveReportToInsightsMessage } = state?.report?.headerButton;
  return {
    signals,
    gridData,
    duration,
    saveReportToInsightsMessage,
  };
};

const mapDispatchToProps = {
  fetchInsightsGridData,
  updateInsightsConfig,
  resetSaveReportToInsights,
};

SaveToInsights.propTypes = {
  reportType: PropTypes.string,
  activeReportId: PropTypes.string,
  signals: PropTypes.array,
  gridData: PropTypes.array,
  duration: PropTypes.number,
  saveReportToInsightsMessage: PropTypes.string,
  fetchInsightsGridData: PropTypes.func,
  updateInsightsConfig: PropTypes.func,
  resetSaveReportToInsights: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(SaveToInsights);
