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
const global_message = {
  ADD_VALID_EMAIL: 'Please enter a valid email',
  EMPTY_ENRICHMENT_NAME: 'Enrichment name may not be empty',
  INVALID_ENRICHMENT_NAME:
    "Enrichment name isn't valid; only '_' and upper/lower case AlphaNumeric characters are allowed",
  ATTRIBUTE_POLICY_FROM_STORE_DEFAULT:
    'bi(OS) will remove defaults for ALL attributes',
  changeAttributePolicyToStoreDefault: (type, name) => {
    return `bi(OS) will add defaults for all attributes. You have to provide defaults for ALL attributes to save updates to ${type} ${name}`;
  },
  INGESTION_SETUP_SUCCESS_TITLE: 'Onboarding successful',
  ingestionSetupSuccessMessage: (entity) => {
    return `${entity} successfully onboarded`;
  },
};

const messages = {
  user: {
    USER_UPDATE_SUCCESS: 'User update successful',
  },
  userProfile: {
    //Update User Password
    EMPTY_CURRENT_PASSWORD: 'Current password may not be empty',
    EMPTY_NEW_PASSWORD: 'New password may not be empty',
    EMPTY_CONFIRM_PASSWORD: 'Confirm password may not be empty',
    PASSWORD_NOT_MATCHING: "New password doesn't match Confirm password",
    PASSWORD_UPDATED: 'Password update successful',
  },
  inviteUser: {
    ADD_VALID_EMAIL: global_message.ADD_VALID_EMAIL,
    DISALLOW_PUBLIC_EMAIL: "Public domain emails aren't allowed",
    EMAIL_ALREADY_PRESENT: 'Duplicate email(s) found in the invitee list',
    INVITE_VALIDATION_TEXT:
      'Please add invitee email and role to invite them to bi(OS)',
    USER_INVITE_SUCCESS: 'User(s) invited successfully to bi(OS)',
  },
  login: {
    EMPTY_EMAIL: 'Email may not be empty',
    EMPTY_PASSWORD: 'Password may not be empty',
    ADD_VALID_EMAIL: global_message.ADD_VALID_EMAIL,
    INVALID_CREDENTIALS: "Sorry! couldn't find your credentials",
    EMAIL_SENT: 'Email sent successfully',
    PUBLIC_EMAIL_MESSAGE: 'Please use company email',
  },
  insight: {
    FAV_REPORT_LIMIT:
      'Limit of 20 favorites reached; unfavorite an existing report to favorite a new one',
    reportAlreadyExistInPeriod: (destinationDroppableId) =>
      `Report already exists in Insights for 1 ${
        destinationDroppableId === '1-hr' ? 'hour' : 'day'
      }`,
    DRAG_CARD_LIMIT: 'Number of Reports exceeds the limit',
  },
  report: {
    INVALID_DERIVED_METRICS_FIELD_VALUE:
      "Derived Metric(s) formula isn't valid", // ONLY for derived metrics
    INVALID_DATE_RANGE: 'Report duration may not be less than window size',
    EMPTY_METRICS_MSG: 'Derived metric(s) may not be empty',
    EMPTY_LEGEND_MSG: 'Legend may not be empty',
    timeRangeChange: (newTimeRangeText, updatedCyclicalComparisonStart) => {
      return `Since you picked a ${newTimeRangeText} duration, cyclical comparison has been switched to "${updatedCyclicalComparisonStart}"`;
    },
    PACKED_BUBBLE_METRIC_LIMIT: 'Bubble chart supports maximum 3 metrics',
    ON_THE_FLY_LIMIT: 'On the fly only works for 1hr duration',
    PARTIAL_DURATION_TRAVELED: 'Note: Only partial duration traveled',
  },
  onboarding: {
    //Entity Listing
    SELECT_SOME_ENTITY: 'Select at least one entity to onboard',
    UPDATE_CONFLICTING_NAME: 'Fix name conflicts for entity to be onboarded',
    duplicateEntityName: (name) => {
      return `Duplicate entity name for ${name}.`;
    },

    //Import Source
    UNAVAILABLE_DESTINATION: 'Source Destination not available', // TODO - this should never happen (bi(OS) is the only destination)
  },
  integration: {
    // Global
    INTEGRATION_SAVE_SUCCESS: 'Changes are saved successfully',

    // Flow
    NAME_REQUIRED: 'Import flow name is required',
    PAYLOAD_REQUIRED: 'Payload Type is required',
    SOURCE_TYPE_REQUIRED: 'Source name is required',
    SOURCE_REQUIRED: 'Source information to create a flow is missing',
    FILTER_REQUIRED: 'Filter is required',
    attributeNotValid: (name) => {
      return `${name} isn't present in destination attributes`;
    },
    ATTRIBUTE_LENGTH_LIMIT: 'Attribute names are limited to 40 characters',
    DATA_MAPPING_REQUIRED_ATTRIBUTE:
      'At least one attribute is required to save this flow configuration',
    TOPIC_REQUIRED: 'Kafka Topic is required',
    WEBHOOK_PATH_VALIDATION: 'Webhook sub path should start with /',
    S3_BUCKET_NAME_REQUIRED: 'S3 bucket name is required',
    SOURCE_BATCH_SIZE_REQUIRED: 'Source batch size is required',
    SOURCE_BATCH_SIZE_AS_NUMBER: 'Source batch size should be a number',
    TABLE_NAME_REQUIRED: `Table name is required`,
    CDC_MINIMUM_TYPE_SELECTION:
      'At least 1 CDC operation type should be selected',
    keyPreExist: (key) => {
      return `Key ${key} name already present`;
    },
    EMPTY_KEY_VALUE: 'Key and value may not be empty',
    AUTH_LOGIN_MISSING:
      'Source credentials are missing; please provide them to proceed',

    // Process
    EMPTY_PROCESS_NAME: 'Process name may not be empty',
    EMPTY_PROCESS_CODE_FILE: 'Process code block may not be empty',
    PYTHON_CODE_MISSING_FUNCTION: "Python code doesn't have a valid function",

    // transform
    REMOVE_TRANSFORM_TOOLTIP_MESSAGE:
      'Manage this attribute from the Attributes tab',

    // Source
    singleInstanceRestriction: (sourceType) => {
      return `Source of type ${sourceType} already exists.
              Multiple ${sourceType} sources may not be created.`;
    },
    mySQLPullInstanceRestriction: (sourceType) => {
      return `More than 4 sources of ${sourceType} type may not be created.`;
    },
  },
  teachBios: {
    EMPTY_ATTRIBUTE_INPUT: 'Empty attribute not allowed',
    EMPTY_VALUES:
      'Empty attribute value(s) detected in row(s).  Please check and try again',
  },
  signal: {
    TURN_OFF_FILL_IN_FOR_ENRICHMENT:
      'Use fill in may not be turned off while adding new enrichment or changing existing enrichment',
    INVALID_SIGNAL_NAME: 'Signal name is not valid',
    EMPTY_SIGNAL_NAME: 'Signal name may not be empty',
    DUPLICATE_SIGNAL_NAME:
      'There is already a signal with this name, please update it.',
    ATTRIBUTE_POLICY_TO_STORE_DEFAULT:
      global_message.changeAttributePolicyToStoreDefault('signal'),
    ATTRIBUTE_POLICY_FROM_STORE_DEFAULT:
      global_message.ATTRIBUTE_POLICY_FROM_STORE_DEFAULT,
    EMPTY_ENRICHMENT_NAME: global_message.EMPTY_ENRICHMENT_NAME,
    INVALID_ENRICHMENT_NAME: global_message.INVALID_ENRICHMENT_NAME,
    EMPTY_CONTEXT_ATTRIBUTE_LIST: 'Context attribute list may not be empty',
    EMPTY_FILL_IN_VALUES: 'Fill in value may not be empty',
    DUPLICATE_ALIAS_VALUE:
      'Alias value for an attribute may not be a duplicate',
    EMPTY_FEATURE_NAME: 'Feature name may not be empty',
    INVALID_FEATURE_NAME: 'Feature name is not valid',
    REQUIRE_EXACT_ONE_DIMENSION: `"Attribute(s) to Query by" must have exactly one entry
     when "Track Last-N Items" is enabled.`,
    REQUIRE_EXACT_ONE_ATTRIBUTE: `"Attribute(s) to Retrieve" must have exactly one entry
     when "Materialized As" is enabled.`,
    REQUIRE_NUMERIC_FEATURE_ATTRIBUTE: `Attribute to retrieve should be of numeric type when
      "Materialized As" is disabled`,
    REQUIRE_DECIMAL_FEATURE_ATTRIBUTE: `Attribute to retrieve should be of decimal type when
    "Materialized As" is enabled`,
    LAST_N_INVALID_CONFIG:
      '"Track Last-N" cannot be enabled for invalid number of attributes',
    INVALID_LAST_N_ITEMS:
      'Number of items to track last-N has to be more than 0',
    INVALID_LAST_N_TTL: 'Items time to live may not be 0',
    REQUIRE_FEATURE_CONTEXT_NAME:
      'Context name is required to enable "Track last-N items"',
    EMPTY_ALERT_NAME: 'Alert name must be set',
    ALERT_NAME_CONFLICT: 'The name is used by another alert',
    INVALID_ALERT_NAME: `Alert name is invalid; use only alphabets, numeric characters,
    and underscore, with maximum length 40 characters`,
    EMPTY_WEBHOOK_VALUE: 'Webhook URL must be set',
    NEED_SECURE_URL: 'Please enter secure HTTP URL, e.g. https://example.com',
    INVALID_URL: 'Invalid URL syntax',
    CONDITION_VARIABLE_MISSING: 'Condition value must be set',
    CONDITION_OPERATOR_MISSING: 'Operator must be set',
    CONDITION_VALUE_MISSING: `Condition value may not be empty when the variable is of type number
    or the operator is CONTAINS`,
    invalidConditionValueType: (lhs) =>
      `Value of condition for ${lhs} must be a number`,
    INGESTION_SETUP_SUCCESS_TITLE: global_message.INGESTION_SETUP_SUCCESS_TITLE,
    ingestionSetupSuccessMessage: global_message.ingestionSetupSuccessMessage,
    signalCreated: (signal) => `${signal} signal is successfully created`,
    signalUpdated: (signal) => `${signal} signal is successfully updated`,
    needFillInValueOfType: (fillInWrongDataType, expectedType) => {
      return `Fill in value for an ${fillInWrongDataType?.attributeName} attribute needs to be of  ${expectedType} type`;
    },
    INGESTION_FAIL_MESSAGE: 'Deleting transform might fail the ingestion',
  },
  context: {
    EMPTY_ATTRIBUTE_ALIAS: 'Attribute alias may not be empty',
    INVALID_CONTEXT_NAME: 'Context name is not valid',
    EMPTY_CONTEXT_NAME: 'Context name may not be empty',
    EMPTY_ENRICHMENT_NAME: global_message.EMPTY_ENRICHMENT_NAME,
    INVALID_ENRICHMENT_NAME: global_message.INVALID_ENRICHMENT_NAME,
    EMPTY_PICK_A_KEY: 'Foreign key field may not be empty',
    EMPTY_ATTRIBUTE_LIST: 'At least one attribute is required',
    DUPLICATE_CONTEXT_NAME:
      'There is already a context with this name, please update it.',
    REQUIRED_ATTRIBUTE_ALIAS_MULTI_SHIM:
      'Attribute alias is required for multi shim context',
    ATTRIBUTE_VALUE_NOT_SELECTED:
      'Please select source attribute from the Attributes(s) dropdown',
    EMPTY_SOURCE_ATTRIBUTES: 'At least one source attribute is necessary',
    INSUFFICIENT_DATA: 'No data rows in the uploaded file',
    ATTRIBUTE_POLICY_TO_STORE_DEFAULT:
      global_message.changeAttributePolicyToStoreDefault('context'),
    ATTRIBUTE_POLICY_FROM_STORE_DEFAULT:
      global_message.ATTRIBUTE_POLICY_FROM_STORE_DEFAULT,
    INGESTION_SETUP_SUCCESS_TITLE: global_message.INGESTION_SETUP_SUCCESS_TITLE,
    UPLOAD_ALLOWED_FILE_TYPE: `Only CSV file is allowed`,
    FILE_REMOVED: 'Specified file is removed',
    EMPTY_FEATURE_NAME: 'Feature name may not be empty',
    INVALID_FEATURE_NAME: 'Feature name is not valid',
    DUPLICATE_FEATURE_NAME: 'The feature name is already used',
    ATTRIBUTE_TO_QUERY_BY_REQUIRED:
      'Minimum 1 Attribute(s) to Query by required',
    ATTRIBUTE_TO_RETRIEVE_BY_REQUIRED:
      'Minimum 1 Attribute(s) to Retrieve required',
    INDEX_REQUIRED: 'feature must set at least one of aggregated or indexed',
    ingestionSetupSuccessMessage: global_message.ingestionSetupSuccessMessage,
    contextCreated: (context) => `${context} context is successfully created`,
    contextUpdated: (context) => `${context} context is successfully updated`,
    selectAttributeContext: (contextList) =>
      `please select attribute for these context : ${contextList.toString()}`,
    noMatchingAttribute: (key) => `None matching attribute for context ${key}`,
    maxFileUploadSize: (size) => `File size exceeds maximum ${size}`,
    attributesMissing: (attributes) =>
      `Necessary attributes are missing in the CSV header: ${attributes.join(
        ', ',
      )}`,
    INGESTION_FAIL_MESSAGE: 'Deleting transform might fail the ingestion',
  },
};
export default messages;
