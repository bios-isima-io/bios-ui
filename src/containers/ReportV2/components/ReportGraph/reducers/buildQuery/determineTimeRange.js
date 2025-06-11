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
import bios from '@bios/bios-sdk';

import { INTERVAL_5_MIN } from 'containers/ReportV2/components/ReportGraph/const';

/**
 * @typedef{Object} TimeRange
 * @property {number} start - Start time in milliseconds
 * @property {number} delta - Delta time in milliseconds
 */

/**
 * Determines the time range.
 *
 * If the request is not on the fly, the method runs a probing query and decide the range
 * based on the data availability.
 *
 * @property {number} durationStart - Requested start time in milliseconds
 * @property {number} duration - Duration of the time range in milliseconds
 * @property {number} onTheFly - The current time if on-the-fly is requested
 * @property {array} selectedSignals - Target signals
 * @returns {TimeRange} Calculated time range
 */
function* determineTimeRange({
  durationStart,
  duration,
  onTheFly,
  selectedSignals,
}) {
  let start;
  let delta;
  if (onTheFly) {
    start = durationStart;
    delta = onTheFly - start;
  } else {
    start = durationStart;
    delta = duration;
    if (selectedSignals.length === 0) {
      return { start, delta };
    }
    const end = durationStart + duration;
    const probeDataPoints = 4;

    // Determine step sizes for selected signals and make query statements
    const stepSizes = [];
    const statements = selectedSignals.map((signal) => {
      const { signalName } = signal;
      const stepSize =
        signal.postStorageStage?.features?.reduce((minimum, feature) => {
          if (!!feature.materializedAs) {
            // this does not create default feature
            return minimum;
          }
          return Math.min(minimum, feature.featureInterval);
        }, INTERVAL_5_MIN) ?? INTERVAL_5_MIN;
      stepSizes.push(stepSize);
      const probeDuration = probeDataPoints * stepSize;
      return bios
        .iSqlStatement()
        .select({ metric: 'count()' })
        .from(signalName)
        .tumblingWindow(stepSize)
        .snappedTimeRange(end, -probeDuration)
        .build();
    });

    // Execute queries and adjust the query start time based on data availability
    const result = yield bios.multiExecute(...statements);
    const shift = result?.reduce((maxStepSize, response, i) => {
      if (response.dataWindows?.length !== probeDataPoints) {
        maxStepSize = Math.max(maxStepSize, stepSizes[i]);
      }
      return maxStepSize;
    }, 0);
    start -= shift;
  }

  return { start, delta };
}

export default determineTimeRange;
