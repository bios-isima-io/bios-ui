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
import { useDeviceDetect } from 'common/hooks';
import React, { useState } from 'react';
import AttributeToRetrieve from 'containers/ContextDetail/Feature/RightPanelFeatureTabContent/AttributeToRetrieve';
import { renderLabel } from 'containers/SignalDetail/utils';
import Interval from 'containers/ContextDetail/Feature/RightPanelFeatureTabContent/Interval';
import IndexedInterval from 'containers/ContextDetail/Feature/RightPanelFeatureTabContent/IndexedInterval';
import { CollapsableWrapper, Header } from 'containers/components';
import FeatureHeader from 'containers/ContextDetail//Feature/FeatureHeader';
import styles from 'containers/SignalDetail/RightPanelAttributeTabContent/styles';
import { css } from 'aphrodite';
import { connect } from 'react-redux';
import messages from 'utils/notificationMessages';
import { isValidStreamName } from 'utils';
import { WarningNotification } from 'containers/utils';
import { setValidationError, updateContextDetail } from '../../actions';
import AttributeToQueryBy from './AttributeToQueryBy';

function RightPanelFeatureTabContent({
  history,
  setShowRightPanel,
  selectedFeature,
  setSelectedFeature,
  setSelectedEnrichment,
  setSelectedAttribute,
  cloneFeature,
  contextDetail,
  updateContextDetail,
  contexts,
}) {
  const isMobile = useDeviceDetect();
  const [activeCarousel, setActiveCarousel] = useState('attributeToQueryBy');

  const isIndexKeySelected = selectedFeature?.dimensions?.find((item) =>
    contextDetail?.primaryKey?.includes(item),
  );

  const isFeatureNameConflicting = (nextFeature) => {
    if (!nextFeature.featureName) {
      return false;
    }
    const newFeatureName = nextFeature.featureName.toLowerCase();
    const id = nextFeature._id;
    return contextDetail?.features?.some(
      (feature) =>
        feature._id !== id &&
        feature.featureName.toLowerCase() === newFeatureName,
    );
  };

  const validateFeature = (feature, options) => {
    let success = 1;
    const nextErrors = {};
    if (options?.force || nextErrors?.name) {
      if (feature.featureName === '') {
        nextErrors.name = messages.context.EMPTY_FEATURE_NAME;
      } else if (!isValidStreamName(feature.featureName)) {
        nextErrors.name = messages.context.INVALID_FEATURE_NAME;
      } else if (isFeatureNameConflicting(feature)) {
        nextErrors.name = messages.context.DUPLICATE_FEATURE_NAME;
      } else if (feature.dimensions.length === 0) {
        nextErrors.name = messages.context.ATTRIBUTE_TO_QUERY_BY_REQUIRED;
      } else if (!feature?.indexed && !feature?.aggregated) {
        nextErrors.name = messages.context.INDEX_REQUIRED;
      } else {
        delete nextErrors.name;
      }
      if (nextErrors.name) {
        success = 0;
        options?.notify && WarningNotification({ message: nextErrors.name });
      }
    }
    return success === 1;
  };

  const updateSelectedFeature = (nextFeature, options) => {
    validateFeature(nextFeature, options);
    setSelectedFeature(nextFeature);
  };
  const contextAttributes = contextDetail?.attributes.map(
    (item) => item.attributeName,
  );

  const numberTypeContextAttributes = contextDetail?.attributes
    .filter((item) => item.type !== 'String' || item.type !== 'Boolean')
    .map((item) => item.attributeName);

  const attributeToQueryByList = [...new Set([...contextAttributes])];

  const attributeToRetrieveList = [
    ...new Set([...numberTypeContextAttributes]),
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
      header: renderLabel('Attribute(s) to Query by'),
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
      header: renderLabel('Attribute(s) to Retrieve'),
      key: 'attributeToRetrieve',
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
            isIndexKeySelected={isIndexKeySelected}
          />
        </>
      ),
      header: renderLabel('Advanced Settings'),
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
        extraActionAdded={!selectedFeature?.isNewEntry}
        actionPanel={() => {
          return (
            <FeatureHeader
              history={history}
              contextDetail={contextDetail}
              contexts={contexts}
              selectedFeature={selectedFeature}
              setShowRightPanel={setShowRightPanel}
              setSelectedFeature={setSelectedFeature}
              validateFeature={validateFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              updateContextDetail={updateContextDetail}
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
}

const mapStateToProps = (state) => {
  const { contextDetail, validationErrors } = state.contextDetail;
  const { contexts } = state.contexts;
  return {
    contextDetail,
    validationErrors,
    contexts,
  };
};

const mapDispatchToProps = {
  updateContextDetail,
  setValidationError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanelFeatureTabContent);
