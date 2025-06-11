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
import { Droppable } from 'react-beautiful-dnd';
import ButtonWrapper from 'containers/components/Button/Button';
import { Spin, Tooltip } from 'antdlatest';
import Card from '../Card';
import { buildNewRowList } from './utils';
import dragDropImage from './../../../../../images/drag-and-drop.png';
import './styles.scss';

const CARD_WIDTH = 222;
const CARD_RIGHT_MARGIN = 35;
const CARD_SCROLL_WIDTH = 756;

function InsightsGridRow({
  row,
  insightsData,
  updateFavState,
  fetchedInsightCyclicalChangeData,
  showSmartShuffle,
  setSmartShuffle,
  isLastRow,

  updateInsightsContextConfig,
  updateInsightsSignalConfig,
  setInsightsGridContextData,
  setInsightsGridSignalData,
}) {
  const width = row?.cards?.length;
  const scrollId = `column-scroll-${Math.random(1, 100)}`;
  const [scrollRef, setScrollRef] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showCardScroller, setShowCardScroller] = useState(true);

  useEffect(() => {
    const ref = document.getElementById(scrollId);
    ref.style['scroll-behavior'] = 'smooth';
    setScrollRef(ref);

    let rowWidth = 0;
    try {
      rowWidth = window.getComputedStyle(ref, null).getPropertyValue('width');
    } catch (e) {
      rowWidth = ref.currentStyle.width;
    }
    if (
      parseInt(rowWidth) >
      width * (CARD_WIDTH + CARD_RIGHT_MARGIN) - CARD_RIGHT_MARGIN
    ) {
      setShowCardScroller(false);
    } else {
      setShowCardScroller(true);
    }

    if (parseInt(rowWidth) < 1000) {
      setShowCardScroller(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  function onScrollLeft() {
    scrollRef.scrollLeft -= CARD_SCROLL_WIDTH;
    setScrollLeft(scrollRef.scrollLeft - CARD_SCROLL_WIDTH);
  }
  function onScrollRight() {
    scrollRef.scrollLeft += CARD_SCROLL_WIDTH;
    setScrollLeft(scrollRef.scrollLeft + CARD_SCROLL_WIDTH);
  }

  const disableLeftArrow = scrollLeft <= 20;
  const disableRightArrow =
    scrollLeft >=
    width * (CARD_WIDTH + CARD_RIGHT_MARGIN) - (scrollRef?.width || 1000);

  let cards = [];

  if (
    row.id === '1-hr' &&
    fetchedInsightCyclicalChangeData?.['1h'] &&
    showSmartShuffle?.['1h']
  ) {
    cards = buildNewRowList(row?.cards, '1h', insightsData);
  } else if (
    row.id === '1-day' &&
    fetchedInsightCyclicalChangeData?.['1d'] &&
    showSmartShuffle?.['1d']
  ) {
    cards = buildNewRowList(row?.cards, '1d', insightsData);
  } else {
    cards = row?.cards;
  }

  const setShuffleButtonClick = (duration) => {
    setSmartShuffle({ [duration]: !showSmartShuffle?.[duration] });
  };
  const SMART_SHUFFLE_TITLE =
    'Smart shuffle - Click me for insight recommendations';
  return (
    <div className="insights-row-container">
      <div className="row-header">
        <div className="row-header-text">{`${row.title} ${
          row.duration ? 'last' : ''
        } ${row.type.toLowerCase()}`}</div>
        <div className="shuffle-button-container">
          {row.id === '1-hr' && cards.length > 0 && (
            <Tooltip placement="topRight" title={SMART_SHUFFLE_TITLE}>
              <div
                className={`shuffle-button-${
                  showSmartShuffle?.['1h'] ? 'primary' : 'secondary'
                }`}
              >
                <ButtonWrapper
                  onClick={() => setShuffleButtonClick('1h')}
                  disabled={!fetchedInsightCyclicalChangeData?.['1h']}
                  type={showSmartShuffle?.['1h'] ? 'primary' : 'secondary'}
                >
                  {fetchedInsightCyclicalChangeData?.['1h'] ? (
                    <i
                      className={`icon-shuffle shuffle-icon ${
                        showSmartShuffle?.['1h'] ? 'shuffle-icon-active' : ''
                      }`}
                    />
                  ) : (
                    <Spin size="small"></Spin>
                  )}
                </ButtonWrapper>
              </div>
            </Tooltip>
          )}
          {row.id === '1-day' && cards.length > 0 && (
            <Tooltip placement="top" title={SMART_SHUFFLE_TITLE}>
              <div
                className={`shuffle-button-${
                  showSmartShuffle?.['1d'] ? 'primary' : 'secondary'
                }`}
              >
                <ButtonWrapper
                  onClick={() => setShuffleButtonClick('1d')}
                  disabled={!fetchedInsightCyclicalChangeData?.['1d']}
                  type={showSmartShuffle?.['1d'] ? 'primary' : 'secondary'}
                >
                  {fetchedInsightCyclicalChangeData?.['1d'] ? (
                    <i
                      className={`icon-shuffle shuffle-icon ${
                        showSmartShuffle?.['1d'] ? 'shuffle-icon-active' : ''
                      }`}
                    />
                  ) : (
                    <Spin size="small"></Spin>
                  )}
                </ButtonWrapper>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      {showCardScroller && (
        <span
          onClick={onScrollLeft}
          style={{
            position: 'relative',
            top: '163px',
            left: '-50px',
            cursor: 'pointer',
            opacity: disableLeftArrow ? 0.3 : 1,
          }}
        >
          <svg
            width="18"
            height="34"
            viewBox="0 0 18 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="scroll-arrow"
          >
            <path
              d="M17 1L0.999998 17L17 33"
              stroke="#706E6B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {showCardScroller && (
        <svg
          onClick={onScrollRight}
          style={{
            position: 'absolute',
            top: '185px',
            right: '-50px',
            zIndex: 100,
            cursor: 'pointer',
            opacity: disableRightArrow ? 0.3 : 1,
          }}
          className="scroll-arrow"
          width="18"
          height="34"
          viewBox="0 0 18 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 33L17 17L1 0.999999"
            stroke="#706E6B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <Droppable droppableId={row.id} direction="horizontal">
        {(provided) => (
          <div
            id={scrollId}
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="insights-grid-row"
          >
            {cards?.map((card, index) => (
              <Card
                key={card?.id}
                card={card}
                cardIndex={index}
                rowId={row.id}
                updateFavState={updateFavState}
                disabledDragDrop={
                  showSmartShuffle?.['1h'] || showSmartShuffle?.['1d']
                }
                updateInsightsContextConfig={updateInsightsContextConfig}
                updateInsightsSignalConfig={updateInsightsSignalConfig}
                setInsightsGridContextData={setInsightsGridContextData}
                setInsightsGridSignalData={setInsightsGridSignalData}
              ></Card>
            ))}

            {row.cards.length === 0 && !isLastRow && (
              <div className="no-data-icon-container">
                <div>
                  <img src={dragDropImage} alt="" style={{ width: '50px' }} />
                </div>
                <div className="text">Drag Reports From All Insights</div>
              </div>
            )}
            {row.cards.length === 0 && isLastRow && (
              <div className="no-data-icon-container">
                <div>
                  <i
                    className="icon-EMPTY-STATE-1"
                    style={{
                      fontSize: '85px',
                    }}
                  >
                    <span className="path1" />
                    <span className="path2" />
                    <span className="path3" />
                    <span className="path4" />
                    <span className="path5" />
                    <span className="path6" />
                    <span className="path7" />
                  </i>{' '}
                </div>
                <div className="text">Create Report By Selecting Context</div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default InsightsGridRow;
