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
import { css } from 'aphrodite';

import { Tabs } from 'containers/components';
import DistinctCountGraph from 'containers/dataSketchComponents/DistinctCountGraph';
import DistinctCountTable from 'containers/dataSketchComponents/DistinctCountTable';
import FrequencyGraph from 'containers/dataSketchComponents/FrequencyGraph';
import PercentilesTable from 'containers/dataSketchComponents/PercentilesTable';
import SpreadGraph from 'containers/dataSketchComponents/SpreadGraph';
import StatisticsTable from 'containers/dataSketchComponents/StatisticsTable';
import SumGraph from 'containers/dataSketchComponents/SumGraph';
import WordCloud from 'containers/dataSketchComponents/WordCloud';
import WordCloudTable from 'containers/dataSketchComponents/WordCloudTable';
import PropTypes from 'prop-types';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';
import styles from './styles';

const DataSketches = ({ selectedAttribute, activePanel }) => {
  const getTabsConfig = () => {
    const dataSketchesData = selectedAttribute?.trendLineData
      ? selectedAttribute?.trendLineData
      : [];

    const distinctCountAbove256Limit =
      selectedAttribute?.distinctCountSummaryNumber &&
      selectedAttribute?.distinctCountSummaryNumber > 256
        ? true
        : false;

    if (
      selectedAttribute.type === 'String' ||
      selectedAttribute.type === 'Boolean'
    ) {
      return {
        defaultTab: 5,
        headerStyle: {
          textAlign: 'center',
        },
        tabs: [
          {
            label: 'Samples',
            key: 5,
            content: () => {
              return (
                <div key="wordCloud">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 51,
                      tabs: [
                        {
                          label: 'Word Cloud',
                          key: 51,
                          content: () => {
                            return activePanel === 'sketches' ? (
                              <WordCloud
                                sample={dataSketchesData?.sample}
                                sampleCount={dataSketchesData?.sampleCount}
                                count={dataSketchesData?.count}
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            ) : (
                              <div></div>
                            );
                          },
                        },
                        {
                          label: 'Frequencies',
                          key: 61,
                          content: () => {
                            return (
                              <FrequencyGraph
                                data={dataSketchesData}
                                isStringType={
                                  selectedAttribute.type === 'String'
                                }
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 52,
                          content: () => {
                            return (
                              <WordCloudTable
                                data={dataSketchesData}
                                isStringType={
                                  selectedAttribute.type === 'String'
                                }
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
          {
            label: 'Distinct Count',
            key: 3,
            content: () => {
              return (
                <div key="distinctCountTab">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 31,
                      tabs: [
                        {
                          label: 'Graph',
                          key: 31,
                          content: () => {
                            return (
                              <DistinctCountGraph data={dataSketchesData} />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 32,
                          content: () => {
                            return (
                              <DistinctCountTable data={dataSketchesData} />
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
        ],
      };
    } else {
      let firstSummary = selectedAttribute.firstSummary
        ? selectedAttribute.firstSummary
        : selectedAttribute?.synopsisTags?.firstSummary;

      return {
        defaultTab: 1,
        headerStyle: {
          textAlign: 'center',
        },
        tabs: [
          {
            label: `Primary Metric <span class="text-sm">${
              firstSummary ? '(' + firstSummary + ')' : ''
            }</span>`,
            key: 1,
            content: () => {
              return (
                <div key="averageTab">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 11,
                      tabs: [
                        {
                          label: 'Graph',
                          key: 11,
                          content: () => {
                            const dataKey =
                              firstSummary &&
                              typeof firstSummary === 'string' &&
                              firstSummary.toLowerCase();

                            if (dataKey === 'word_cloud') {
                              return activePanel === 'sketches' ? (
                                <WordCloud
                                  sample={dataSketchesData?.sample}
                                  sampleCount={dataSketchesData?.sampleCount}
                                  count={dataSketchesData?.count}
                                  distinctCountAbove256Limit={
                                    distinctCountAbove256Limit
                                  }
                                />
                              ) : (
                                <div></div>
                              );
                            }
                            return (
                              <SumGraph
                                data={dataSketchesData}
                                dataKey={dataKey}
                                isItTimestampLag={
                                  firstSummary === 'TIMESTAMP_LAG'
                                }
                              />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 12,
                          content: () => {
                            return (
                              <StatisticsTable
                                data={dataSketchesData}
                                selectedAttribute={selectedAttribute}
                              />
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
          {
            label: 'Spread',
            key: 2,
            content: () => {
              return (
                <div key="spreadTab">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 21,
                      tabs: [
                        {
                          label: 'Graph',
                          key: 21,
                          content: () => {
                            return (
                              <SpreadGraph
                                data={dataSketchesData}
                                type="signal"
                              />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 22,
                          content: () => {
                            return <PercentilesTable data={dataSketchesData} />;
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
          {
            label: 'Samples',
            key: 5,
            content: () => {
              return (
                <div key="wordCloud">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 51,
                      tabs: [
                        {
                          label: 'Word Cloud',
                          key: 51,
                          content: () => {
                            return activePanel === 'sketches' ? (
                              <WordCloud
                                sample={dataSketchesData?.sample}
                                sampleCount={dataSketchesData?.sampleCount}
                                count={dataSketchesData?.count}
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            ) : (
                              <div></div>
                            );
                          },
                        },
                        {
                          label: 'Frequencies',
                          key: 61,
                          content: () => {
                            return (
                              <FrequencyGraph
                                data={dataSketchesData}
                                isStringType={
                                  selectedAttribute.type === 'String'
                                }
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 52,
                          content: () => {
                            return (
                              <WordCloudTable
                                data={dataSketchesData}
                                distinctCountAbove256Limit={
                                  distinctCountAbove256Limit
                                }
                              />
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
          {
            label: 'Distinct Count',
            key: 3,
            content: () => {
              return (
                <div key="distinctCountTab">
                  <Tabs
                    tabsConfig={{
                      defaultTab: 31,
                      tabs: [
                        {
                          label: 'Graph',
                          key: 31,
                          content: () => {
                            return (
                              <DistinctCountGraph data={dataSketchesData} />
                            );
                          },
                        },
                        {
                          label: 'Table',
                          key: 32,
                          content: () => {
                            return (
                              <DistinctCountTable data={dataSketchesData} />
                            );
                          },
                        },
                      ],
                    }}
                  />
                </div>
              );
            },
          },
        ],
      };
    }
  };

  return (
    <div className={css(styles.RPFieldWrapper)}>
      {(selectedAttribute?.trendLineData?.sum?.length > 0 ||
        selectedAttribute?.trendLineData?.distinctCount?.length > 0) && (
        <Tabs tabsConfig={getTabsConfig()} />
      )}
    </div>
  );
};

DataSketches.propTypes = {
  selectedAttribute: PropTypes.instanceOf(Object),
};

export default DataSketches;
