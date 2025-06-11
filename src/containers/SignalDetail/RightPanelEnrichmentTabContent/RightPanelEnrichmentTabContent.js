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
import { Dropdown, Menu } from 'antdlatest';
import { css } from 'aphrodite';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import commonStyles from 'app/styles/commonStyles';
import { useDeviceDetect } from 'common/hooks';
import SwitchWrapper from 'components/Switch';
import { Capsule, Header, Input } from 'containers/components';
import { updateSignalDetail } from 'containers/SignalDetail/actions';
import { ErrorNotification } from 'containers/utils';
import messages from 'utils/notificationMessages';
import EnrichmentHeader from './EnrichmentHeader';
import styles from './styles';

const RightPanelEnrichmentTabContent = ({
  // Data props
  history,
  contexts,
  selectedEnrichment,
  setShowRightPanel,
  signalDetail,

  //Methods props
  updateSignalDetail,
  setSelectedFeature,
  setSelectedEnrichment,
  setSelectedAttribute,
}) => {
  const isMobile = useDeviceDetect();

  let KeyList = [];
  let contextAttribute = [];
  let selectedContext = null;
  if (selectedEnrichment?.contextName) {
    let primaryKey = null;
    let selectedAttribute = null;

    selectedContext = contexts.find((item) => {
      return item.contextName === selectedEnrichment.contextName;
    });
    if (selectedContext) {
      primaryKey = selectedContext?.primaryKey?.[0];

      selectedAttribute = selectedContext?.attributes.find((attribute) => {
        return attribute.attributeName === primaryKey;
      });

      contextAttribute = selectedContext?.attributes.slice(1).map((att) => {
        return {
          attributeName: att.attributeName,
        };
      });

      // Get context enrichment attributes
      let contextEnrichedAttributes =
        selectedContext?.enrichments &&
        Array.isArray(selectedContext.enrichments)
          ? selectedContext.enrichments.reduce((accumulator, enrichment) => {
              let temp = enrichment?.enrichedAttributes.reduce((acc, attr) => {
                if (attr.hasOwnProperty('value')) {
                  const attributeValue = attr?.value?.split('.')?.[1];
                  const alias = attr?.as;
                  alias ? acc.push(alias) : acc.push(attributeValue);
                } else if (attr.hasOwnProperty('valuePickFirst')) {
                  const attributeValue = '';
                  const alias = attr?.as;
                  alias ? acc.push(alias) : acc.push(attributeValue);
                }
                return acc;
              }, []);
              accumulator = accumulator.concat(temp);
              return accumulator;
            }, [])
          : [];

      if (contextEnrichedAttributes.length > 0) {
        contextEnrichedAttributes = contextEnrichedAttributes.map((att) => {
          return {
            attributeName: att,
          };
        });
        contextAttribute = [...contextAttribute, ...contextEnrichedAttributes];
      }

      contextAttribute = contextAttribute.filter((attr) => {
        let itemMatched = selectedEnrichment.contextAttributes.find((item) => {
          return item.attributeName === attr.attributeName;
        });
        return !itemMatched;
      });

      KeyList = signalDetail?.attributes.filter((attribute, index) => {
        if (
          selectedAttribute.hasOwnProperty('allowedValues') &&
          attribute.hasOwnProperty('allowedValues') &&
          selectedAttribute.type === attribute.type
        ) {
          return true;
        }
        if (
          !selectedAttribute.hasOwnProperty('allowedValues') &&
          !attribute.hasOwnProperty('allowedValues') &&
          selectedAttribute.type === attribute.type
        ) {
          return true;
        }
        return false;
      });

      // Add attributes from enrichments on top of current one or all of them if this is new enrichment
      signalDetail?.enrich?.enrichments?.every((enrichment) => {
        if (enrichment.enrichmentName === selectedEnrichment.enrichmentName) {
          return false;
        }
        const currentContext = contexts.find((context) => {
          return context.contextName === enrichment.contextName;
        });
        enrichment.contextAttributes.forEach((attribute) => {
          currentContext.attributes.forEach((attr) => {
            if (attr.attributeName === attribute.attributeName) {
              if (
                selectedAttribute.hasOwnProperty('allowedValues') &&
                attr.hasOwnProperty('allowedValues') &&
                selectedAttribute.type === attr.type
              ) {
                KeyList.push(attribute);
              }
              if (
                !selectedAttribute.hasOwnProperty('allowedValues') &&
                !attr.hasOwnProperty('allowedValues') &&
                selectedAttribute.type === attr.type
              ) {
                KeyList.push(attribute);
              }
            }
          });
        });
        return true;
      });
    }
  }

  const KeyMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        const enrichment = {
          ...selectedEnrichment,
          foreignKey: [key],
        };
        setSelectedEnrichment(enrichment);
      }}
    >
      {KeyList.map(({ attributeName, as }) => {
        return (
          <Menu.Item key={as ?? attributeName}>{as ?? attributeName}</Menu.Item>
        );
      })}
    </Menu>
  );

  const attributeMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        const enrichment = {
          ...selectedEnrichment,
          contextAttributes: [
            ...selectedEnrichment.contextAttributes,
            {
              attributeName: key,
              minimize: false,
            },
          ],
        };
        setSelectedEnrichment(enrichment);
      }}
    >
      {contextAttribute.map(({ attributeName }) => {
        return <Menu.Item key={attributeName}>{attributeName}</Menu.Item>;
      })}
    </Menu>
  );

  const filteredContext = contexts.filter((context) => {
    if (
      context?.contextName?.includes(':') &&
      context?.contextName?.split(':')?.[0] === signalDetail?.signalName
    ) {
      return false;
    }
    return true;
  });

  const contextMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        const enrichment = {
          ...selectedEnrichment,
          contextName: key,
          foreignKey: [],
          contextAttributes: [],
        };
        setSelectedEnrichment(enrichment);
      }}
    >
      {filteredContext.map(({ contextName }) => {
        return <Menu.Item key={contextName}>{contextName}</Menu.Item>;
      })}
    </Menu>
  );

  const onUseFillInChange = (checked) => {
    if (!signalDetail) {
      return;
    }
    if (signalDetail.isNewEntry === true) {
      const enrichment = {
        ...selectedEnrichment,
        missingLookupPolicy: checked ? 'StoreFillInValue' : 'Reject',
      };
      setSelectedEnrichment(enrichment);
    } else {
      ErrorNotification({
        message: messages.signal.TURN_OFF_FILL_IN_FOR_ENRICHMENT,
      });
    }
  };

  const expandEnrichmentAttribute = (attribute) => {
    const updatedEnrichment = {
      ...selectedEnrichment,
      contextAttributes: selectedEnrichment.contextAttributes.map((item) => {
        if (attribute.attributeName === item.attributeName) {
          item.minimize = false;
        }
        return item;
      }),
    };
    setSelectedEnrichment(updatedEnrichment);
  };

  const minimizeEnrichmentAttribute = (attribute) => {
    const updatedEnrichment = {
      ...selectedEnrichment,
      contextAttributes: selectedEnrichment.contextAttributes.map((item) => {
        if (attribute.attributeName === item.attributeName) {
          item.minimize = true;
        }
        return item;
      }),
    };
    setSelectedEnrichment(updatedEnrichment);
  };

  const deleteEnrichmentAttribute = (attribute) => {
    const updatedEnrichment = {
      ...selectedEnrichment,
      contextAttributes: selectedEnrichment.contextAttributes.filter((item) => {
        return attribute.attributeName !== item.attributeName;
      }),
    };
    setSelectedEnrichment(updatedEnrichment);
  };

  const onAliasChange = (event, attribute) => {
    const updatedEnrichment = {
      ...selectedEnrichment,
      contextAttributes: selectedEnrichment.contextAttributes.map((item) => {
        if (attribute.attributeName === item.attributeName) {
          item.as = event.target.value;
        }
        return item;
      }),
    };
    setSelectedEnrichment(updatedEnrichment);
  };

  const onFillInChange = (event, attribute) => {
    const updatedEnrichment = {
      ...selectedEnrichment,
      contextAttributes: selectedEnrichment.contextAttributes.map((item) => {
        if (attribute.attributeName === item.attributeName) {
          item.fillIn = event.target.value;
        }
        return item;
      }),
    };
    setSelectedEnrichment(updatedEnrichment);
  };

  return (
    <div>
      <Header
        title={selectedEnrichment?.enrichmentName}
        backLinkText={isMobile ? null : 'Enrichment'}
        EmptyTitleText="Untitled_Enrichment"
        placeholder="Enrichment name..."
        rightPanel={true}
        onChange={(value) => {
          setSelectedEnrichment({
            ...selectedEnrichment,
            enrichmentName: value,
          });
        }}
        actionPanel={() => {
          return (
            <EnrichmentHeader
              history={history}
              signalDetail={signalDetail}
              setShowRightPanel={setShowRightPanel}
              selectedEnrichment={selectedEnrichment}
              updateSignalDetail={updateSignalDetail}
              setSelectedFeature={setSelectedFeature}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              selectedContext={selectedContext}
              contexts={contexts}
            />
          );
        }}
      />

      <div className={css(styles.wrapper)}>
        <div className={css(styles.row)}>
          <div>Context </div>
          <Dropdown overlay={contextMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>
                {selectedEnrichment?.contextName
                  ? selectedEnrichment?.contextName
                  : 'Select context'}
              </div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>

        <div className={css(styles.row)}>
          <div>Foreign Key</div>
          <Dropdown overlay={KeyMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>
                {selectedEnrichment?.foreignKey?.[0]
                  ? selectedEnrichment?.foreignKey?.[0]
                  : 'Pick a key...'}
              </div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>

        <div className={css(styles.row)}>
          <div>Use Fill In</div>
          <SwitchWrapper
            disabled={signalDetail?.isNewEntry !== true}
            checked={
              signalDetail?.isNewEntry === true
                ? selectedEnrichment.missingLookupPolicy === 'StoreFillInValue'
                : true
            }
            onChange={onUseFillInChange}
            offLabel="NO"
            onLabel="YES"
          />
        </div>

        <div className={css(styles.row)}>
          <div>Attributes</div>
          <Dropdown overlay={attributeMenu} trigger={['click']}>
            <div className={css(styles.dropdownPlaceHolderLabelWrapper)}>
              <div>Add attribute...</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>

        <div className={css(styles.attributeListWrapper)}>
          {selectedEnrichment.contextAttributes.map((attribute) => {
            return (
              <>
                <div className={css(styles.attributeListItem)}>
                  <Capsule
                    text={attribute.attributeName}
                    tooltip={attribute?.as || attribute.attributeName}
                  />
                  <div className={css(commonStyles.iconWrapper)}>
                    {attribute.minimize ? (
                      <i
                        className={`icon-plus ${css(commonStyles.icon)}`}
                        onClick={() => {
                          expandEnrichmentAttribute(attribute);
                        }}
                      />
                    ) : (
                      <i
                        className={`icon-minimize ${css(commonStyles.icon)}`}
                        onClick={() => {
                          minimizeEnrichmentAttribute(attribute);
                        }}
                      />
                    )}
                    <i
                      className={`icon-trash ${css(commonStyles.icon)}`}
                      onClick={() => {
                        deleteEnrichmentAttribute(attribute);
                      }}
                    />
                  </div>
                </div>
                <div className={css(styles.attributeItemSecondRow)}>
                  {!attribute.minimize && (
                    <div className={css(styles.row)}>
                      <div>Alias</div>
                      <Input
                        placeholder="Alias"
                        hideSuffix={true}
                        value={attribute.as}
                        onChange={(event) => {
                          onAliasChange(event, attribute);
                        }}
                      />
                    </div>
                  )}

                  {!attribute.minimize && (
                    <div className={css(styles.row, styles.mt0)}>
                      <div>Fill-In</div>
                      <Input
                        disabled={
                          signalDetail?.isNewEntry === true
                            ? selectedEnrichment.missingLookupPolicy ===
                              'Reject'
                            : false
                        }
                        placeholder="Fill-in value"
                        value={attribute.fillIn}
                        hideSuffix={true}
                        onChange={(event) => {
                          onFillInChange(event, attribute);
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

RightPanelEnrichmentTabContent.propTypes = {
  contexts: PropTypes.instanceOf(Object),
  signalDetail: PropTypes.instanceOf(Object),
  selectedEnrichment: PropTypes.instanceOf(Object),
  setShowRightPanel: PropTypes.func,
  updateSignalDetail: PropTypes.func,
  setSelectedFeature: PropTypes.func,
  setSelectedEnrichment: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
};

const mapDispatchToProps = {
  updateSignalDetail: (payload) => updateSignalDetail(payload),
};

const mapStateToProps = (state) => {
  const { signalDetail } = state.signalDetail;
  const { contexts } = state.contexts;
  return {
    signalDetail,
    contexts,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanelEnrichmentTabContent);
