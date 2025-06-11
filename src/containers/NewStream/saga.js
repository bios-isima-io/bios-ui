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
import { all, fork, put, takeLatest } from 'redux-saga/effects';
import { jsonToCSV } from 'react-papaparse';

import bios from '@bios/bios-sdk';

import { LOAD_TEACH_BIOS, ADD_DRAFT_SIGNAL } from './actionTypes';
import {
  onLoadTeachBiosSuccess,
  onLoadTeachBiosError,
  updateCurrentStep,
} from './actions';
import { handleAPIError } from '../utils';

const datatypeMap = {
  int: 'Integer',
  double: 'Decimal',
  string: 'String',
  boolean: 'Boolean',
};

export const convertSnakeCaseToCamelCase = (str) => {
  return str.replace(/(_\w)/g, function (k) {
    return k[1].toUpperCase();
  });
};

const getDefaultValueByType = (type) => {
  if (type === 'int') {
    return 0;
  } else if (type === 'double') {
    return 0.0;
  } else if (type === 'string') {
    return 'MISSING';
  } else if (type === 'boolean') {
    return false;
  }
};

function transformAttributes(attributes) {
  if (attributes && Array.isArray(attributes)) {
    return attributes.map((entity) => {
      const type = entity.isTimestamp ? 'int' : entity.type;
      return {
        isNewEntry: true,
        data: entity.data,
        attributeName: entity.name,
        type: type,
        default: getDefaultValueByType(type),
        defaultEnabled: false,
        category: entity.isTimestamp ? 'Quantity' : null,
        kind: entity.isTimestamp ? 'Timestamp' : null,
        otherKindName: '',
        unit: entity.isTimestamp ? 'UnixMillisecond' : null,
        unitDisplayName: '',
        unitDisplayPosition: null,
        positiveIndicator: null,
        firstSummary: null,
        secondSummary: null,
      };
    });
  }
  return [];
}

function transformAttributesWithUseHeader(attributes, fileContent) {
  let headers = fileContent?.split('\n')?.[0]?.split(',');
  if (attributes && Array.isArray(attributes)) {
    return attributes.map((entity, index) => {
      return {
        data: entity.data.slice(1),
        name: headers[index],
        type: entity.type,
      };
    });
  }
  return [];
}

function* workerTeachbiOSSaga({ payload }) {
  try {
    const { type, data, fields, flowMapping } = payload || {};

    let teach = null;
    if (type === 'custom-attributes') {
      teach = data;
    } else if (type === 'file-upload') {
      let { fileContent, activeTransFormations } = data;
      if (activeTransFormations.includes(3)) {
        fileContent = fileContent.map((row, index) => {
          return row.map((value) => {
            if (activeTransFormations.includes(0) && index === 0) {
              return value;
            }
            if (value?.trim() === '') {
              return 'MISSING';
            }
            return value;
          });
        });
      }
      teach = jsonToCSV(fileContent, {
        newline: '\n',
      });
    } else if (type === 'json') {
      teach = data;
    }

    const teachResponse = yield bios.teachBios(teach);
    let attributes = teachResponse?.attributes;

    if (type === 'file-upload') {
      const { activeTransFormations } = data;
      if (activeTransFormations.includes(0)) {
        attributes = transformAttributesWithUseHeader(attributes, teach);
        if (activeTransFormations.includes(1)) {
          attributes = attributes.map((item) => {
            const updatedValue = convertSnakeCaseToCamelCase(item['name']);
            item['name'] = updatedValue;
            return item;
          });
        }
      }
    }
    if (type === 'json') {
      attributes = attributes.map((attribute, index) => {
        attribute.name = fields[index];
        if (
          flowMapping &&
          flowMapping.attributeMapping &&
          flowMapping.convert_atToTimestamp
        ) {
          const attributeMapping = flowMapping.attributeMapping[fields[index]];
          attribute.isTimestamp = !!attributeMapping?.isTimestamp;
        }
        return attribute;
      });
    }
    attributes = transformAttributes(
      type === 'file-upload' || type === 'json'
        ? attributes
        : teachResponse?.attributes,
    );
    attributes = attributes.map((entity) => {
      entity.type = datatypeMap[entity.type];
      return entity;
    });
    yield put(onLoadTeachBiosSuccess(attributes));
    yield put(updateCurrentStep(2));
  } catch (error) {
    handleAPIError(error);
    yield put(onLoadTeachBiosError(error));
  }
}

function workerAddSignalSaga({ payload }) {
  try {
    let { history, streamName, attributes } = payload;

    const signalDetail = {
      signalName: streamName,
      missingAttributePolicy: 'Reject',
      attributes: attributes,
      enrich: {
        enrichments: [],
      },
      postStorageStage: {
        features: [],
      },
      dataSynthesisStatus: null,
    };
    // yield put(updateCurrentStep(0));
    history &&
      history.push({
        pathname: `/signal/${streamName}`,
        state: { signalDetail },
      });
  } catch (e) {
    handleAPIError(e);
    // yield put(setSignalsError('Error in fetching context'));
  }
}

function* actionWatcher() {
  yield takeLatest(LOAD_TEACH_BIOS, workerTeachbiOSSaga);
  yield takeLatest(ADD_DRAFT_SIGNAL, workerAddSignalSaga);
}

export function* watchNewStreamSaga() {
  yield all([fork(actionWatcher)]);
}
