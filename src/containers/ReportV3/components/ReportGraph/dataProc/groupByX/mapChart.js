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
import { getMetricsFromDerivedMetric } from 'containers/ReportV2/utils/metricsRegex';
import { worldTopo } from './topo/world';
import { evaluate } from 'mathjs';

const mapChartPlot = ({
  onClick = () => {},
  data,
  topology,
  name,
  cyclicalData,
}) => {
  const cyclicalSeriesItem = {
    events: {
      click: onClick,
    },
    data: cyclicalData,
    type: 'map',
    name: 'Cyclical Comparison: ' + name,
    states: {
      hover: {
        color: '#818274',
      },
    },
    dataLabels: {
      enabled: true,
      format: '{point.name}',
    },
  };
  const resp = {
    chart: {
      map: topology,
    },

    title: {
      text: '',
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
        theme: {
          zIndex: 100,
        },
      },
    },

    colorAxis: {
      min: 0,
    },

    series: [
      {
        events: {
          click: onClick,
        },
        data,
        type: 'map',
        name,
        states: {
          hover: {
            color: '#818274',
          },
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
      },
    ],
  };

  if (cyclicalData && cyclicalData?.length > 0) {
    resp?.series?.push(cyclicalSeriesItem);
  }
  return resp;
};

const getName = ({ selectedMetrics }) => {
  return selectedMetrics?.[0]?.as ?? selectedMetrics?.[0]?.measurement;
};

const buildDataFromStatementData = (graphData, signalDataOrder, level) => {
  const dataMap = {};
  const uniqueItems = new Set();
  signalDataOrder?.forEach((signal, signalIndex) => {
    const sq = graphData[signalIndex];

    sq?.dataWindows?.[0]?.records?.forEach((record) => {
      sq?.definitions?.forEach((def, defIndex) => {
        if (defIndex === 0 || (level === 2 && defIndex === 1)) {
          return;
        }
        const metric = signal + '.' + def.name;
        if (dataMap[metric] === undefined) {
          dataMap[metric] = {};
        }
        const country = record[0]?.toLowerCase();
        if (level === 1) {
          dataMap[metric][country] = record[defIndex];
          uniqueItems.add(country);
        }
        if (level === 2) {
          const state = record[1]?.toLowerCase();
          dataMap[metric][state] = record[defIndex];
          uniqueItems.add(state);
        }
      });
    });
  });

  return { dataMap, uniqueItems };
};

const getDataLevel1SimpleMetric = (graphData) => {
  let dataMap = {};

  graphData?.forEach((statementData) => {
    statementData?.dataWindows?.[0]?.records?.forEach((r) => {
      const l1 = r[0]?.toLowerCase();
      if (!dataMap?.[l1]) {
        dataMap[l1] = r[1];
      }
    });
  });

  const data = [];
  if (dataMap) {
    Object.keys(dataMap)?.forEach((l1) => {
      data.push([l1, dataMap?.[l1]]);
    });
  }
  return data;
};

export const evaluateDerivedMetrics = ({ formula, terms, fetchValue }) => {
  if (!terms) {
    return 0;
  }
  let doesContainUndefined = false;
  terms.forEach((term) => {
    const value = fetchValue(term) ?? 0;
    formula = formula.replace(term, value);
  });

  try {
    const result = evaluate(formula);
    if (
      doesContainUndefined ||
      isNaN(result) ||
      result === Infinity ||
      result === -Infinity
    ) {
      return 0;
    }
    return result;
  } catch (e) {
    return 0;
  }
};

const getDataDerived = ({
  graphData,
  signalDataOrder,
  selectedMetrics,
  selectedSignals,
  level,
  country,
}) => {
  const { dataMap, uniqueItems } = buildDataFromStatementData(
    graphData,
    signalDataOrder,
    level,
  );
  const { measurement } = selectedMetrics?.[0];

  const terms = getMetricsFromDerivedMetric({
    metric: measurement,
    entities: selectedSignals,
    type: 'signal',
  });

  let finalDataMap = {};

  for (const location of uniqueItems) {
    const value = evaluateDerivedMetrics({
      formula: measurement,
      terms,
      fetchValue: (metric) => dataMap?.[metric]?.[location],
    });
    finalDataMap[location] = value;
  }

  const data = [];
  if (finalDataMap) {
    Object.keys(finalDataMap)?.forEach((l1) => {
      let item = l1;
      if (level === 2 && country) {
        item = country + '-' + l1;
      }
      data.push([item, finalDataMap?.[l1]]);
    });
  }

  return data;
};

export const getMapXChartPlotDataLevel1 = ({
  setMapChartCountry,
  graphData,
  selectedMetrics,
  cyclicalData,
  signalDataOrder,
  selectedSignals,
}) => {
  if (selectedMetrics?.[0]?.type === 'derived') {
    const data = getDataDerived({
      graphData,
      signalDataOrder,
      selectedMetrics,
      selectedSignals,
      level: 1,
    });

    const cyclicalDataResp = getDataDerived({
      graphData: cyclicalData,
      signalDataOrder,
      selectedMetrics,
      selectedSignals,
      level: 1,
    });

    return mapChartPlot({
      onClick: (e) => {
        e.preventDefault();
        setMapChartCountry &&
          setMapChartCountry({ mapChartCountry: e?.point?.['hc-key'] });
      },
      data: data,
      cyclicalData: cyclicalDataResp,
      topology: worldTopo,
      name: getName({ selectedMetrics }),
    });
  }
  return mapChartPlot({
    onClick: (e) => {
      e.preventDefault();
      setMapChartCountry &&
        setMapChartCountry({ mapChartCountry: e?.point?.['hc-key'] });
    },
    data: getDataLevel1SimpleMetric(graphData),
    cyclicalData: getDataLevel1SimpleMetric(cyclicalData),
    topology: worldTopo,
    name: getName({ selectedMetrics }),
  });
};

const getDataLevel2SimpleMetric = (graphData) => {
  const dataMap = {};

  graphData?.forEach((statementData) => {
    statementData?.dataWindows?.[0]?.records?.forEach((r) => {
      const l1 = r[0]?.toLowerCase();
      const l2 = r[1]?.toLowerCase();
      if (!dataMap?.[l1]) {
        dataMap[l1] = {};
      }
      if (!dataMap?.[l1]?.[l2]) {
        dataMap[l1][l2] = r[2];
      }
    });
  });

  const regularData = [];
  if (dataMap) {
    Object.keys(dataMap)?.forEach((l1) => {
      Object.keys(dataMap[l1])?.forEach((l2) => {
        regularData.push([l1 + '-' + l2, dataMap?.[l1]?.[l2]]);
      });
    });
  }

  return regularData;
};

export const getMapXChartPlotDataLevel2 = ({
  graphData,
  topology,
  selectedMetrics,
  cyclicalData,
  signalDataOrder,
  selectedSignals,
  country,
}) => {
  if (selectedMetrics?.[0]?.type === 'derived') {
    const data = getDataDerived({
      graphData,
      signalDataOrder,
      selectedMetrics,
      selectedSignals,
      level: 2,
      country,
    });

    const cyclicalDataResp = getDataDerived({
      graphData: cyclicalData,
      signalDataOrder,
      selectedMetrics,
      selectedSignals,
      level: 2,
      country,
    });

    return mapChartPlot({
      onClick: (e) => {
        e.preventDefault();
      },
      data: data,
      cyclicalData: cyclicalDataResp,
      topology,
      name: getName({ selectedMetrics }),
    });
  }

  return mapChartPlot({
    onClick: (e) => {
      e.preventDefault();
    },
    data: getDataLevel2SimpleMetric(graphData),
    cyclicalData: getDataLevel2SimpleMetric(cyclicalData),
    topology,
    name: getName({ selectedMetrics }),
  });
};
