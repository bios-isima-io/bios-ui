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
import { cloneDeep } from 'lodash-es';
import { connect } from 'react-redux';

import ipxl from '@bios/ipxl';

import ContextDetail from 'containers/ContextDetail';
import {
  setContextDetail,
  updateContextDetail,
} from 'containers/ContextDetail/actions';
import { entityListingActions } from 'containers/Onboarding/EntityListing/reducers';
import styles from 'containers/Onboarding/NewSignalTeachBiosWrapper/styles';
import { useEffect } from 'react';
import { makeImportFlowSpec } from 'containers/Integrations/utils';
import integrationActions from 'containers/Integrations/reducers/actions';

const { userClicks } = ipxl;
const { setEntityListing } = entityListingActions;
const { setIntegrationConfig } = integrationActions;

const ContextDetailWrapper = ({
  setStep,
  history,
  reset,

  contextDetail,
  selectedEntity,
  activeEntity,
  contextDetailNew,
  selectedEntityCreationFlow,
  flowMapping,
  importSources,
  importDestinations,
  importFlowSpecsCopy,

  setEntityListing,
  setContextDetail,
  updateContextDetail,
  setIntegrationConfig,
}) => {
  // Set the contextDetail in onboardinge2e to current current contextDetail for the ContextDetail
  // component on loading this component. An initial import flow is also built and set here.
  useEffect(() => {
    setContextDetail({});
    updateContextDetail({ ...contextDetail, isNewEntry: true });

    const importSourceId = selectedEntity?.importSourceId;

    if (importSourceId?.length > 0) {
      const subject = selectedEntity?.subjects.find((subj) => {
        const name = subj.newName === '' ? subj.subjectName : subj.newName;
        return name === activeEntity;
      });

      const importFlowSpec = makeImportFlowSpec(
        importSourceId,
        importSources,
        importDestinations,
        flowMapping,
        contextDetail,
        subject,
      );

      setIntegrationConfig({
        importFlowSpecsCopy: [...importFlowSpecsCopy, importFlowSpec],
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let isLastOnboardingStep = false;

  if (selectedEntityCreationFlow === 'teach_bios') {
    isLastOnboardingStep = true;
  } else {
    isLastOnboardingStep = selectedEntity?.subjects.every(
      (item) => item.created === true,
    );
  }

  return (
    <>
      <div className={css(styles.modalContent)}>
        <ContextDetail
          history={history}
          parentFlow="onboarding"
          skipInitialDetailSetup={true} // since this component sets up the initial data
          selectedEntityCreationFlow={selectedEntityCreationFlow}
          onCreateNewContext={(name) => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Context Onboarded',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceShowEntityContextDetail',
              leftSection: 'onboarding',
            });
            if (selectedEntityCreationFlow === 'teach_bios') {
              return;
            }
            const updatedSelectedEntity = cloneDeep(selectedEntity);
            updatedSelectedEntity.subjects = updatedSelectedEntity.subjects.map(
              (subject) => {
                const { sameNameExists, newName, subjectName } = subject;
                const entityName = sameNameExists ? newName : subjectName;
                if (name === entityName) {
                  subject.created = true;
                }
                if (
                  activeEntity === entityName &&
                  activeEntity !== contextDetailNew.contextName
                ) {
                  subject.newName = contextDetailNew.contextName;
                  subject.created = true;
                }
                return subject;
              },
            );
            setEntityListing({
              selectedEntity: updatedSelectedEntity,
            });
          }}
          onDeleteCreatedContext={(name) => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Delete Onboarded Signal',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceShowEntitySignalDetail',
              leftSection: 'onboarding',
            });
            if (selectedEntityCreationFlow === 'teach_bios') {
              return;
            }
            const updatedSelectedEntity = cloneDeep(selectedEntity);
            updatedSelectedEntity.subjects = updatedSelectedEntity.subjects.map(
              (subject) => {
                const { sameNameExists, newName, subjectName } = subject;
                const entityName = sameNameExists ? newName : subjectName;
                if (name === entityName) {
                  subject.created = false;
                }
                return subject;
              },
            );
            setEntityListing({
              selectedEntity: updatedSelectedEntity,
            });
          }}
          onCancel={() => {
            userClicks({
              pageURL: history?.location?.pathname,
              pageTitle: document.title,
              pageDomain: window?.location?.origin,
              eventLabel: 'Cancel Onboarding',
              rightSection: 'None',
              mainSection: 'onboardingDataSourceShowEntitySignalDetail',
              leftSection: 'onboarding',
            });
            if (selectedEntityCreationFlow === 'teach_bios') {
              setStep(1);
            } else {
              setStep(7);
            }
          }}
          resetOnboarding={reset}
          isLastOnboardingStep={isLastOnboardingStep}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { selectedEntity, activeEntity, selectedEntityCreationFlow } =
    state.onboardinge2e.entityListing;

  const { contextDetail } = state.onboardinge2e.global;
  const { contextDetail: contextDetailNew } = state?.contextDetail;

  const { flowMapping } = state.integration.integrationConfig;
  const { importSources, importDestinations, importFlowSpecsCopy } =
    state.integration?.integrationConfig;

  return {
    contextDetail,
    selectedEntity,
    activeEntity,
    contextDetailNew,
    selectedEntityCreationFlow,
    flowMapping,
    importSources,
    importDestinations,
    importFlowSpecsCopy,
  };
};

const mapDispatchToProps = {
  setEntityListing,
  setContextDetail,
  updateContextDetail,
  setIntegrationConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContextDetailWrapper);
