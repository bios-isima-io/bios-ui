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
import { Spin } from 'antdlatest';
import { cloneDeep, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MultiSelect from 'components/react-multi-select';
import Colon from 'containers/ReportV2/components/AdvanceSettings/components/Colon';
import Button from 'containers/components/Button/Button';
import { ErrorNotification } from 'containers/utils';
import { UNSELECT_ALL_OCCURRENCES_WARNING } from './const';
import { contextReportFiltersActions } from './reducers';
import { getSelectedFilterList } from './utils';
import { getDimensions } from './utils/utils';
import './styles.scss';

const {
  setSelectedFilters,
  resetFilters,
  resetInitialSavedFilters,
  fetchFilters,
  updateFilterOrder,
} = contextReportFiltersActions;

function Filters({
  allFilters,
  initialFilters,
  setSelectedFilters,
  selectedFilters,
  loadingFilters,
  resetFilters,
  selectedMetrics,
  selectedContexts,
  groupByX,
  groupByY,
  fetchFilters,
  updateFilterOrder,
}) {
  const dimensionList = getDimensions({ groupByX, groupByY });

  let newSelectedFilters = cloneDeep(selectedFilters);
  for (const key in newSelectedFilters) {
    if (!dimensionList.includes(key)) {
      delete newSelectedFilters[key];
    }
  }
  if (!isEqual(newSelectedFilters, selectedFilters)) {
    setSelectedFilters({ ...newSelectedFilters });
  }

  const [selectedFiltersCopy, setSelectedFiltersCopy] = useState(
    newSelectedFilters ? newSelectedFilters : {},
  );

  const [isSelecting, setSelecting] = useState(false);

  useEffect(() => {
    if (selectedMetrics.length === 0) {
      resetFilters();
    }
  }, [resetFilters, selectedMetrics]);

  useEffect(() => {
    if (!isEqual(newSelectedFilters, selectedFiltersCopy)) {
      setSelectedFiltersCopy({ ...newSelectedFilters });
    }
  }, [selectedFilters]);

  const resetSelectedFiltersHandler = () => {
    updateFilterOrder([]);
    setSelectedFiltersCopy({});
    setSelectedFilters({});
  };

  const commitFilterChange = (dimension) => {
    if (!isEqual(selectedFilters, selectedFiltersCopy)) {
      if (selectedFiltersCopy?.[dimension]?.length === 0) {
        setSelectedFiltersCopy({ ...selectedFilters });
        ErrorNotification({
          message: UNSELECT_ALL_OCCURRENCES_WARNING(dimension),
        });
      } else {
        // Remove the filter if all are selected
        const availableFilterValues = new Set();
        Object.keys(allFilters?.[dimension])?.forEach((item) =>
          availableFilterValues.add(item),
        );
        selectedFilters?.[dimension]?.forEach((item) =>
          availableFilterValues.add(item),
        );
        const numSelectedFilterValues = selectedFiltersCopy[dimension]?.length;
        const numAvailableFilterValues = availableFilterValues.size;
        if (numSelectedFilterValues === numAvailableFilterValues) {
          delete selectedFiltersCopy[dimension];
          setSelectedFiltersCopy({
            ...selectedFiltersCopy,
          });
        }

        setSelectedFilters({ ...selectedFiltersCopy });
      }
    }
  };

  const getValuesToRender = (selected, options, dimension) => {
    if (selected.length === 0) {
      return <span className="placeholder-custom">Select {dimension}</span>;
    }
    if (selected.length === 1) {
      const displayValue = `${dimension} : ${selected[0]}`;
      return displayValue.length > 18
        ? displayValue.substring(0, 14) + '...'
        : displayValue;
    }
    if (
      allFilters?.[dimension] &&
      selected.length > 1 &&
      selected.length < Object.keys(allFilters?.[dimension]).length
    ) {
      return `${dimension} : ${selected.length}`;
    }

    if (!allFilters?.[dimension] && selected.length > 1) {
      return `${dimension} : ${selected.length}`;
    }

    if (selected.length === options.length) {
      return <span className="placeholder-custom">Select {dimension}</span>;
    }

    if (!isSelecting) {
      return `${dimension} : ${selected.length}`;
    }

    return `Selected ${selected.length} ${dimension}`;
  };

  const sortedDimensionList = dimensionList.sort((a, b) => a.localeCompare(b));

  return (
    <div className="report-filters">
      {dimensionList?.length === 0 && loadingFilters && (
        <div className="loading-filter">
          <Spin></Spin>
        </div>
      )}
      {dimensionList?.length === 0 && !loadingFilters && <div>No filters</div>}
      {sortedDimensionList.map((dimension) => {
        const dimValueSorted =
          allFilters && allFilters?.[dimension]
            ? Object.keys(allFilters?.[dimension]).sort(function (a, b) {
                return (
                  allFilters?.[dimension]?.[b] - allFilters?.[dimension]?.[a]
                );
              })
            : [];
        const selected = getSelectedFilterList(
          allFilters,
          selectedFiltersCopy,
          dimension,
        );

        const options = dimValueSorted.map((dimValue) => {
          return {
            label: dimValue + ' - ',
            value: dimValue,
            count: allFilters?.[dimension]?.[dimValue],
          };
        });

        // add existing selected value that doesn't exist in current duration interval
        if (selectedFiltersCopy?.hasOwnProperty(dimension)) {
          for (const dimValue of selectedFiltersCopy?.[dimension]) {
            if (!selected.includes(dimValue)) {
              selected.push(dimValue);
            }
          }
        }

        // add option for value that doesn't exist in current duration interval
        if (selectedFilters?.hasOwnProperty(dimension)) {
          for (const dimValue of selectedFilters?.[dimension]) {
            if (options.filter((o) => o.value === dimValue).length === 0) {
              options.push({
                label: dimValue + ' - ',
                value: dimValue,
                count: 0,
              });
            }
          }
        }

        return (
          <div className="row" key={dimension}>
            <div className="column dimension-name">
              {dimension}
              <Colon />
            </div>
            <div className="column">
              <MultiSelect
                options={options}
                selected={selected}
                isLoading={loadingFilters}
                onDropdownToggle={(isOpen) => {
                  if (isOpen) {
                    fetchFilters({
                      selectedContexts,
                      selectedMetrics,
                      groupByX,
                      groupByY,
                      selectedFilters,
                      dimensions: [dimension],
                    });
                  }
                  if (!isOpen) {
                    commitFilterChange(dimension);
                  }
                  setSelecting(isOpen);
                }}
                onSelectedChanged={(selected) => {
                  setSelectedFiltersCopy({
                    ...selectedFiltersCopy,
                    [dimension]: selected,
                  });
                }}
                overrideStrings={{
                  selectAll: 'All',
                }}
                valueRenderer={(selected, options) =>
                  getValuesToRender(selected, options, dimension)
                }
                selectSomeItems={'Select ' + dimension}
              />
            </div>
          </div>
        );
      })}

      {dimensionList?.length > 0 && (
        <div className="row">
          <div className="column dimension-name"></div>
          <div className="column">
            <Button
              type="secondary-no-border"
              onClick={resetSelectedFiltersHandler}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

Filters.propTypes = {
  allFilters: PropTypes.object,
  selectedMetrics: PropTypes.array,
  initialFilters: PropTypes.object,
  filtersShow: PropTypes.object,
  setSelectedFilters: PropTypes.func,
  loadingFilters: PropTypes.bool,
  resetFilters: PropTypes.func,
  resetInitialSavedFilters: PropTypes.func,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
  selectedSignals: PropTypes.array,
  fetchFilters: PropTypes.func,
  duration: PropTypes.number,
  durationStart: PropTypes.number,
  windowSize: PropTypes.number,
  updateFilterOrder: PropTypes.func,
};

const mapDispatchToProps = {
  setSelectedFilters,
  resetFilters,
  resetInitialSavedFilters,
  fetchFilters,
  updateFilterOrder,
};

const mapStateToProps = (state) => {
  const {
    allFilters,
    selectedFilters,
    filtersShow,
    loadingFilters,
    initialFilters,
  } = state.contextReport.filters;
  const { selectedMetrics } = state.contextReport.metrics;

  const { groupByX, groupByY } = state.contextReport.groupBy;

  const { selectedContexts } = state?.contextReport?.contextMultiSelect;

  return {
    allFilters,
    selectedFilters,
    filtersShow,
    loadingFilters,
    initialFilters,
    selectedMetrics,
    groupByX,
    groupByY,
    selectedContexts,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
