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
import { makeTimestamps } from '..';

describe('makeTimestamps', () => {
  describe('fundamental', () => {
    const basicDataSet = {
      1685467500000: {
        '_usage.sum(numWrites)': 473462,
        '_usage.sum(numReads)': 33361,
      },
      1685467800000: {
        '_usage.sum(numWrites)': 355837,
        '_usage.sum(numReads)': 25497,
      },
      1685468100000: {
        '_usage.sum(numWrites)': 443218,
        '_usage.sum(numReads)': 29909,
      },
      1685468400000: {
        '_usage.sum(numWrites)': 473732,
        '_usage.sum(numReads)': 32505,
      },
      1685468700000: {
        '_usage.sum(numWrites)': 362525,
        '_usage.sum(numReads)': 24711,
      },
      1685469000000: {
        '_usage.sum(numWrites)': 438829,
        '_usage.sum(numReads)': 30138,
      },
      1685469300000: {
        '_usage.sum(numWrites)': 477663,
        '_usage.sum(numReads)': 33066,
      },
      1685469600000: {
        '_usage.sum(numWrites)': 350677,
        '_usage.sum(numReads)': 23619,
      },
      1685469900000: {
        '_usage.sum(numWrites)': 435844,
        '_usage.sum(numReads)': 30155,
      },
      1685470200000: {
        '_usage.sum(numWrites)': 456641,
        '_usage.sum(numReads)': 31904,
      },
      1685470500000: {
        '_usage.sum(numWrites)': 357176,
        '_usage.sum(numReads)': 24425,
      },
      1685470800000: {
        '_usage.sum(numWrites)': 429867,
        '_usage.sum(numReads)': 29531,
      },
    };

    const oneStartPointMissing = { ...basicDataSet };
    delete oneStartPointMissing[1685467500000];

    const twoStartPointsMissing = { ...basicDataSet };
    delete twoStartPointsMissing[1685467500000];
    delete twoStartPointsMissing[1685467800000];

    const oneEndPointMissing = { ...basicDataSet };
    delete oneEndPointMissing[1685470500000];

    const twoEndPointsMissing = { ...basicDataSet };
    delete twoEndPointsMissing[1685470500000];
    delete twoEndPointsMissing[1685470800000];

    const sparseData = { ...basicDataSet };
    delete sparseData[1685468100000];
    delete sparseData[1685468400000];
    delete sparseData[1685468700000];

    const expectedStartTimestamps = [
      1685467500000, 1685467800000, 1685468100000, 1685468400000, 1685468700000,
      1685469000000, 1685469300000, 1685469600000, 1685469900000, 1685470200000,
      1685470500000, 1685470800000,
    ];
    const windowSize = 300000;
    const expectedTimestamps = expectedStartTimestamps.map((start) => {
      return { start, end: start + windowSize };
    });

    it.each([
      ['Full data', basicDataSet],
      ['One starting point missing', oneStartPointMissing],
      ['Two starting points missing', twoStartPointsMissing],
      ['One ending point missing', oneEndPointMissing],
      ['Two ending points missing', twoEndPointsMissing],
      ['Sparse data', sparseData],
    ])('Fundamental: %s', (_, dataSet) => {
      const timestamps = makeTimestamps({
        dataSet,
        durationStart: 1685467500000,
        duration: 3600000,
        windowSize,
      });

      expect(timestamps).toStrictEqual(expectedTimestamps);
    });

    it.each([
      ['Missing durationStart', { duration: 3600000, windowSize: 300000 }],
      [
        'Missing duration',
        { durationStart: 1685467500000, windowSize: 300000 },
      ],
      [
        'Missing windowSize',
        { durationStart: 1685467500000, duration: 3600000 },
      ],
    ])('Incomplete param: %s', (_, params) => {
      const timestamps = makeTimestamps({
        dataSet: basicDataSet,
      });

      expect(timestamps).toStrictEqual(expectedTimestamps);
    });
  });

  describe('Data points and time range not aligned', () => {
    const basicDataSet = {
      1685454900000: {
        '_usage.sum(numWrites)': 859406,
        '_usage.sum(numReads)': 62086,
        '_usage.count()': 502,
      },
      1685455800000: {
        '_usage.sum(numWrites)': 906115,
        '_usage.sum(numReads)': 64326,
        '_usage.count()': 506,
      },
      1685456700000: {
        '_usage.sum(numWrites)': 968804,
        '_usage.sum(numReads)': 67888,
        '_usage.count()': 506,
      },
      1685457600000: {
        '_usage.sum(numWrites)': 1015928,
        '_usage.sum(numReads)': 71286,
        '_usage.count()': 504,
      },
      1685458500000: {
        '_usage.sum(numWrites)': 1049336,
        '_usage.sum(numReads)': 72034,
        '_usage.count()': 509,
      },
      1685459400000: {
        '_usage.sum(numWrites)': 1066345,
        '_usage.sum(numReads)': 72248,
        '_usage.count()': 506,
      },
      1685460300000: {
        '_usage.sum(numWrites)': 1097179,
        '_usage.sum(numReads)': 75670,
        '_usage.count()': 508,
      },
      1685461200000: {
        '_usage.sum(numWrites)': 1114571,
        '_usage.sum(numReads)': 77207,
        '_usage.count()': 508,
      },
      1685462100000: {
        '_usage.sum(numWrites)': 1150247,
        '_usage.sum(numReads)': 86109,
        '_usage.count()': 548,
      },
      1685463000000: {
        '_usage.sum(numWrites)': 1144511,
        '_usage.sum(numReads)': 82594,
        '_usage.count()': 517,
      },
      1685463900000: {
        '_usage.sum(numWrites)': 1162809,
        '_usage.sum(numReads)': 85926,
        '_usage.count()': 551,
      },
      1685464800000: {
        '_usage.sum(numWrites)': 1184699,
        '_usage.sum(numReads)': 84483,
        '_usage.count()': 526,
      },
      1685465700000: {
        '_usage.sum(numWrites)': 1213910,
        '_usage.sum(numReads)': 86676,
        '_usage.count()': 518,
      },
      1685466600000: {
        '_usage.sum(numWrites)': 1228230,
        '_usage.sum(numReads)': 83745,
        '_usage.count()': 510,
      },
      1685467500000: {
        '_usage.sum(numWrites)': 1281144,
        '_usage.sum(numReads)': 86363,
        '_usage.count()': 518,
      },
      1685468400000: {
        '_usage.sum(numWrites)': 1272787,
        '_usage.sum(numReads)': 87911,
        '_usage.count()': 517,
      },
      1685469300000: {
        '_usage.sum(numWrites)': 1279017,
        '_usage.sum(numReads)': 87915,
        '_usage.count()': 513,
      },
      1685470200000: {
        '_usage.sum(numWrites)': 1243162,
        '_usage.sum(numReads)': 85678,
        '_usage.count()': 514,
      },
      1685471100000: {
        '_usage.sum(numWrites)': 1258776,
        '_usage.sum(numReads)': 86558,
        '_usage.count()': 508,
      },
      1685472000000: {
        '_usage.sum(numWrites)': 1233908,
        '_usage.sum(numReads)': 86809,
        '_usage.count()': 508,
      },
      1685472900000: {
        '_usage.sum(numWrites)': 1245973,
        '_usage.sum(numReads)': 89155,
        '_usage.count()': 522,
      },
      1685473800000: {
        '_usage.sum(numWrites)': 1209916,
        '_usage.sum(numReads)': 86011,
        '_usage.count()': 515,
      },
      1685474700000: {
        '_usage.sum(numWrites)': 1217915,
        '_usage.sum(numReads)': 86995,
        '_usage.count()': 527,
      },
      1685475600000: {
        '_usage.sum(numWrites)': 1210636,
        '_usage.sum(numReads)': 88257,
        '_usage.count()': 526,
      },
    };

    const oneStartPointMissing = { ...basicDataSet };
    delete oneStartPointMissing[1685454900000];

    const twoStartPointsMissing = { ...basicDataSet };
    delete twoStartPointsMissing[1685455800000];
    delete twoStartPointsMissing[1685454900000];

    const oneEndPointMissing = { ...basicDataSet };
    delete oneEndPointMissing[1685474700000];

    const twoEndPointsMissing = { ...basicDataSet };
    delete twoEndPointsMissing[1685474700000];
    delete twoEndPointsMissing[1685475600000];

    const sparseData = { ...basicDataSet };
    delete sparseData[1685455800000];
    delete sparseData[1685457600000];
    delete sparseData[1685458500000];

    const expectedStartTimestamps = [
      1685454900000, 1685455800000, 1685456700000, 1685457600000, 1685458500000,
      1685459400000, 1685460300000, 1685461200000, 1685462100000, 1685463000000,
      1685463900000, 1685464800000, 1685465700000, 1685466600000, 1685467500000,
      1685468400000, 1685469300000, 1685470200000, 1685471100000, 1685472000000,
      1685472900000, 1685473800000, 1685474700000, 1685475600000,
    ];
    const windowSize = 900000;

    const expectedTimestamps = expectedStartTimestamps.map((start) => {
      return { start, end: start + windowSize };
    });

    it.each([
      ['Full data', basicDataSet],
      ['One starting point missing', oneStartPointMissing],
      ['Two starting points missing', twoStartPointsMissing],
      ['One ending point missing', oneEndPointMissing],
      ['Two ending points missing', twoEndPointsMissing],
      ['Sparse data', sparseData],
    ])('%s', (_, dataSet) => {
      const timestamps = makeTimestamps({
        dataSet,
        durationStart: 1685454900000,
        duration: 21600000,
        windowSize,
      });

      expect(timestamps).toStrictEqual(expectedTimestamps);
    });
  });

  describe('Array input', () => {
    const basicTimestamps = [
      1685379600000, 1685380500000, 1685381400000, 1685382300000, 1685383200000,
      1685384100000, 1685385000000, 1685385900000, 1685386800000, 1685387700000,
      1685388600000, 1685389500000, 1685390400000, 1685391300000, 1685392200000,
      1685393100000, 1685394000000, 1685394900000, 1685395800000, 1685396700000,
      1685397600000, 1685398500000, 1685399400000, 1685400300000,
    ];

    const oneStartPointMissing = basicTimestamps.slice(1);
    const twoStartPointsMissing = basicTimestamps.slice(2);
    const oneEndPointMissing = basicTimestamps.slice(
      0,
      basicTimestamps.length - 1,
    );
    const twoEndPointsMissing = basicTimestamps.slice(
      0,
      basicTimestamps.length - 2,
    );
    const sparse = basicTimestamps.filter((_, i) => ![1, 4, 5].includes(i));

    const windowSize = 900000;

    const expectedTimestamps = basicTimestamps.map((start) => {
      return { start, end: start + windowSize };
    });

    it.each([
      ['Full data', basicTimestamps],
      ['One starting point missing', oneStartPointMissing],
      ['Two starting points missing', twoStartPointsMissing],
      ['One ending point missing', oneEndPointMissing],
      ['Two ending points missing', twoEndPointsMissing],
      ['Sparse data', sparse],
    ])('%s', (_, srcTimestamps) => {
      const cloned = [...srcTimestamps];
      const timestamps = makeTimestamps({
        timestamps: cloned,
        durationStart: 1685379600000,
        duration: 21600000,
        windowSize,
      });

      expect(timestamps).toStrictEqual(expectedTimestamps);
    });
  });

  describe('on-the-fly', () => {
    const basicDataSet = {
      1685656800000: {
        '_usage.sum(numWrites)': 314446,
        '_usage.sum(numReads)': 23454,
      },
      1685657100000: {
        '_usage.sum(numWrites)': 359821,
        '_usage.sum(numReads)': 26137,
      },
      1685657400000: {
        '_usage.sum(numWrites)': 395008,
        '_usage.sum(numReads)': 28695,
      },
      1685657700000: {
        '_usage.sum(numWrites)': 307340,
        '_usage.sum(numReads)': 22694,
      },
      1685658000000: {
        '_usage.sum(numWrites)': 362628,
        '_usage.sum(numReads)': 26266,
      },
      1685658300000: {
        '_usage.sum(numWrites)': 399384,
        '_usage.sum(numReads)': 29157,
      },
      1685658600000: {
        '_usage.sum(numWrites)': 306814,
        '_usage.sum(numReads)': 22605,
      },
      1685658900000: {
        '_usage.sum(numWrites)': 355600,
        '_usage.sum(numReads)': 26460,
      },
      1685659200000: {
        '_usage.sum(numWrites)': 394653,
        '_usage.sum(numReads)': 28781,
      },
      1685659500000: {
        '_usage.sum(numWrites)': 310972,
        '_usage.sum(numReads)': 23172,
      },
      1685659800000: {
        '_usage.sum(numWrites)': 363017,
        '_usage.sum(numReads)': 28139,
      },
      1685660100000: {
        '_usage.sum(numWrites)': 402631,
        '_usage.sum(numReads)': 31077,
      },
      1685660400000: {
        '_usage.sum(numWrites)': 309728,
        '_usage.sum(numReads)': 23077,
      },
      1685660700000: {
        '_usage.sum(numWrites)': 76302,
        '_usage.sum(numReads)': 5450,
      },
    };
    const duration = 3600000;
    const durationStart = 1685656800000;
    const windowSize = 300000;
    const onTheFly = 1685660731182;

    const expectedTimestamps = [
      [1685656800000, 1685657100000],
      [1685657100000, 1685657400000],
      [1685657400000, 1685657700000],
      [1685657700000, 1685658000000],
      [1685658000000, 1685658300000],
      [1685658300000, 1685658600000],
      [1685658600000, 1685658900000],
      [1685658900000, 1685659200000],
      [1685659200000, 1685659500000],
      [1685659500000, 1685659800000],
      [1685659800000, 1685660100000],
      [1685660100000, 1685660400000],
      [1685660400000, 1685660700000],
      [1685660700000, 1685660731182],
    ].map(([start, end]) => ({
      start,
      end,
    }));

    it.each([['Fundamental', basicDataSet]])(
      'Fundamental: %s',
      (_, dataSet) => {
        const timestamps = makeTimestamps({
          dataSet,
          durationStart,
          duration,
          windowSize,
          endTimestamp: onTheFly,
        });

        expect(timestamps).toStrictEqual(expectedTimestamps);
      },
    );
  });
});
