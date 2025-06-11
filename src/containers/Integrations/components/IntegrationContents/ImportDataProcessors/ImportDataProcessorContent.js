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
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';
import { Modal } from 'antdlatest';
import { Input } from 'containers/components';
import RightPanelHeader from '../../RightPanelHeader';
import { integrationActions } from '../../../reducers';
import { ErrorNotification } from 'containers/utils';
import { getMethodNameFromCode } from './utils';
import messages from 'utils/notificationMessages';
import ipxl from '@bios/ipxl';
import styles from './styles';
import './styles.scss';

const { userClicks } = ipxl;
const {
  setRightPanelActive,
  setProcessDetails,
  setImportDataProcessorsCopy,
  setIntegrationConfig,
} = integrationActions;

function ImportDataProcessorContent({
  setRightPanelActive,
  setProcessDetails,
  processName,
  processCode,
  existingProcess,
  rightPanelType,
  setIntegrationConfig,
  importDataProcessors,
  importDataProcessorsCopy,
  setImportDataProcessorsCopy,
  importFlowSpecs,
  history,
}) {
  const [isSampleCodeVisible, setIsSampleCodeVisible] = useState(false);

  const setProcessName = (newProcessName) => {
    setProcessDetails({ processName: newProcessName });
  };

  const setProcessCode = (newProcessCode) => {
    setProcessDetails({ processCode: newProcessCode });
  };

  // const deleteFile = () => setProcessCode('');

  const saveProcess = () => {
    if (processName === '') {
      ErrorNotification({ message: messages.integration.EMPTY_PROCESS_NAME });
      return;
    }
    if (processCode === '') {
      ErrorNotification({
        message: messages.integration.EMPTY_PROCESS_CODE_FILE,
      });
      return;
    }
    if (getMethodNameFromCode(processCode) === '') {
      ErrorNotification({
        message: messages.integration.PYTHON_CODE_MISSING_FUNCTION,
      });
      return;
    }
    if (existingProcess) {
      const newProcessList = importDataProcessorsCopy?.map((idp) => {
        if (idp?.processorName === processName) {
          return {
            processorName: processName,
            code: processCode,
            shouldUpdate: true,
          };
        }
        return idp;
      });
      setImportDataProcessorsCopy(newProcessList);
    } else {
      // new process
      const newProcess = {
        processorName: processName,
        code: processCode,
        shouldCreate: true,
      };
      setImportDataProcessorsCopy([...importDataProcessorsCopy, newProcess]);
    }
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: existingProcess ? 'Update Process' : `Create Process`,
      rightSection: 'process',
      mainSection: 'integration',
      leftSection: 'integration',
    });
  };

  const deleteDataProcessor = (processorName) => {
    let newDeleteDataProcessor;
    if (
      importDataProcessors?.some((idp) => idp?.processorName === processorName)
    ) {
      newDeleteDataProcessor = importDataProcessorsCopy?.map((processor) => {
        if (processor.processorName === processorName) {
          return {
            ...processor,
            shouldDelete: true,
          };
        }
        return processor;
      });
    } else {
      newDeleteDataProcessor = importDataProcessorsCopy?.filter((processor) => {
        return !(processor?.processorName === processorName);
      });
    }
    userClicks({
      pageURL: history?.location?.pathname,
      pageTitle: document.title,
      pageDomain: window?.location?.origin,
      eventLabel: `Delete Process`,
      rightSection: 'process',
      mainSection: 'integration',
      leftSection: 'integration',
    });
    newDeleteDataProcessor &&
      setImportDataProcessorsCopy(newDeleteDataProcessor);
  };

  return (
    <div>
      <RightPanelHeader
        validateReportName={'no-validation'}
        setRightPanelActive={setRightPanelActive}
        setIntegrationConfig={setIntegrationConfig}
        save={saveProcess}
        name={processName}
        setName={setProcessName}
        rightPanelType={rightPanelType}
        existing={existingProcess}
        placeholder="New Process"
        readOnly={existingProcess}
        deleteItem={() => deleteDataProcessor(processName)}
        importFlowSpecs={importFlowSpecs}
        itemId={processName}
        history={history}
      />
      <div className={css(styles.pythonAddFunc)}>
        <div>Python Module</div>
        <div>
          <i
            className={`icon-expand ${css(styles.pythonIconInfo)}`}
            onClick={() => setIsSampleCodeVisible(true)}
          />
          <Modal
            closeIcon={<i className={`icon-close ${css(styles.closeIcon)}`} />}
            title={
              <div className={css(styles.pythonInputTitle)}>
                {existingProcess ? (
                  <span>processName</span>
                ) : (
                  <Input
                    value={processName}
                    hideSuffix={true}
                    placeholder="New Process"
                    onChange={(event) => setProcessName(event.target.value)}
                    readOnly={existingProcess}
                  />
                )}
              </div>
            }
            visible={isSampleCodeVisible}
            onOk={() => setIsSampleCodeVisible(false)}
            onCancel={() => setIsSampleCodeVisible(false)}
            footer={null}
            width={850}
            wrapClassName="pythonCodeExampleModal"
          >
            <AceEditor
              placeholder="Put your Python code here"
              width=""
              mode="python"
              theme="tomorrow"
              onChange={setProcessCode}
              value={processCode}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </Modal>
        </div>
      </div>
      <div>
        <AceEditor
          placeholder="Put your Python code here"
          width=""
          mode="python"
          theme="tomorrow"
          onChange={setProcessCode}
          value={processCode}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const {
    processName,
    processCode,
    existingProcess,
    rightPanelType,
    importDataProcessors,
    importDataProcessorsCopy,
    importFlowSpecs,
  } = state?.integration?.integrationConfig;
  return {
    processName,
    processCode,
    existingProcess,
    rightPanelType,
    importDataProcessors,
    importDataProcessorsCopy,
    importFlowSpecs,
  };
};

const mapDispatchToProps = {
  setRightPanelActive,
  setProcessDetails,
  setImportDataProcessorsCopy,
  setIntegrationConfig,
};

ImportDataProcessorContent.propTypes = {
  setRightPanelActive: PropTypes.func,
  setProcessDetails: PropTypes.func,
  setImportDataProcessorsCopy: PropTypes.func,
  rightPanelType: PropTypes.string,
  processName: PropTypes.string,
  processCode: PropTypes.string,
  existingProcess: PropTypes.bool,
  importDataProcessors: PropTypes.array,
  importDataProcessorsCopy: PropTypes.array,
  importFlowSpecs: PropTypes.array,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportDataProcessorContent);
