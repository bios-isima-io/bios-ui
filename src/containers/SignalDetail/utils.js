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
import { Tooltip } from 'antdlatest';

const findEnrichedAttribute = (signalDetail, contexts, attributeName) => {
  const result = {};
  const canonAttrName = attributeName.toLowerCase();
  signalDetail?.enrich?.enrichments.forEach((enrichment) => {
    enrichment.contextAttributes.forEach((enrichedAttribute) => {
      const outName = !!enrichedAttribute.as
        ? enrichedAttribute.as
        : enrichedAttribute.attributeName;
      if (outName.toLowerCase() === canonAttrName) {
        result.context = enrichment.contextName.toLowerCase();
        result.attributeName = enrichedAttribute.attributeName;
      }
    });
  });
  if (!result.context) {
    return undefined;
  }
  const contextConfig = contexts.find(
    (context) => context.contextName.toLowerCase() === result.context,
  );
  return getAttributeConfig(contextConfig, [], result.attributeName);
};

export const buildDataTypeForEnrichment = (enrichments, contexts) => {
  const data = {};
  const contextMap = new Map();

  contexts?.forEach((context) => {
    contextMap?.set(context?.contextName, context);
  });

  enrichments?.forEach((enrich) => {
    enrich?.enrichedAttributes?.forEach((enrichAtt) => {
      if (
        enrichAtt?.as &&
        enrichAtt?.value &&
        enrichAtt?.value?.includes('.')
      ) {
        const [contextName, attributeName] = enrichAtt?.value?.split('.');
        if (!contextMap?.has(contextName)) {
          return;
        }
        const contextDetails = contextMap.get(contextName);
        const attributeDetails = contextDetails?.attributes?.find(
          (att) => att?.attributeName === attributeName,
        );
        data[enrichAtt?.as] = attributeDetails;
      }
    });
  });
  return data;
};

/**
 * Gets attribute configuration by a name.
 *
 * The method always looks for enriched attributes if the name is not found in the
 * signal's attributes.
 *
 * @param streamConfig {object} signal or context config
 * @param contexts {list<object>} all available contexts
 * @param attributeName {string} name of the attribute to look for
 * @returns {object} Found attribute config or undefined
 */
export const getAttributeConfig = (streamConfig, contexts, attributeName) => {
  const attr = attributeName.toLowerCase();
  let attributeConf = streamConfig.attributes.find(
    (entry) => entry.attributeName.toLowerCase() === attr,
  );
  if (!!attributeConf) {
    return attributeConf;
  }
  return findEnrichedAttribute(streamConfig, contexts, attributeName);
};

const buildAttributeArray = (arr, signalConfig, contexts) => {
  const resp = [];
  arr.forEach((item) => {
    const attributeConfig = getAttributeConfig(signalConfig, contexts, item);
    resp.push({
      attributeName: attributeConfig.attributeName,
      type: attributeConfig.type,
    });
  });
  return resp;
};

/**
 * Builds context config for LastN Feature as Context output.
 *
 * The function generates a context with attributes --- the primary key
 * and the value attribute. The primary key has the same names and types with
 * the LastN dimensions. The value attribute is always of string type. Its name
 * is the LastN tracking attribute name followed by 'Collection',
 * e.g. 'productIdCollection' for tracking attribute 'productId'.
 *
 * @param contextName {string} context name
 * @param signalConfig {object} signal config
 * @param feature {object} feature config that includes the LastN setup
 * @param contexts {list<object>} list of context config
 * @returns {object} context config for LastN FaC output
 */
export const buildLastNContextConfig = (
  contextName,
  signalConfig,
  feature,
  contexts,
) => {
  const primaryKey = [...feature?.dimensions];
  if (primaryKey.includes('operation')) {
    primaryKey.splice(primaryKey.indexOf('operation'), 1);
  }
  const dimensionArray = buildAttributeArray(
    primaryKey,
    signalConfig,
    contexts,
  );
  const attribute = feature.attributes[0];
  const contextConfig = {
    contextName,
    missingAttributePolicy: 'Reject',
    attributes: [
      ...dimensionArray,
      { attributeName: `${attribute}Collection`, type: 'String' },
    ],
    primaryKey,
    ttl: feature.ttl + 60 * 24 * 3600 * 1000, // Feature TTL + 60 days
  };
  return contextConfig;
};

/**
 * Builds context config for AccumulatingCount Feature as Context output.
 *
 * The function generates a context with attributes --- the primary key
 * and the value attributes. The primary key has the same names and types with
 * the LastN dimension. The value attributes are inherited from feature attributes.
 *
 * @param contextName {string} context name
 * @param signalConfig {object} signal config
 * @param feature {object} feature config that includes the LastN setup
 * @param contexts {list<object>} list of context config
 * @returns {object} context config for LastN FaC output
 */
export const buildAccumulatingCountContextConfig = (
  contextName,
  signalConfig,
  feature,
  contexts,
) => {
  const attributeArray = buildAttributeArray(
    feature.attributes,
    signalConfig,
    contexts,
  );

  const primaryKey = [...feature?.dimensions];
  if (primaryKey.includes('operation')) {
    primaryKey.splice(primaryKey.indexOf('operation'), 1);
  }

  const dimensionArray = buildAttributeArray(
    primaryKey,
    signalConfig,
    contexts,
  );
  const contextConfig = {
    contextName,
    missingAttributePolicy: 'Reject',
    attributes: [
      ...attributeArray,
      ...dimensionArray,
      {
        attributeName: 'timestamp',
        type: 'Integer',
        tags: {
          category: 'Quantity',
          kind: 'Timestamp',
          unit: 'UuidTime',
        },
      },
    ],
    primaryKey,
  };
  return contextConfig;
};

/**
 * Tests if an existing context is usable for specified feature context.
 *
 * The method checks if the schema is compatible with the reference context.
 * Also checks if the context's TTL is as expected.
 *
 * @param existingContext {object} existing context
 * @param refContext {object} reference context
 * @returns {object} {schemaMatches, ttlEquals}
 */
export const isFeatureContext = (existingContext, refContext) => {
  const result = {
    schemaMatches: false,
    ttlEquals: false,
  };
  if (!existingContext) {
    return result;
  }
  result.ttlEquals = existingContext.ttl === refContext.ttl;
  if (!(existingContext.attributes?.length >= 2)) {
    return result;
  }
  const primaryKey = existingContext?.primaryKey;
  // defensive code for corrupted context config
  if (!primaryKey) {
    return result;
  }
  let valueAttrChecked = false;
  const globalMissingAttributePolicy =
    existingContext.missingAttributePolicy?.toLowerCase();
  for (let attribute of existingContext.attributes) {
    const canonName = attribute?.attributeName?.toLowerCase();
    const type = attribute?.type?.toLowerCase();
    if (canonName === primaryKey[0]?.toLowerCase()) {
      if (
        type !== refContext.attributes[0].type.toLowerCase() ||
        canonName !== refContext.attributes[0].attributeName.toLowerCase()
      ) {
        return result;
      }
    } else if (
      canonName === refContext.attributes[1].attributeName.toLowerCase()
    ) {
      if (type === refContext.attributes[1].type.toLowerCase()) {
        valueAttrChecked = true;
      } else {
        return result;
      }
    } else {
      const missingAttributePolicy =
        attribute?.missingAttributePolicy?.toLowerCase() ||
        globalMissingAttributePolicy;
      if (missingAttributePolicy !== 'storedefaultvalue') {
        return result;
      }
    }
  }
  result.schemaMatches = valueAttrChecked;
  return result;
};

export const findAnyStringProperty = (srcObject) => {
  if (Array.isArray(srcObject)) {
    for (let element in srcObject) {
      const value = findAnyStringProperty(element);
      if (!!value) {
        return value;
      }
    }
    return undefined;
  }
  if (srcObject instanceof Object) {
    for (const [, entryValue] of Object.entries(srcObject)) {
      const value = findAnyStringProperty(entryValue);
      if (!!value) {
        return value;
      }
    }
    return undefined;
  }
  // scalar, null, or undefined
  return srcObject;
};

/**
 * Gives a label with tags.
 *
 * The label is colored red when there's an error message.
 * The error message would be provided by a tooltip on the label.
 *
 * @param label {string} label to show
 * @param errorMessage {string} error message associated with the label if any
 * @returns Rendered label
 */
export const renderLabel = (label, errorMessage) => {
  return (
    <Tooltip title={errorMessage}>
      <div style={{ color: !!errorMessage ? 'red' : 'black' }}>{label}</div>
    </Tooltip>
  );
};
