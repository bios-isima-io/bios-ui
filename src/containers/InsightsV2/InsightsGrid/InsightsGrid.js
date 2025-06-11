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
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Spin } from 'antdlatest';
import OverviewCharts from '../OverviewCharts';
import InsightsGridRow from './Components/InsightsGridRow';
import { insightsGridActions } from './reducers';
import { insightsGridActions as insightsGridContextActions } from './../InsightGridContext/reducers';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import './styles.scss';

const {
  fetchInsightsGridData,
  cancelFetchInsightsGridData,
  setInsightsGridData,
  updateInsightsConfig,
  resetInsightsGridData,
  fetchNewCardData,
  fetchInsightsAllCardData,
  setSmartShuffle,
} = insightsGridActions;

const {
  fetchInsightsGridData: fetchInsightsGridContextData,
  fetchInsightsAllCardData: fetchInsightsAllCardContextData,
  fetchNewCardData: fetchNewCardContextData,
  updateInsightsConfig: updateInsightsContextConfig,
  setInsightsGridData: setInsightsGridContextData,
} = insightsGridContextActions;

function InsightsGrid({
  signals,
  metricsModifiers,
  insightsSignalData,
  gridSignalData,
  fetchedInsightCyclicalChangeData,
  showSmartShuffle,
  setSmartShuffle,
  fetchInsightsGridData,
  cancelFetchInsightsGridData,
  setInsightsGridData,
  updateInsightsConfig,
  allReports,
  resetInsightsGridData,
  fetchNewCardData,
  fetchInsightsAllCardData,
  contexts,
  fetchInsightsGridContextData,
  fetchInsightsAllCardContextData,
  gridContextData,
  updateInsightsContextConfig,
  setInsightsGridContextData,
}) {
  const [cardSequentialLoad, setCardSequentialLoad] = useState(false);
  const [cardContextSequentialLoad, setCardContextSequentialLoad] =
    useState(false);
  const [gridData, setGridData] = useState([]);

  const dragEndContext = (result) => {
    if (result?.destination?.droppableId === 'overview-charts-droppable') {
      if (result?.reason === 'DROP' && result?.source?.droppableId === 'mine') {
        updateFavStateContext(
          result?.source?.droppableId,
          result?.draggableId,
          true,
        );
      }
      return;
    }

    if (
      result?.reason !== 'DROP' ||
      result?.destination === null ||
      result?.source === null
    ) {
      return;
    }

    const sourceDroppableId = result?.source?.droppableId;
    const destinationDroppableId = result?.destination?.droppableId;
    const sourceIndex = result?.source?.index;
    const destinationIndex = result?.destination?.index;

    // no position changed
    if (
      sourceDroppableId === destinationDroppableId &&
      sourceIndex === destinationIndex
    ) {
      return;
    }
    const newData = cloneDeep(gridContextData);
    const dest = newData.filter((d) => d.id === destinationDroppableId);
    const src = gridData.filter((d) => d.id === sourceDroppableId);

    // same row card moment
    if (
      destinationDroppableId !== 'all-report' &&
      sourceDroppableId === destinationDroppableId
    ) {
      let filterRow = newData.filter((row) => row.id === sourceDroppableId);
      if (filterRow.length === 1) {
        const temp = filterRow[0].cards[sourceIndex];
        filterRow[0].cards.splice(sourceIndex, 1);
        filterRow[0].cards.splice(destinationIndex, 0, temp);
        updateInsightsContextConfig({ gridData: newData });
        setInsightsGridContextData(newData);
      }
      return;
    }
    // report already exist when pulled from other row
    if (
      destinationDroppableId !== 'all-report' &&
      dest[0].cards.find(
        (card) => card.reportId === src[0].cards[sourceIndex].reportId,
      )
    ) {
      ErrorNotification({
        message: messages.insight.reportAlreadyExistInPeriod(
          destinationDroppableId,
        ),
      });
      return;
    }

    if (dest[0].cards.length > 6) {
      ErrorNotification({
        message: messages.insight.DRAG_CARD_LIMIT,
      });
      return;
    }

    let card;
    if (sourceDroppableId === 'all-report') {
      card = cloneDeep(src[0].cards[sourceIndex]);
      card.id = uuidv4();
    } else {
      card = src[0].cards.splice(sourceIndex, 1)[0];
    }

    if (destinationDroppableId !== 'all-report') {
      dest[0].cards = [
        ...dest[0].cards.slice(0, destinationIndex),
        card,
        ...dest[0].cards.slice(destinationIndex),
      ];
    }
    updateInsightsContextConfig({ gridData: newData });
    setInsightsGridContextData(newData);
  };

  const updateFavStateContext = (rowId, cardId, newFav) => {
    const newData = cloneDeep(gridContextData);
    newData.forEach((section) => {
      if (section.id === rowId) {
        section.cards.forEach((card) => {
          if (card.id === cardId) {
            card.fav = newFav;
          }
        });
      }
    });
    updateInsightsContextConfig({ gridData: newData });
    setInsightsGridContextData(newData);
  };

  const checkIfSourceCardIsContext = ({ gridData, result }) => {
    const row = gridData?.find((d) => d.id === result?.source?.droppableId);
    let isContext = false;
    if (row && row?.cards?.[result?.source?.index].type === 'context') {
      isContext = true;
    }
    return isContext;
  };

  const checkIfInvalidCardMovement = (result, isContextCard) => {
    const sourceDroppableId = result?.source?.droppableId;
    const destinationDroppableId = result?.destination?.droppableId;
    const signalReport = ['1-hr', '1-day'];
    const contextReport = ['mine'];
    if (
      signalReport.includes(sourceDroppableId) &&
      contextReport.includes(destinationDroppableId)
    ) {
      return true;
    }
    if (
      signalReport.includes(destinationDroppableId) &&
      contextReport.includes(sourceDroppableId)
    ) {
      return true;
    }
    if (
      sourceDroppableId === 'all-report' &&
      isContextCard &&
      signalReport.includes(destinationDroppableId)
    ) {
      return true;
    }
    if (
      sourceDroppableId === 'all-report' &&
      !isContextCard &&
      contextReport.includes(destinationDroppableId)
    ) {
      return true;
    }
    return false;
  };

  const dragEnd = (result) => {
    const isContextCard = checkIfSourceCardIsContext({ result, gridData });

    if (checkIfInvalidCardMovement(result, isContextCard)) {
      ErrorNotification({
        message: 'Movement between signal & context insights not allowed',
      });
      return;
    }
    if (isContextCard) {
      dragEndContext(result);
      return;
    }
    if (result?.destination?.droppableId === 'overview-charts-droppable') {
      if (
        result?.reason === 'DROP' &&
        (result?.source?.droppableId === '1-hr' ||
          result?.source?.droppableId === '1-day')
      ) {
        updateFavState(result?.source?.droppableId, result?.draggableId, true);
      }
      return;
    }

    if (
      result?.reason !== 'DROP' ||
      result?.destination === null ||
      result?.source === null
    ) {
      return;
    }

    const sourceDroppableId = result?.source?.droppableId;
    const destinationDroppableId = result?.destination?.droppableId;
    const sourceIndex = result?.source?.index;
    const destinationIndex = result?.destination?.index;

    // no position changed
    if (
      sourceDroppableId === destinationDroppableId &&
      sourceIndex === destinationIndex
    ) {
      return;
    }
    const newData = cloneDeep(gridSignalData);
    const dest = newData.filter((d) => d.id === destinationDroppableId);
    const src = newData.filter((d) => d.id === sourceDroppableId);

    // same row card moment
    if (
      destinationDroppableId !== 'all-report' &&
      sourceDroppableId === destinationDroppableId
    ) {
      let filterRow = newData.filter((row) => row.id === sourceDroppableId);
      if (filterRow.length === 1) {
        const temp = filterRow[0].cards[sourceIndex];
        filterRow[0].cards.splice(sourceIndex, 1);
        filterRow[0].cards.splice(destinationIndex, 0, temp);
        updateInsightsConfig({ gridData: newData });
        setInsightsGridData(newData);
      }
      return;
    }

    // report already exist when pulled from other row
    if (
      destinationDroppableId !== 'all-report' &&
      dest[0].cards.find(
        (card) => card.reportId === src[0].cards[sourceIndex].reportId,
      )
    ) {
      ErrorNotification({
        message: messages.insight.reportAlreadyExistInPeriod(
          destinationDroppableId,
        ),
      });
      return;
    }

    if (dest[0].cards.length > 6) {
      ErrorNotification({
        message: messages.insight.DRAG_CARD_LIMIT,
      });
      return;
    }

    let card;
    if (sourceDroppableId === 'all-report') {
      card = cloneDeep(src[0].cards[sourceIndex]);
      card.id = uuidv4();
    } else {
      card = src[0].cards.splice(sourceIndex, 1)[0];
    }

    if (destinationDroppableId !== 'all-report') {
      dest[0].cards = [
        ...dest[0].cards.slice(0, destinationIndex),
        card,
        ...dest[0].cards.slice(destinationIndex),
      ];

      //handles card data update
      fetchNewCardData({
        reportId: card.reportId,
        insightGridDuration:
          destinationDroppableId === '1-hr' ? 3600000 : 86400000,
        allReports,
        signals,
        metricsModifiers,
      });
    }
    updateInsightsConfig({ gridData: newData });
    setInsightsGridData(newData);
  };

  const updateFavState = (rowId, cardId, newFav) => {
    const newData = cloneDeep(gridSignalData);
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

  useEffect(() => {
    if (signals.length > 0) {
      fetchInsightsGridData({ signals });
    }
  }, [fetchInsightsGridData, signals]);

  useEffect(() => {
    if (contexts.length > 0) {
      fetchInsightsGridContextData({ contexts });
    }
  }, [contexts, fetchInsightsGridContextData]);

  useEffect(() => {
    if (signals.length > 0) {
      fetchInsightsGridData({ signals });
    }
    if (contexts.length > 0) {
      fetchInsightsGridContextData({ contexts });
    }

    return () => {
      resetInsightsGridData();
      cancelFetchInsightsGridData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cardSequentialLoad && gridSignalData) {
      setCardSequentialLoad(true);
      fetchInsightsAllCardData({
        signals,
        metricsModifiers,
        allReports,
        gridData: gridSignalData,
      });
    }
  }, [
    allReports,
    cardSequentialLoad,
    fetchInsightsAllCardData,
    gridSignalData,
    metricsModifiers,
    signals,
  ]);

  useEffect(() => {
    if (!cardContextSequentialLoad && gridContextData) {
      setCardContextSequentialLoad(true);
      fetchInsightsAllCardContextData({
        contexts,
        metricsModifiers,
        allReports,
        gridData: gridContextData,
      });
    }
  }, [
    allReports,
    cardContextSequentialLoad,
    fetchInsightsAllCardContextData,
    gridContextData,
    metricsModifiers,
    contexts,
  ]);

  useEffect(() => {
    if (!gridSignalData || !gridContextData) {
      return;
    }

    const mineCards = gridContextData?.[0]?.cards.map((card) => {
      card.type = 'context';
      return card;
    });
    const mineCardList = cloneDeep(gridContextData?.[0]);
    mineCardList.card = mineCards;
    const allContextCards = gridContextData?.[1]?.cards.map((card) => {
      card.type = 'context';
      return card;
    });
    const allReportsCards = [
      ...(gridSignalData?.[2]?.cards ? gridSignalData?.[2]?.cards : []),
      ...(allContextCards ? allContextCards : []),
    ];
    const allReports = cloneDeep(gridSignalData?.[2]);
    allReports.cards = allReportsCards;
    const gridData1 = [
      gridSignalData?.[0],
      gridSignalData?.[1],
      mineCardList,
      allReports,
    ];
    setGridData(gridData1);
  }, [gridSignalData, gridContextData, allReports]);

  return (
    <>
      <DragDropContext onDragEnd={dragEnd}>
        <OverviewCharts />
        <div>
          {gridData?.length === 0 ? (
            <div className="grid-data-loader">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {gridData?.map((row, index) => {
                const ufs =
                  row.id === 'mine' ? updateFavStateContext : updateFavState;
                return (
                  <InsightsGridRow
                    key={row.id}
                    row={row}
                    updateFavState={ufs}
                    fetchedInsightCyclicalChangeData={
                      fetchedInsightCyclicalChangeData
                    }
                    insightsData={insightsSignalData}
                    setSmartShuffle={setSmartShuffle}
                    showSmartShuffle={showSmartShuffle}
                    updateInsightsContextConfig={updateInsightsContextConfig}
                    updateInsightsSignalConfig={updateInsightsConfig}
                    setInsightsGridContextData={setInsightsGridContextData}
                    setInsightsGridSignalData={setInsightsGridData}
                    isLastRow={index === gridData.length - 1}
                  ></InsightsGridRow>
                );
              })}
            </>
          )}
        </div>
      </DragDropContext>
    </>
  );
}

const mapStateToProps = (state) => {
  const {
    insightsData: insightsSignalData,
    gridData: gridSignalData,
    fetchedInsightCyclicalChangeData,
    showSmartShuffle,
  } = state?.insights?.insightsGrid;
  const { signals, metricsModifiers } = state?.signalMultiSelect;
  const { contexts } = state?.contextReport?.contextMultiSelect;
  const { allReports } = state?.report?.reportDetails;

  const { insightsData: insightsContextData, gridData: gridContextData } =
    state?.insights?.insightsContextGrid;
  return {
    signals,
    insightsSignalData,
    gridSignalData,
    fetchedInsightCyclicalChangeData,
    showSmartShuffle,
    metricsModifiers,
    allReports,

    contexts,
    insightsContextData,
    gridContextData,
  };
};

const mapDispatchToProps = {
  fetchInsightsGridData,
  cancelFetchInsightsGridData,
  setInsightsGridData,
  updateInsightsConfig,
  resetInsightsGridData,
  fetchNewCardData,
  fetchInsightsAllCardData,
  setSmartShuffle,
  fetchInsightsGridContextData,
  fetchInsightsAllCardContextData,
  fetchNewCardContextData,
  updateInsightsContextConfig,
  setInsightsGridContextData,
};

InsightsGrid.propTypes = {
  insightsSignalData: PropTypes.object,
  gridSignalData: PropTypes.array,
  fetchedInsightCyclicalChangeData: PropTypes.object,
  showSmartShuffle: PropTypes.object,
  signals: PropTypes.array,
  metricsModifiers: PropTypes.array,
  allReports: PropTypes.array,
  fetchInsightsGridData: PropTypes.func,
  cancelFetchInsightsGridData: PropTypes.func,
  setInsightsGridData: PropTypes.func,
  fetchNewCardData: PropTypes.func,
  updateInsightsConfig: PropTypes.func,
  fetchInsightsAllCardData: PropTypes.func,
  setSmartShuffle: PropTypes.func,
  contexts: PropTypes.array,
  fetchInsightsGridContextData: PropTypes.func,
  fetchInsightsAllCardContextData: PropTypes.func,
  gridContextData: PropTypes.array,
  updateInsightsContextConfig: PropTypes.func,
  setInsightsGridContextData: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsGrid);
