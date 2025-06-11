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
import { COLOR_LIST } from 'containers/ContextReport/components/ReportGraph/colors';
import Humanize from 'humanize-plus';

export const getFunnelDataWrapper = ({
  series,
  categories,
  sessionFunnelNumVisitMetric,
}) => {
  const regularData = getFunnelData({
    series,
    categories,
    index: 0,
    sessionFunnelNumVisitMetric,
  });
  let cyclicalData = null;
  if (series?.length === 2) {
    cyclicalData = getFunnelData({
      series,
      categories,
      index: 1,
      sessionFunnelNumVisitMetric,
    });
  }

  return {
    regularData,
    cyclicalData,
  };
};

export const getFunnelData = ({
  series,
  categories,
  index,
  sessionFunnelNumVisitMetric,
}) => {
  const data = [];
  let total = 0;
  series?.[index].data?.forEach((element, index) => {
    const name = categories?.[index];
    const item = {
      name,
      y: 100 / categories?.length,
      hoverValue: element,
    };
    if (sessionFunnelNumVisitMetric) {
      if (name === 'Total') {
        item.weightage = 100;
        total = element;
      } else {
        item.weightage = (element / total) * 100;
      }
    }
    data.push(item);
  });

  return {
    name: series?.[index]?.name,
    data,
  };
};

const isSessionFunnelNumVisitMetric = ({ selectedMetrics }) => {
  return (
    selectedMetrics?.length === 1 &&
    selectedMetrics?.[0]?.measurement === 'session_funnel.sum(numVisits)'
  );
};

export const getFunnelChartPlotData = ({ plotOptions, selectedMetrics }) => {
  const {
    series,
    xAxis: { categories },
  } = plotOptions;
  const sessionFunnelNumVisitMetric = isSessionFunnelNumVisitMetric({
    selectedMetrics,
  });
  const data = getFunnelDataWrapper({
    series,
    categories,
    sessionFunnelNumVisitMetric,
  });
  const newSeries = [];
  if (data?.regularData) {
    newSeries.push(data?.regularData);
  }
  if (data?.cyclicalData) {
    newSeries.push(data?.cyclicalData);
  }

  return {
    chart: {
      type: 'funnel',
    },
    title: {
      text: '',
    },
    plotOptions: {
      series: {
        neckWidth: '25%',
        neckHeight: '0%',
        width: '80%',
        center: ['50%', '50%'],
        dataLabels: {
          style: {
            textOutline: 0,
            color: '#000',
            fontSize: '11px',
          },
          enabled: true,
          formatter: function () {
            const weightage = this.point.weightage
              ? ` (${Humanize.compactInteger(this.point.weightage, 2)}%)`
              : '';
            const value =
              parseInt(this.point.hoverValue).toString().length < 4
                ? Humanize.intComma(this.point.hoverValue)
                : Humanize.compactInteger(this.point.hoverValue, 2);
            return this.point.name + ' (' + value + ')' + weightage;
          },
          inside: true,
        },
      },
      funnel: {
        colors: COLOR_LIST,
      },
    },
    legend: {
      enabled: false,
    },
    series: newSeries,
    tooltip: {
      useHTML: true,
      customTooltipPerSeries: function () {
        return (
          '<b>' +
          this.series.name +
          '</br>' +
          this.point.name +
          '</b></br>Value: <b>' +
          this.point.hoverValue
        );
      },
      formatter: function () {
        if (this.series.tooltipOptions.customTooltipPerSeries) {
          return this.series.tooltipOptions.customTooltipPerSeries.call(this);
        }
      },
    },
  };
};
