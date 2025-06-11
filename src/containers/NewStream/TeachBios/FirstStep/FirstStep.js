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
import { Dropdown, Menu, Upload } from 'antdlatest';
import { css } from 'aphrodite';
import { useState } from 'react';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';
import { readString } from 'react-papaparse';

import commonStyles from 'app/styles/commonStyles';
import fileImage from 'app/styles/svg-src/File.svg';
import CustomSwitch from 'components/CustomSwitch';
import LineBreak from 'components/LineBreak';
import { Input, Tabs } from 'containers/components';
import Actions from 'containers/Onboarding/components/Actions';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import Footer from './components/Footer';
import JsonTitle from './components/JsonTitle';
import MicroservicesFunction from './components/MicroservicesFunction';
import styles from './styles';
import { applyTransformations } from './utils';

const { Dragger } = Upload;

const FirstStep = ({
  userCustomAttribute,
  onchange,
  onLoadTeachBios,
  fileContent,
  streamType,
  hideStreamTypeSwitch,
  updateFileContent,
  updateFileName,
  backLinkClick,
  teachBiosLoading,
  updateFlowMapping,
  prependKeySeparator,
  selectedType,
  selectedArrayToProcess,
  selectedTab,
  jsonValue,
  validJson,
  activeTransFormations,
  updateSelectedType,
  updateSelectedTab,
  updateJSONValue,
  updateValidJSON,
  updatePrependKeySeparator,
  updateActiveTransformations,
  parentFlow,
  onCancel,
  onBack,
}) => {
  const [attributeSelect, setAttributeSelect] = useState(
    selectedArrayToProcess,
  );

  let reader = null;
  const handleFileRead = (e) => {
    const content = reader.result;
    if (selectedTab === 'json_file') {
      const json = JSON.parse(content);
      updateValidJSON(true);
      updateFileContent(json);
    } else {
      const results = readString(content, {
        encoding: 'utf-8',
      });
      const columnCount = results?.data?.[0]?.length;
      const CSVData = results?.data.filter((row) => {
        if (row.length !== columnCount) {
          return false;
        } else {
          return true;
        }
      });
      if (CSVData.length === 0) {
        ErrorNotification({
          message:
            'Insufficient data to process, Missing columns in specified file',
        });
        return;
      } else if (CSVData.length > 100) {
        updateValidJSON(true);
        updateFileContent(CSVData.slice(0, 100));
      } else {
        updateValidJSON(true);
        updateFileContent(CSVData);
      }
    }
  };

  const isValidJson = (json) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onJSONEditorChange = (value) => {
    updateJSONValue(value);
    const isValid = isValidJson(value);
    updateValidJSON(isValid);
  };

  const transformJson = (json) => {
    let fields = [];
    let csv = '';
    const replacer = function (key, value) {
      return value === null ? '' : value;
    };
    json = Array.isArray(json) ? json : [json];
    json.forEach((obj) => {
      fields = [...fields, ...Object.keys(obj)];
    });
    fields = [...new Set(fields)];
    csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(',');
    });
    csv = csv.join('\r\n');
    return {
      fields,
      csv,
    };
  };

  const onNextButtonClick = () => {
    if (selectedType === 'csv') {
      if (fileContent) {
        onLoadTeachBios &&
          onLoadTeachBios({
            type: 'file-upload',
            data: {
              fileContent,
              activeTransFormations,
            },
          });
      } else {
        let inputData = userCustomAttribute && userCustomAttribute.split(',');
        let isEmpty = userCustomAttribute === '';
        let isValid = !isEmpty;
        if (isValid) {
          const finalData = applyTransformations(
            inputData,
            selectedType,
            activeTransFormations,
          );
          onLoadTeachBios &&
            onLoadTeachBios({
              type: 'custom-attributes',
              data: finalData.jsObject.toString(),
            });
        } else {
          let msg = '';
          if (isEmpty) {
            msg = messages.teachBios.EMPTY_ATTRIBUTE_INPUT;
          }
          ErrorNotification({
            message: msg,
          });
        }
      }
    } else if (selectedType === 'json') {
      const jsObject = fileContent ? fileContent : JSON.parse(jsonValue);
      const result = applyTransformations(
        jsObject,
        selectedType,
        activeTransFormations,
        attributeSelect,
        prependKeySeparator,
      );
      if (result) {
        const { jsObject: finalJsObject, flowMapping } = result;
        updateFlowMapping({
          flowMapping: { ...flowMapping, attributeSearch: attributeSelect },
        });
        if (finalJsObject) {
          const { csv: string, fields } = transformJson(finalJsObject);
          onLoadTeachBios({
            type: 'json',
            data: string,
            fields,
            flowMapping,
          });
        }
      }
    }
  };

  const csvDragProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: () => false,
    onChange: (info) => {
      const { status } = info.file;
      if (info.file !== undefined && status !== 'removed') {
        reader = new FileReader();
        reader.onloadend = handleFileRead;
        reader.readAsBinaryString(info.file);
        updateFileName(info.file.name);
      }
    },
  };

  const jsonDragProps = {
    name: 'file',
    multiple: false,
    accept: '.json',
    beforeUpload: () => false,
    onChange: (info) => {
      const { status } = info.file;
      if (info.file !== undefined && status !== 'removed') {
        reader = new FileReader();
        reader.onloadend = handleFileRead;
        reader.readAsText(info.file);
        updateFileName(info.file.name);
      }
    },
  };

  const isScalarArray = (arr) => {
    return arr.every(
      (entity) => typeof entity === 'string' || typeof entity === 'number',
    );
  };

  const findAllObjectKeys = (object) => {
    let result = [];

    const recurse = (item, parent = []) => {
      //Check for scalar values
      if (Object(item) !== item) {
        return;
      }
      for (const i in item) {
        if (item.hasOwnProperty(i)) {
          if (Array.isArray(item[i]) && !isScalarArray(item[i])) {
            //Process Array objects excluding array with scalar values
            result = [...result, { name: i, path: [...parent, i] }];
            item[i].forEach((entity) => {
              recurse(entity, [...parent, i]);
            });
          } else {
            //Process Object
            if (!(Object(item[i]) !== item[i])) {
              recurse(item[i], [...parent, i]);
            }
          }
        }
      }
    };
    recurse(object, []);
    const map = {};
    return result.filter((item) => {
      if (map.hasOwnProperty(item.name)) {
        return false;
      } else {
        map[item.name] = item.path;
        return true;
      }
    });
  };

  const jsonTabsConfig = {
    defaultTab: selectedTab,
    tabs: [
      {
        label: 'Paste Examples',
        key: 'json_inline',
        content: () => {
          let dropdownList = [];
          if (selectedType === 'json' && selectedTab === 'json_inline') {
            try {
              const json = JSON.parse(jsonValue);
              dropdownList = findAllObjectKeys(json);

              //Clear out selected item when JSON is changed and no longer contains the selected item
              if (
                attributeSelect &&
                attributeSelect.name &&
                !dropdownList.some((item) => {
                  return item?.name === attributeSelect?.name;
                })
              ) {
                updateFlowMapping({
                  selectedArrayToProcess: null,
                });
                setAttributeSelect(null);
              }

              //Add clear selection option
              if (dropdownList.length > 0) {
                dropdownList = [{ name: 'None' }, ...dropdownList];
              }
            } catch (e) {
              dropdownList = [];
            }
          }

          const menu = (
            <Menu
              className={css(commonStyles.menuWrapper)}
              onClick={({ key }) => {
                if (key === 'None') {
                  updateFlowMapping({
                    selectedArrayToProcess: null,
                  });
                  setAttributeSelect(null);
                } else {
                  const selectedItem = dropdownList.filter(
                    (entity) => entity.name === key,
                  );
                  updateFlowMapping({
                    selectedArrayToProcess: selectedItem?.[0],
                  });
                  setAttributeSelect(selectedItem?.[0]);
                }
              }}
            >
              {dropdownList.map((item) => {
                return (
                  <Menu.Item key={item.name} path={item.path}>
                    {item.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          );

          return (
            <>
              <MicroservicesFunction
                prependKeySeparator={prependKeySeparator}
                updatePrependKeySeparator={updatePrependKeySeparator}
                hideStreamTypeSwitch={hideStreamTypeSwitch}
                selectedTab={selectedTab}
                selectedType={selectedType}
                activeTransFormations={activeTransFormations}
                setActiveTransFormations={updateActiveTransformations}
                jsonValue={jsonValue}
              />
              {activeTransFormations.includes(1) && dropdownList.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'calc(50% - 70px) 250px',
                    marginBottom: '30px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      columnGap: '15px',
                      alignItems: 'center',
                      color: 'rgb(43, 40, 38)',
                      fontSize: '14px',
                    }}
                  >
                    Select Array to process
                  </div>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <div
                      style={{
                        width: '100%',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid rgb(221, 221, 221)',
                        background: 'transparent',
                        borderRadius: '5px',
                        padding: '0px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        {attributeSelect?.name
                          ? attributeSelect.name
                          : 'Select'}
                      </div>
                      <i className="icon-chevron-down" />
                    </div>
                  </Dropdown>
                </div>
              )}

              <JsonTitle
                validJson={validJson}
                jsonValue={jsonValue}
                style={{ marginTop: '100px' }}
              />
              <AceEditor
                className={css(styles.jsonEditor)}
                mode="json"
                theme="tomorrow"
                name="jsonEditor"
                onLoad={() => {}}
                onChange={onJSONEditorChange}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={false}
                value={jsonValue}
                width="100%"
                height="350px"
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </>
          );
        },
      },
      {
        label: 'Upload Examples',
        key: 'json_file',
        content: () => {
          return (
            <>
              <MicroservicesFunction
                prependKeySeparator={prependKeySeparator}
                updatePrependKeySeparator={updatePrependKeySeparator}
                hideStreamTypeSwitch={hideStreamTypeSwitch}
                selectedTab={selectedTab}
                selectedType={selectedType}
                activeTransFormations={activeTransFormations}
                setActiveTransFormations={updateActiveTransformations}
                jsonValue={jsonValue}
              />
              <Dragger {...jsonDragProps} className={css(styles.dragPanel)}>
                <div className={css(styles.secondMethod)}>
                  <img
                    src={fileImage}
                    className={css(styles.importFileImage)}
                    alt=""
                  />
                  <div className={css(styles.description)}>
                    Click or drag your file (.JSON) here (maximum 1000 examples)
                  </div>
                  <div className={css(styles.description)}>
                    <b>NOTE: Example data will not be stored</b>
                  </div>
                </div>
              </Dragger>
              <div className={css(styles.description)}></div>
            </>
          );
        },
      },
    ],
  };

  const tabsConfig = {
    defaultTab: selectedTab,
    tabs: [
      {
        label: 'Paste Examples',
        key: 'csv_inline',
        content: () => {
          return (
            <>
              <MicroservicesFunction
                hideStreamTypeSwitch={hideStreamTypeSwitch}
                selectedTab={selectedTab}
                selectedType={selectedType}
                activeTransFormations={activeTransFormations}
                setActiveTransFormations={updateActiveTransformations}
              />
              <div
                style={{
                  marginTop: '100px',
                }}
              >
                Teach bi(OS) by example - use comma-separated attributes
              </div>
              <div className={`ts_teachbios ${css(styles.inputWrapper)}`}>
                <Input
                  placeholder="Example: 100, male, https://bios.isima.io/, 9920800, 192.168.0.0.4"
                  hideSuffix={true}
                  onChange={(e) => {
                    let value = e.target.value;
                    onchange && onchange(value);
                  }}
                />
              </div>
            </>
          );
        },
      },
      {
        label: 'Upload Examples',
        key: 'csv_file',
        content: () => {
          return (
            <>
              <MicroservicesFunction
                hideStreamTypeSwitch={hideStreamTypeSwitch}
                selectedTab={selectedTab}
                selectedType={selectedType}
                activeTransFormations={activeTransFormations}
                setActiveTransFormations={updateActiveTransformations}
              />
              <Dragger {...csvDragProps} className={css(styles.dragPanel)}>
                <div className={css(styles.secondMethod)}>
                  <img
                    src={fileImage}
                    className={css(styles.importFileImage)}
                    alt=""
                  />
                  <div className={css(styles.description)}>
                    Click or drag your file (.CSV) here (maximum 1000 examples)
                  </div>
                  <div className={css(styles.description)}>
                    <b>NOTE: Example data will not be stored</b>
                  </div>
                </div>
              </Dragger>
            </>
          );
        },
      },
    ],
  };

  const isNextCTADisabled = () => {
    let disableNextCTA = false;
    if (selectedTab === 'json_inline') {
      disableNextCTA = !validJson || jsonValue === '{}' || jsonValue === '[]';
    } else if (selectedTab === 'json_file') {
      disableNextCTA = fileContent === null || !validJson;
    } else if (selectedTab === 'csv_inline') {
      disableNextCTA = userCustomAttribute === '';
    } else if (selectedTab === 'csv_file') {
      disableNextCTA = fileContent === null;
    }
    return disableNextCTA;
  };

  return (
    <>
      <div className={css(styles.firstMethod)}>
        <div className={css(styles.fileTypeSwitch)}>
          <CustomSwitch
            options={[
              {
                label: 'JSON',
                key: 'json',
                description: null,
              },

              {
                label: 'CSV',
                key: 'csv',
                description: null,
              },
            ]}
            selected={selectedType}
            onChange={(value) => {
              updateSelectedTab(
                value === 'json' ? 'json_inline' : 'csv_inline',
              );
              updateSelectedType(value);
              updateJSONValue(null);
              updateValidJSON(false);
              updateActiveTransformations(value === 'json' ? [3] : [3]);
            }}
          />
        </div>
        <LineBreak height="60px" />
        {selectedType === 'csv' && (
          <Tabs
            tabsConfig={tabsConfig}
            onTabChange={(value) => {
              updateSelectedTab(value);
            }}
          />
        )}

        {selectedType === 'json' && (
          <Tabs
            key={`${selectedType}-${selectedTab}`}
            tabsConfig={jsonTabsConfig}
            onTabChange={(value) => {
              updateSelectedTab(value);
            }}
          />
        )}
      </div>

      {parentFlow === 'onboarding' ? (
        <Actions
          className={css(styles.mt130)}
          nextDisabled={isNextCTADisabled()}
          nextButtonName="Next"
          onNextClick={onNextButtonClick}
          onBackClick={() => {
            onBack && onBack();
          }}
          onCancel={() => {
            onCancel && onCancel();
          }}
          loading={teachBiosLoading}
        />
      ) : (
        <Footer
          loading={teachBiosLoading}
          onNextClick={onNextButtonClick}
          onCancelClick={() => {
            backLinkClick && backLinkClick();
          }}
          disableNext={isNextCTADisabled()}
        />
      )}
    </>
  );
};

export default FirstStep;
