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
import { Modal, Upload } from 'antdlatest';
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { readString } from 'react-papaparse';
import { connect } from 'react-redux';

import commonStyles from 'app/styles/commonStyles';
import uploadCloud from 'app/styles/svg-src/upload-cloud.svg';
import { usePrevious } from 'common/hooks';
import SwitchWrapper from 'components/Switch';
import { Button, ThreeDotAnimation } from 'containers/components';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import { uploadContextData } from 'containers/ContextDetail/actions';
import { MAX_FILE_MEGABYTES } from './constant';
import styles from './style';
import { fileSizeInMb } from './utils';

const { Dragger } = Upload;

const UploadContextEntries = ({
  uploadingData,
  uploadContextData,
  contextDetail,
  contextDetailModified,
  flowSpecsModified,
}) => {
  let reader = null;
  const [fileName, setFileName] = useState(null);
  const [uploadingDone, setUploadingDone] = useState(false);
  const [selectingFile, setSelectingFile] = useState(false);
  const [isFirstRowHeader, setIsFirstRowHeader] = useState(true);

  const prevUploadingData = usePrevious(uploadingData);

  useEffect(() => {
    if (prevUploadingData && !uploadingData) {
      setUploadingDone(true);
      setTimeout(() => {
        setUploadingDone(false);
        setFileName(null);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingData]);

  const contextName = contextDetail.contextName;

  /**
   * Builds biOS CSV from CSV parser data
   */
  const buildCsvRows = (sourceData) => {
    if (!sourceData) {
      ErrorNotification({
        message: messages.context.INSUFFICIENT_DATA,
      });
      return null;
    }
    if (isFirstRowHeader) {
      return buildCsvRowsWithHeader(sourceData);
    }

    const numAttributes = contextDetail.attributes.length;
    let rowNumWithInvalidCount = null;
    const inValidColumnCount = sourceData.some((row, i) => {
      if (row.length !== numAttributes) {
        rowNumWithInvalidCount = i;
        return true;
      }
      return false;
    });

    if (inValidColumnCount) {
      ErrorNotification({
        message: `Row (${rowNumWithInvalidCount + 1}) has ${
          sourceData[rowNumWithInvalidCount].length
        } columns, while expected number of columns are ${numAttributes}`,
      });
      return null;
    }

    return sourceData;
  };

  const buildCsvRowsWithHeader = (sourceData) => {
    const header = sourceData[0];
    const indexes = header.reduce((acc, name, i) => {
      acc[name.toLowerCase()] = i;
      return acc;
    }, {});
    const missingAttrs = [];
    const indexMapping = contextDetail.attributes.map((attribute) => {
      const name = attribute.attributeName;
      const index = indexes[name.toLowerCase()];
      if (index === undefined) {
        missingAttrs.push(name);
      }
      return index;
    });
    if (missingAttrs.length > 0) {
      ErrorNotification({
        message: messages.context.attributesMissing(missingAttrs),
      });
      return null;
    }
    const sourceDataRows = sourceData.slice(1);
    if (sourceDataRows.length === 0) {
      ErrorNotification({
        message: messages.context.INSUFFICIENT_DATA,
      });
      return null;
    }
    const rows = sourceDataRows.map((row) =>
      indexMapping.map((index) => (index < row.length ? row[index] : '')),
    );
    return rows;
  };

  const handleFileRead = (e) => {
    setSelectingFile(false);
    const content = reader.result;
    const results = readString(content, {
      encoding: 'utf-8',
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    const csvRows = buildCsvRows(results?.data);

    if (csvRows === null) {
      return;
    }

    const payload = {
      contextName: contextName,
      data: csvRows,
    };
    uploadContextData(payload);
  };

  const maxFileSize =
    MAX_FILE_MEGABYTES >= 1024
      ? `${MAX_FILE_MEGABYTES / 1024} GB`
      : `${MAX_FILE_MEGABYTES} MB`;

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    className: 'upload-csv-data',
    beforeUpload: () => false,
    onChange({ file }) {
      const { status, name } = file;

      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        ErrorNotification({
          message: messages.context.UPLOAD_ALLOWED_FILE_TYPE,
        });
        return;
      }
      if (fileSizeInMb(file.size) >= MAX_FILE_MEGABYTES) {
        ErrorNotification({
          message: messages.context.maxFileUploadSize(maxFileSize),
        });
        return;
      }

      if (status === 'removed') {
        ErrorNotification({
          message: messages.context.FILE_REMOVED,
        });
        return;
      }

      setFileName(name);
      reader = new FileReader();
      reader.onloadend = handleFileRead;
      reader.readAsBinaryString(file);
    },
  };

  return (
    <div className={css(styles.Wrapper)}>
      <div className={css(styles.label)}></div>
      {uploadingData ? (
        <div className={css(styles.uploadingWrapper)}>
          <span className={css(styles.uploadingLabel)}>
            Uploading
            <ThreeDotAnimation />
          </span>
        </div>
      ) : uploadingDone ? (
        <div className={css(styles.uploadedWrapper)}>
          Uploaded <span className={css(styles.uploadedLabel)}>{fileName}</span>
        </div>
      ) : (
        <>
          <Button
            type={'primary'}
            disabled={contextDetailModified || flowSpecsModified}
            onClick={() => {
              setSelectingFile(true);
            }}
          >
            Upload CSV Data
          </Button>
          {selectingFile && (
            <Modal
              wrapClassName="confirmation-modal"
              visible={true}
              footer={null}
              onCancel={() => setSelectingFile(false)}
            >
              <div className={css(styles.uploadDialogWrapper)}>
                <div className={css(styles.uploadingHeaderSwitchWrapper)}>
                  <div>Is first row header?</div>
                  <SwitchWrapper
                    checked={isFirstRowHeader}
                    onChange={setIsFirstRowHeader}
                  />
                </div>
                <Dragger
                  {...uploadProps}
                  className={css(commonStyles.dragPanel)}
                >
                  <img src={uploadCloud} alt="" />
                  <p className={css(commonStyles.dragPanelDescription)}>
                    Click or drag CSV file to this area to upload
                  </p>
                  <p className={css(commonStyles.dragPanelDescription)}>
                    Maximum file size is {maxFileSize}
                  </p>
                </Dragger>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

UploadContextEntries.propTypes = {
  uploadingData: PropTypes.bool,
  contextDetail: PropTypes.object,
  uploadContextData: PropTypes.func,
  contextDetailModified: PropTypes.bool,
  flowSpecsModified: PropTypes.bool,
};

const mapDispatchToProps = {
  uploadContextData,
};

const mapStateToProps = (state) => {
  const {
    uploadingData,
    contextDetail,
    contextDetailModified,
    flowSpecsModified,
  } = state.contextDetail;

  return {
    uploadingData,
    contextDetail,
    contextDetailModified,
    flowSpecsModified,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadContextEntries);
