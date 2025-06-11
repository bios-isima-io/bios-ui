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
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import Humanize from 'humanize-plus';

import { useWindowSize } from 'common/hooks';

HighchartsMore(Highcharts);

const BoxPlotGraph = ({ data = [[]], plotCounts = true }) => {
  const [boxPlotGraphData, setBoxPlotGraphData] = useState([[]]);
  const [volumeGraphData, setVolumeGraphData] = useState([[]]);
  const [width] = useWindowSize();

  useEffect(() => {
    if (data && data.sum && data.sum.length > 0) {
      let updatedBoxPlotGraphData = [];
      let updatedVolumeGraphData = [];

      let i = 0;
      for (i; i < data.sum.length; i += 1) {
        updatedBoxPlotGraphData.push([
          !isNaN(data.p1[i]) ? data.p1[i] : null,
          !isNaN(data.p25[i]) ? data.p25[i] : null,
          !isNaN(data.median[i]) ? data.median[i] : null,
          !isNaN(data.p75[i]) ? data.p75[i] : null,
          !isNaN(data.p99[i]) ? data.p99[i] : null,
        ]);
        if (plotCounts) {
          updatedVolumeGraphData.push([
            data.startTime[i], // the date
            !isNaN(data.count[i]) ? data.count[i] : null, // the volume
          ]);
        }
      }
      setBoxPlotGraphData(updatedBoxPlotGraphData);
      if (plotCounts) {
        setVolumeGraphData(updatedVolumeGraphData);
      }
    }
  }, [data, plotCounts]);

  const options = {
    title: {
      text: '',
    },
    xAxis: {
      visible: false,
    },
    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Spread',
        },
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
    ],
    tooltip: {
      split: true,
      formatter: function () {
        const formatNumber = function (num) {
          return parseInt(num).toString().length < 7
            ? Humanize.intComma(num)
            : Humanize.compactInteger(num, 2);
        };
        const boxPlotFormatter = function (p) {
          const { point = {} } = p;
          const { high, q3, median, q1, low } = point;
          return (
            '99th Percentile: ' +
            formatNumber(high) +
            '<br />75th Percentile: ' +
            formatNumber(q3) +
            '<br />Median: ' +
            formatNumber(median) +
            '<br />25th Percentile: ' +
            formatNumber(q1) +
            '<br />1st Percentile: ' +
            formatNumber(low)
          );
        };
        const lineFormatter = function (p) {
          return 'Volume: ' + formatNumber(p?.point?.y);
        };
        return [
          'Time : ' + moment(data.startTime[this.x]).format('YYYY-MM-DD HH:mm'),
          boxPlotFormatter(this.points[0]),
          lineFormatter(this.points[1]),
        ];
      },
    },
    series: [
      {
        name: 'Spread',
        type: 'boxplot',
        data: boxPlotGraphData,
      },
    ],
  };

  if (plotCounts) {
    const countsYAxis = {
      labels: {
        align: 'right',
        x: -3,
      },
      title: {
        text: 'Count',
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2,
    };

    const countsSeries = {
      name: 'Count',
      type: 'spline',
      marker: {
        radius: 2,
      },
      data: volumeGraphData,
      yAxis: 1,
    };

    options.yAxis[0].height = '60%';
    options.yAxis.push(countsYAxis);
    options.series.push(countsSeries);
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
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

export default BoxPlotGraph;
