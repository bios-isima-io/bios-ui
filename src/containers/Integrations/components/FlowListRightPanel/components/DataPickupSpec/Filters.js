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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import styles from '../../../../styles';
import { Button, Input } from '../../../../../components';
import { flowSpecsActions } from '../../reducers';
import { cloneDeep } from 'lodash';
import filtersStyles from './styles';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';
import './styles.scss';

const { setDataPickupSpec } = flowSpecsActions;

function Filters({ setDataPickupSpec, dataPickupSpec }) {
  const { filters } = dataPickupSpec;

  const addFilter = () => {
    const newFilter = filters && Array.isArray(filters) ? filters : [];
    newFilter.push({
      sourceAttributeName: '',
      filter: `lambda value:value == 'val1' or value == 'val2'`,
    });
    setDataPickupSpec({ filters: newFilter });
  };

  const deleteFilter = (index) => {
    const newFilter = cloneDeep(filters);
    newFilter.splice(index, 1);
    setDataPickupSpec({ filters: newFilter });
  };

  const updateFilter = (key, value, index) => {
    const newFilter = cloneDeep(filters);
    newFilter[index][key] = value;
    setDataPickupSpec({ filters: newFilter });
  };

  return (
    <div>
      {filters &&
        filters.length > 0 &&
        filters.map((filter, index) => {
          return (
            <div className={css(filtersStyles.filterContainer)}>
              <div className={css(styles.threeColDelete)}>
                <div className={css(styles.rPanelSubSectionCol1)}>
                  Source Attribute
                </div>
                <Input
                  value={filter?.sourceAttributeName}
                  onChange={(event) =>
                    updateFilter(
                      'sourceAttributeName',
                      event.target.value,
                      index,
                    )
                  }
                  hideSuffix={true}
                  placeholder="Source Attribute Name"
                ></Input>
                <div
                  style={{
                    marginLeft: '5px',
                    marginTop: '5px',
                    fontSize: '18px',
                  }}
                >
                  <i
                    className={`icon-trash`}
                    onClick={() => deleteFilter(index)}
                  />
                </div>
              </div>

              <div className={css(styles.rPanelSubSectionRowFilter)}>
                <div className={css(styles.rPanelSubSectionCol1)}>Filter</div>
                <AceEditor
                  placeholder="Put your Python code here"
                  width=""
                  height="100px"
                  mode="python"
                  theme="tomorrow"
                  className="flow-filter-editor"
                  onChange={(value) => updateFilter('filter', value, index)}
                  value={filter?.filter}
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                  }}
                  fontSize="12px"
                  showPrintMargin={false}
                />
              </div>
            </div>
          );
        })}
      <div
        className={css(
          styles.rPanelSubSectionRow,
          filtersStyles.addFilterButtonWrapper,
        )}
      >
        <Button
          type="secondary-no-border"
          size="small"
          onClick={() => addFilter()}
        >
          Add Filter
        </Button>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  setDataPickupSpec,
};

const mapStateToProps = (state) => {
  const { dataPickupSpec } = state.integration.importFlowSpecs;
  return {
    dataPickupSpec,
  };
};

Filters.propTypes = {
  setDataPickupSpec: PropTypes.func,
  dataPickupSpec: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
