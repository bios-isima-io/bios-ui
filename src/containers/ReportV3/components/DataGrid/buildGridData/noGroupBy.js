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
import './styles.scss';
import moment from 'moment-timezone';
import { CYCLICAL_DATA, DATE_TIME_KEY } from '../const';
import {
  percentileList,
  distinctCountList,
} from '../../AdvanceSettings/Metrics/AddMetric/Type/Simple/const';
import { round } from 'lodash';
import { makeTimestamps } from 'containers/ReportV2/components/ReportGraph/dataProc/utils';
import { buildDataSetNoGroupBy } from 'containers/ReportV2/components/ReportGraph/dataProc/noGroupBy/data';
import { dateTimeColumnObj } from './dateTimeColumnObj';

const gridColumnNoGroupBy = ({
  graphDataResponse,
  timezone,
  selectedMetrics,
}) => {
  const timezoneVal = timezone === '' ? moment.tz.guess() : timezone;

  if (
    (selectedMetrics.length === 2 || selectedMetrics.length === 3) &&
    graphDataResponse?.chart?.type === 'bubble'
  ) {
    let columns = [];
    const entry = graphDataResponse?.series?.[0]?.data?.[0];
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
    columns.unshift(
      dateTimeColumnObj(
        timezoneVal,
        'Date and time',
        'date-and-time',
        DATE_TIME_KEY,
      ),
    );
    return columns;
  }

  // short series name regex for spread and distinctcounts
  const metrics = percentileList.join('|') + '|' + distinctCountList.join('|');
  const simpleRegex = `(:|${metrics})+\\((?:.*?)\\)`;
  // end short series name regex for spread and distinctcounts

  const columns = graphDataResponse?.series?.reduce((acc, series) => {
    if (series.name === CYCLICAL_DATA) {
      return acc;
    }

    // defensive code in case the type of the name is not string
    let seriesName = series?.name?.toString();

    // short series name for spread and distinctcounts
    if (seriesName?.match(simpleRegex)) {
      seriesName = series.name?.split('.')?.[1];
    }
    // end short series name for spread and distinctcounts
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
    columns.unshift(
      dateTimeColumnObj(
        timezoneVal,
        'Date and time',
        'date-and-time',
        DATE_TIME_KEY,
      ),
    );
  return columns;
};

const gridDataNoGroupBy = ({
  graphDataResponse,
  graphData,
  selectedMetrics,
  signalDataOrder,
  durationStart,
  duration,
  windowSize,
  endTimestamp,
}) => {
  const dataSet = buildDataSetNoGroupBy({
    signalDataOrder,
    graphData,
  });

  const timestamps = makeTimestamps({
    dataSet,
    durationStart,
    duration,
    windowSize,
    endTimestamp,
  });

  let noOfEntries = 0;
  graphDataResponse?.series?.forEach((series) => {
    if (noOfEntries < series?.length) {
      noOfEntries = series?.length;
    }
  });

  const dataMap = {};
  const metricLength = selectedMetrics.length;
  graphDataResponse?.series?.forEach((series) => {
    series?.data?.forEach((entry) => {
      if (
        series.type === 'packedbubble' ||
        graphDataResponse?.chart?.type === 'bubble'
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
        } else if (metricLength === 3) {
          if (dataMap?.[entry.name] === undefined) {
            dataMap[entry.name] = {};
          }
          dataMap[entry.name][entry.xName] = entry.x;
          dataMap[entry.name][entry.yName] = entry.y;
          dataMap[entry.name][entry.zName] = entry.z;
        }
      } else if (entry.length === 2 && series.name !== CYCLICAL_DATA) {
        if (dataMap[entry[0]] === undefined) {
          dataMap[entry[0]] = {};
        }
        dataMap[entry[0]][series.name] = entry[1];
      } else if (entry.length === 3 && series.name !== CYCLICAL_DATA) {
        // spread and distinctcounts
        if (dataMap[entry[0]] === undefined) {
          dataMap[entry[0]] = {};
        }
        dataMap[entry[0]][series.name] = entry[2];
      }
    });
  });
  const data = Object.keys(dataMap)
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    .reduce((acc, ts, index) => {
      let obj = {
        [DATE_TIME_KEY]: timestamps[index],
        key: index,
      };
      for (let i in dataMap[ts]) {
        if (dataMap?.[ts]?.[i] !== undefined && !isNaN(dataMap[ts][i])) {
          obj[i] = round(dataMap[ts][i], 2);
        } else {
          obj[i] = 0;
        }
      }
      acc.push(obj);
      return acc;
    }, []);

  return data.reverse();
};

export { gridColumnNoGroupBy, gridDataNoGroupBy };
