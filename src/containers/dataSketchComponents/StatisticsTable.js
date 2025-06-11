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
import { Table } from 'antdlatest';
import { css } from 'aphrodite';
import Humanize from 'humanize-plus';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { TABLE_CONFIG } from './constant';
import styles from './styles';

let columns = TABLE_CONFIG.map(({ title, dataIndex, width }) => {
  return {
    title,
    dataIndex,
    width,
  };
});

const StatisticsTable = ({ data = [], selectedAttribute }) => {
  const [col, setCol] = useState(columns);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let column = [...columns];
    if (data['timestamp_lag']) {
      column.push({
        title: 'TimeStampLag',
        dataIndex: 'timestamp_lag',
        width: 180,
      });
    }
    if (selectedAttribute.firstSummary) {
      let index = -1;
      let entity = null;
      column.forEach((item, i) => {
        if (item.dataIndex === selectedAttribute?.firstSummary?.toLowerCase()) {
          index = i;
          entity = item;
        }
      });
      if (index > -1) {
        column.splice(index, 1);
        column.unshift(entity);
      }
    }
    if (selectedAttribute.secondSummary) {
      let index = -1;
      let entity = null;
      column.forEach((item, i) => {
        if (
          item.dataIndex === selectedAttribute?.secondSummary?.toLowerCase()
        ) {
          index = i;
          entity = item;
        }
      });
      if (index > -1) {
        column.splice(index, 1);
        column.unshift(entity);
      }
    }
    setCol(column);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute.attributeName]);

  let tableBodyData = [];

  if (data) {
    let tableData = [];
    data.sum.forEach((_, index) => {
      const startTime = moment(data?.['startTime']?.[index]).format(
        'YYYY-MM-DD HH:mm',
      );
      const min =
        typeof data?.['min']?.[index] === 'number' &&
        data?.['min']?.[index] >= Number.MIN_SAFE_INTEGER
          ? data?.['min']?.[index]
          : null;
      const max =
        typeof data?.['max']?.[index] === 'number' &&
        data?.['max']?.[index] <= Number.MAX_SAFE_INTEGER
          ? data?.['max']?.[index]
          : null;
      const stddev =
        typeof data?.['stddev']?.[index] === 'number' &&
        !isNaN(data?.['stddev']?.[index])
          ? data?.['stddev']?.[index].toFixed(2)
          : '-';
      const avg =
        typeof data?.['avg']?.[index] === 'number' &&
        !isNaN(data?.['avg']?.[index])
          ? data?.['avg']?.[index].toFixed(2)
          : '-';
      const skewness =
        typeof data?.['skewness']?.[index] === 'number' &&
        !isNaN(data?.['skewness']?.[index])
          ? data?.['skewness']?.[index].toFixed(2)
          : '-';
      const kurtosis =
        typeof data?.['kurtosis']?.[index] === 'number' &&
        !isNaN(data?.['kurtosis']?.[index])
          ? data?.['kurtosis']?.[index].toFixed(2)
          : '-';
      const timestamp_lag =
        typeof data?.['timestamp_lag']?.[index] === 'number' &&
        !isNaN(data?.['timestamp_lag']?.[index])
          ? data?.['timestamp_lag']?.[index].toFixed(2)
          : '-';

      if (
        min !== null ||
        max !== null ||
        stddev !== null ||
        avg !== null ||
        skewness !== null ||
        kurtosis !== null
      ) {
        tableData.push({
          startTime,
          min: !isNaN(min)
            ? parseInt(min).toString().length < 7
              ? Humanize.intComma(min)
              : Humanize.compactInteger(min, 2)
            : '-',
          max: !isNaN(max)
            ? parseInt(max).toString().length < 7
              ? Humanize.intComma(max)
              : Humanize.compactInteger(max, 2)
            : '-',
          stddev: !isNaN(stddev)
            ? parseInt(stddev).toString().length < 7
              ? Humanize.intComma(stddev)
              : Humanize.compactInteger(stddev, 2)
            : '-',
          avg: !isNaN(avg)
            ? parseInt(avg).toString().length < 7
              ? Humanize.intComma(avg)
              : Humanize.compactInteger(avg, 2)
            : '-',
          skewness: !isNaN(skewness)
            ? parseInt(skewness).toString().length < 7
              ? Humanize.intComma(skewness)
              : Humanize.compactInteger(skewness, 2)
            : '-',
          kurtosis: !isNaN(kurtosis)
            ? parseInt(kurtosis).toString().length < 7
              ? Humanize.intComma(kurtosis)
              : Humanize.compactInteger(kurtosis, 2)
            : '-',
          timestamp_lag: !isNaN(timestamp_lag)
            ? parseInt(timestamp_lag).toString().length < 7
              ? Humanize.intComma(timestamp_lag)
              : Humanize.compactInteger(timestamp_lag, 2)
            : '-',
        });
      }
    });
    tableBodyData = tableData;
  }

  if (loading) {
    return null;
  }

  return (
    <div className={css(styles.commonSectionWrapper)}>
      <div className={css(styles.lastOneDayLabel)}>Data for last 1 day</div>
      <div className={`bios-custom-table ${css(styles.StatTableWrapper)}`}>
        {tableBodyData.length > 0 ? (
          <Table
            columns={col}
            dataSource={tableBodyData}
            pagination={false}
            scroll={{ y: 223 }}
          />
        ) : (
          <div className={css(styles.noData)}>No data available</div>
        )}
      </div>
    </div>
  );
};

export default StatisticsTable;
