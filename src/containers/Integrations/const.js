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
export const TAB_SOURCE = 0;
export const TAB_PROCESS = 1;
export const TAB_DESTINATION = 2;

export const PANEL_SOURCE = 'source';
export const PANEL_PROCESS = 'process';
export const PANEL_DESTINATION = 'destination';
export const INVITE_USERS = 'invite_users';

export const AUTH_TYPE_LOGIN = 'Login';
export const AUTH_TYPE_INMESSAGE = 'InMessage';
export const AUTH_TYPE_HTTP_HEADER_PLAIN = 'HttpHeadersPlain';
export const AUTH_TYPE_HTTP_AUTH_HEADER = 'HttpAuthorizationHeader';
export const AUTH_TYPE_HMAC = 'Hmac';

export const INTEGRATION_TYPE_WEBHOOK = 'Webhook';
export const INTEGRATION_TYPE_KAFKA = 'Kafka';
export const INTEGRATION_TYPE_HIBERNATE = 'Hibernate';
export const INTEGRATION_TYPE_S3 = 'S3';
export const INTEGRATION_TYPE_FILE = 'File';
export const INTEGRATION_TYPE_REST = 'RestClient';
export const INTEGRATION_TYPE_FACEBOOK = 'FacebookAd';
export const INTEGRATION_TYPE_GOOGLE = 'GoogleAd';

export const INTEGRATION_TYPE_RDBMS_CDC = 'RDBMS - CDC';
export const INTEGRATION_TYPE_RDBMS_PULL = 'RDBMS - Pull';
export const INTEGRATION_TYPE_MYSQL_CDC = 'Mysql';
export const INTEGRATION_TYPE_MYSQL_PULL = 'MysqlPull';
export const INTEGRATION_TYPE_POSTGRES_CDC = 'Postgres';
export const INTEGRATION_TYPE_POSTGRES_PULL = 'PostgresPull';
export const INTEGRATION_TYPE_MONGODB_CDC = 'Mongodb';

export const INTEGRATION_DEFAULT_POLL_INTERVAL = 60;

export const ACTIVE_INTEGRATIONS = [
  INTEGRATION_TYPE_WEBHOOK,
  INTEGRATION_TYPE_KAFKA,
  INTEGRATION_TYPE_S3,
  INTEGRATION_TYPE_FILE,
  INTEGRATION_TYPE_REST,
  INTEGRATION_TYPE_FACEBOOK,
  INTEGRATION_TYPE_GOOGLE,
  INTEGRATION_TYPE_MYSQL_CDC,
  INTEGRATION_TYPE_MYSQL_PULL,
  INTEGRATION_TYPE_POSTGRES_CDC,
  INTEGRATION_TYPE_MONGODB_CDC,
];

export const INTEGRATION_TYPE_DISPLAY_NAME = {
  [INTEGRATION_TYPE_WEBHOOK]: INTEGRATION_TYPE_WEBHOOK,
  [INTEGRATION_TYPE_KAFKA]: INTEGRATION_TYPE_KAFKA,
  [INTEGRATION_TYPE_S3]: INTEGRATION_TYPE_S3,
  [INTEGRATION_TYPE_FILE]: INTEGRATION_TYPE_FILE,
  [INTEGRATION_TYPE_REST]: 'REST API',
  [INTEGRATION_TYPE_FACEBOOK]: 'Facebook',
  [INTEGRATION_TYPE_GOOGLE]: 'Google',

  [INTEGRATION_TYPE_RDBMS_CDC]: INTEGRATION_TYPE_RDBMS_CDC,
  [INTEGRATION_TYPE_RDBMS_PULL]: INTEGRATION_TYPE_RDBMS_PULL,
  [INTEGRATION_TYPE_MYSQL_CDC]: 'MySQL - CDC',
  [INTEGRATION_TYPE_MYSQL_PULL]: 'MySQL - Pull',
  [INTEGRATION_TYPE_POSTGRES_CDC]: 'Postgres - CDC',
  [INTEGRATION_TYPE_POSTGRES_PULL]: 'Postgres - Pull',
  [INTEGRATION_TYPE_MONGODB_CDC]: 'MongoDB - CDC',
};

export const RDBMS_DB_DISPLAY_NAME = {
  [INTEGRATION_TYPE_MYSQL_CDC]: 'MySQL',
  [INTEGRATION_TYPE_MYSQL_PULL]: 'MySQL',
  [INTEGRATION_TYPE_POSTGRES_CDC]: 'Postgres',
  [INTEGRATION_TYPE_POSTGRES_PULL]: 'Postgres',
};

export const INTEGRATION_TYPE_TO_TYPE_MAP = {
  Webhook: 'Webhook',
  Kafka: 'Kafka',
  S3: 'S3',
  File: 'File',
  Facebook: 'FacebookAd',
  Google: 'GoogleAd',
  RestClient: 'RestClient',
  'MySQL - CDC': 'Mysql',
  'MySQL - Pull': 'MysqlPull',
  'Postgres - CDC': 'Postgres',
  'Postgres - Pull': 'PostgresPull',
};

export const INTEGRATION_TYPE_PUSH_PULL = {
  [INTEGRATION_TYPE_WEBHOOK]: 'Push',
  [INTEGRATION_TYPE_KAFKA]: 'Pull',
  [INTEGRATION_TYPE_S3]: 'Pull',
  [INTEGRATION_TYPE_FILE]: 'Pull',
  [INTEGRATION_TYPE_REST]: 'Pull',
  [INTEGRATION_TYPE_FACEBOOK]: 'Pull',
  [INTEGRATION_TYPE_GOOGLE]: 'Pull',

  [INTEGRATION_TYPE_RDBMS_CDC]: 'Push',
  [INTEGRATION_TYPE_RDBMS_PULL]: 'Pull',
  [INTEGRATION_TYPE_MYSQL_CDC]: 'Pull',
  [INTEGRATION_TYPE_MYSQL_PULL]: 'Pull',
};

export const FIELD_FOR_IMPORT_SRC_RDBMS = {
  Mysql: ['type', 'databaseHost', 'databasePort', 'databaseName', 'ssl'],
  MysqlPull: [
    'type',
    'databaseHost',
    'databasePort',
    'databaseName',
    'ssl',
    'pollingInterval',
  ],
  Postgres: ['type', 'databaseHost', 'databasePort', 'databaseName', 'ssl'],
};

export const AuthNameMapping = {
  user: { label: 'User', placeholder: 'Enter User Name' },
  password: { label: 'Password', placeholder: 'Enter Password' },
  inMessageUserAttribute: {
    label: 'User Name Key',
    placeholder: 'bios-user',
  },
  inMessagePasswordAttribute: {
    label: 'Password Key',
    placeholder: 'bios-password',
  },
  userHeader: {
    label: 'User Name Header',
    placeholder: 'x-bios-user',
  },
  passwordHeader: {
    label: 'Password Header',
    placeholder: 'x-bios-password',
  },
};

export const DESTINATION_TYPE_S3 = 'S3';

export const DESTINATION_TYPE_DISPLAY_NAME = {
  [DESTINATION_TYPE_S3]: 'AWS S3',
};

export const EXPORT_STATUS_ENABLED = 'Enabled';
export const EXPORT_STATUS_DISABLED = 'Disabled';

export const MESSAGES = {
  EMPTY_DESTINATION_NAME: 'Export Destination Name is required',
  propertyMissing: (prop) => `${prop} is required`,
};
