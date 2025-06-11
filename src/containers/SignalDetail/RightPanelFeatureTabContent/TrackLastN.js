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
import Dropdown from 'components/Dropdown';
import { css } from 'aphrodite';
import iconStyles from 'common/styles/IconStyles';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Input, InputNumber } from '../../components';
import featureStyles from './styles';
import { buildFeatureAsContextName } from './utils';
import { renderLabel } from '../utils';
import { remove } from 'lodash';

const DEFAULT_LAST_N = 1;
const DEFAULT_TTL = 15 * 24 * 3600 * 1000; // 15 days in millis
const MATERIALIZED_AS = {
  'Last N': 'lastn',
  'Accumulating Count': 'accumulatingCount',
};
const MATERIALIZED_AS_REVERSE = Object.fromEntries(
  Object.entries(MATERIALIZED_AS).map(([key, value]) => [value, key]),
);

const TrackLastN = ({
  selectedFeature,
  updateSelectedFeature,
  signalDetail,
  contexts,
  validationErrors,
}) => {
  const [materializedAs, setMaterializedAs] = useState('');
  const [ttlDays, setTtlDays] = useState(1);
  const [violations, setViolations] = useState({});

  useEffect(() => {
    const { materializedAs } = selectedFeature;
    if (materializedAs === 'LastN') {
      setTtlDays(calculateTtlDays(selectedFeature.ttl));
      setMaterializedAs('lastn');
    } else if (materializedAs === 'AccumulatingCount') {
      setMaterializedAs('accumulatingCount');
    } else {
      setMaterializedAs('');
    }
  }, [selectedFeature]);

  useEffect(() => {
    setViolations((validationErrors.features || {})[selectedFeature._id] || {});
  }, [selectedFeature, validationErrors]);

  const calculateTtlDays = (ttlInMillis) =>
    Math.ceil(ttlInMillis / (24 * 3600 * 1000));

  const updateMaterialized = (val) => {
    setMaterializedAs(val);
    setLastNAvailability(val);
  };

  const setLastNAvailability = (value) => {
    let nextSelectedFeature;
    if (value === 'lastn') {
      const featureAsContextName = buildFeatureAsContextName(
        signalDetail,
        selectedFeature,
      );
      nextSelectedFeature = {
        ...selectedFeature,
        items: DEFAULT_LAST_N,
        ttl: DEFAULT_TTL,
        featureAsContextName,
        materializedAs: 'LastN',
      };
      if (nextSelectedFeature?.dimensions?.includes('operation')) {
        nextSelectedFeature.dimensions = remove(
          nextSelectedFeature?.dimensions,
          (val) => val !== 'operation',
        );
      }
    } else if (value === 'accumulatingCount') {
      const featureAsContextName = buildFeatureAsContextName(
        signalDetail,
        selectedFeature,
      );

      nextSelectedFeature = {
        ...selectedFeature,
        featureAsContextName,
        materializedAs: 'AccumulatingCount',
      };
      if (!nextSelectedFeature?.dimensions) {
        nextSelectedFeature['dimensions'] = [];
      }
      if (!nextSelectedFeature?.dimensions?.includes('operation')) {
        nextSelectedFeature.dimensions.push('operation');
      }
      delete nextSelectedFeature?.items;
      delete nextSelectedFeature?.ttl;
      delete nextSelectedFeature?.dataSketches;
    } else {
      nextSelectedFeature = { ...selectedFeature };
      delete nextSelectedFeature?.featureAsContextName;
      delete nextSelectedFeature?.materializedAs;
    }
    updateSelectedFeature(nextSelectedFeature, {
      force: value !== '',
      notify: value !== '',
    });
  };

  const updateNumItems = (numItems) => {
    updateSelectedFeature({
      ...selectedFeature,
      items: numItems,
    });
  };

  const updateTtlDays = (days) => {
    if (days < 0) {
      return;
    }
    updateSelectedFeature({
      ...selectedFeature,
      ttl: days * 24 * 3600 * 1000,
    });
  };

  return (
    <div className={css(featureStyles.panelWrapper)}>
      <div className={css(featureStyles.advEntryWrapper)}>
        <div className={css(featureStyles.advLabel)}>
          {renderLabel('Materialized As', violations?.lastN?.__global)}
        </div>
        <Tooltip
          title={
            <div className={css(featureStyles.descInTooltip)}>
              If enabled, the feature keeps track of last N "attributes to
              retrieve" for each "attribute to query by". The tracked items are
              stored into a context.
            </div>
          }
        >
          <i
            className={`icon-Info ${css(
              iconStyles.IconInfo,
              featureStyles.iconStyle,
            )}`}
          />
        </Tooltip>
        <div className={css(featureStyles.control)}>
          <Dropdown
            onClick={(key) => {
              if (materializedAs !== key) {
                updateMaterialized(MATERIALIZED_AS[key]);
              }
            }}
            disabled={false}
            showClearSelection={true}
            optionList={Object.keys(MATERIALIZED_AS)}
            placeholder={
              MATERIALIZED_AS_REVERSE?.[materializedAs]
                ? MATERIALIZED_AS_REVERSE[materializedAs]
                : `Select Materialized As...`
            }
          />
        </div>
      </div>

      {(materializedAs === 'lastn' ||
        materializedAs === 'accumulatingCount') && (
        <div className={css(featureStyles.advEntryWrapper)}>
          <div className={css(featureStyles.advLabel)}>
            {renderLabel('Context Name', violations?.lastN?.context)}
          </div>
          <Tooltip
            title={
              <>
                <div className={css(featureStyles.descInTooltip)}>
                  Specifies the name of the context to store the results. The
                  primary key is the "attribute to query by" in this feature.
                  The value is tracked items of the "attribute to retrieve"
                  encoded into JSON.
                </div>
                <div className={css(featureStyles.descInTooltip)}>
                  <b>Note</b> - If the specified context already exists, it
                  would be replaced when its schema is not as desired.
                </div>
              </>
            }
          >
            <i
              className={`icon-Info ${css(
                iconStyles.IconInfo,
                featureStyles.iconStyle,
              )}`}
            />
          </Tooltip>
          <Input
            placeholder="Enter context name..."
            value={selectedFeature?.featureAsContextName}
            hideSuffix={true}
            onChange={(event) => {
              updateSelectedFeature({
                ...selectedFeature,
                featureAsContextName: event.target.value,
              });
            }}
          />
        </div>
      )}

      {materializedAs === 'lastn' && (
        <>
          <div className={css(featureStyles.advEntryWrapper)}>
            <div className={css(featureStyles.advLabel)}>
              {renderLabel('Number of Items', violations?.lastN?.numItems)}
            </div>
            <div></div>
            <div className={css(featureStyles.control)}>
              <InputNumber
                value={selectedFeature.items}
                min={1}
                max={64}
                onChange={updateNumItems}
              />
            </div>
          </div>
          <div className={css(featureStyles.advEntryWrapper)}>
            <div className={css(featureStyles.advLabel)}>
              {renderLabel('Items Time to Live', violations?.lastN?.ttl)}
            </div>
            <Tooltip
              title={
                <div className={css(featureStyles.descInTooltip)}>
                  Tracked items are removed from the context after the period of
                  time specified by this parameter.
                </div>
              }
            >
              <i
                className={`icon-Info ${css(
                  iconStyles.IconInfo,
                  featureStyles.iconStyle,
                )}`}
              />
            </Tooltip>
            <div className={css(featureStyles.control)}>
              <InputNumber value={ttlDays} min={1} onChange={updateTtlDays} />
              <div>days</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
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

export default connect(mapStateToProps)(TrackLastN);
