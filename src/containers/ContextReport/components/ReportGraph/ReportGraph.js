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
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { debounce } from 'lodash';
import moment from 'moment-timezone';
import { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { useWindowSize } from 'common/hooks';
import { reportFiltersActions } from 'containers/ReportV2/components/AdvanceSettings/Filters/reducers';
import { dataGridActions } from 'containers/ContextReport/components/DataGrid/reducers';
import { ErrorNotification } from 'containers/utils';
import LoadingGraph from './components/LoadingGraph/LoadingGraph';
import NoData from './components/NoData';
import ReportInsightBox from './components/ReportInsightBox';
import AuditGraphGroupByY from './components/AuditGraphGroupByY';
import { getGraphDataNoGroupBy } from './dataProc';
import { reportGraphActions } from './reducers';
import { addDefaultGraphParam } from './utils';
import HighchartsTreeChart from 'highcharts/modules/treemap';
import { fetchSignals } from 'containers/Signal/actions';
import './styles.scss';
import { getGraphDataGroupBy2 } from './dataProc/groupBy2';

HighchartsMore(Highcharts);
HighchartsTreeChart(Highcharts);

const {
  fetchReportGraphData,
  setReportGraphData,
  fetchReportAuditGraphData,
  resetGraphData,
} = reportGraphActions;
const { resetFilters } = reportFiltersActions;
const { setDataGrid } = dataGridActions;

window.moment = moment;

Highcharts.setOptions({
  lang: {
    thousandsSep: '',
  },
});

function ReportGraph({
  contexts,
  selectedContexts,

  fetchReportGraphData,
  graphData,
  graphDataLoading,
  graphDataError,
  contextDataOrder,
  groupByX,
  groupByY,
  allFilters,
  selectedFilters,
  resetFilters,
  showRightPanel,
  selectedMetrics,

  contextSynopsis,
  setReportGraphData,
  fetchReportAuditGraphData,
  setDataGrid,
  fetchSignals,
  signals,
  contextCountTotal,
  resetGraphData,
  topX,
  topY,
}) {
  const [screenWidth] = useWindowSize();
  const isMobile = window.innerWidth < isimaLargeDeviceBreakpointNumber;
  const [HCDataObj, setHCDataObj] = useState(
    addDefaultGraphParam({ title: '' }),
  );
  const [graphLoader, setGraphLoader] = useState(false);
  const [noData, setNoData] = useState(true);
  const [firstLoad, setFirstLoad] = useState(false);
  const [errorReported, setErrorReported] = useState(false);

  useEffect(() => {
    if (graphData?.length === 0 || !graphData) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [graphData]);

  const updateGraphData = () => {
    return {
      contexts,
      selectedContexts,
      selectedMetrics,

      groupByX,
      groupByY,

      allFilters,
      selectedFilters,
      topX,
      topY,
    };
  };

  useEffect(() => {
    if (selectedContexts?.length === 0) {
      setDataGrid(null);
      resetFilters();
      setReportGraphData({
        graphData: [],
        statementData: [],
        contextDataOrder: [],
      });
      resetGraphData();
      return;
    }
    setErrorReported(false);
    fetchReportGraphData({
      ...updateGraphData(),
    });
  }, [
    selectedContexts,
    groupByX,
    groupByY,
    contexts,
    selectedMetrics,
    topX,
    topY,
  ]);

  useEffect(() => {
    if (selectedContexts?.length > 0 && signals.length > 0) {
      fetchReportAuditGraphData({
        selectedContexts,
        groupByX,
        signals,
        selectedMetrics,
      });
    }
  }, [
    selectedContexts,
    groupByX,
    signals,
    contexts,
    fetchReportAuditGraphData,
  ]);

  const getOptionsHC = () => {
    let response = {
      title: '',
    };
    if (groupByX !== '' && groupByY === '') {
      response = getGraphDataNoGroupBy({
        graphData,
        contextDataOrder,
        selectedContexts,
        groupByX,
        contextSynopsis,
        selectedFilters,
        selectedMetrics,
        topX,
        contextCountTotal,
      });
    } else if (groupByX !== '' && groupByY !== '') {
      response = getGraphDataGroupBy2({
        graphData,
        contextDataOrder,
        selectedContexts,
        groupByX,
        groupByY,
        contextSynopsis,
        selectedFilters,
        selectedMetrics,
        topX,
        topY,
      });
    }
    setDataGrid(response);
    return response;
  };

  useEffect(() => {
    if (graphDataLoading) {
      let resp = { title: '' };
      resp = addDefaultGraphParam(resp, true);
      setHCDataObj(resp);
    } else {
      setGraphLoader(true);
      let resp = getOptionsHC();
      setHCDataObj(resp);
    }
    if (!!graphDataError && !errorReported) {
      ErrorNotification({ message: graphDataError });
      setErrorReported(true);
    }
  }, [graphDataLoading, graphData, graphDataError, selectedFilters]);

  const reloadGraph = () => {
    setGraphLoader(true);
    let resp = getOptionsHC();
    setHCDataObj(resp);
  };

  const reloadGraphDebounce = debounce(() => {
    reloadGraph();
  }, 1000);

  useEffect(() => {
    let loaded = false;
    if (!showRightPanel && !graphDataLoading && !graphLoader && isMobile) {
      reloadGraph();
      loaded = true;
    }
    if (!loaded && firstLoad) {
      reloadGraphDebounce();
    }
    setFirstLoad(true);
  }, [showRightPanel]);

  useEffect(() => {
    reloadGraph();
  }, [screenWidth]);

  useEffect(() => {
    setGraphLoader(false);
  }, [HCDataObj]);

  useEffect(() => {
    setHCDataObj(addDefaultGraphParam({ title: '' }, true));
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const refreshReport = useCallback(() => {
    setErrorReported(false);
    fetchReportGraphData({
      ...updateGraphData(),
    });
  }, [updateGraphData, fetchReportGraphData]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshReport();
    }, 300000);
    return () => clearInterval(interval);
  }, [refreshReport]);

  return (
    <div>
      {graphDataLoading || graphDataLoading || graphLoader ? (
        <LoadingGraph></LoadingGraph>
      ) : graphData?.length === 0 || noData ? (
        <NoData />
      ) : (
        <>
          {isMobile ? (
            <div className="report-graph-container-mobile">
              <ReportInsightBox
                contextCountTotal={contextCountTotal}
                selectedMetrics={selectedMetrics}
              />{' '}
              <HighchartsReact
                highcharts={Highcharts}
                options={HCDataObj}
                containerProps={{
                  style: {
                    height: '450px',
                    paddingBottom: '0px',
                    paddingTop: '40px',
                  },
                }}
              />
              <AuditGraphGroupByY selectedMetrics={selectedMetrics} />
            </div>
          ) : (
            <div className="report-graph-container">
              <div style={{ width: '100%', flex: 3, marginBottom: '30px' }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={HCDataObj}
                  containerProps={{
                    style: {
                      height: '450px',
                      width: '100%',
                      paddingBottom: '20px',
                    },
                  }}
                />
              </div>
              <div style={{ width: '100%', flex: 1, marginLeft: '20px' }}>
                <ReportInsightBox
                  contextCountTotal={contextCountTotal}
                  selectedMetrics={selectedMetrics}
                />
                <AuditGraphGroupByY />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

ReportGraph.propTypes = {};

const mapDispatchToProps = {
  fetchReportGraphData,
  resetFilters,
  setDataGrid,
  setReportGraphData,
  fetchReportAuditGraphData,
  fetchSignals,
  resetGraphData,
};

const mapStateToProps = (state) => {
  const { contexts, selectedContexts } =
    state?.contextReport?.contextMultiSelect;

  const {
    graphData,
    contextDataOrder,
    graphDataLoading,
    graphDataError,
    firstDivisionAttribute,
    contextSynopsis,
    contextCountTotal,
  } = state?.contextReport?.data;

  const { groupByX, groupByY } = state?.contextReport?.groupBy;

  const { selectedFilters } = state?.contextReport?.filters;
  const { selectedMetrics } = state?.contextReport?.metrics;
  const { topX, topY } = state?.contextReport?.dataGranularity;
  const { signals } = state?.signals;

  return {
    contexts,
    selectedContexts,
    graphData,
    graphDataLoading,
    graphDataError,
    contextDataOrder,
    groupByX,
    groupByY,
    selectedFilters,
    firstDivisionAttribute,
    contextSynopsis,
    selectedMetrics,
    signals,
    contextCountTotal,
    topX,
    topY,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportGraph);
