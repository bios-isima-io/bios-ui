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
import commonStyles from 'app/styles/commonStyles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { isValidStreamName } from 'utils';
import validator from 'validator';
import messages from '../../../utils/notificationMessages';
import { Button, Input, Tabs } from '../../components';
import { WarningNotification } from '../../utils';
import AlertCondition from './AlertCondition';
import FeatureStyles from './styles';
import { isNumericColumn, quote, unquote } from './utils';

const AddEditAlert = ({
  signalDetail,
  allAlerts,
  contexts,
  alert,
  currentlyEdited,
  srcRelations,
  setSelectedFeature,
  selectedFeature,
  cancelEdit,
}) => {
  const [alertName, setAlertName] = useState(
    alert?.alertName ? alert.alertName : '',
  );
  const [webhookUrl, setWebhookUrl] = useState(
    alert?.webhookUrl ? alert.webhookUrl : '',
  );
  const [relations, setRelations] = useState([]);
  const [selectedTab, setSelectedTab] = useState(
    alert?.condition === 'true' ? 0 : 1,
  );
  const [violations, setViolations] = useState({ relations: [] });

  useEffect(() => {
    let relations;
    if (!!srcRelations) {
      relations = srcRelations.map((relation) => {
        const newRelation = { ...relation };
        if (!newRelation.id) {
          newRelation.id = shortid.generate();
        }
        newRelation.op = newRelation.op.toUpperCase();
        if (newRelation.isNum === undefined) {
          newRelation.isNum = isNumericColumn(
            relation.lhs,
            signalDetail,
            contexts,
          );
        }
        if (!newRelation.isNum) {
          newRelation.rhs = unquote(newRelation.rhs);
        }
        return newRelation;
      });
    } else {
      relations = [createRelation()];
    }
    setRelations(relations);
    setViolations({ relations: relations.map((r) => null) });
  }, [srcRelations, signalDetail, contexts]);

  const createRelation = () => {
    return {
      lhs: '',
      op: '',
      rhs: '',
      id: shortid.generate(),
    };
  };

  const makeCondition = (relations) => {
    if (relations.length === 0) {
      return '';
    }
    const terms = relations.map((relation) => makeConditionTerm(relation));
    return joinTerms(terms, 0);
  };

  const joinTerms = (terms, start) => {
    const nextIndex = start + 1;
    if (nextIndex === terms.length) {
      return terms[start];
    }
    const op = relations[nextIndex].isAnd ? 'AND' : 'OR';
    return `(${terms[start]} ${op} ${joinTerms(terms, nextIndex)})`;
  };

  const makeConditionTerm = (relation) => {
    let isNum = relation.isNum;
    if (isNum === undefined) {
      isNum = isNumericColumn(relation.lhs, signalDetail, contexts);
    }
    let rhs = relation.rhs;
    if (!isNum) {
      rhs = quote(rhs);
    }
    return `(${relation.lhs} ${relation.op} ${rhs})`;
  };

  const addRelation = () => {
    const newRelation = createRelation();
    if (relations.length > 0) {
      const prev = relations[relations.length - 1].isAnd;
      newRelation.isAnd = prev !== undefined ? prev : true;
    }
    setRelations([...relations, newRelation]);
  };

  const updateRelation = (relation, index) => {
    const nextRelations = [...relations];
    nextRelations[index] = {
      ...relation,
      isNum: isNumericColumn(relation.lhs, signalDetail, contexts),
    };
    if (violations.relations[index]) {
      const result = validateRelation(relation);
      nextRelations[index] = result.relation;
      const nextViolations = { ...violations };
      nextViolations.relations = [...violations.relations];
      nextViolations.relations[index] = result.violation;
      setViolations(nextViolations);
    }

    if (index > 0) {
      for (let idx = 1; idx < relations.length; idx++) {
        nextRelations[idx].isAnd = relation.isAnd;
      }
    }
    setRelations(nextRelations);
  };

  const deleteRelation = (index) => {
    const temp = [...relations];
    temp.splice(index, 1);
    setRelations(temp);
  };

  const renderLabel = (title, errorMessage) => {
    return (
      <Tooltip title={errorMessage}>
        <div style={{ color: !!errorMessage ? 'red' : 'black' }}>{title}</div>
      </Tooltip>
    );
  };

  const webhookInput = () => {
    return (
      <div className={css(FeatureStyles.row)}>
        {renderLabel('Webhook URL', violations.webhookUrl)}
        <Input
          value={webhookUrl}
          onChange={(event) => {
            const newWebhookUrl = event?.target?.value?.trim();
            if (!!violations.webhookUrl) {
              setViolations({
                ...violations,
                webhookUrl: validateWebhookUrl(newWebhookUrl),
              });
            }
            setWebhookUrl(newWebhookUrl);
          }}
          hideSuffix={true}
          placeholder="Enter Webhook URL..."
        />
      </div>
    );
  };

  const validateAlertName = (newAlertName) => {
    if (!newAlertName) {
      return messages.signal.EMPTY_ALERT_NAME;
    }
    const canonName = newAlertName.toLowerCase();
    const conflicting = allAlerts.find(
      (alert, index) =>
        index !== currentlyEdited &&
        alert.alertName.toLowerCase() === canonName,
    );
    if (!!conflicting) {
      return messages.signal.ALERT_NAME_CONFLICT;
    }
    if (!isValidStreamName(newAlertName)) {
      const name = messages.signal.INVALID_ALERT_NAME;
      return name;
    }
    return null;
  };

  const validateWebhookUrl = (newWebhookUrl) => {
    if (!newWebhookUrl) {
      return messages.signal.EMPTY_WEBHOOK_VALUE;
    }
    if (
      !validator.isURL(newWebhookUrl, {
        protocols: ['https'],
        require_protocol: true,
      })
    ) {
      if (!newWebhookUrl.startsWith('https:')) {
        return messages.signal.NEED_SECURE_URL;
      }
      return messages.signal.INVALID_URL;
    }
    return null;
  };

  const validateRelation = (relation) => {
    const nextRelation = { ...relation };
    const lhs = nextRelation.lhs;
    const value = nextRelation.rhs;
    const op = nextRelation.op;
    let violation = {};
    if (!lhs) {
      violation.var = messages.signal.CONDITION_VARIABLE_MISSING;
    }
    if (!op) {
      violation.op = messages.signal.CONDITION_OPERATOR_MISSING;
    }

    if (lhs && nextRelation.isNum === undefined) {
      nextRelation.isNum = isNumericColumn(lhs, signalDetail, contexts);
    }

    if (nextRelation.isNum && !validator.isFloat(value)) {
      violation.value = messages.signal.invalidConditionValueType(lhs);
    }
    if (!value && (nextRelation.isNum || nextRelation.op === 'CONTAINS')) {
      violation.value = messages.signal.CONDITION_VALUE_MISSING;
    }
    if (Object.keys(violation).length === 0) {
      return { relation: nextRelation, violation: null };
    }
    return { relation: nextRelation, violation };
  };

  const validateRelations = (nextViolations) => {
    let success = true;
    const relationViolations = [];
    const nextRelations = [];
    relations.forEach((relation) => {
      const result = validateRelation(relation);
      nextRelations.push(result.relation);
      if (!!result.violation?.var) {
        WarningNotification({ message: result.violation.var });
        success = false;
      }
      if (!!result.violation?.op) {
        WarningNotification({ message: result.violation.op });
        success = false;
      }
      if (!!result.violation?.value) {
        WarningNotification({ message: result.violation.value });
        success = false;
      }
      relationViolations.push(result.violation);
    });
    nextViolations.relations = relationViolations;
    setViolations(nextViolations);
    setRelations(nextRelations);
    return success;
  };

  /**
   * Validates the edited alert parameters.
   *
   * The method sends warning messages for validation errors.
   * Also sets them to state 'violations'.
   *
   * @returns true if validation is successful, false otherwise
   */
  const validateAlertParams = () => {
    const nextViolations = {};
    let success = true;
    nextViolations.name = validateAlertName(alertName?.trim());
    if (!!nextViolations.name) {
      WarningNotification({ message: nextViolations.name });
      success = false;
    }
    nextViolations.webhookUrl = validateWebhookUrl(webhookUrl);
    if (!!nextViolations.webhookUrl) {
      WarningNotification({ message: nextViolations.webhookUrl });
      success = false;
    }
    if (selectedTab === 1 && !validateRelations(nextViolations)) {
      success = false;
    }
    setViolations(nextViolations);
    return success;
  };

  /**
   * Applies the edited alerts parameters.
   */
  const apply = () => {
    if (!validateAlertParams()) {
      return;
    }

    let condition = selectedTab === 1 ? makeCondition(relations) : 'true';

    setSelectedFeature({
      ...selectedFeature,
      alerts: allAlerts.map((item, index) => {
        if (index === currentlyEdited) {
          return {
            ...item,
            alertName: alertName,
            webhookUrl: webhookUrl,
            condition: condition,
          };
        }

        return item;
      }),
    });

    cancelEdit();
  };

  const tabsConfig = {
    defaultTab: selectedTab,
    tabs: [
      {
        label: window.innerWidth >= 1200 ? 'Streaming Alert' : 'Streaming',
        key: 0,
        content: webhookInput,
      },
      {
        label: window.innerWidth >= 1200 ? 'Custom Alert' : 'Custom',
        key: 1,
        content: () => {
          return (
            <div>
              <div className={css(FeatureStyles.customFormulaWrapper)}>
                <div>Alert Condition</div>
                {relations.map((relation, index) => {
                  return (
                    <AlertCondition
                      key={relation.id}
                      index={index}
                      relation={relation}
                      onChange={(cdx) => updateRelation(cdx, index)}
                      selectedFeature={selectedFeature}
                      onDelete={() => deleteRelation(index)}
                      violation={violations?.relations[index]}
                    />
                  );
                })}
                <Button
                  type="primary"
                  onClick={addRelation}
                  disabled={relations.length >= 5}
                >
                  Add Condition
                </Button>
              </div>
              {webhookInput()}
            </div>
          );
        },
      },
    ],
  };

  return (
    <>
      <div className={css(FeatureStyles.row)}>
        {renderLabel('Alert Name', violations.name)}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 30px 30px',
            gridGap: '10px',
            alignItems: 'center',
          }}
        >
          <Input
            placeholder="Enter alert name..."
            value={alertName}
            hideSuffix={true}
            onChange={(event) => {
              const newName = event?.target?.value?.trim();
              if (violations.name) {
                if (validateAlertName(newName) === null) {
                  setViolations({ ...violations, name: null });
                }
              }
              setAlertName(newName);
            }}
          />
          <Tooltip title="Apply" mouseEnterDelay={1.0}>
            <i
              className={`icon-check ${css(commonStyles.icon)}`}
              onClick={apply}
            />
          </Tooltip>
          <Tooltip title="Cancel" mouseEnterDelay={1.0}>
            <i
              className={`icon-close ${css(commonStyles.icon)}`}
              onClick={cancelEdit}
            />
          </Tooltip>
        </div>
      </div>

      <Tabs
        tabsConfig={tabsConfig}
        onTabChange={(key) => {
          setWebhookUrl('');
          setSelectedTab(key);
        }}
      />
    </>
  );
};

AddEditAlert.propTypes = {
  list: PropTypes.array,
  currentlyEdited: PropTypes.number,
  selected: PropTypes.instanceOf(Object),
  selectedFeature: PropTypes.instanceOf(Object),
  setSelectedFeature: PropTypes.func,
  setCurrentEdited: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { signalDetail } = state.signalDetail;
  const { contexts } = state.contexts;
  return {
    signalDetail,
    contexts,
  };
};

export default connect(mapStateToProps)(AddEditAlert);
