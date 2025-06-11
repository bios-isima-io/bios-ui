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
import { css } from 'aphrodite';
import { useDeviceDetect } from 'common/hooks';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isValidStreamName } from 'utils';
import messages from 'utils/notificationMessages';
import { Header } from '../../components';
import CollapsableWrapper from '../../components/CollapsableWrapper';
import { WarningNotification } from '../../utils';
import { setValidationError, updateSignalDetail } from '../actions';
import { DUPLICATE_FEATURE_NAME } from '../constant';
import FeatureHeader from '../FeatureHeader';
import styles from '../RightPanelAttributeTabContent/styles';
import { findAnyStringProperty, renderLabel } from '../utils';
import Alerts from './Alerts';
import AttributeToQueryBy from './AttributeToQueryBy';
import AttributeToRetrieve from './AttributeToRetrieve';
import IndexedInterval from './IndexedInterval';
import Interval from './Interval';
import TrackLastN from './TrackLastN';
import { isDecimalColumn, isNumericColumn } from './utils';

const RightPanelFeatureTabContent = ({
  history,
  signalDetail,
  contexts,
  validationErrors,
  setValidationError,
  updateSignalDetail,
  setShowRightPanel,
  selectedFeature,
  setSelectedFeature,
  setSelectedEnrichment,
  setSelectedAttribute,
  cloneFeature,
}) => {
  const isMobile = useDeviceDetect();
  const [activeCarousel, setActiveCarousel] = useState('attributeToQueryBy');
  const [violations, setViolations] = useState({});

  useEffect(() => {
    setViolations((validationErrors.features || {})[selectedFeature._id] || {});
  }, [selectedFeature, validationErrors]);

  const isFeatureNameConflicting = (nextFeature) => {
    if (!nextFeature.featureName) {
      return false;
    }
    const canonName = nextFeature.featureName.toLowerCase();
    const id = nextFeature._id;
    return signalDetail.postStorageStage?.features?.some(
      (feature) =>
        feature._id !== id && feature.featureName.toLowerCase() === canonName,
    );
  };

  /**
   * Generic parameter validation method.
   *
   * @param validationCondition {boolean} condition for valid parameter
   * @param message {string} error message in case of violation
   * @param errors {object} object to accumulate error message
   * @param property {string} property name to store the error message
   * @param options {object} execution object
   * @property options.force {boolean} force executing validation, otherwise validation
   * would happen only when errors[property] is set
   * @property options.notify {boolean} enables warning notifications
   * @returns 1 if the parameter is validated, 0 otherwise
   */
  const validateElement = (
    validationCondition,
    message,
    errors,
    property,
    options,
  ) => {
    if (!options?.force && !errors[property]) {
      return 1;
    }
    if (validationCondition) {
      delete errors[property];
      return 1;
    }

    errors[property] = message;
    options?.notify && WarningNotification({ message });
    return 0;
  };

  /**
   * Validates feature parameters.
   *
   * The method updates validationErrors redux state after the validation.
   *
   * @param feature {object} feature to validate
   * @param options {object} options
   * @property options.force {boolean} force executing validation, otherwise validation
   * would happen only when errors[property] is set
   * @property options.notify {boolean} enables warning notifications
   * @returns true if all validation was successful, false if any failed
   */
  const validateFeature = (feature, options) => {
    let success = 1;
    const nextErrors =
      (validationErrors?.features || {})[selectedFeature._id] || {};

    // feature name
    if (options?.force || nextErrors?.name) {
      if (feature.featureName === '') {
        nextErrors.name = messages.signal.EMPTY_FEATURE_NAME;
      } else if (!isValidStreamName(feature.featureName)) {
        nextErrors.name = messages.signal.INVALID_FEATURE_NAME;
      } else if (isFeatureNameConflicting(feature.featureName)) {
        nextErrors.name = DUPLICATE_FEATURE_NAME;
      } else {
        delete nextErrors.name;
      }
      if (nextErrors.name) {
        success = 0;
        options?.notify && WarningNotification({ message: nextErrors.name });
      }
    }

    let lastNValidated = 1;
    const lastNEnabled = feature?.materializedAs === 'LastN';
    const isAccumulatingCount = feature?.materializedAs === 'AccumulatingCount';

    // attributes
    nextErrors.attributes = nextErrors.attributes || {};
    if (isAccumulatingCount) {
      (feature.attributes || []).forEach((attribute) => {
        lastNValidated &= validateElement(
          isDecimalColumn(attribute, signalDetail, contexts),
          messages.signal.REQUIRE_DECIMAL_FEATURE_ATTRIBUTE,
          nextErrors.attributes,
          attribute,
          options,
        );
      });
    }

    if (lastNEnabled) {
      lastNValidated &= validateElement(
        feature.attributes?.length === 1,
        messages.signal.REQUIRE_EXACT_ONE_ATTRIBUTE,
        nextErrors.attributes,
        '__global',
        options,
      );
    } else {
      !isAccumulatingCount &&
        (feature.attributes || []).forEach((attribute) => {
          success &= validateElement(
            isNumericColumn(attribute, signalDetail, contexts),
            messages.signal.REQUIRE_NUMERIC_FEATURE_ATTRIBUTE,
            nextErrors.attributes,
            attribute,
            options,
          );
        });
    }

    success &= lastNValidated;

    if (lastNValidated) {
      delete nextErrors.lastN?.__global;
    } else {
      const message = messages.signal.LAST_N_INVALID_CONFIG;
      nextErrors.lastN = { __global: message };
    }

    if (lastNEnabled) {
      nextErrors.lastN = nextErrors.lastN || {};
      success &= validateElement(
        feature?.items > 0,
        messages.signal.INVALID_LAST_N_ITEMS,
        nextErrors.lastN,
        'numItems',
        options,
      );

      success &= validateElement(
        feature?.ttl > 0,
        messages.signal.INVALID_LAST_N_TTL,
        nextErrors.lastN,
        'ttl',
        options,
      );

      success &= validateElement(
        feature?.featureAsContextName?.length > 0,
        messages.signal.REQUIRE_FEATURE_CONTEXT_NAME,
        nextErrors.lastN,
        'context',
        options,
      );

      success &= validateElement(
        isValidStreamName(feature?.featureAsContextName),
        messages.signal.REQUIRE_FEATURE_CONTEXT_NAME,
        nextErrors.lastN,
        'context',
        options,
      );
    }

    setValidationError(['features', feature._id], nextErrors);
    return success === 1;
  };

  const updateSelectedFeature = (nextFeature, options) => {
    validateFeature(nextFeature, options);
    setSelectedFeature(nextFeature);
  };

  const signalAttributes = signalDetail?.attributes.map(
    (item) => item.attributeName,
  );

  const numberTypeSignalAttributes = signalDetail?.attributes
    .filter((item) => item.type !== 'String' || item.type !== 'Boolean')
    .map((item) => item.attributeName);

  const numberTypeEnrichedAttribute =
    signalDetail?.enrich?.enrichments?.reduce((accumulator, item) => {
      let attributes = item.contextAttributes
        .filter((entity) => {
          const selectedContext = contexts.find(
            (context) => context.contextName === item.contextName,
          );
          const selectedAttribute = selectedContext?.attributes?.find(
            (attribute) => attribute.attributeName === entity.attributeName,
          );
          if (
            selectedAttribute &&
            (selectedAttribute.type !== 'String' || item.type !== 'Boolean')
          ) {
            return true;
          } else {
            return false;
          }
        })
        .map((item) => (item.as ? item.as : item.attributeName));

      return accumulator.concat(attributes);
    }, []) ?? [];

  const enrichedAttribute =
    signalDetail?.enrich?.enrichments?.reduce((accumulator, item) => {
      return accumulator.concat(
        item.contextAttributes.map((entity) => {
          return entity.as ? entity.as : entity.attributeName;
        }),
      );
    }, []) ?? [];

  const attributeToQueryByList = [
    ...new Set([...signalAttributes, ...enrichedAttribute]),
  ];

  const attributeToRetrieveList = [
    ...new Set([...numberTypeSignalAttributes, ...numberTypeEnrichedAttribute]),
  ];

  const panels = [
    {
      component: (
        <AttributeToQueryBy
          selectedFeature={selectedFeature}
          updateSelectedFeature={updateSelectedFeature}
          list={attributeToQueryByList}
        />
      ),
      header: renderLabel(
        'Attribute(s) to Query by',
        findAnyStringProperty(violations?.dimensions),
      ),
      key: 'attributeToQueryBy',
    },
    {
      component: (
        <AttributeToRetrieve
          selectedFeature={selectedFeature}
          updateSelectedFeature={updateSelectedFeature}
          list={attributeToRetrieveList}
        />
      ),
      header: renderLabel(
        'Attribute(s) to Retrieve',
        findAnyStringProperty(violations?.attributes),
      ),
      key: 'attributeToRetrieve',
    },
    {
      component: (
        <Alerts
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      ),
      header: renderLabel('Alerts', findAnyStringProperty(violations?.alerts)),
      key: 'alerts',
    },
    {
      component: (
        <>
          <Interval
            timeInMs={selectedFeature?.featureInterval}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
          <IndexedInterval
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
          <TrackLastN
            selectedFeature={selectedFeature}
            updateSelectedFeature={updateSelectedFeature}
          />
        </>
      ),
      header: renderLabel(
        'Advanced Settings',
        findAnyStringProperty(violations?.indexing) ||
          findAnyStringProperty(violations?.lastN),
      ),
      key: 'advanced_settings',
    },
  ];

  return (
    <div>
      <Header
        title={selectedFeature?.featureName}
        backLinkText={isMobile ? null : 'Feature'}
        EmptyTitleText="Untitled_Feature"
        placeholder="Feature name..."
        rightPanel={true}
        onChange={(value) => {
          setSelectedFeature({
            ...selectedFeature,
            featureName: value,
          });
        }}
        extraActionAdded={!selectedFeature.isNewEntry}
        actionPanel={() => {
          return (
            <FeatureHeader
              history={history}
              signalDetail={signalDetail}
              contexts={contexts}
              selectedFeature={selectedFeature}
              setShowRightPanel={setShowRightPanel}
              setSelectedFeature={setSelectedFeature}
              validateFeature={validateFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              updateSignalDetail={updateSignalDetail}
              cloneFeature={cloneFeature}
            />
          );
        }}
      />

      <div className={css(styles.RPWrapper)}>
        <CollapsableWrapper
          activePanel={activeCarousel}
          panels={panels}
          setActiveRightPanel={(val) => {
            setActiveCarousel(val);
          }}
        />
      </div>
    </div>
  );
};

RightPanelFeatureTabContent.propTypes = {
  setShowRightPanel: PropTypes.func,
  updateSignalDetail: PropTypes.func,
  setValidationError: PropTypes.func,
  setSelectedFeature: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
  setSelectedEnrichment: PropTypes.func,
  contexts: PropTypes.instanceOf(Object),
  signalDetail: PropTypes.instanceOf(Object),
  selectedFeature: PropTypes.instanceOf(Object),
  cloneFeature: PropTypes.func,
  isExistingAuditSignal: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const { signalDetail, validationErrors } = state.signalDetail;
  const { contexts } = state.contexts;
  return {
    signalDetail,
    validationErrors,
    contexts,
  };
};

const mapDispatchToProps = {
  updateSignalDetail,
  setValidationError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanelFeatureTabContent);
