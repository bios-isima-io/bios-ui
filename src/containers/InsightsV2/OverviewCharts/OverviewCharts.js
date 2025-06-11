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
import { Carousel, Tooltip } from 'antdlatest';
import { Icon } from 'antd';
import OverviewSignalCard from './components/OverviewCard';
import OverviewContextCard from '../OverviewChartsContext/components/OverviewCard';
import { overviewContextChartsActions } from '../OverviewChartsContext/reducers';
import { getFavReportsFromInsightsConfig as getContextFavReportsFromInsightsConfig } from '../OverviewChartsContext/utils';
import { overviewChartsActions } from './reducers';
import { useHistory } from 'react-router-dom';
import graphLoader from 'images/graphloader.gif';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import Highcharts from 'highcharts';
import { Droppable } from 'react-beautiful-dnd';
import { useWindowSize } from 'common/hooks';
import { buildReportMap } from 'containers/ReportV2/utils';
import { getFavReportsFromInsightsConfig } from './utils';
import coffeeImage from '../../../images/coffee.gif';
import dragDropImage from '../../../images/drag-and-drop.png';
import ipxl from '@bios/ipxl';
import './styles.scss';

const { userClicks } = ipxl;

const { fetchOverviewChartReport, resetOverviewChartData } =
  overviewChartsActions;

const {
  fetchOverviewChartReport: fetchOverviewChartContextReport,
  resetOverviewChartData: resetOverviewChartContextData,
} = overviewContextChartsActions;

function OverviewCharts({
  insightsConfig,
  gridData,
  allReports,
  signals,
  loaderSignal,
  chartDataSignal,
  resetOverviewChartData,
  fetchOverviewChartReport,
  metricsModifiers,

  fetchOverviewChartContextReport,
  resetOverviewChartContextData,
  contexts,
  insightsContextConfig,
  chartDataContext,
}) {
  const isMobile = window.innerWidth < isimaLargeDeviceBreakpointNumber;
  const chartsCarouselRef = React.createRef();
  const history = useHistory();
  const [autoRotateCarousel, setAutoRotateCarousel] = useState(true);
  const [firstGridDataLoad, setFirstGridDataLoad] = useState(false);
  const [filteredFavReports, setFilteredFavReports] = useState([]);
  const [screenWidth] = useWindowSize();
  useEffect(() => {
    const updateCharts = () =>
      Highcharts.charts.forEach((chart) => {
        if (chart) {
          chart.reflow();
        }
      });
    setTimeout(updateCharts, 1000);
  }, [screenWidth]);

  useEffect(() => {
    if (
      ((insightsConfig?.sections?.length > 0 &&
        insightsContextConfig?.sections?.length === 0) ||
        gridData?.length > 0) &&
      allReports?.reportConfigs?.length > 0 &&
      signals?.length > 0
    ) {
      if (gridData !== null && !firstGridDataLoad) {
        setFirstGridDataLoad(true);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData, insightsConfig, insightsContextConfig, allReports, signals]);

  useEffect(() => {
    return () => {
      resetOverviewChartData();
      resetOverviewChartContextData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let reportMap;
    let filteredFavReportsTemp;
    if (
      ((insightsConfig?.sections?.length > 0 && signals?.length > 0) ||
        (insightsContextConfig?.sections?.length === 0 &&
          contexts?.length > 0)) &&
      allReports?.reportConfigs?.length > 0
    ) {
      reportMap = buildReportMap(allReports?.reportConfigs);
      const signalReports =
        insightsConfig?.sections?.length > 0 && signals?.length > 0
          ? getFavReportsFromInsightsConfig({
              insightsConfig,
              reportMap,
            })
          : [];
      const contextReports =
        insightsContextConfig?.sections?.length > 0 && contexts?.length > 0
          ? getContextFavReportsFromInsightsConfig({
              insightsConfig: insightsContextConfig,
              reportMap,
            })
          : [];
      filteredFavReportsTemp = [
        ...(signalReports ? signalReports : []),
        ...(contextReports ? contextReports : []),
      ];
    }

    if (
      ((insightsConfig?.sections?.length > 0 && signals?.length > 0) ||
        (insightsContextConfig?.sections?.length === 0 &&
          contexts?.length > 0)) &&
      allReports?.reportConfigs?.length > 0 &&
      filteredFavReportsTemp.length > 0
    ) {
      if (filteredFavReportsTemp?.[0]?.reportType === 'contextReport') {
        fetchOverviewChartContextReport({
          contexts,
          metricsModifiers,
          signals,
          ...filteredFavReportsTemp?.[0],
        });
      } else {
        fetchOverviewChartReport({
          signals,
          metricsModifiers,
          ...filteredFavReportsTemp?.[0],
        });
      }
      setFilteredFavReports(filteredFavReportsTemp);
    }
  }, [
    insightsConfig,
    insightsContextConfig,
    allReports,
    signals,
    contexts,
    fetchOverviewChartReport,
    metricsModifiers,
    fetchOverviewChartContextReport,
  ]);

  useEffect(() => {
    let reportMap;
    let filteredFavReportsTemp;
    if (
      ((insightsConfig?.sections?.length > 0 && signals?.length > 0) ||
        (insightsContextConfig?.sections?.length === 0 &&
          contexts?.length > 0)) &&
      allReports?.reportConfigs?.length > 0
    ) {
      reportMap = buildReportMap(allReports?.reportConfigs);
      const signalReports =
        insightsConfig?.sections?.length > 0 && signals?.length > 0
          ? getFavReportsFromInsightsConfig({
              insightsConfig,
              reportMap,
            })
          : [];
      const contextReports =
        insightsContextConfig?.sections?.length > 0 && contexts?.length > 0
          ? getContextFavReportsFromInsightsConfig({
              insightsConfig: insightsContextConfig,
              reportMap,
            })
          : [];
      filteredFavReportsTemp = [
        ...(signalReports ? signalReports : []),
        ...(contextReports ? contextReports : []),
      ];
      if (
        filteredFavReportsTemp.length !== filteredFavReports.length &&
        filteredFavReportsTemp.length > 0
      ) {
        let chardDataId;
        if (filteredFavReports?.[0]?.reportType === 'contextReport') {
          chardDataId = `${filteredFavReportsTemp?.[0].report?.reportId}`;
        } else {
          chardDataId = `${filteredFavReportsTemp?.[0]?.report?.reportId}_${filteredFavReportsTemp?.[0]?.duration}`;
        }
        const chartData =
          filteredFavReportsTemp?.[0]?.report?.reportType === 'contextReport'
            ? chartDataContext
            : chartDataSignal;
        if (
          filteredFavReportsTemp?.[0]?.report?.reportType === 'contextReport'
        ) {
          chartData?.[chardDataId] &&
            fetchOverviewChartContextReport({
              contexts,
              metricsModifiers,
              signals,
              ...filteredFavReportsTemp?.[0],
            });
        } else {
          chartData?.[chardDataId] &&
            fetchOverviewChartReport({
              signals,
              metricsModifiers,
              ...filteredFavReportsTemp?.[0],
            });
        }
      }
      if (filteredFavReportsTemp?.length === 0) {
        setFilteredFavReports([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allReports,
    chartDataSignal,
    chartDataContext,
    fetchOverviewChartReport,
    insightsConfig,
    insightsContextConfig,
    metricsModifiers,
    signals,
    contexts,
  ]);

  const next = (report_index) => {
    let chardDataId;
    if (
      filteredFavReports?.[report_index]?.report?.reportType === 'contextReport'
    ) {
      chardDataId = `${filteredFavReports?.[report_index]?.report?.reportId}`;
    } else {
      chardDataId = `${filteredFavReports?.[report_index]?.report?.reportId}_${filteredFavReports?.[report_index]?.duration}`;
    }
    const chartData =
      filteredFavReports?.[report_index]?.report?.reportType === 'contextReport'
        ? chartDataContext
        : chartDataSignal;
    if (
      chartData?.[chardDataId] === undefined &&
      filteredFavReports?.[report_index]
    ) {
      if (
        filteredFavReports?.[report_index]?.report?.reportType ===
        'contextReport'
      ) {
        fetchOverviewChartContextReport({
          contexts,
          metricsModifiers,
          signals,
          ...filteredFavReports?.[report_index],
        });
      } else {
        fetchOverviewChartReport({
          signals,
          metricsModifiers,
          ...filteredFavReports?.[report_index],
        });
      }
    }
    chartsCarouselRef?.current?.next();
  };

  const previous = (report_index) => {
    let chardDataId;
    if (
      filteredFavReports?.[report_index]?.report?.reportType === 'contextReport'
    ) {
      chardDataId = `${filteredFavReports?.[report_index]?.report?.reportId}`;
    } else {
      chardDataId = `${filteredFavReports?.[report_index]?.report?.reportId}_${filteredFavReports?.[report_index]?.duration}`;
    }
    const chartData =
      filteredFavReports?.[report_index]?.report?.reportType === 'contextReport'
        ? chartDataContext
        : chartDataSignal;
    if (
      chartData?.[chardDataId] === undefined &&
      filteredFavReports?.[report_index]
    ) {
      if (
        filteredFavReports?.[report_index]?.report?.reportType ===
        'contextReport'
      ) {
        fetchOverviewChartContextReport({
          contexts,
          metricsModifiers,
          signals,
          ...filteredFavReports?.[report_index],
        });
      } else {
        fetchOverviewChartReport({
          signals,
          metricsModifiers,
          ...filteredFavReports?.[report_index],
        });
      }
    }
    chartsCarouselRef?.current?.prev();
  };

  return (
    <Droppable droppableId={'overview-charts-droppable'} direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="overview-charts-container"
        >
          <Carousel
            ref={(ref) => {
              chartsCarouselRef.current = ref;
            }}
            effect="fade"
            autoplay={autoRotateCarousel}
            dots={false}
            swipe={false}
            autoplaySpeed={20000}
            afterChange={next}
          >
            {filteredFavReports?.map((report, index) => {
              let chardDataId;
              const isContextReport =
                report?.report?.reportType === 'contextReport';
              if (isContextReport) {
                chardDataId = `${report?.report?.reportId}`;
              } else {
                chardDataId = `${report?.report?.reportId}_${report?.duration}`;
              }
              const OC = isContextReport
                ? OverviewContextCard
                : OverviewSignalCard;
              const chartData = isContextReport
                ? chartDataContext
                : chartDataSignal;
              return (
                <div
                  key={index}
                  className="carousel-card"
                  onClick={() => {
                    userClicks({
                      pageURL: history?.location?.pathname,
                      pageTitle: document.title,
                      pageDomain: window?.location?.origin,
                      eventLabel: `Open ${filteredFavReports?.[index]?.reportId} favorite Report`,
                      rightSection: 'None',
                      mainSection: 'insight',
                      leftSection: 'insight',
                    });
                    if (isContextReport) {
                      history.push(
                        '/context-report/' +
                          filteredFavReports?.[index]?.reportId +
                          '/',
                      );
                    } else {
                      history.push(
                        '/report/' +
                          filteredFavReports?.[index]?.reportId +
                          '/' +
                          filteredFavReports?.[index]?.duration,
                      );
                    }
                  }}
                >
                  <div
                    className={!isMobile ? 'carousel-container-desktop' : ''}
                  >
                    <div>
                      <div
                        className={
                          isMobile
                            ? 'carousel-slide-buttons-container mobile-carousel-slide-buttons-container'
                            : 'carousel-slide-buttons-container'
                        }
                      >
                        {filteredFavReports?.length > 1 && (
                          <>
                            <Tooltip placement="top" title="Previous">
                              <i
                                onClick={(e) => {
                                  e.stopPropagation();
                                  previous(
                                    index - 1 < 0
                                      ? filteredFavReports?.length - 1
                                      : index - 1,
                                  );
                                }}
                                className="icon-chevron-left"
                              ></i>
                            </Tooltip>
                            <Tooltip
                              placement="top"
                              title={
                                autoRotateCarousel
                                  ? 'Pause Auto Rotate'
                                  : 'Play Auto Rotate'
                              }
                            >
                              <Icon
                                type={
                                  autoRotateCarousel
                                    ? 'pause-circle'
                                    : 'play-circle'
                                }
                                theme="filled"
                                style={{
                                  fontSize: '24px',
                                  marginLeft: '16px',
                                  marginRight: '16px',
                                  color: '#878787',
                                  fontWeight: '200',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAutoRotateCarousel(!autoRotateCarousel);
                                }}
                              />
                            </Tooltip>
                            <Tooltip placement="top" title="Next">
                              <i
                                onClick={(e) => {
                                  e.stopPropagation();
                                  next(
                                    (index + 1) % filteredFavReports?.length,
                                  );
                                }}
                                className="icon-chevron-right"
                              ></i>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </div>
                    {chartData?.[chardDataId] === undefined ? (
                      <div className="graph-loader-container loading-insight-chart">
                        <img src={graphLoader} alt="loading graph..." />
                      </div>
                    ) : (
                      <OC
                        history={history}
                        plotData={chartData?.[chardDataId].graphPlotData}
                        allReports={allReports}
                        report={chartData?.[chardDataId]}
                        selectApiResponse={
                          chartData?.[chardDataId]?.queryApiResponse
                        }
                        dataPoints={chartData?.[chardDataId]?.dataPoints}
                        next={() =>
                          next((index + 1) % filteredFavReports.length)
                        }
                        previous={() =>
                          previous((index - 1) % filteredFavReports.length)
                        }
                        isMobile={isMobile}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {(loaderSignal || insightsConfig === null) && (
              <div className="carousel-card graph-loader-container loading-insight">
                <img src={graphLoader} alt="loading graph..." />
              </div>
            )}
            {(allReports?.length === 0 || filteredFavReports?.length === 0) &&
              insightsConfig?.sections?.length === 0 && (
                <div className="no-data-icon-container carousel-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <img src={coffeeImage} alt="" style={{ width: '100px' }} />
                  </div>
                  <div className="text">
                    Hold On!! Report might take some time to show
                  </div>
                </div>
              )}
            {(allReports?.length === 0 || filteredFavReports?.length === 0) &&
              insightsConfig?.sections?.length > 0 && (
                <div className="no-data-icon-container carousel-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <img src={dragDropImage} alt="" style={{ width: '50px' }} />
                  </div>
                  <div className="text">
                    No Report Marked Favorite. Drag here from Insights Section
                    or Click on Heart Icon
                  </div>
                </div>
              )}
          </Carousel>
        </div>
      )}
    </Droppable>
  );
}

const mapDispatchToProps = {
  resetOverviewChartData,
  fetchOverviewChartReport,
  fetchOverviewChartContextReport,
  resetOverviewChartContextData,
};

const mapStateToProps = (state) => {
  const { insightsConfig, gridData } = state?.insights?.insightsGrid;
  const { allReports } = state?.report?.reportDetails;
  const { signals, metricsModifiers } = state.signalMultiSelect;
  const { loader: loaderSignal, chartData: chartDataSignal } =
    state?.insights?.overviewCharts;

  const { insightsConfig: insightsContextConfig } =
    state?.insights?.insightsContextGrid;
  const { contexts } = state?.contextReport?.contextMultiSelect;
  const { chartData: chartDataContext } =
    state?.insights?.overviewContextCharts;
  return {
    insightsConfig,
    gridData,
    allReports,
    signals,
    loaderSignal,
    chartDataSignal,
    metricsModifiers,

    contexts,
    insightsContextConfig,
    chartDataContext,
  };
};

OverviewCharts.propTypes = {
  fetchOverviewChartReport: PropTypes.func,
  insightsConfig: PropTypes.object,
  gridData: PropTypes.array,
  allReports: PropTypes.array,
  signals: PropTypes.array,
  chartDataSignal: PropTypes.object,
  loaderSignal: PropTypes.bool,
  contexts: PropTypes.array,
  insightsContextConfig: PropTypes.object,
  chartDataContext: PropTypes.object,
  fetchOverviewChartContextReport: PropTypes.func,
  resetOverviewChartContextData: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCharts);
