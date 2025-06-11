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
import { Dropdown, Menu, Radio, Tooltip } from 'antdlatest';
import { css } from 'aphrodite';
import commonStyles from 'app/styles/commonStyles';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { Input, InputNumber } from '../../components';
import styles from '../../SignalDetail/RightPanelEnrichmentTabContent/styles';
import enrichmentStyles from './styles';
import { getAttributeForContext } from './utils/getFillInValue';

const AttributePanel = ({
  contexts,
  selectedAttributes,
  setSelectedAttributes,
  selectedContexts,
  availableAttributesMap,
}) => {
  let availableAttributes = availableAttributesMap?.[selectedContexts?.[0]]
    ? availableAttributesMap[selectedContexts[0]]
    : [];

  if (availableAttributes.length > 0) {
    availableAttributes = availableAttributes.filter((attribute) => {
      return !selectedAttributes?.some((entity) => {
        return entity?.source?.[0]?.attribute === attribute.attributeName;
      });
    });
  }

  const onSelectAttribute = (key) => {
    const attrs = [
      ...selectedAttributes,
      {
        alias: '',
        fillIn: '',
        source: [
          {
            context: selectedContexts[0],
            attribute: key,
            _id: shortid.generate(),
          },
        ],
        minimize: false,
        _id: shortid.generate(),
      },
    ];
    setSelectedAttributes(attrs);
  };

  const expandAttribute = (entity) => {
    setSelectedAttributes(
      selectedAttributes?.map((attr) =>
        attr._id === entity._id ? { ...attr, minimize: false } : attr,
      ),
    );
  };

  const minimizeAttribute = (entity) => {
    setSelectedAttributes(
      selectedAttributes?.map((attr) =>
        attr._id === entity._id ? { ...attr, minimize: true } : attr,
      ),
    );
  };

  const removeAttribute = (entity) => {
    setSelectedAttributes(
      selectedAttributes?.filter((attr) => attr._id !== entity._id),
    );
  };

  const onAliasUpdate = (event, entity) => {
    const attrs = selectedAttributes?.map((attr) =>
      attr._id === entity._id ? { ...attr, alias: event.target.value } : attr,
    );
    setSelectedAttributes(attrs);
  };

  const onDefaultUpdate = (value, entity) => {
    const attrs = selectedAttributes?.map((attr) =>
      attr._id === entity._id ? { ...attr, fillIn: value } : attr,
    );
    setSelectedAttributes(attrs);
  };

  /*
  const onFillInUpdate = (event, entity) => {
    const attrs = selectedAttributes?.map((attr) =>
      attr._id === entity._id ? { ...attr, fillIn: event.target.value } : attr,
    );
    setSelectedAttributes(attrs);
  };
  */

  const areAttributesReady = availableAttributes?.length > 0;
  const allAttributeSelected =
    availableAttributes?.length === 0 && selectedAttributes?.length > 0;

  const attributeMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        onSelectAttribute(key);
      }}
      disabled={areAttributesReady}
    >
      {availableAttributes.map(({ attributeName }) => {
        return <Menu.Item key={attributeName}>{attributeName}</Menu.Item>;
      })}
    </Menu>
  );

  const getAttributePlaceHolder = () => {
    if (allAttributeSelected) {
      return 'Nothing to select';
    }
    return areAttributesReady ? (
      'Select attribute from the remote context...'
    ) : (
      <div style={{ color: '#f70' }}>Select contexts first</div>
    );
  };

  return (
    <div className={css(enrichmentStyles.enrichmentPanelWrapper)}>
      <div className={css(enrichmentStyles.singleShimSelectAttribute)}>
        <Dropdown
          overlay={attributeMenu}
          trigger={['click']}
          disabled={!areAttributesReady}
        >
          <div className={css(styles.dropdownLabelWrapper)}>
            <div>{getAttributePlaceHolder()}</div>
            <i className="icon-chevron-down" />
          </div>
        </Dropdown>
      </div>

      <div className={css(styles.attributeListWrapper)}>
        {selectedAttributes?.map((entity) => {
          const source = entity.source?.[0]?.attribute;
          const attributeName = entity.alias || source;
          const contextName = entity.source?.[0]?.context;

          const attribute = getAttributeForContext({
            contexts,
            contextName,
            attributeName: source,
          });
          return (
            <>
              <div className={css(styles.attributeListItem)} key={entity._id}>
                <Tooltip title={attributeName}>{source}</Tooltip>

                <div className={css(commonStyles.iconWrapper)}>
                  {entity.minimize ? (
                    <i
                      className={`icon-plus ${css(commonStyles.icon)}`}
                      onClick={() => {
                        expandAttribute(entity);
                      }}
                    />
                  ) : (
                    <i
                      className={`icon-minimize ${css(commonStyles.icon)}`}
                      onClick={() => {
                        minimizeAttribute(entity);
                      }}
                    />
                  )}
                  <i
                    className={`icon-trash ${css(commonStyles.icon)}`}
                    onClick={() => {
                      removeAttribute(entity);
                    }}
                  />
                </div>
              </div>
              {!entity.minimize && (
                <div className={css(styles.row, styles.mt0)}>
                  <div>Alias</div>
                  <Input
                    placeholder="Enter alias..."
                    hideSuffix={true}
                    value={entity.alias}
                    onChange={(event) => {
                      onAliasUpdate(event, entity);
                    }}
                  />
                </div>
              )}

              {!entity.minimize && (
                <div className={css(styles.row, styles.mt0)}>
                  <div>Default</div>
                  {/* <Input
                    placeholder="Enter Default..."
                    hideSuffix={true}
                    value={entity?.fillIn}
                    onChange={(event) => {
                      onDefaultUpdate(event, entity);
                    }}
                  /> */}
                  {attribute?.type === 'String' ? (
                    <Input
                      placeholder="Default value"
                      hideSuffix={true}
                      value={entity?.fillIn}
                      onChange={(event) => {
                        onDefaultUpdate(event?.target?.value, entity);
                      }}
                    />
                  ) : attribute?.type === 'Boolean' ? (
                    <Radio.Group
                      value={entity?.fillIn === 'true'}
                      onChange={(event) => {
                        onDefaultUpdate(event?.target?.value, entity);
                      }}
                      className={css(styles.flexCenter)}
                    >
                      <Radio value={true} className={css(styles.flexCenter)}>
                        True
                      </Radio>

                      <Radio value={false} className={css(styles.flexCenter)}>
                        false
                      </Radio>
                    </Radio.Group>
                  ) : attribute?.type === 'Decimal' ? (
                    <InputNumber
                      key="Decimal"
                      placeholder="Default value"
                      step={0.1}
                      value={entity?.fillIn}
                      onChange={(value) => {
                        onDefaultUpdate(value, entity);
                      }}
                    />
                  ) : (
                    <InputNumber
                      key="Integer"
                      placeholder="Default value"
                      step={1}
                      value={entity?.fillIn}
                      onChange={(value) => {
                        onDefaultUpdate(value, entity);
                      }}
                    />
                  )}
                </div>
              )}
              {/*!entity.minimize && (
                <div className={css(styles.row, styles.mt0)}>
                  <div>Fill-In</div>
                  <Input
                    placeholder="Enter fill-in..."
                    hideSuffix={true}
                    value={entity.fillIn}
                    onChange={(event) => {
                      onFillInUpdate(event, entity);
                    }}
                  />
                </div>
              )*/}
            </>
          );
        })}
      </div>
    </div>
  );
};

AttributePanel.propTypes = {
  selectedAttributes: PropTypes.instanceOf(Object),
  setSelectedAttributes: PropTypes.func,
  selectedContexts: PropTypes.instanceOf(Object),
  contexts: PropTypes.instanceOf(Object),
  availableAttributesMap: PropTypes.instanceOf(Object),
};

export default AttributePanel;
