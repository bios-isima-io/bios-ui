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
import { GROUP_BY_X_KEY, GROUP_BY_Y_KEY } from '../const';
import generateColumnNames from './generateColumnNames';

const UNKNOWN = 'NA';

const hasCyclicalData = (graphDataResponse) => {
  if (graphDataResponse?.series?.[0]?.type === 'treemap') {
    return graphDataResponse?.series?.length === 2;
  }
  if (graphDataResponse?.chart?.type === 'pie') {
    return graphDataResponse?.series?.length === 4;
  }
  return graphDataResponse?.series?.find((s) =>
    s?.stack?.startsWith('Cyclical Comparison:'),
  );
};

const gridColumnGroupByXY = (graphDataResponse, selectedMetrics) => {
  const columns = generateColumnNames(selectedMetrics);

  const cyclicalData = hasCyclicalData(graphDataResponse);
  if (cyclicalData) {
    if (graphDataResponse?.series?.[0]?.type === 'treemap') {
      const metric = graphDataResponse?.series?.[1]?.extra?.metric;
      columns.push({
        title: metric,
        dataIndex: metric,
        key: metric,
      });
    } else if (graphDataResponse?.chart?.type === 'pie') {
      const metric = graphDataResponse?.series?.[3]?.extra?.metric;
      columns.push({
        title: metric,
        dataIndex: metric,
        key: metric,
      });
    } else {
      columns.push({
        title: cyclicalData.stack,
        dataIndex: cyclicalData.stack,
        key: cyclicalData.stack,
      });
    }
  }

  Array.isArray(columns) &&
    columns.length > 0 &&
    columns.unshift({
      title: 'Split-By Y',
      dataIndex: GROUP_BY_Y_KEY,
      key: GROUP_BY_Y_KEY,
    });

  Array.isArray(columns) &&
    columns.length > 0 &&
    columns.unshift({
      title: 'Split-By X',
      dataIndex: GROUP_BY_X_KEY,
      key: GROUP_BY_X_KEY,
    });
  return columns;
};

const buildTableData = ({ dataMap }) => {
  let key = 0;
  let data = [];
  for (let groupByX in dataMap) {
    for (let groupByY in dataMap[groupByX]) {
      let obj = {
        [GROUP_BY_X_KEY]: groupByX,
        [GROUP_BY_Y_KEY]: groupByY,
        key,
      };
      let hasValidValue = false;
      for (let i in dataMap[groupByX][groupByY]) {
        if (
          dataMap?.[groupByX]?.[groupByY]?.[i] !== undefined &&
          !isNaN(dataMap[groupByX][groupByY][i])
        ) {
          if (dataMap[groupByX][groupByY][i] !== 0) {
            hasValidValue = true;
          }
          obj[i] = round(dataMap[groupByX][groupByY][i], 2);
        } else if (UNKNOWN === dataMap[groupByX][groupByY][i]) {
          obj[i] = '-';
        } else {
          obj[i] = 0;
        }
      }
      hasValidValue && data.push(obj);
      key = key + 1;
    }
  }
  return data;
};

const gridDataGroupByXYTreemap = ({ graphData }) => {
  const dataMap = {};
  graphData?.series?.forEach((ser) => {
    ser?.data?.forEach((d) => {
      if (d?.parent) {
        if (!dataMap?.[d?.parent]) {
          dataMap[d.parent] = {};
        }
        if (!dataMap?.[d?.parent]?.[d?.name]) {
          dataMap[d.parent][d?.name] = {};
        }
        dataMap[d.parent][d?.name][ser?.extra?.metric] = d.value;
      }
    });
  });
  return buildTableData({ dataMap });
};

const gridDataGroupByXYPie = ({ graphData }) => {
  const dataMap = {};
  graphData?.series?.forEach((ser, index) => {
    index % 2 === 1 &&
      ser?.data?.forEach((d) => {
        if (d?.belongTo) {
          if (!dataMap?.[d?.belongTo]) {
            dataMap[d.belongTo] = {};
          }
          if (!dataMap?.[d?.belongTo]?.[d?.name]) {
            dataMap[d.belongTo][d?.name] = {};
          }
          dataMap[d.belongTo][d?.name][ser?.extra?.metric] = d.y;
        }
      });
  });
  return buildTableData({ dataMap });
};

const gridDataGroupByXY = (graphData) => {
  if (graphData?.series?.[0]?.type === 'treemap') {
    return gridDataGroupByXYTreemap({ graphData });
  }

  if (graphData?.chart?.type === 'pie') {
    return gridDataGroupByXYPie({ graphData });
  }
  const dataMap = {};
  const categories = graphData?.xAxis?.categories;
  if (!categories) {
    return;
  }

  const cyclicalData = hasCyclicalData(graphData);
  graphData?.series?.forEach((series) => {
    series?.data?.forEach((entry, index) => {
      if (series.type === 'packedbubble') {
        if (dataMap?.[series.name] === undefined) {
          dataMap[series.name] = {};
        }
        if (dataMap[series.name][entry.name] === undefined) {
          dataMap[series.name][entry.name] = {};

          if (cyclicalData) {
            dataMap[categories[index]][series.name][cyclicalData.stack] =
              UNKNOWN;
          }
        }

        dataMap[series.name][entry.name][entry.cat] = entry.value;
      } else {
        if (dataMap?.[categories[index]] === undefined) {
          dataMap[categories[index]] = {};
        }
        if (dataMap[categories[index]][series.name] === undefined) {
          dataMap[categories[index]][series.name] = {};

          if (cyclicalData) {
            dataMap[categories[index]][series.name][cyclicalData.stack] =
              UNKNOWN;
          }
        }
        dataMap[categories[index]][series.name][series.stack] = entry;
      }
    });
  });

  return buildTableData({ dataMap });
};

export { gridColumnGroupByXY, gridDataGroupByXY };
