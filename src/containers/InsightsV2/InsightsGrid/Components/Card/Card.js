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
import { Draggable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import Trend from 'react-trend';
import { Spin, Tooltip } from 'antdlatest';
import moment from 'moment';
import useVisibility from './visible';
import { ErrorNotification } from 'containers/utils';
import { ConfirmationDialog } from 'containers/components';
import { insightsGridActions } from './../../reducers';
import { insightsGridActions as contextInsightsGridActions } from './../../../InsightGridContext/reducers';
import { reportActions } from 'containers/ReportV2/reducers';
import messages from 'utils/notificationMessages';
import ipxl from '@bios/ipxl';
import { buildPositiveIndicatorMap } from 'containers/InsightsV2/utils';
import { cloneDeep } from 'lodash';
import './styles.scss';

const { userClicks } = ipxl;
const { fetchNewCardData } = insightsGridActions;
const { fetchNewCardData: contextFetchNewCardData } =
  contextInsightsGridActions;
const { deleteReport } = reportActions;
function Card({
  card,
  cardIndex,
  rowId,
  updateFavState,
  insightsData,
  gridData,
  fetchNewCardData,
  allReports,
  signals,
  metricsModifiers,
  disabledDragDrop,
  deleteReport,

  contextFetchNewCardData,
  contexts,
  contextGridData,
  updateInsightsContextConfig,
  updateInsightsSignalConfig,
  setInsightsGridContextData,
  setInsightsGridSignalData,
}) {
  const history = useHistory();
  const [isVisible, cardVisibleRef] = useVisibility(0);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [trendLine, setTrendLine] = useState([]);
  const [count, setCount] = useState(null);
  const [insightGridDuration, setInsightGridDuration] = useState(null);
  const [hasFilter, setHasFilter] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteReportConfirm, setShowDeleteReportConfirm] = useState(false);
  const positiveIndicatorMap = buildPositiveIndicatorMap(signals);

  useEffect(() => {
    const dur = getDuration();
    let insightGridDuration = null;
    if (dur === '') {
      insightGridDuration = 'allReport';
    } else if (dur === 3600000) {
      insightGridDuration = '1h';
    } else if (dur === 86400000) {
      insightGridDuration = '1d';
    } else {
      return;
    }
    setInsightGridDuration(insightGridDuration);
    if (
      isVisible &&
      insightsData?.[insightGridDuration]?.[card.reportId] === undefined
    ) {
      if (card.type === 'context') {
        contextFetchNewCardData({
          reportId: card.reportId,
          allReports,
          contexts,
          metricsModifiers,
        });
      } else {
        fetchNewCardData({
          reportId: card.reportId,
          insightGridDuration: getDuration(),
          allReports,
          signals,
          metricsModifiers,
          positiveIndicatorMap,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (!isLoaded && insightsData?.[insightGridDuration]?.[card?.reportId]) {
      const cardDetails = insightsData?.[insightGridDuration]?.[card?.reportId];
      setIsLoaded(true);
      const updatedAtNew = moment(cardDetails.lastTimeStamp).fromNow();
      setUpdatedAt(updatedAtNew);
      setCount(cardDetails.count);
      setTrendLine(cardDetails.trendLineArray);
      setHasFilter(cardDetails.hasFilter);
      if (cardDetails?.error) {
        setError(cardDetails.error);
      }
    }
  }, [isLoaded, insightsData, insightGridDuration, card?.reportId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cardDetails = insightsData?.[insightGridDuration]?.[card?.reportId];
      if (cardDetails) {
        const updatedAtNew = moment(cardDetails?.lastTimeStamp).fromNow();
        updatedAtNew && setUpdatedAt(updatedAtNew);
      }
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightsData]);

  const checkFavReportLimit = (gridData) => {
    let count = 0;
    gridData?.forEach((row) => {
      row?.cards.forEach((card) => {
        if (card?.fav) {
          count++;
        }
      });
    });
    return count > 19;
  };

  const changeFavState = (fav) => {
    if (!fav && checkFavReportLimit(gridData)) {
      ErrorNotification({
        message: messages.insight.FAV_REPORT_LIMIT,
      });
      return;
    }
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: `${card?.title} favorite change to ${fav}`,
      rightSection: 'None',
      mainSection: 'insight',
      leftSection: 'insight',
    });
    updateFavState(rowId, card.id, !fav);
  };

  const getDuration = () => {
    if (rowId) {
      if (rowId === '1-hr') {
        return 3600000;
      }
      if (rowId === '1-day') {
        return 86400000;
      }
    }
    return '';
  };

  const showReport = () => {
    if (
      card?.cardType !== 'invalidCardNoSignal' &&
      card?.cardType !== 'invalidCardNoFeature'
    ) {
      userClicks({
        pageURL: history?.location?.pathname,
        pageTitle: document.title,
        pageDomain: window?.location?.origin,
        eventLabel: `Show ${card?.title} report`,
        rightSection: 'None',
        mainSection: 'insight',
        leftSection: 'insight',
      });
      if (card.type === 'context') {
        history.push('/context-report/' + card.reportId + '/');
      } else {
        history.push('/report/' + card.reportId + '/' + getDuration());
      }
    }
  };

  return (
    <div>
      <ConfirmationDialog
        show={showDeleteReportConfirm}
        onCancel={() => {
          setShowDeleteReportConfirm(false);
        }}
        onOk={() => {
          let newData = null;
          if (card.type === 'context') {
            newData = cloneDeep(contextGridData);
            for (let filterRow of newData) {
              filterRow.cards = filterRow.cards.filter(
                (cd) => cd.reportId !== card.reportId,
              );
            }
            //update insight grid
            updateInsightsContextConfig({ gridData: newData });
            setInsightsGridContextData(newData);
          } else {
            newData = cloneDeep(gridData);
            for (let filterRow of newData) {
              filterRow.cards = filterRow.cards.filter(
                (cd) => cd.reportId !== card.reportId,
              );
            }
            //update insight grid
            updateInsightsSignalConfig({ gridData: newData });
            setInsightsGridSignalData(newData);
          }

          // delete report
          deleteReport(card.reportId, null);
        }}
        type="delete"
        onCancelText="No, Keep Report"
        onOkText="Yes, Delete Report"
        headerTitleText="Delete Report"
        helperText="Deleting the report will remove it for all users"
      />
      <Draggable
        key={card?.id}
        draggableId={card?.id}
        index={cardIndex}
        isDragDisabled={
          disabledDragDrop || card.cardType === 'invalidCardNoSignal'
        }
      >
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`row-card ${
              rowId === 'all-report' ? 'all-report-card' : ''
            }`}
            onClick={() => showReport()}
          >
            <div className="card-icon-close">
              <i
                className="icon-close"
                onClick={(e) => {
                  e.stopPropagation();
                  if (rowId === 'all-report') {
                    setShowDeleteReportConfirm(true);
                  } else if (rowId === '1-day' || rowId === '1-hr') {
                    // update insight
                    const newData = cloneDeep(gridData);
                    let filterRow = newData.filter((row) => row.id === rowId);
                    if (filterRow.length === 1) {
                      filterRow[0].cards.splice(cardIndex, 1);
                      updateInsightsSignalConfig({ gridData: newData });
                      setInsightsGridSignalData(newData);
                    }
                  } else if (rowId === 'mine') {
                    const newData = cloneDeep(contextGridData);
                    let filterRow = newData.filter((row) => row.id === rowId);
                    if (filterRow.length === 1) {
                      filterRow[0].cards.splice(cardIndex, 1);
                      updateInsightsContextConfig({ gridData: newData });
                      setInsightsGridContextData(newData);
                    }
                  }
                }}
              />
            </div>
            <div className="card-title" ref={cardVisibleRef}>
              {card?.title}
            </div>
            <div className="card-updated-at">
              {card?.type !== 'context' && (error !== '' ? error : updatedAt)}
            </div>
            <div className="card-filter">
              {hasFilter && (
                <Tooltip placement="top" title="Filter enabled">
                  <i className="icon-filter" />
                </Tooltip>
              )}
            </div>
            <div className="card-change">{card?.change}</div>
            <div className="card-indicator">
              {card.count ? card.count : count?.toLocaleString()}
            </div>
            <div className="card-fav">
              {rowId !== 'all-report' && (
                <i
                  onClick={(e) => {
                    e.stopPropagation();
                    changeFavState(card.fav);
                  }}
                  className={`icon-fav ${
                    card.fav === false ? 'icon-fav-border-only' : ''
                  }`}
                />
              )}
            </div>
            {card?.value}
            {card.type === 'context' ? (
              <div className="card-mini-graph">
                <div style={{ width: '220px' }}>
                  <Trend
                    smooth
                    gradient={['#000']}
                    radius={10}
                    strokeWidth={2}
                    strokeLinecap={'butt'}
                    data={card.trendLineArray ? card.trendLineArray : []}
                    autoDrawDuration={500}
                    autoDrawEasing="ease-in"
                  />
                </div>
              </div>
            ) : (
              <div className="card-mini-graph">
                {error === '' && isLoaded && (
                  <div style={{ width: '220px' }}>
                    <Trend
                      smooth
                      gradient={['#000']}
                      radius={10}
                      strokeWidth={2}
                      strokeLinecap={'butt'}
                      data={trendLine ? trendLine : []}
                      autoDrawDuration={500}
                      autoDrawEasing="ease-in"
                    />
                  </div>
                )}
                {!isLoaded && <Spin size="small" className="graph-loader" />}
              </div>
            )}
          </div>
        )}
      </Draggable>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { signals, metricsModifiers } = state?.signalMultiSelect;
  const { allReports } = state?.report?.reportDetails;
  const { insightsData, gridData } = state?.insights?.insightsGrid;
  const { gridData: contextGridData } = state?.insights?.insightsContextGrid;
  const { contexts } = state?.contextReport?.contextMultiSelect;

  return {
    allReports,
    signals,
    metricsModifiers,
    insightsData,
    gridData,
    contextGridData,
    contexts,
  };
};

const mapDispatchToProps = {
  fetchNewCardData,
  deleteReport,
  contextFetchNewCardData,
};

Card.propTypes = {
  card: PropTypes.object,
  cardIndex: PropTypes.number,
  rowId: PropTypes.string,
  updateFavState: PropTypes.func,
  fetchNewCardData: PropTypes.func,
  allReports: PropTypes.array,
  signals: PropTypes.array,
  metricsModifiers: PropTypes.array,
  insightsData: PropTypes.object,
  gridData: PropTypes.array,
  deleteReport: PropTypes.func,
  contextFetchNewCardData: PropTypes.func,
  contexts: PropTypes.array,
  contextGridData: PropTypes.array,
  updateInsightsContextConfig: PropTypes.func,
  updateInsightsSignalConfig: PropTypes.func,
  setInsightsGridContextData: PropTypes.func,
  setInsightsGridSignalData: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
