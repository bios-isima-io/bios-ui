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

// inputObject : any simple/nested Object
// but array is not a valid inout

import { isObject, isEmpty, camelCase, keys } from 'lodash';
import { cloneDeep } from 'lodash-es';

const parentJoinString = (arr, separator) =>
  arr.map((k, i) => k + separator).join('');

const isScalarArray = (arr) => {
  return arr.every(
    (entity) => typeof entity === 'string' || typeof entity === 'number',
  );
};

const handleScalarValues = ({
  cur,
  flatObj,
  parent,
  currentKey,
  prependParent,
  error,
  snakeCaseToCamelCase,
  attributeMapping,
  attributeSearchPath,
  concatenateScalerOperator,
  FirstArrayElementInSearchPath,
  checkDuplicate,
}) => {
  //Handle array with scalar values
  const value = cur.join('_');
  let parentVal = parent;

  //Remove currentKey value from parent array if it's there to fix double prepending
  if (prependParent) {
    const temp = [...parent];
    const lastEle = temp.pop();
    if (lastEle === currentKey) {
      parentVal = temp;
    }
  }

  return handlePrependParent({
    cur: value,
    parent: parentVal,
    prependParent,
    currentKey,
    flatObj,
    error,
    concatenateScalerOperator,
    snakeCaseToCamelCase,
    attributeMapping,
    attributeSearchPath,
    FirstArrayElementInSearchPath,
    checkDuplicate,
  });
};

const handlePrependParent = ({
  cur,
  parent,
  prependParent,
  currentKey,
  error,
  snakeCaseToCamelCase,
  flatObj,
  attributeMapping,
  attributeSearchPath,
  FirstArrayElementInSearchPath,
  concatenateScalerOperator,
  convert_atToTimestamp = false,
  checkDuplicate,
}) => {
  //Ignore K-V when attributeSearchPath contains nested arrays
  if (
    FirstArrayElementInSearchPath &&
    [...parent, currentKey].includes(FirstArrayElementInSearchPath) &&
    ![...parent, currentKey].includes(
      attributeSearchPath[attributeSearchPath.length - 1],
    )
  ) {
    return;
  }

  const mapping = {};
  const kvPair = {};
  const tempOperator =
    concatenateScalerOperator === '' ? '_' : concatenateScalerOperator;
  if (prependParent && parent.length > 0) {
    let parentString = snakeCaseToCamelCase
      ? parent.map((k, i) => camelCase(k) + tempOperator).join('') +
        camelCase(currentKey)
      : parentJoinString(parent, tempOperator) + currentKey;

    //In case concatenateScalerOperator is empty string than camelCase whole string
    if (concatenateScalerOperator === '') {
      parentString = camelCase(parentString);
    }

    //Strip name longer than 40 character as attribute name can have max 40 char
    parentString = parentString.replace(/ /g, '').slice(0, 40);
    if (
      flatObj.hasOwnProperty(parentString) &&
      attributeMapping.hasOwnProperty(parentString) &&
      JSON.stringify(attributeMapping?.[parentString]?.path) ===
        JSON.stringify([...parent, currentKey]) &&
      checkDuplicate
    ) {
      error['message'] = `${currentKey} is duplicated`;
      error['type'] = `duplicate`;
      return;
    }
    mapping[parentString] = {
      name: parentString,
      path: [...parent, currentKey],
      type: typeof cur,
      isTimestamp:
        convert_atToTimestamp &&
        (currentKey.endsWith('_at') || currentKey.endsWith('At')),
    };
    kvPair[parentString] = cur;
  } else {
    let currentKayOriginalValue = currentKey;
    if (snakeCaseToCamelCase) {
      currentKey = camelCase(currentKey);
    }
    //Strip name longer than 40 character as attribute name can have max 40 char
    currentKey = currentKey.replace(/ /g, '').slice(0, 40);

    if (
      flatObj.hasOwnProperty(currentKey) &&
      attributeMapping.hasOwnProperty(currentKey) &&
      checkDuplicate
    ) {
      error['message'] = `${currentKey} is duplicated`;
      error['type'] = `duplicate`;
      return;
    }

    mapping[currentKey] = {
      name: currentKey,
      path: [...parent, currentKayOriginalValue],
      type: typeof cur,
      isTimestamp:
        convert_atToTimestamp &&
        (currentKey.endsWith('_at') || currentKey.endsWith('At')),
    };
    kvPair[currentKey] = cur;
  }

  return { mapping, kvPair };
};

const handleNullValue = ({ cur, replaceNullValues, currentKey }) => {
  let error = null;
  let updatedValue = null;

  if (cur === null || cur === '') {
    if (!replaceNullValues) {
      error = {};
      error['type'] = `null`;
      if (cur === null) {
        error['message'] = `null values are not allowed, key: ${currentKey}`;
      } else if (cur === '') {
        error[
          'message'
        ] = `Empty string values are not allowed, key: ${currentKey}`;
      }
    } else {
      updatedValue = 'MISSING';
    }
  }

  return { error, updatedValue };
};

export const ProcessesJSON = ({
  inputObject,
  prependParent = false,
  replaceNullValues = false,
  concatenateScaler = false,
  concatenateScalerOperator = '_',
  flattenJSON = false,
  snakeCaseToCamelCase = false,
  selectedArrayItem = null,
  convert_atToTimestamp = false,
}) => {
  let FirstArrayElementInSearchPath = null;
  let attributeSearchPath = selectedArrayItem?.path;
  let error = {};
  let attributeMapping = {};
  let flatObj = {};
  let levelCount = 0;
  let checkDuplicate = true;

  const updateResultMapping = (mapping, kvPair) => {
    attributeMapping = { ...attributeMapping, ...mapping };
    if (kvPair) {
      flatObj = { ...flatObj, ...kvPair };
    }
  };

  function recurse(cur, parent, currentKey) {
    levelCount = levelCount + 1;

    //Return if there is some error already found
    if (!isEmpty(error)) {
      return;
    }

    if (Object(cur) !== cur) {
      const response = handleNullValue({ cur, replaceNullValues, currentKey });
      if (response.error) {
        error = response.error;
        return;
      } else if (response.updatedValue) {
        cur = response.updatedValue;
      }

      const { mapping, kvPair } =
        handlePrependParent({
          cur,
          parent,
          prependParent,
          currentKey,
          error,
          snakeCaseToCamelCase,
          concatenateScalerOperator,
          flatObj,
          attributeMapping,
          attributeSearchPath,
          FirstArrayElementInSearchPath,
          convert_atToTimestamp,
          checkDuplicate,
        }) || {};
      if (error && error.message) {
        return;
      }
      if (mapping && kvPair) {
        updateResultMapping(mapping, kvPair);
      }
      return { mapping, kvPair };
    } else if (Array.isArray(cur)) {
      if (cur.length === 0) {
        return;
      }
      if (levelCount >= 2 && !flattenJSON) {
        return;
      }

      //Update Mapping for array key
      let map = {};
      map[currentKey] = {
        name: currentKey,
        path: parent,
        type: 'array',
      };
      updateResultMapping({ ...map });

      // This pre-calculate the start key from where K-V pairs needs to be ignored
      // when attributeSearchPath containing nested array.
      if (
        attributeSearchPath &&
        attributeSearchPath.length > 1 &&
        FirstArrayElementInSearchPath === null &&
        attributeSearchPath
          .slice(0, attributeSearchPath.length - 1)
          .includes(currentKey)
      ) {
        FirstArrayElementInSearchPath = currentKey;
      }

      //Handle Array of scalar values
      if (isScalarArray(cur) && concatenateScaler) {
        const { mapping, kvPair } =
          handleScalarValues({
            cur,
            flatObj,
            parent,
            currentKey,
            prependParent,
            error,
            concatenateScalerOperator,
            snakeCaseToCamelCase,
            attributeMapping,
            attributeSearchPath,
            FirstArrayElementInSearchPath,
            checkDuplicate,
          }) || {};
        if (error && error.message) {
          return;
        }
        if (mapping && kvPair) {
          updateResultMapping(mapping, kvPair);
          return { mapping, kvPair };
        }
      }

      const isArrayOfObject = cur.every((item) => isObject(item));
      //Allow only selected array to process and parent arrays to it
      if (
        isArrayOfObject &&
        attributeSearchPath &&
        attributeSearchPath.includes(currentKey) &&
        parent.every((val) => attributeSearchPath.includes(val))
      ) {
        let arrayResult = [];

        cur.forEach((object, index) => {
          if (index > 0) {
            checkDuplicate = false;
          }

          const attributeMappingCopy = cloneDeep(attributeMapping);
          const flatObjCopy = cloneDeep(flatObj);
          const result = recurse(object, parent);
          if (error && error.message) {
            return;
          }

          const mapping = { ...attributeMappingCopy, ...result.mapping };
          const kvPair = { ...flatObjCopy, ...result.kvPair };
          arrayResult.push({ mapping, kvPair });
        });
        checkDuplicate = true;
        let allKVPairKeys = [];
        arrayResult.forEach((item) => {
          const keysList = keys(item.kvPair);
          allKVPairKeys = { ...allKVPairKeys, ...keysList };
        });
        let mergeMapping = [];
        arrayResult.forEach((item) => {
          mergeMapping = { ...mergeMapping, ...item.mapping };
        });

        arrayResult = arrayResult.map((item, i) => {
          const finalKVPairs = {};
          Object.keys(allKVPairKeys).forEach((key) => {
            if (item.kvPair.hasOwnProperty(allKVPairKeys[key])) {
              finalKVPairs[allKVPairKeys[key]] =
                item.kvPair[allKVPairKeys[key]];
            } else {
              //Trying to find data for the key in other rows so that we can get better results
              let valueFoundInOtherRow = null;
              arrayResult.forEach((entity, index) => {
                if (i === index) {
                  return;
                }
                if (
                  entity.kvPair.hasOwnProperty(allKVPairKeys[key]) &&
                  entity.kvPair[allKVPairKeys[key]] !== 'MISSING'
                ) {
                  valueFoundInOtherRow = entity.kvPair[allKVPairKeys[key]];
                }
              });
              finalKVPairs[allKVPairKeys[key]] = valueFoundInOtherRow
                ? valueFoundInOtherRow
                : 'MISSING';
            }
          });
          if (error && error.message) {
            return {};
          }
          return {
            mapping: { ...mergeMapping, ...item.mapping },
            kvPair: finalKVPairs,
          };
        });

        if (error && error.message) {
          return;
        }
        updateResultMapping(arrayResult[0].mapping, arrayResult[0].kvPair);
        return {
          mapping: arrayResult[0].mapping,
          kvPair: arrayResult[0].kvPair,
        };
      }
    } else {
      if (levelCount >= 2 && !flattenJSON) {
        return;
      }
      let isEmpty = true;
      let mapping = {};
      let kvPair = {};
      for (let p in cur) {
        let currentObjKey = '';
        if (isObject(cur[p])) {
          currentObjKey = p;
        }
        isEmpty = false;
        const result = recurse(
          cur[p],
          parent
            ? currentObjKey
              ? [...parent, currentObjKey]
              : parent
            : [currentObjKey],
          p,
        );
        if (result && result.mapping && result.kvPair) {
          mapping = { ...mapping, ...result.mapping };
          kvPair = { ...kvPair, ...result.kvPair };
        }
      }

      if (isEmpty && parent) {
        return;
      } else {
        updateResultMapping(mapping, kvPair);
        if (currentKey) {
          let map = {};
          map[currentKey] = {
            name: currentKey,
            path: parent,
            type: 'object',
          };
          updateResultMapping({ ...map });
        }
        return { mapping, kvPair };
      }
    }
  }

  let result = recurse(inputObject, [], null);

  //Handle if there are no K-V pair to process
  if (Object.keys(result?.kvPair).length === 0) {
    error['message'] = 'No data to process';
    error['type'] = `nodata`;
  }

  return {
    flatObj: result && result.kvPair ? result.kvPair : {},
    flowMapping: {
      attributeMapping: result && result.mapping ? result.mapping : {},
      prependParent: prependParent,
      snakeCaseToCamelCase,
      attributeSearch: '',
      attributeSearchPath,
      concatenateScalerOperator,
      convert_atToTimestamp,
    },
    error,
  };
};
