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
const COLOR_GRADIENT = [
  // ['#253C5A', '#325078', '#3E6496', '#6583AB', '#8BA2C0'],
  // ['#81262B', '#C23940', '#D73F47', '#DF656C', '#EB9FA3'],
  // ['#3D6662', '#518882', '#65AAA3', '#84BBB5', '#B2D5D1'],
  // ['#254A1F', '#3B7632', '#4A933E', '#6EA965', '#A5C99F'],
  // ['#8B7322', '#BA992E', '#E8BF39', '#EDCC61', '#F4DF9C'],
  // ['#5F3C56', '#7F5073', '#9F6490', '#B283A6', '#CFB2C8'],
  // ['#98525B', '#CA6D79', '#FD8897', '#FDA0AC', '#FEC4CB'],
  // ['#291D17', '#523A2E', '#89614D', '#A18171', '#C4B0A6'],
  // ['#A55518', '#D46E1F', '#EC7A22', '#F0954E', '#F6BD91'],
  // ['#56504E', '#89807D', '#ABA09C', '#BCB3B0', '#D5D0CE'],

  ['#024B7A', '#1B5D87', '#356F95', '#4E81A2', '#6793AF', '#81A5BD'],
  ['#5C6E56', '#839D7B', '#8FA788', '#A8BAA3', '#B5C4B0', '#CDD8CA'],
  ['#3D6662', '#518882', '#65AAA3', '#84BBB5', '#B2D5D1', '#B7DFDB'],
  ['#313A52', '#414D6D', '#516088', '#7480A0', '#97A0B8', '#CBCFDB'],
  ['#44B7C2', '#57BEC8', '#7CCDD4', '#8FD4DA', '#A2DBE1', '#B4E2E7'],
  ['#171717', '#494949', '#838383', '#A9A9A9', '#C8C8C8', '#E2E2E2'],
  ['#5C443B', '#76574D', '#8F7166', '#B5A099', '#CDC0BB', '#E6DFDD'],
  ['#5F3C56', '#7F5073', '#9F6490', '#B283A6', '#CFB2C8'],
  ['#8B7322', '#BA992E', '#E8BF39', '#EDCC61', '#F4DF9C'],
  ['#A55518', '#D46E1F', '#EC7A22', '#F0954E', '#F6BD91'],
];

const REST_GRADIENT = [
  '#1B314b',
  '#364B63',
  '#607080',
  '#94A3B3',
  '#D3DDE7',
  '#E9F9F7',
];

const GRAPH_COLORS = [
  '#10ac84',
  '#ee5253',
  '#2e86de',
  '#ff9f43',
  '#90a4ae',
  '#004C6D',
  '#536D4B',
  '#941100',
  '#FFD656',
  '#454545',
];

const CYCLICAL_COLOR = '#e2e2e2';

const getSelectedColumns = (order) => {
  const newGradient = COLOR_GRADIENT.reduce((acc, gradients) => {
    const newArr = order.map((val) => gradients[val]);
    acc.push(newArr);
    return acc;
  }, []);

  return newGradient;
};

const GRAPH_COLORS_1 = () => {
  const order = [2];
  return getSelectedColumns(order);
};

const GRAPH_COLORS_2 = () => {
  const order = [1, 3];
  return getSelectedColumns(order);
};

const GRAPH_COLORS_3 = () => {
  const order = [0, 2, 4];
  return getSelectedColumns(order);
};

const GRAPH_COLORS_4 = () => {
  const order = [0, 1, 3, 4];
  return getSelectedColumns(order);
};

const GRAPH_COLORS_5 = () => {
  const order = [0, 1, 2, 3, 4];
  return getSelectedColumns(order);
};

const COLOR_INDEX_ORDER = [4, 2, 0, 1, 3];

const getGraphColorArrayName = (count) => {
  switch (count) {
    case 1:
      return GRAPH_COLORS_1();
    case 2:
      return GRAPH_COLORS_2();
    case 3:
      return GRAPH_COLORS_3();
    case 4:
      return GRAPH_COLORS_4();
    case 5:
      return GRAPH_COLORS_5();
    default:
      return GRAPH_COLORS_5();
  }
};

export {
  COLOR_GRADIENT,
  COLOR_INDEX_ORDER,
  REST_GRADIENT,
  GRAPH_COLORS_1,
  GRAPH_COLORS_2,
  GRAPH_COLORS_3,
  GRAPH_COLORS_4,
  GRAPH_COLORS_5,
  CYCLICAL_COLOR,
  GRAPH_COLORS,
  getGraphColorArrayName,
};
