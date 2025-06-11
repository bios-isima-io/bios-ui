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
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import Actions from 'containers/Onboarding/components/Actions';
import OnboardingSteps from 'containers/Onboarding/components/OnboardingSteps';
import integrationActions from 'containers/Onboarding/EntityListing/reducers/actions';
import styles from 'containers/Onboarding/SelectDataSource/styles';
import onboardingStyles from 'containers/Onboarding/styles';
import connectingImage from './animat-rocket.gif';

const { startDiscovery } = integrationActions;

const ConnectingDataSource = ({
  setStep,
  importSourceId,
  startDiscovery,
  dataDiscoveryLoading,
  selectedEntitySource,
  reset,
}) => {
  useEffect(() => {
    startDiscovery({ importSourceId, setStep });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should be called only once on loading
  }, []);

  if (!dataDiscoveryLoading) {
    return null;
  }

  return (
    <div className={css(styles.wrapper)}>
      <OnboardingSteps activeIndex={1} />
      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.headerItem)}>
          {selectedEntitySource}
        </div>
      </div>
      <div className={css(styles.contentWrapper)}>
        <img
          className={css(styles.image)}
          src={connectingImage}
          alt="connecting"
        />
        <div>Discovering source data. It may take a while.</div>
        <Actions
          loading={dataDiscoveryLoading}
          className={css(styles.mt100)}
          onNextClick={() => {
            setStep(5);
          }}
          onBackClick={() => {
            setStep(3);
          }}
          onCancel={() => {
            reset && reset();
          }}
        />
      </div>
    </div>
  );
};

ConnectingDataSource.propTypes = {
  setStep: PropTypes.func,
  startDiscovery: PropTypes.func,
  dataDiscoveryLoading: PropTypes.bool,
  importSourceId: PropTypes.string,
  selectedEntitySource: PropTypes.string,
  reset: PropTypes.func,
};

const mapDispatchToProps = {
  startDiscovery,
};

const mapStateToProps = (state) => {
  const { importSourceId } = state?.onboardinge2e.integration;
  const { dataDiscoveryLoading, selectedEntitySource } =
    state?.onboardinge2e?.entityListing;
  return { importSourceId, dataDiscoveryLoading, selectedEntitySource };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectingDataSource);
