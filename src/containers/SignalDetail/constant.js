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
const EMPTY_SIGNAL_NAME_WARNING_MSG = 'Signal name is required';
const EMPTY_ALLOWED_VALUES_MSG =
  'At least one character is required for an allowed value';
const DEFAULT_MISSING_IN_ALLOWED_VALUE_MSG =
  'The default value is missing in allowed value list';
const EMPTY_DEFAULT_VALUE_MSG = 'Default value is required';
const EMPTY_SIGNAL_ATTRIBUTE_WARNING_MSG = 'Attribute name is required';
const EMPTY_SIGNAL_ATTRIBUTE_UNIT_POSITION_MSG =
  'Unit prefix/suffix is required';
const DUPLICATE_ENRICHMENT_NAME = 'The enrichment name is already used';
const EMPTY_TIME_LAG_ATTRIBUTE_NAME = 'Time lag attribute name is required';
const DUPLICATE_FEATURE_NAME = 'The feature name is already used';
const MISSING_UNIT_DISPLAY_NAME =
  'Unit display name is required when unit is OtherType';
const ALLOWED_VALUE_CANT_REMOVE_MSG = `Allowed values can't be removed`;

const ATTRIBUTE_ID_TO_TYPE_MAPPING = {
  1: 'Integer',
  2: 'Decimal',
  3: 'String',
  5: 'Boolean',
};

const TypeMapping = {
  Decimal: 1,
  Integer: 2,
  String: 3,
  Boolean: 4,
};
const IDTypeMapping = ['Decimal', 'Integer', 'String', 'Boolean'];

/**
 * Makes error message for an invalid name.
 *
 * @param entityType {string} entity type, start with capital letter.
 * @returns {string} generated error message
 */
const makeInvalidNameMessage = (entityType) =>
  `${entityType} includes invalid characters; please use only alphabets and numbers.
  Second and later character may be underscore (_), too`;

/**
 * Make error message for a duplicate name.
 *
 * @param entityType {string} entity type, start with small letter
 * @returns {string} generated error message
 */
const makeDuplicateNameMessage = (entityType) =>
  `The ${entityType} is already used; please use another name`;

const makeDuplicateAttributeInEnrichmentMessage = (attribute, context) =>
  `The attribute name "${attribute}' is already used in context '${context}'; please use alias`;

const makeDuplicateAliasMessage = (alias) =>
  `The alias "${alias}' is already used.`;

export {
  TypeMapping,
  IDTypeMapping,
  ATTRIBUTE_ID_TO_TYPE_MAPPING,
  EMPTY_SIGNAL_NAME_WARNING_MSG,
  EMPTY_ALLOWED_VALUES_MSG,
  DEFAULT_MISSING_IN_ALLOWED_VALUE_MSG,
  EMPTY_DEFAULT_VALUE_MSG,
  EMPTY_SIGNAL_ATTRIBUTE_WARNING_MSG,
  DUPLICATE_ENRICHMENT_NAME,
  EMPTY_TIME_LAG_ATTRIBUTE_NAME,
  DUPLICATE_FEATURE_NAME,
  EMPTY_SIGNAL_ATTRIBUTE_UNIT_POSITION_MSG,
  MISSING_UNIT_DISPLAY_NAME,
  ALLOWED_VALUE_CANT_REMOVE_MSG,
  makeDuplicateAttributeInEnrichmentMessage,
  makeInvalidNameMessage,
  makeDuplicateNameMessage,
  makeDuplicateAliasMessage,
};
