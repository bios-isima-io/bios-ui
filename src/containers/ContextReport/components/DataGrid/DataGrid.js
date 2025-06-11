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
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Table from 'containers/components/Table';
import { Input } from '../../../components';
import CsvDownloader from 'react-csv-downloader';
import dataGridActions from './reducers/actions';
import {
  gridColumnGroupByX,
  gridDataGroupByX,
  gridColumnGroupByXY,
  gridDataGroupByXY,
} from './buildGridData';
import MobileDropdown from 'components/MobileDropdown';
import './styles.scss';
import Loading from 'containers/ReportV2/components/DataGrid/Loading';

const { resetDataGrid } = dataGridActions;

function DataGrid({
  graphDataResponse,
  groupByX,
  groupByY,
  resetDataGrid,
  selectedMetrics,
  isMobile,
}) {
  const [showDataGrid, setShowDataGrid] = useState(isMobile ? false : true);
  const [filteredTable, setFilteredTable] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  let columns = [];
  let data = [];

  if (groupByX !== '' && groupByY === '') {
    columns = gridColumnGroupByX(selectedMetrics);
    data = gridDataGroupByX(graphDataResponse, selectedMetrics);
  } else if (groupByX !== '' && groupByY !== '') {
    columns = gridColumnGroupByXY(selectedMetrics);
    data = gridDataGroupByXY(graphDataResponse, selectedMetrics);
  } else {
    columns = [];
    data = [];
  }

  const search = (value) => {
    if (value === '') {
      setFilteredTable(data);
      return;
    }
    const filterTable = data?.filter((o) =>
      Object.keys(o).some((k) => {
        if (k === 'key') {
          return false;
        }
        return String(o[k]).toLowerCase().includes(value.toLowerCase());
      }),
    );

    setFilteredTable(filterTable);
  };

  useEffect(() => {
    setFilteredTable(null);
    setSearchValue('');
  }, [groupByX, groupByY]);

  useEffect(() => {
    return () => resetDataGrid();
  }, []);

  useEffect(() => {
    if (!isMobile && !showDataGrid) {
      setShowDataGrid(true);
    }
  }, [isMobile]);

  const searchInputChanged = (value) => {
    search(value);
    setSearchValue(value);
  };
  return (
    <div className="report-data-grid-container">
      {isMobile && (
        <MobileDropdown
          showSection={showDataGrid}
          setShowSection={setShowDataGrid}
          textContent="Data"
        />
      )}
      {showDataGrid && (
        <div className="report-data-grid">
          <div className="header">
            <div className="header-options">
              <CsvDownloader
                datas={data?.map((item) => {
                  let o = {};
                  Object.keys(item).forEach((key) => {
                    o[key] = `"${item[key]}"`;
                  });
                  return o;
                })}
                columns={columns?.map((cl) => {
                  return {
                    id: cl.dataIndex,
                    displayName: cl.title,
                  };
                })}
                filename={`data-${new Date().toLocaleString()}.csv`}
                className="datagrid-download-button"
              >
                <Loading />
              </CsvDownloader>
              <div className="search-field">
                <Input
                  placeholder="Search"
                  onChange={(e) => searchInputChanged(e.target.value)}
                  value={searchValue}
                />
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredTable == null ? data : filteredTable}
            scroll={{ x: 600 }}
          ></Table>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { selectedMetrics } = state.contextReport.metrics;
  const { graphDataResponse } = state.contextReport.dataGrid;
  const { groupByX, groupByY } = state.contextReport.groupBy;
  return {
    graphDataResponse,
    groupByX,
    groupByY,
    selectedMetrics,
  };
};

const mapDispatchToProps = {
  resetDataGrid,
};

DataGrid.propTypes = {
  graphDataResponse: PropTypes.object,
  groupByX: PropTypes.string,
  groupByY: PropTypes.string,
  resetDataGrid: PropTypes.func,
  selectedMetrics: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);
