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
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'aphrodite';
import OnboardingSteps from '../components/OnboardingSteps';
import Actions from '../components/Actions';
import EntityHeader from './EntityHeader';
import EntityItem from './EntityItem';
import insightsSetupStyles from '../InsightSetUp/style';
import onboardingStyles from '../styles';
import { getEntityCounts } from '../utils';
import { entityListingActions } from '../EntityListing/reducers';
import { flowSpecsActions } from 'containers/Integrations/components/FlowListRightPanel/reducers';
import styles from './style';
import ipxl from '@bios/ipxl';

const { userClicks } = ipxl;
const { setEntityListing } = entityListingActions;
const { setSourceDataSpec } = flowSpecsActions;

function SelectedEntityListing({
  setStep,
  type,
  selectedEntity,
  setEntityListing,
  selectedEntitySource,
  reset,
  setSourceDataSpec,
  history,
}) {
  const entitiesAll = getEntityCounts(selectedEntity);

  const entries = selectedEntity?.subjects?.filter((subject) => {
    if (
      subject?.shouldCreate &&
      ((type === 'mutable' && subject.mutable) ||
        (type === 'immutable' && !subject.mutable))
    ) {
      return true;
    }
    return false;
  });
  let prevStep = type === 'mutable' ? 5 : 7;
  prevStep =
    type === 'immutable' &&
    !selectedEntity?.subjects?.some(
      (subject) => subject?.shouldCreate && subject.mutable,
    )
      ? 5
      : prevStep;
  const nextButtonName =
    type === 'immutable'
      ? 'Configure Mutable Data'
      : 'Configure Immutable Data';
  return (
    <div className={css(onboardingStyles.wrapperContainer)}>
      <OnboardingSteps activeIndex={3} />
      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.headerItem)}>
          {selectedEntitySource}
        </div>
      </div>
      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.subHeader)}>
          {entries?.length} Entities Identified
        </div>
      </div>

      <div className={css(styles.wrapper)}>
        <EntityHeader type={type} />
        {entries?.map((subject) => {
          const activeEntity = subject?.sameNameExists
            ? subject?.newName
            : subject?.subjectName;
          return (
            <EntityItem
              name={subject?.subjectName}
              sameNameExists={subject?.sameNameExists}
              newName={subject?.newName}
              onClick={() => {
                setEntityListing({
                  activeEntity,
                });
                type === 'immutable' ? setStep(9) : setStep(11);
              }}
              created={subject?.created}
              key={activeEntity}
            />
          );
        })}
      </div>
      <Actions
        className={css(insightsSetupStyles.mt100)}
        onNextClick={() => {
          if (type === 'mutable' && entitiesAll?.['immutable'] > 0) {
            setStep(8);
          } else {
            setStep(30);
          }
        }}
        onBackClick={() => {
          setStep(prevStep);
        }}
        onCancel={() => {
          userClicks({
            pageURL: history?.location?.pathname,
            pageTitle: document.title,
            pageDomain: window?.location?.origin,
            eventLabel: 'Cancel Onboarding',
            rightSection: 'None',
            mainSection: 'onboardingDataSourceShowEntitiesList',
            leftSection: 'onboarding',
          });
          reset && reset();
        }}
        nextButtonName={nextButtonName}
        nextDisabled={entries?.some((ent) => !ent.created)}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  const { selectedEntity, selectedEntitySource } =
    state?.onboardinge2e.entityListing;
  return { selectedEntity, selectedEntitySource };
};

const mapDispatchToProps = {
  setEntityListing,
  setSourceDataSpec,
};

SelectedEntityListing.propTypes = {
  setStep: PropTypes.func,
  selectedEntity: PropTypes.object,
  type: PropTypes.string,
  reset: PropTypes.func,
  selectedEntitySource: PropTypes.string,
  setSourceDataSpec: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectedEntityListing);
