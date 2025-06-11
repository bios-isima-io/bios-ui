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
import { getAttributeConfig } from '../utils';

const isFunction = (word) => {
  return !!['min', 'max', 'sum', 'count'].find(
    (entry) => word.toLowerCase() === entry,
  );
};

const tokenize = (condition) => {
  const tokens = [];
  let inLiteral = false;
  let inOperator = false;
  let inFunction = false;
  let escape = false;
  let token = '';
  for (let i = 0; i < condition.length; ++i) {
    const ch = condition.charAt(i);
    if (inLiteral) {
      if (escape) {
        token = token.concat(ch);
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      token = token.concat(ch);
      if (ch === "'") {
        inLiteral = false;
        tokens.push(token);
        token = '';
      }
      continue;
    }
    if (ch === '>' || ch === '<' || ch === '=') {
      if (!inOperator) {
        if (token.length > 0) {
          tokens.push(token);
          token = '';
        }
      }
      inOperator = true;
    } else if (inOperator) {
      tokens.push(token);
      token = '';
      inOperator = false;
    }
    if (ch === ' ' || ch === '\t') {
      if (token.length > 0) {
        tokens.push(token);
        token = '';
      }
      continue;
    }
    if (ch === '(' || ch === ')') {
      if (ch === '(' && isFunction(token)) {
        inFunction = true;
      } else if (ch === ')' && inFunction) {
        inFunction = false;
        token = token.concat(ch);
        tokens.push(token);
        token = '';
        continue;
      } else {
        if (token.length > 0) {
          tokens.push(token);
        }
        tokens.push(ch);
        token = '';
        continue;
      }
    }
    token = token.concat(ch);
    if (ch === "'") {
      inLiteral = true;
      continue;
    }
  }
  if (token.length > 0) {
    tokens.push(token);
  }
  return tokens;
};

export const parseCondition = (condition) => {
  if (!condition) {
    return [];
  }

  const logicalOps = new Set(['==', '<', '<=', '>', '>=', 'CONTAINS']);

  const tokens = tokenize(condition);
  const relations = [];
  let relation = null;
  let isAnd = undefined;
  let expectAndOr = false;
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];
    if (token === '(') {
      if (relation !== null) {
        relations.push(relation);
      }
      relation = { isAnd };
    } else if (token === ')') {
      if (relation?._isLogical) {
        // previous empty relations are redundant for a logical relation
        while (relations.length > 0) {
          const peek = relations[relations.length - 1];
          if (peek.lhs !== undefined) {
            break;
          }
          relations.pop();
        }
        relations.push(relation);
        expectAndOr = true;
        relation = null;
      } else {
        if (relations.length === 0) {
          // uneditable
          return null;
        }
        if (relation === null) {
          // do nothing
          continue;
        }
        // bundle and put it to the previous relation
        const element = `(${relation.lhs} ${relation.op} ${relation.rhs})`;
        relation = relations.pop();
        if (relation.lhs === undefined) {
          relation.lhs = element;
        } else if (relation.rhs !== undefined) {
          // syntax error
          return null;
        } else {
          relation.rhs = element;
        }
      }
    } else if (expectAndOr) {
      isAnd = token.toUpperCase() === 'AND';
      expectAndOr = false;
    } else if (relation === null) {
      return null;
    } else if (relation.lhs === undefined) {
      relation.lhs = token;
    } else if (relation.op === undefined) {
      relation.op = token.toUpperCase();
      relation._isLogical = logicalOps.has(relation.op);
    } else {
      relation.rhs = token;
    }
  }
  return relations;
};

export const isNumericColumn = (lhs, signalConfig, contexts) => {
  if (lhs === undefined || lhs === '') {
    return undefined;
  }
  if (lhs === 'count()') {
    return true;
  }
  if (
    lhs.length >= 5 &&
    ['sum(', 'min(', 'max('].find((prefix) => prefix === lhs.substring(0, 4))
  ) {
    return true;
  }
  const attributeConfig = getAttributeConfig(signalConfig, contexts, lhs);
  return !!attributeConfig ? attributeConfig.type !== 'String' : undefined;
};

export const isDecimalColumn = (lhs, signalConfig, contexts) => {
  const attributeConfig = getAttributeConfig(signalConfig, contexts, lhs);
  return attributeConfig?.type === 'Decimal';
};

export const findContext = (contexts, contextName) => {
  const canonName = contextName.toLowerCase();
  return contexts.find(
    (context) => context.contextName.toLowerCase() === canonName,
  );
};

export const buildFeatureAsContextName = (signalConfig, featureConfig) => {
  const signalName = signalConfig.signalName.replace(/_?[sS]ignal$/g, ''); // cspell:disable-line
  const featureName = featureConfig.featureName.replace(/_?[sS]ignal$/g, ''); // cspell:disable-line;
  return `${signalName}_${featureName}`;
};

/**
 * Wrap the specified string by single quotes.
 *
 * @param src - source string
 * @returns quoted string
 */
export const quote = (src) => {
  const escaped = src.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${escaped}'`;
};

/**
 * Remove single quotes from a literal string.
 *
 * @param src - source string
 * @returns unquoted string
 */
export const unquote = (src) => {
  if (!src.startsWith("'") || !src.endsWith("'")) {
    return src;
  }
  return src
    .substring(1, src.length - 1)
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
};
