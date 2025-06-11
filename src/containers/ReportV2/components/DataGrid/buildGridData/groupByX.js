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
import { round } from 'lodash';
import { GROUP_BY_X_KEY } from '../const';
import { checkGraphType } from '../../ReportGraph/utils';
import { gridDataGroupByXForMapChart } from './groupByX/map';

const gridColumnGroupByX = (graphData, selectedMetrics) => {
  if (
    (selectedMetrics.length === 2 || selectedMetrics.length === 3) &&
    graphData?.chart?.type === 'bubble'
  ) {
    let columns = [];
    const entry = graphData?.series?.[0]?.data?.[0];
    if (!entry) {
      return columns;
    }
    columns.push({
      title: entry.xName,
      dataIndex: entry.xName,
      key: entry.xName,
    });
    columns.push({
      title: entry.yName,
      dataIndex: entry.yName,
      key: entry.yName,
    });
    columns.push({
      title: entry.zName,
      dataIndex: entry.zName,
      key: entry.zName,
    });

    columns.unshift({
      title: 'Split-By X',
      dataIndex: GROUP_BY_X_KEY,
      key: GROUP_BY_X_KEY,
    });
    return columns;
  }

  const columns = graphData?.series?.reduce((acc, series) => {
    const newTitle = `${series.name} ${
      series.unitDisplayName &&
      series.unitDisplayName !== undefined &&
      series.unitDisplayName !== ''
        ? ` (${series.unitDisplayName})`
        : ''
    }`;
    acc.push({
      title: newTitle,
      dataIndex: series.name,
      key: series.name,
    });
    return acc;
  }, []);

  Array.isArray(columns) &&
    columns.length > 0 &&
    columns.unshift({
      title: 'Split-By X',
      dataIndex: GROUP_BY_X_KEY,
      key: GROUP_BY_X_KEY,
    });
  return columns;
};

const gridDataGroupByXForFunnelDonutTreemapChart = ({ graphData, type }) => {
  let itemValueKey = null;
  switch (type) {
    case 'funnel':
      itemValueKey = 'hoverValue';
      break;
    case 'donut':
      itemValueKey = 'y';
      break;
    case 'treemap':
      itemValueKey = 'value';
      break;
    default:
      itemValueKey = 'value';
  }
  let dataMap = {};
  const categories = [];
  graphData?.series?.forEach((s) => {
    s?.data?.forEach((item, index) => {
      if (dataMap?.[item['name']] === undefined) {
        dataMap[item['name']] = {};
        categories.push(item['name']);
      }
      if (dataMap?.[item['name']]?.[s?.name] === undefined) {
        dataMap[item['name']][s.name] = item?.[itemValueKey];
      }
    });
  });
  const data = categories.reduce((acc, category, index) => {
    let obj = {
      [GROUP_BY_X_KEY]: category,
      key: index,
    };
    for (let i in dataMap[category]) {
      if (
        dataMap?.[category]?.[i] !== undefined &&
        !isNaN(dataMap[category][i])
      ) {
        obj[i] = round(dataMap[category][i], 2);
      } else {
        obj[i] = 0;
      }
    }
    acc.push(obj);
    return acc;
  }, []);
  return data;
};
const gridDataGroupByX = (graphData, selectedMetrics) => {
  const dataMap = {};
  let categories = graphData?.xAxis?.categories
    ? graphData.xAxis.categories
    : [];
  const metricLength = selectedMetrics.length;
  if (checkGraphType({ selectedMetrics, graphType: 'funnel' })) {
    return gridDataGroupByXForFunnelDonutTreemapChart({
      graphData,
      type: 'funnel',
    });
  }
  if (checkGraphType({ selectedMetrics, graphType: 'donut' })) {
    return gridDataGroupByXForFunnelDonutTreemapChart({
      graphData,
      type: 'donut',
    });
  }
  if (checkGraphType({ selectedMetrics, graphType: 'treemap' })) {
    return gridDataGroupByXForFunnelDonutTreemapChart({
      graphData,
      type: 'treemap',
    });
  }
  if (checkGraphType({ selectedMetrics, graphType: 'map' })) {
    return gridDataGroupByXForMapChart({
      graphData,
    });
  }

  graphData?.series?.forEach((series) => {
    series?.data?.forEach((entry, index) => {
      if (
        series.type === 'packedbubble' ||
        graphData?.chart?.type === 'bubble'
      ) {
        if (metricLength === 1) {
          if (dataMap?.[entry.name] === undefined) {
            dataMap[entry.name] = {};
          }
          dataMap[entry.name][series.name] = entry.value;
        } else if (metricLength === 2) {
          if (dataMap?.[entry.name] === undefined) {
            dataMap[entry.name] = {};
          }
          dataMap[entry.name][entry.xName] = entry.x;
          dataMap[entry.name][entry.zName] = entry.z;
          categories.push(entry.name);
        } else if (metricLength === 3) {
          if (dataMap?.[entry.name] === undefined) {
            dataMap[entry.name] = {};
          }
          dataMap[entry.name][entry.xName] = entry.x;
          dataMap[entry.name][entry.yName] = entry.y;
          dataMap[entry.name][entry.zName] = entry.z;
          categories.push(entry.name);
        }
      } else {
        if (dataMap?.[categories[index]] === undefined) {
          dataMap[categories[index]] = {};
        }
        dataMap[categories[index]][series.name] = entry;
      }
    });
  });
  const data = categories.reduce((acc, category, index) => {
    let obj = {
      [GROUP_BY_X_KEY]: category,
      key: index,
    };
    for (let i in dataMap[category]) {
      if (
        dataMap?.[category]?.[i] !== undefined &&
        !isNaN(dataMap[category][i])
      ) {
        obj[i] = round(dataMap[category][i], 2);
      } else {
        obj[i] = 0;
      }
    }
    acc.push(obj);
    return acc;
  }, []);
  return data;
};

export { gridColumnGroupByX, gridDataGroupByX };
