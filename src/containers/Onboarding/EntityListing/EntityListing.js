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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'aphrodite';
import OnboardingSteps from '../components/OnboardingSteps';
import onboardingStyles from '../styles';
import { entityListingActions } from './reducers';
import EntityItem from './EntityItem';
import EntityHeader from './EntityHeader';
import EmptyEntityListing from '../EmptyEntityListing';
import { getUniqueSignalContextNames } from './utils';
import { Button } from 'containers/components';
import Actions from '../components/Actions';
import style from './style';
import insightsSetupStyles from '../InsightSetUp/style';
import { ErrorNotification } from 'containers/utils';
import { getEntityCounts } from '../utils';
import messages from 'utils/notificationMessages';
import LineBreak from 'components/LineBreak';
import ipxl from '@bios/ipxl';

const { userClicks } = ipxl;
const { setEntityListing } = entityListingActions;
const PageRowCountInc = 10;

function EntityListing({
  setEntityListing,
  selectedEntity,
  signals,
  contexts,
  setStep,
  selectedEntitySource,
  reset,
  history,
}) {
  const [pageEntryCount, setPageEntryCount] = useState(PageRowCountInc);
  const uniqueNames = getUniqueSignalContextNames(signals, contexts);
  const entities = getEntityCounts(selectedEntity);
  useEffect(() => {
    let shouldUpdate = false;
    const newEntityListingSubjects = selectedEntity?.subjects?.map(
      (subject) => {
        if ('mutable' in subject) {
          return subject;
        }
        shouldUpdate = true;
        return {
          ...subject,
          shouldCreate: false,
          created: false,
          sameNameExists: uniqueNames.has(subject.subjectName),
          newName: '',
          mutable: true,
        };
      },
    );
    if (shouldUpdate) {
      const listingSubjects = newEntityListingSubjects?.sort((x, y) => {
        return x?.sameNameExists === y?.sameNameExists
          ? 0
          : x?.sameNameExists
          ? -1
          : 1;
      });
      setEntityListing({
        selectedEntity: {
          ...selectedEntity,
          subjects: listingSubjects,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntity]);

  const updateEntityData = (value, key, updateIndex) => {
    const newEntityListingSubjects = selectedEntity?.subjects?.map(
      (subject, subjectIndex) => {
        if (subjectIndex === updateIndex) {
          return {
            ...subject,
            [key]: value,
          };
        }
        return subject;
      },
    );
    setEntityListing({
      selectedEntity: {
        ...selectedEntity,
        subjects: newEntityListingSubjects,
      },
    });
  };

  const setAllValues = (key, value) => {
    const newEntityListingSubjects = selectedEntity?.subjects?.map(
      (subject) => {
        return {
          ...subject,
          [key]: value,
        };
      },
    );
    setEntityListing({
      selectedEntity: {
        ...selectedEntity,
        subjects: newEntityListingSubjects,
      },
    });
  };

  const validateEntityList = () => {
    if (entities?.['selectedEntries'] === 0) {
      ErrorNotification({ message: messages.onboarding.SELECT_SOME_ENTITY });
      return false;
    }
    let hasError = false;
    let uniqueNamesCopy = new Set(uniqueNames);
    selectedEntity?.subjects?.forEach((subject) => {
      uniqueNamesCopy.add(subject.subjectName);
    });
    selectedEntity?.subjects?.forEach((subject) => {
      if (subject.shouldCreate && subject.sameNameExists) {
        if (subject.newName === '') {
          ErrorNotification({
            message: messages.onboarding.UPDATE_CONFLICTING_NAME,
          });
          hasError = true;
          return;
        }
        if (uniqueNamesCopy.has(subject.newName)) {
          ErrorNotification({
            message: messages.onboarding.duplicateEntityName(subject.newName),
          });
          hasError = true;
          return;
        }
        uniqueNamesCopy.add(subject.newName);
      }
    });
    return !hasError;
  };

  return selectedEntity?.subjects?.length > 0 ? (
    <div className={css(onboardingStyles.wrapperContainer)}>
      <OnboardingSteps activeIndex={2} />
      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.headerItem)}>
          {selectedEntitySource}
        </div>
      </div>

      <div className={css(onboardingStyles.header)}>
        <div className={css(onboardingStyles.subHeader)}>
          {entities?.['selectedEntries']} Selected. {entities?.['mutable']}{' '}
          Mutable / {entities?.['immutable']} Immutable
        </div>
      </div>

      <div className={css(style.wrapper)}>
        <EntityHeader
          selected={
            selectedEntity?.subjects?.length === entities?.['selectedEntries']
          }
          setAllValues={setAllValues}
        />

        <div
          style={{
            maxHeight: '200px',
            overflowY: 'scroll',
          }}
          className={css(style.entityListingContainer)}
        >
          {selectedEntity?.subjects?.reduce((acc, subject, subjectIndex) => {
            if (subjectIndex > pageEntryCount) {
              return acc;
            }
            acc.push(
              <EntityItem
                name={subject?.subjectName}
                shouldCreate={subject?.shouldCreate}
                sameNameExists={subject?.sameNameExists}
                newName={subject?.newName}
                mutable={subject?.mutable}
                subjectIndex={subjectIndex}
                updateEntityData={updateEntityData}
                key={subject?.subjectName}
              />,
            );
            return acc;
          }, [])}
        </div>

        {pageEntryCount < selectedEntity?.subjects?.length - 1 && (
          <div className={css(style.loadMoreButton)}>
            <Button
              type="secondary"
              onClick={() => {
                setPageEntryCount(pageEntryCount + PageRowCountInc);
              }}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
      <LineBreak height="60px" />

      <Actions
        className={css(insightsSetupStyles.mt100)}
        onNextClick={() => {
          if (!validateEntityList()) {
            return;
          }
          userClicks({
            pageURL: history?.location?.pathname,
            pageTitle: document.title,
            pageDomain: window?.location?.origin,
            eventLabel:
              entities?.['mutable'] === 0 && entities?.['immutable'] > 0
                ? 'Configure Immutable Data'
                : 'Configure Mutable Data',
            rightSection: 'None',
            mainSection: 'onboardingDataSourceEntitySelection',
            leftSection: 'onboarding',
          });
          entities?.['mutable'] > 0 ? setStep(7) : setStep(8);
        }}
        onBackClick={() => {
          setStep(3);
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
        nextDisabled={entities?.['selectedEntries'] === 0}
        nextButtonName={
          entities?.['mutable'] === 0 && entities?.['immutable'] > 0
            ? 'Configure Immutable Data'
            : 'Configure Mutable Data'
        }
      />
    </div>
  ) : (
    <EmptyEntityListing setStep={setStep} />
  );
}

const mapStateToProps = (state) => {
  const { selectedEntity, selectedEntitySource } =
    state?.onboardinge2e.entityListing;
  const { signals } = state?.signals;
  const { contexts } = state?.contexts;

  return { selectedEntity, signals, contexts, selectedEntitySource };
};
const mapDispatchToProps = {
  setEntityListing,
};

EntityListing.propTypes = {
  setEntityListing: PropTypes.func,
  signals: PropTypes.array,
  contexts: PropTypes.array,
  selectedEntity: PropTypes.object,
  setStep: PropTypes.func,
  reset: PropTypes.func,
  selectedEntitySource: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityListing);
