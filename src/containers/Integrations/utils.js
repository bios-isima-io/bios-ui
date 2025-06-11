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
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  ACTIVE_INTEGRATIONS,
  AUTH_TYPE_LOGIN,
  FIELD_FOR_IMPORT_SRC_RDBMS,
  INTEGRATION_TYPE_KAFKA,
  INTEGRATION_TYPE_MONGODB_CDC,
  INTEGRATION_TYPE_MYSQL_CDC,
  INTEGRATION_TYPE_POSTGRES_CDC,
} from 'containers/Integrations/const';
import messages from 'utils/notificationMessages';

import {
  AuthNameMapping,
  INTEGRATION_TYPE_FACEBOOK,
  INTEGRATION_TYPE_GOOGLE,
  INTEGRATION_TYPE_WEBHOOK,
} from './const';

/**
 * Finds the first link to import destination from the import source via the import flow specs.
 *
 * If there are no such link, the method also finds importSource.importDestinationId and
 * use it to find the destination if any.
 *
 * @param {object} importSource - the import source to start with
 * @param {object} importDestinations - candidate import destinations
 * @param {object} importFlowSpecs - import flow specs that may connect from source to dest
 * @returns {object} Found import destination or undefined
 */
const findImportDestination = (
  importSource,
  importDestinations,
  importFlowSpecs,
) => {
  const spec = importFlowSpecs.find(
    (flow) =>
      flow.sourceDataSpec?.importSourceId === importSource.importSourceId,
  );
  const dest = importDestinations.find(
    (dest) =>
      dest.importDestinationId ===
      spec?.destinationDataSpec?.importDestinationId,
  );
  return (
    dest ||
    importDestinations.find(
      (dest) => dest.importDestinationId === importSource.importDestinationId,
    )
  );
};

const buildWebhookImportSrcData = (
  wh,
  integrationName,
  importDestinationId,
) => {
  return {
    importSourceName: integrationName,
    type: 'Webhook',
    webhookPath: wh.srcWebhookPath,
    importDestinationId,
  };
};

const webhookAddAuth = (wb, biosDestination) => {
  if (biosDestination?.hmacStatus) {
    wb.payloadValidation = {
      type: 'HmacSignature',
      sharedSecret: biosDestination.hmacSharedSecret,
      hmacHeader: biosDestination.hmacHeader,
      digestBase64Encoded: biosDestination.digestBase64Encoded || false,
    };
  }
  if (biosDestination?.destAuthType === 'Login') {
    return wb;
  }
  if (biosDestination?.destAuthType === 'HttpAuthorizationHeader') {
    wb.authentication = {
      type: 'HttpAuthorizationHeader',
    };
    return wb;
  }
  wb.authentication = {
    type: biosDestination.destAuthType,
    [biosDestination.key1]: biosDestination.value1,
    [biosDestination.key2]: biosDestination.value2,
  };
  return wb;
};

const buildAuthFromSavedAuth = (auth) => {
  switch (auth?.type) {
    case 'InMessage':
      return {
        key1: 'inMessageUserAttribute',
        key2: 'inMessagePasswordAttribute',
        value1: auth?.['inMessageUserAttribute'],
        value2: auth?.['inMessagePasswordAttribute'],
      };
    case 'HttpHeadersPlain':
      return {
        key1: 'userHeader',
        key2: 'passwordHeader',
        value1: auth?.['userHeader'],
        value2: auth?.['passwordHeader'],
      };
    case 'HttpAuthorizationHeader':
      return {
        key1: '',
        key2: '',
        value1: '',
        value2: '',
      };
    case 'Login':
    default:
      return {
        key1: 'user',
        key2: 'password',
        value1: auth?.['user'],
        value2: auth?.['password'],
      };
  }
};

const buildPayloadValidation = (payloadValidation) => {
  if (payloadValidation?.type === 'HmacSignature') {
    return {
      hmacStatus: true,
      hmacSharedSecret: payloadValidation.sharedSecret,
      hmacHeader: payloadValidation.hmacHeader,
      hmacDigestBase64Encoded: payloadValidation.digestBase64Encoded,
    };
  }
  return {};
};

const buildHibernateImportSrcData = (integrationName, importDestinationId) => {
  return {
    importSourceName: integrationName,
    type: 'Hibernate',
    importDestinationId,
  };
};

const buildKafkaImportSrcData = (
  kafka,
  integrationName,
  importDestinationId,
) => {
  const payload = {
    importSourceName: integrationName,
    type: 'Kafka',
    bootstrapServers: kafka.bootstrapServers,
    apiVersion: [...kafka.apiVersion.split('.')],
    importDestinationId,
  };

  if (kafka.srcUser && kafka.srcPassword) {
    payload.authentication = {
      type: 'SaslPlaintext',
      user: kafka.srcUser,
      password: kafka.srcPassword,
    };
  }

  return payload;
};

const buildRdbmsImportSrcData = ({
  rdbms,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    importDestinationId,
  };

  for (const field of FIELD_FOR_IMPORT_SRC_RDBMS?.[rdbms?.type]) {
    payload[field] = rdbms?.[field];
  }

  if (rdbms?.type === INTEGRATION_TYPE_POSTGRES_CDC) {
    payload.slotName = rdbms?.slotName
      ? rdbms?.slotName
      : uuidv4().replaceAll('-', '_');
  }

  if (rdbms.srcUser && rdbms.srcPassword) {
    payload.authentication = {
      type: 'Login',
      user: rdbms.srcUser,
      password: rdbms.srcPassword,
    };
  }
  return payload;
};

const buildMongodbImportSrcData = ({
  mongodb,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: 'Mongodb',
    endpoints: mongodb.endpoints,
    databaseName: mongodb.databaseName,
    replicaSet: mongodb.replicaSet,
    useDnsSeedList: mongodb.useDnsSeedList,
    importDestinationId,
    authSource: mongodb.authSource,
    ssl: mongodb?.ssl,
  };

  if (mongodb.srcUser && mongodb.srcPassword) {
    payload.authentication = {
      type: 'Login',
      user: mongodb.srcUser,
      password: mongodb.srcPassword,
    };
  }
  return payload;
};

const buildRdbmsPullImportSrcData = ({
  rdbms,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: rdbms?.type,
    databaseHost: rdbms?.databaseHost,
    databasePort: rdbms?.databasePort,
    databaseName: rdbms?.databaseName,
    importDestinationId,
    pollingInterval: rdbms?.pollingInterval,
    ssl: rdbms?.ssl,
    columnName: rdbms?.columnName,
  };

  if (rdbms.srcUser && rdbms.srcPassword) {
    payload.authentication = {
      type: 'Login',
      user: rdbms.srcUser,
      password: rdbms.srcPassword,
    };
  }
  return payload;
};

const buildS3ImportSrcData = ({ s3, integrationName, importDestinationId }) => {
  const payload = {
    importSourceName: integrationName,
    type: 'S3',
    endpoint: s3?.endpoint,
    pollingInterval: s3?.pollingInterval,
    importDestinationId,
  };

  if (s3.accessKey && s3.secretKey) {
    payload.authentication = {
      type: s3.type,
      accessKey: s3.accessKey,
      secretKey: s3.secretKey,
    };
  }
  return payload;
};

const buildFileImportSrcData = ({
  file,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: 'File',
    fileLocation: file?.fileLocation,
    pollingInterval: file?.pollingInterval,
    importDestinationId,
  };
  return payload;
};

const buildRestImportSrcData = ({
  rest,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: 'RestClient',
    endpoint: rest?.endpoint,
    method: rest?.method,
    importDestinationId,
    pollingInterval: rest?.pollingInterval,
  };
  if (rest?.type) {
    payload.authentication = {
      type: rest.type,
    };
  }
  return payload;
};

const buildGoogleImportSrcData = ({
  google,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: INTEGRATION_TYPE_GOOGLE,
    customerID: google?.customerID,
    pollingInterval: google?.pollingInterval,
    importDestinationId,
  };
  payload.authentication = {
    type: google.type,
    clientId: google.clientId,
    developerToken: google.developerToken,
    clientSecret: google.clientSecret,
    refreshToken: google.refreshToken,
  };
  return payload;
};

const buildFacebookImportSrcData = ({
  facebook,
  integrationName,
  importDestinationId,
}) => {
  const payload = {
    importSourceName: integrationName,
    type: INTEGRATION_TYPE_FACEBOOK,
    endpoint: facebook?.endpoint,
    importDestinationId,
    pollingInterval: facebook?.pollingInterval,
  };
  if (facebook.clientId && facebook.clientSecret && facebook.accessToken) {
    payload.authentication = {
      type: facebook.type,
      clientId: facebook.clientId,
      clientSecret: facebook.clientSecret,
      accessToken: facebook.accessToken,
    };
  }
  return payload;
};

const buildDestData = (bd) => {
  const payload = {
    type: 'Bios',
  };

  if (bd.destAuthType === 'Login') {
    payload.authentication = {
      type: 'Login',
      user: bd.value1,
      password: bd.value2,
    };
  } else {
    payload.authentication = {
      type: bd.destAuthType,
    };
  }
  return payload;
};

const SOURCE_NAME_REQUIRED = 'Source Name is required';

const validateWebhookSource = (webhook, integrationName, biosDestination) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }

  if (webhook.srcWebhookPath === undefined || webhook.srcWebhookPath === '') {
    return 'Webhook Path is required';
  }

  if (!webhook.srcWebhookPath.startsWith('/')) {
    return `Webhook path should start with /`;
  }

  if (biosDestination?.hmacStatus) {
    if (biosDestination?.hmacHeader === '') {
      return 'HMAC header is required';
    } else if (biosDestination?.hmacSharedSecret === '') {
      return 'HMAC Shared Secret is required';
    }
  }

  if (
    biosDestination?.destAuthType === 'HttpHeadersPlain' ||
    biosDestination?.destAuthType === 'InMessage' ||
    biosDestination?.destAuthType === 'Login'
  ) {
    if (biosDestination?.value1 === '') {
      return `${AuthNameMapping[biosDestination?.key1].label} is required`;
    } else if (biosDestination?.value2 === '') {
      return `${AuthNameMapping[biosDestination?.key2].label} is required`;
    }
  }
  return '';
};

function validateIpAndPort(input) {
  var parts = input.split(':');
  var ip = parts[0].split('.');
  var port = parts[1];
  return (
    validateNum(port, 1, 65535) &&
    ip.length === 4 &&
    ip.every(function (segment) {
      return validateNum(segment, 0, 255);
    })
  );
}

function validateIp(input) {
  const ip = input?.split('.');
  return (
    ip.length === 4 &&
    ip.every(function (segment) {
      return validateNum(segment, 0, 255);
    })
  );
}

function validateKafkaVersion(input) {
  const parts = input?.split('.');
  return (
    parts.length === 3 &&
    parts.every(function (segment) {
      return validateNum(segment, 0, 1000);
    })
  );
}

function validateNum(input, min, max) {
  var num = +input;
  return num >= min && num <= max && input === num.toString();
}

const validateArrayOfIps = (ips) => {
  if (ips.length === 0) {
    return 'Bootstrap Servers are required';
  }

  let invalidIps = [];
  ips.forEach((sv) => {
    if (!validateIpAndPort(sv)) {
      invalidIps.push(sv);
    }
  });
  if (invalidIps.length > 0) {
    const invalidIpsString = invalidIps.join(', ');
    return `Server IP(s) or port number(s) are invalid: ${invalidIpsString}`;
  }
  return '';
};

const validateKafkaSource = (
  kafka,
  integrationName,
  setErrors = () => {},
  errors = {},
) => {
  if (integrationName === '' || integrationName === undefined) {
    setErrors({ ...errors, integrationName: true });
    return SOURCE_NAME_REQUIRED;
  }
  if (kafka.bootstrapServers.length === 0) {
    return 'Bootstrap Servers are required';
  }

  let invalidIps = [];
  kafka.bootstrapServers.forEach((sv) => {
    if (!validateIpAndPort(sv)) {
      invalidIps.push(sv);
    }
  });
  if (invalidIps.length > 0) {
    setErrors({ ...errors, bootstrapServers: true });
    const invalidIpsString = invalidIps.join(', ');
    return `Server IP(s) or port number(s) are invalid: ${invalidIpsString}`;
  }

  if (!validateKafkaVersion(kafka.apiVersion)) {
    setErrors({ ...errors, apiVersion: true });
    return 'Kafka version is invalid';
  }

  if (kafka.srcUser === '') {
    setErrors({ ...errors, srcUser: true });
    return 'User Name is required';
  }

  if (kafka.srcPassword === '') {
    setErrors({ ...errors, srcPassword: true });
    return 'Password is required';
  }

  return '';
};

const validateHibernateSource = (integrationName) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }
  return '';
};

const validateRdbmsSource = (
  mysql,
  integrationName,
  setErrors = () => {},
  errors = {},
) => {
  if (integrationName === '' || integrationName === undefined) {
    setErrors({ ...errors, integrationName: true });
    return SOURCE_NAME_REQUIRED;
  }
  if (mysql.databaseHost === '') {
    setErrors({ ...errors, databaseHost: true });
    return 'Database Host is required';
  }
  let invalidIp = false;
  if (!validateIp(mysql.databaseHost)) {
    invalidIp = true;
  }
  if (invalidIp) {
    setErrors({ ...errors, invalidIp: true });
    return 'Database Host should be an IP address';
  }

  if (mysql.databasePort === '') {
    setErrors({ ...errors, databasePort: true });
    return 'Database Port is required';
  }
  const invalidPort = 'Database Port should be a number from 1 to 65535';
  if (isNaN(mysql.databasePort)) {
    setErrors({ ...errors, databasePort: true });
    return invalidPort;
  }
  if (validateNum(parseInt(mysql.databasePort), 1, 65535)) {
    setErrors({ ...errors, databasePort: true });
    return invalidPort;
  }
  if (mysql.databaseName === '') {
    setErrors({ ...errors, databaseName: true });
    return 'Database Name is required';
  }
  if (mysql.srcUser === '') {
    setErrors({ ...errors, srcUser: true });
    return 'User Name is required';
  }
  if (mysql.srcPassword === '') {
    setErrors({ ...errors, srcPassword: true });
    return 'Password is required';
  }
  return '';
};

const validateMongodbSource = (
  mongodb,
  integrationName,
  setErrors = () => {},
  errors = {},
) => {
  if (integrationName === '' || integrationName === undefined) {
    setErrors({ ...errors, integrationName: true });
    return SOURCE_NAME_REQUIRED;
  }
  const validateIpsErrors = validateArrayOfIps(mongodb.endpoints);
  if (validateIpsErrors !== '') {
    setErrors({ ...errors, endpoints: true });
    return validateIpsErrors;
  }
  if (mongodb.useDnsSeedList === '') {
    setErrors({ ...errors, useDnsSeedList: true });
    return 'Use DNS Seed List is required';
  }
  if (mongodb.databaseName === '') {
    setErrors({ ...errors, databaseName: true });
    return 'Database Name is required';
  }
  if (mongodb.replicaSet === '') {
    setErrors({ ...errors, replicaSet: true });
    return 'Replica Set is required';
  }
  if (mongodb.srcUser === '') {
    setErrors({ ...errors, srcUser: true });
    return 'User Name is required';
  }
  if (mongodb.srcPassword === '') {
    setErrors({ ...errors, srcPassword: true });
    return 'Password is required';
  }
  return '';
};

const validateRdbmsPullSource = (
  rdbms,
  integrationName,
  setErrors = () => {},
  errors = {},
) => {
  const validateMessage =
    validateRdbmsSource(rdbms, integrationName, setErrors, errors) ||
    validatePollingInterval(rdbms.pollingInterval);
  if (validateMessage !== '') {
    setErrors({ ...errors, pollingInterval: true });
    return validateMessage;
  }
  return '';
};

const validatePollingInterval = (pollingInterval) => {
  if (
    pollingInterval === undefined ||
    pollingInterval === null ||
    pollingInterval === ''
  ) {
    return 'Polling Interval is required';
  }

  if (isNaN(pollingInterval)) {
    return 'Polling Interval should be a number';
  }

  return '';
};

const validateS3Source = (s3, integrationName) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }
  if (s3.endpoint === '') {
    return 'Endpoint is required';
  }
  if (!s3.endpoint.startsWith('https://')) {
    return 'Endpoint should start with https://';
  }
  if (s3.accessKey === '') {
    return 'Access Key is required';
  }
  if (s3.secretKey === '') {
    return 'Secret Key is required';
  }
  let validateMessage = validatePollingInterval(s3.pollingInterval);
  if (validateMessage !== '') {
    return validateMessage;
  }
  return '';
};

const validateFileSource = (file, integrationName) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }
  if (file.fileLocation === '') {
    return 'File Location is required';
  }
  let validateMessage = validatePollingInterval(file.pollingInterval);
  if (validateMessage !== '') {
    return validateMessage;
  }
  return '';
};

const validateRestSource = (rest, integrationName) => {
  if (!integrationName) {
    return SOURCE_NAME_REQUIRED;
  }
  if (!rest.endpoint) {
    return 'Endpoint is required';
  }
  if (!rest.method) {
    return 'Method is required';
  }
  if (!rest.endpoint.startsWith('https://')) {
    return 'Endpoint should start with https://';
  }
  let validateMessage = validatePollingInterval(rest.pollingInterval);
  if (validateMessage !== '') {
    return validateMessage;
  }
  return '';
};

const validateGoogleSource = (google, integrationName) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }
  if (google.customerID === '') {
    return 'Customer ID is required';
  }
  if (google.clientId === '') {
    return 'Client ID is required';
  }
  if (google.developerToken === '') {
    return 'Developer Token is required';
  }
  if (google.clientSecret === '') {
    return 'Client Secret is required';
  }
  if (google.refreshToken === '') {
    return 'Refresh Token is required';
  }
  let validateMessage = validatePollingInterval(google.pollingInterval);
  if (validateMessage !== '') {
    return validateMessage;
  }
  return '';
};

const validateFacebookSource = (facebook, integrationName) => {
  if (integrationName === '' || integrationName === undefined) {
    return SOURCE_NAME_REQUIRED;
  }
  if (facebook.endpoint === '') {
    return 'Endpoint is required';
  }
  if (!facebook.endpoint.startsWith('https://')) {
    return 'Endpoint should start with https://';
  }
  if (facebook.clientId === '') {
    return 'Client ID is required';
  }
  if (facebook.clientSecret === '') {
    return 'Client Secret is required';
  }
  if (facebook.accessToken === '') {
    return 'Access Token is required';
  }
  let validateMessage = validatePollingInterval(facebook.pollingInterval);
  if (validateMessage !== '') {
    return validateMessage;
  }
  return '';
};

const newIFSUpdateAttribute = ({
  importFlowSpecsCopy,
  name,
  oldAttribute,
  newAttribute,
  type,
}) => {
  let newImportFlowSpecsCopy = cloneDeep(importFlowSpecsCopy);
  newImportFlowSpecsCopy = newImportFlowSpecsCopy?.reduce((acc, ifs) => {
    if (
      ifs?.destinationDataSpec?.name === name &&
      ifs?.destinationDataSpec?.type === type
    ) {
      ifs.dataPickupSpec.attributes = ifs?.dataPickupSpec?.attributes?.map(
        (att) => {
          if (att?.as && att.as === oldAttribute) {
            att.as = newAttribute;
            if (!ifs?.shouldCreate) {
              ifs.shouldUpdate = true;
            }
          } else if (
            !att?.as &&
            !att?.transforms &&
            att?.sourceAttributeName === oldAttribute
          ) {
            att.sourceAttributeName = newAttribute;
            ifs.shouldUpdate = true;
          } else if (att?.transforms) {
            att?.transforms?.forEach((tf) => {
              if (tf.as === oldAttribute) {
                tf.as = newAttribute;
                ifs.shouldUpdate = true;
              }
            });
          }
          return att;
        },
      );
    }
    acc.push(ifs);
    return acc;
  }, []);
  return newImportFlowSpecsCopy;
};

const newIFSAddAttribute = ({
  importFlowSpecsCopy,
  name,
  newAttribute,
  type,
}) => {
  let newImportFlowSpecsCopy = cloneDeep(importFlowSpecsCopy);
  newImportFlowSpecsCopy = newImportFlowSpecsCopy?.reduce((acc, ifs) => {
    if (
      ifs?.destinationDataSpec?.name === name &&
      ifs?.destinationDataSpec?.type === type
    ) {
      ifs?.dataPickupSpec?.attributes.push({
        sourceAttributeName: newAttribute,
      });
      if (!ifs?.shouldCreate) {
        ifs.shouldUpdate = true;
      }
    }
    acc.push(ifs);
    return acc;
  }, []);
  return newImportFlowSpecsCopy;
};

const newIFSDeleteAttribute = ({
  importFlowSpecsCopy,
  name,
  deleteAttribute,
  type,
}) => {
  let newImportFlowSpecsCopy = cloneDeep(importFlowSpecsCopy);
  newImportFlowSpecsCopy = newImportFlowSpecsCopy?.reduce((acc, ifs) => {
    if (
      ifs?.destinationDataSpec?.name === name &&
      ifs?.destinationDataSpec?.type === type
    ) {
      ifs.dataPickupSpec.attributes = ifs?.dataPickupSpec?.attributes?.filter(
        (att) => {
          if (att?.transforms) {
            const hasAtt = att?.transforms?.some(
              (transform) => transform.as === deleteAttribute,
            );
            if (hasAtt) {
              ifs.shouldUpdate = true;
              return false;
            }
            return true;
          }
          if (att.as) {
            if (att.as === deleteAttribute) {
              ifs.shouldUpdate = true;
              return false;
            }
          } else {
            if (att.sourceAttributeName === deleteAttribute) {
              ifs.shouldUpdate = true;
              return false;
            }
          }
          return true;
        },
      );
    }
    acc.push(ifs);
    return acc;
  }, []);
  return newImportFlowSpecsCopy;
};

const generateSourceTypeHash = (importSourcesCopy) => {
  const result = {};
  importSourcesCopy.forEach((source) => {
    if (result.hasOwnProperty(source?.type)) {
      result[source?.type] = result[source?.type] + 1;
    } else {
      result[source?.type] = 1;
    }
  });
  return result;
};

const validateSourceInstance = (sourceType, importSourcesCopy) => {
  let validationMessage = '';

  if (sourceType !== INTEGRATION_TYPE_WEBHOOK) {
    const sourceTypeHash = generateSourceTypeHash(importSourcesCopy);
    if (sourceType === 'MysqlPull') {
      if (
        sourceTypeHash.hasOwnProperty(sourceType) &&
        sourceTypeHash[sourceType] >= 4
      ) {
        validationMessage =
          messages.integration.mySQLPullInstanceRestriction(sourceType);
      }
    } else {
      if (
        sourceTypeHash.hasOwnProperty(sourceType) &&
        sourceTypeHash[sourceType] > 0
      ) {
        validationMessage =
          messages.integration.singleInstanceRestriction(sourceType);
      }
    }
  }

  return validationMessage;
};

/**
 * Lists active entries of importSources or importSourcesCopy redux state.
 */
const listActiveSources = (importSources) => {
  return importSources?.reduce((acc, source) => {
    if (source?.shouldDelete || !ACTIVE_INTEGRATIONS?.includes(source?.type)) {
      return acc;
    }
    acc.push(source);
    return acc;
  }, []);
};

/**
 * Lists active entries of a generic integration entity list redux state,
 * such as importDataProcessors.
 */
const listActiveEntries = (importEntities) => {
  return importEntities?.reduce((acc, entity) => {
    if (entity?.shouldDelete) {
      return acc;
    }
    acc.push(entity);
    return acc;
  }, []);
};

/**
 * Parse an ImportDataProcessors entry to displayable format (processDetails).
 */
const parseProcessorConf = (processor) => {
  let processCode;
  if (processor.shouldCreate || processor.shouldUpdate) {
    processCode = processor.code;
  } else {
    try {
      processCode = Buffer.from(processor.code, 'base64').toString();
    } catch (e) {
      processCode = '';
    }
  }
  return {
    processName: processor.processorName,
    processCode,
    existingProcess: true,
  };
};

const getNewProcessDetails = () => ({
  processName: '',
  processCode: '',
  existingProcess: false,
});

export const createImportFlowDataMapping = (
  flowMapping,
  signalOrContext,
  attributeSearchPath,
) => {
  if (!flowMapping) {
    return undefined;
  }
  const attributes = signalOrContext?.attributes;
  return attributes?.map((att) => {
    const mapping = flowMapping.attributeMapping[att.attributeName];

    let nestedPath, regexp;
    let sourceAttributeName = mapping?.name;
    if (mapping?.path?.length > 0) {
      const clonePath = cloneDeep(mapping.path);
      nestedPath = clonePath.join('/');
      if (nestedPath) {
        regexp = new RegExp('^' + attributeSearchPath);
        if (regexp.test(nestedPath)) {
          sourceAttributeName = nestedPath.replace(regexp, '');
        } else {
          sourceAttributeName = '/' + nestedPath;
        }
      }
    }
    const entity = {
      sourceAttributeName: att?.oldAttributeName
        ? att?.oldAttributeName
        : sourceAttributeName,
      as: mapping?.name,
    };
    // Attach process for timestamp attribute
    if (mapping?.isTimestamp) {
      entity.processes = [
        {
          processorName: 'TimeStampUtil',
          method: 'parse_datetime',
        },
      ];
    }
    return entity;
  });
};

export const resolveImportDestinationId = (
  importSourceConfig,
  importDestinations,
) => {
  if (importSourceConfig?.importDestinationId) {
    return importSourceConfig?.importDestinationId;
  }
  return importDestinations?.find(
    (dest) =>
      dest.type === 'Bios' && dest.authentication?.type === AUTH_TYPE_LOGIN,
  )?.importDestinationId;
};

export const makeImportFlowSpec = (
  importSourceId,
  importSources,
  importDestinations,
  flowMapping,
  streamConfig,
  subject,
) => {
  const dataPickupSpec = {
    attributes: createImportFlowDataMapping(flowMapping, streamConfig),
    attributeSearchPath: flowMapping.attributeSearch,
  };
  const sourceConfig = importSources?.find(
    (src) => src.importSourceId === importSourceId,
  );
  const sourceDataSpec = {
    importSourceId,
    payloadType: subject?.payloadType,
  };
  if (sourceConfig.type === INTEGRATION_TYPE_KAFKA) {
    sourceDataSpec.topic = subject.subjectName;
    sourceDataSpec.kwArgs = {
      max_poll_records: 20,
      auto_offset_reset: 'earliest',
      enable_auto_commit: false,
    };
  } else if (
    sourceConfig.type === INTEGRATION_TYPE_MYSQL_CDC ||
    sourceConfig.type === INTEGRATION_TYPE_MONGODB_CDC ||
    sourceConfig.type === INTEGRATION_TYPE_POSTGRES_CDC
  ) {
    sourceDataSpec.tableName = subject.subjectName;
    sourceDataSpec.cdcOperationTypes = ['Create', 'Read', 'Update', 'Delete'];
    sourceDataSpec.payloadType = 'Json';
  }
  const importDestinationId = resolveImportDestinationId(
    sourceConfig,
    importDestinations,
  );
  const streamName = streamConfig.contextName || streamConfig.signalName;
  const type = streamConfig.signalName ? 'Signal' : 'Context';
  const importFlowSpec = {
    importFlowId: uuidv4(),
    importFlowName: `${streamName}Flow`,
    sourceDataSpec,
    destinationDataSpec: {
      importDestinationId,
      type,
      name: streamName,
    },
    dataPickupSpec,
    shouldCreate: true,
  };
  return importFlowSpec;
};

export {
  findImportDestination,
  buildWebhookImportSrcData,
  webhookAddAuth,
  buildAuthFromSavedAuth,
  buildPayloadValidation,
  buildHibernateImportSrcData,
  buildKafkaImportSrcData,
  buildRdbmsImportSrcData,
  buildMongodbImportSrcData,
  buildS3ImportSrcData,
  buildFileImportSrcData,
  buildRestImportSrcData,
  buildGoogleImportSrcData,
  buildFacebookImportSrcData,
  buildDestData,
  validateWebhookSource,
  validateKafkaSource,
  validateHibernateSource,
  validateRdbmsSource,
  buildRdbmsPullImportSrcData,
  validateRdbmsPullSource,
  validateMongodbSource,
  validatePollingInterval,
  validateS3Source,
  validateFileSource,
  validateRestSource,
  validateGoogleSource,
  validateFacebookSource,
  newIFSUpdateAttribute,
  newIFSAddAttribute,
  newIFSDeleteAttribute,
  validateSourceInstance,
  listActiveSources,
  listActiveEntries,
  parseProcessorConf,
  getNewProcessDetails,
};
