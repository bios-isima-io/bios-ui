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

import { PERCENTILE_TABLE_CONFIG } from './constant';
import styles from './styles';

const columns = PERCENTILE_TABLE_CONFIG.map(({ title, dataIndex, width }) => {
  return {
    title,
    dataIndex,
    width,
  };
});

const PercentilesTable = ({ data = [] }) => {
  let tableBodyData = [];

  if (data) {
    let tableData = [];
    data.sum.forEach((_, index) => {
      const startTime = moment(data?.['startTime']?.[index]).format(
        'YYYY-MM-DD HH:mm',
      );

      const p1 =
        typeof data?.['p1']?.[index] === 'number' &&
        !isNaN(data?.['p1']?.[index])
          ? data?.['p1']?.[index].toFixed(2)
          : '-';
      const p25 =
        typeof data?.['p25']?.[index] === 'number' &&
        !isNaN(data?.['p25']?.[index])
          ? data?.['p25']?.[index].toFixed(2)
          : '-';
      const median =
        typeof data?.['median']?.[index] === 'number' &&
        !isNaN(data?.['median']?.[index])
          ? data?.['median']?.[index].toFixed(2)
          : '-';
      const p75 =
        typeof data?.['p75']?.[index] === 'number' &&
        !isNaN(data?.['p75']?.[index])
          ? data?.['p75']?.[index].toFixed(2)
          : '-';
      const p99 =
        typeof data?.['p99']?.[index] === 'number' &&
        !isNaN(data?.['p99']?.[index])
          ? data?.['p99']?.[index].toFixed(2)
          : '-';

      if (
        p1 !== null ||
        p25 !== null ||
        median !== null ||
        p75 !== null ||
        p99 !== null
      ) {
        tableData.push({
          startTime,
          p1: !isNaN(p1)
            ? parseInt(p1).toString().length < 7
              ? Humanize.intComma(p1)
              : Humanize.compactInteger(p1, 2)
            : '-',
          p25: !isNaN(p25)
            ? parseInt(p25).toString().length < 7
              ? Humanize.intComma(p25)
              : Humanize.compactInteger(p25, 2)
            : '-',
          median: !isNaN(p25)
            ? parseInt(median).toString().length < 7
              ? Humanize.intComma(median)
              : Humanize.compactInteger(median, 2)
            : '-',
          p75: !isNaN(p25)
            ? parseInt(p75).toString().length < 7
              ? Humanize.intComma(p75)
              : Humanize.compactInteger(p75, 2)
            : '-',
          p99: !isNaN(p25)
            ? parseInt(p99).toString().length < 7
              ? Humanize.intComma(p99)
              : Humanize.compactInteger(p99, 2)
            : '-',
        });
      }
    });
    tableBodyData = tableData;
  }

  return (
    <div className={css(styles.commonSectionWrapper)}>
      <div className={css(styles.lastOneDayLabel)}>Data for last 1 day</div>
      <div className={`bios-custom-table ${css(styles.StatTableWrapper)}`}>
        {tableBodyData.length > 0 ? (
          <Table
            columns={columns}
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

export default PercentilesTable;
