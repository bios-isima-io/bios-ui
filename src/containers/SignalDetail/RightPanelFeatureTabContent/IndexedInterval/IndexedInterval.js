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
import { css } from 'aphrodite';
import iconStyles from 'common/styles/IconStyles';
import SwitchWrapper from 'components/Switch';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { InputNumber } from '../../../components';
import { renderLabel } from '../../utils';
import featureStyles from '../styles';
import styles from './style';

const IndexedInterval = ({
  selectedFeature,
  setSelectedFeature,
  validationErrors,
}) => {
  const [featureInterval, setFeatureInterval] = useState(300000);
  const [intervalMultiplier, setIntervalMultiplier] = useState(0);
  const [timeIndexInterval, setTimeIndexInterval] = useState(0);
  const [violations, setViolations] = useState({});

  useEffect(() => {
    // something is wrong if featureInterval is zero but we just put defensive code here
    const nextFeatureInterval = selectedFeature?.featureInterval || 300000;
    setFeatureInterval(nextFeatureInterval);
    const nextIndexInterval =
      selectedFeature?.timeIndexInterval || nextFeatureInterval;
    setTimeIndexInterval(nextIndexInterval);
    setIntervalMultiplier(
      nextFeatureInterval ? nextIndexInterval / nextFeatureInterval : 0,
    );
  }, [selectedFeature?.timeIndexInterval, selectedFeature?.featureInterval]);

  useEffect(() => {
    setViolations(
      (validationErrors.features || {})[selectedFeature._id]?.indexing || {},
    );
  }, [selectedFeature, validationErrors]);

  const isIndexingEnabled = () => {
    return !!selectedFeature?.indexed;
  };

  return (
    <div className={css(featureStyles.panelWrapper)}>
      <div className={css(featureStyles.advEntryWrapper)}>
        <div className={css(featureStyles.advLabel)}>
          {renderLabel('Enable Indexing', violations?.indexed)}
        </div>
        <div style={{ width: '22px', height: '22px' }}>
          <Tooltip
            title={
              <div className={css(featureStyles.descInTooltip)}>
                Indexes are used by high-cardinality "attributes to query".
              </div>
            }
          >
            <i
              className={`icon-Info ${css(
                iconStyles.IconInfo,
                styles.iconStyle,
              )}`}
            />
          </Tooltip>
        </div>
        <div className={css(styles.control)}>
          <SwitchWrapper
            checked={isIndexingEnabled()}
            onChange={(indexed) => {
              const nextSelectedFeature = { ...selectedFeature };
              if (indexed) {
                nextSelectedFeature.indexed = indexed;
                nextSelectedFeature.timeIndexInterval = timeIndexInterval;
              } else {
                delete nextSelectedFeature.timeIndexInterval;
                delete nextSelectedFeature.indexed;
              }
              setSelectedFeature(nextSelectedFeature);
            }}
            onLabel="YES"
            offLabel="NO"
          />
        </div>
      </div>
      {isIndexingEnabled() && (
        <div className={css(featureStyles.advEntryWrapper)}>
          {renderLabel('Index Interval Multiplier', violations?.interval)}
          <Tooltip
            title={
              <>
                <div className={css(featureStyles.descInTooltip)}>
                  The indexing interval controls how often indexes are created.
                  It is defined as a multiple of the parameter “interval”.
                </div>
                <div className={css(featureStyles.descInTooltip)}>
                  <b>Note</b> - Larger indexing multiple implies longer delays
                  in indexing signal data.
                </div>
              </>
            }
          >
            <i
              className={`icon-Info ${css(
                iconStyles.IconInfo,
                styles.iconStyle,
              )}`}
            />
          </Tooltip>
          <div className={css(styles.control)}>
            <InputNumber
              value={intervalMultiplier}
              min={1}
              // max={100}
              onChange={(value) => {
                setSelectedFeature({
                  ...selectedFeature,
                  timeIndexInterval: value * featureInterval,
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// export default IndexedInterval;
const mapStateToProps = (state) => {
  const { validationErrors } = state.signalDetail;
  return { validationErrors };
};

export default connect(mapStateToProps)(IndexedInterval);
