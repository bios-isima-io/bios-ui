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
import { WINDOW_SIZE_MAPPING, DURATION_MIN_WINDOW_SIZE_ALLOWED } from './const';
import { cloneDeep } from 'lodash';

const getCustomWSAllowedThreshold = (duration) => {
  const durationArray = Object.keys(DURATION_MIN_WINDOW_SIZE_ALLOWED);
  let prev = 0;

  for (let i = 0; i < durationArray.length; i++) {
    let current = parseInt(durationArray[i]);
    if (prev < duration && duration < current) {
      break;
    } else {
      prev = current;
    }
  }
  if (prev === 0) return parseInt(durationArray[0]);
  return prev;
};

const getWindowSizeMapping = (duration) => {
  const newWindowSizeMapping = cloneDeep(WINDOW_SIZE_MAPPING);
  let customAllowedWSThreshold;
  newWindowSizeMapping.forEach((ws) => {
    let wsValue;
    if (!isNaN(ws.value)) {
      wsValue = parseInt(ws.value);
      if (wsValue > duration) {
        ws.disabled = true;
      } else {
        ws.disabled = false;
      }

      // block unsupported ws size so graph loading does not lag
      if (DURATION_MIN_WINDOW_SIZE_ALLOWED[parseInt(duration)]) {
        const minWindowSizeAllowed =
          DURATION_MIN_WINDOW_SIZE_ALLOWED[parseInt(duration)];

        if (wsValue < minWindowSizeAllowed) {
          ws.disabled = true;
        }
      } else {
        if (!customAllowedWSThreshold) {
          customAllowedWSThreshold =
            DURATION_MIN_WINDOW_SIZE_ALLOWED[
              getCustomWSAllowedThreshold(duration)
            ];
        }
        if (wsValue < customAllowedWSThreshold) {
          ws.disabled = true;
        }
      }
    }
  });
  return newWindowSizeMapping;
};

const findAllowedWindowSize = (windowSizeMapping) => {
  const allowedWindowSize = windowSizeMapping.find((ws) => {
    return !ws.disabled;
  });
  return parseInt(allowedWindowSize.value);
};

const getWSBasedOnExistingWSDuration = ({ windowSize, duration }) => {
  const newWindowSizeMapping = getWindowSizeMapping(duration);
  let newWindowSize = findAllowedWindowSize(newWindowSizeMapping);
  return { newWindowSize, newWindowSizeMapping };
};

export {
  getWindowSizeMapping,
  getWSBasedOnExistingWSDuration,
  findAllowedWindowSize,
};
