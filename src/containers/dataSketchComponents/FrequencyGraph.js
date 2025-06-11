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
import React, { useMemo } from 'react';
import { css } from 'aphrodite';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Humanize from 'humanize-plus';

import { useWindowSize } from 'common/hooks';
import styles from './styles';

const FrequencyGraph = ({ data, isStringType, distinctCountAbove256Limit }) => {
  const [width] = useWindowSize();
  const { count } = data;

  const totalEvents = useMemo(
    () =>
      count?.length > 0
        ? count.reduce((acc, item) => {
            return acc + item;
          }, 0)
        : [],
    [count],
  );

  return (
    <div className={css(styles.commonSectionWrapper)}>
      <div className={css(styles.lastOneDayLabel)}>
        Data for last 1 day (
        {Humanize.compactInteger(totalEvents).toUpperCase()} events){' '}
        {distinctCountAbove256Limit && ' - Approximate samples'}
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          title: {
            text: '',
          },
          xAxis: {
            visible: false,
          },
          yAxis: {
            title: {
              enabled: false,
            },
            labels: {
              formatter: function () {
                let value = this.value;

                if (value % 1) {
                  return Highcharts.numberFormat(value, 2);
                }

                return value;
              },
            },
          },
          tooltip: {
            split: true,
            formatter: function () {
              const count =
                parseInt(this.y).toString().length < 7
                  ? Humanize.intComma(this.y)
                  : Humanize.compactInteger(this.y, 2);
              const length = isStringType
                ? parseInt(data.sampleLength[this.x]).toString().length < 7
                  ? Humanize.intComma(data.sampleLength[this.x])
                  : Humanize.compactInteger(data.sampleLength[this.x], 2)
                : 0;
              const sample =
                typeof data.sample[this.x] === 'string'
                  ? data.sample[this.x]
                  : parseInt(data.sample[this.x]).toString().length < 7
                  ? Humanize.intComma(data.sample[this.x])
                  : Humanize.compactInteger(data.sample[this.x], 2);

              return isStringType
                ? 'Sample: ' +
                    sample +
                    '<br />' +
                    'Count: ' +
                    count +
                    '<br />' +
                    'Length: ' +
                    length +
                    '<br />'
                : 'Sample: ' + sample + '<br />Count: ' + count + '<br />';
            },
          },
          series: [
            {
              data: data?.sampleCount?.map((item) =>
                isNaN(item) ? null : item,
              ),
              name: 'Count',
              type: 'spline',
              marker: {
                radius: 2,
              },
            },
          ],
          // chart: { type: 'column' },
        }}
        containerProps={{
          style: {
            height: '100%',
            width: width < 1280 ? width - 40 + 'px' : '100%',
          },
        }}
      />
    </div>
  );
};

export default FrequencyGraph;
