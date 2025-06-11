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
import { generateTooltipNumber } from '../../utils';

const buildBubbleDataSet = (series) => {
  const dataSet = {};
  series.forEach((ser) => {
    ser.data.forEach((d) => {
      if (!(d.name in dataSet)) {
        dataSet[d.name] = {};
      }
      dataSet[d.name][ser.name] = d.value;
    });
  });
  return dataSet;
};

const buildBubbleResp = (selectedMetrics, dataSet, colors) => {
  const data = [];
  const xLabel = selectedMetrics?.[1]?.as;
  const xShowPercentage = selectedMetrics?.[1]?.showPercentage;
  const yLabel = selectedMetrics?.length === 2 ? '' : selectedMetrics?.[2]?.as;
  const yShowPercentage =
    selectedMetrics?.length === 2 ? '' : selectedMetrics?.[2]?.showPercentage;
  const zShowPercentage = selectedMetrics?.[0]?.showPercentage;
  let xUnitDisplayName;
  let xUnitDisplayPosition;
  let yUnitDisplayName;
  let yUnitDisplayPosition;
  let zUnitDisplayName;
  let zUnitDisplayPosition;
  let minSize = 10;
  let maxSize = 85;
  if (selectedMetrics?.length === 3) {
    xUnitDisplayName = selectedMetrics?.[1]?.unitDisplayName;
    xUnitDisplayPosition = selectedMetrics?.[1]?.unitDisplayPosition;
    yUnitDisplayName = selectedMetrics?.[2]?.unitDisplayName;
    yUnitDisplayPosition = selectedMetrics?.[2]?.unitDisplayPosition;
    zUnitDisplayName = selectedMetrics?.[0]?.unitDisplayName;
    zUnitDisplayPosition = selectedMetrics?.[0]?.unitDisplayPosition;
  } else if (selectedMetrics?.length === 2) {
    xUnitDisplayName = selectedMetrics?.[1]?.unitDisplayName;
    xUnitDisplayPosition = selectedMetrics?.[1]?.unitDisplayPosition;
    yUnitDisplayName = selectedMetrics?.[2]?.unitDisplayName;
    yUnitDisplayPosition = selectedMetrics?.[2]?.unitDisplayPosition;
  }
  let i = 0;
  for (const name in dataSet) {
    let values = [];
    let legends = [];
    selectedMetrics.forEach((sm) => {
      values.push(dataSet[name][sm.as] || 0);
      legends.push(sm.as);
    });
    let [zName, xName, yName] = legends;
    let [zValue, xValue, yValue] = values;

    if (xShowPercentage) {
      xValue *= 100;
    }
    if (yShowPercentage) {
      yValue *= 100;
    }
    if (zShowPercentage) {
      zValue *= 100;
    }
    data.push({
      x: xValue,
      y: selectedMetrics?.length === 2 ? 0 : yValue ? yValue : 0,
      z: zValue,
      name,
      xName: xName,
      yName: selectedMetrics?.length === 2 ? '' : yName,
      zName: zName,
      xUnitDisplayName,
      yUnitDisplayName,
      zUnitDisplayName,
      xUnitDisplayPosition,
      yUnitDisplayPosition,
      zUnitDisplayPosition,
      color: colors?.[i % colors.length]?.[0],
    });
    i++;
  }

  if (data?.length < 5) {
    minSize = 55;
    maxSize = 80;
  }
  const resp = {
    chart: {
      type: 'bubble',
    },
    title: {
      text: '',
    },
    legend: {
      enabled: false,
    },

    xAxis: {
      title: {
        text: xLabel,
      },
      maxPadding: 0.05,
    },

    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: yLabel,
      },
      maxPadding: 0.2,
    },
    plotOptions: {
      bubble: {
        minSize,
        maxSize,
      },
    },
    series: [
      {
        showInLegend: false,
        data,
      },
    ],
  };
  if (selectedMetrics?.length === 3) {
    resp.tooltip = {
      useHTML: true,
      borderColor: 'lightgrey',
      borderRadius: '10',
      formatter: function () {
        return (
          '<b>' +
          this.point.name +
          '</b></br>' +
          this.point.xName +
          ' : <b>' +
          generateTooltipNumber(
            this.point.x,
            this.point.xUnitDisplayName,
            this.point.xUnitDisplayPosition,
          ) +
          '</b></br>' +
          this.point.yName +
          ' : <b>' +
          generateTooltipNumber(
            this.point.y,
            this.point.yUnitDisplayName,
            this.point.yUnitDisplayPosition,
          ) +
          '</b></br>' +
          this.point.zName +
          ' : <b>' +
          generateTooltipNumber(
            this.point.z,
            this.point.zUnitDisplayName,
            this.point.zUnitDisplayPosition,
          ) +
          '</b></br>'
        );
      },
    };
  } else if (selectedMetrics?.length === 2) {
    resp.tooltip = {
      useHTML: true,
      borderColor: 'lightgrey',
      borderRadius: '10',
      formatter: function () {
        return (
          '<b> ' +
          this.point.name +
          '</b></br>' +
          this.point.xName +
          ' : <b>' +
          generateTooltipNumber(
            this.point.x,
            this.point.xUnitDisplayName,
            this.point.xUnitDisplayPosition,
          ) +
          '</b></br>' +
          this.point.zName +
          ' : <b>' +
          generateTooltipNumber(
            this.point.z,
            this.point.zUnitDisplayName,
            this.point.zUnitDisplayPosition,
          ) +
          '</b></br>'
        );
      },
    };
  }
  return resp;
};

export { buildBubbleDataSet, buildBubbleResp };
