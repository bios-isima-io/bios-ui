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
import commonStyles from 'app/styles/commonStyles';
import { Capsule, Input } from '../../components';
import styles from '../../SignalDetail/RightPanelEnrichmentTabContent/styles';
import enrichmentStyles from './styles';

const MultiShimSingleAttribute = ({
  entity,
  index,
  lastIndex,
  availableAttributesMap,
  onUpdate,
}) => {
  const onAttributeAliasChange = (event, index) => {
    onUpdate({ ...entity, alias: event.target.value });
  };

  const trashAttribute = () => {
    onUpdate({ ...entity, _deleted: true });
  };

  const expandAttribute = (entity) => {
    onUpdate({ ...entity, minimize: false });
  };

  const collapseAttribute = () => {
    onUpdate({ ...entity, minimize: true });
  };

  const onSourceItemContextSelection = (key, index, item) => {
    const nextEntity = {
      ...entity,
      source: entity.source.map((src) =>
        src._id === item._id ? { ...src, attribute: key } : src,
      ),
    };
    onUpdate(nextEntity);
  };

  const getDropdownWithInfo = (index, item) => {
    const originalList = availableAttributesMap?.[item?.context];
    const filterList = [...originalList];

    return (
      <div
        style={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'calc(100% - 40px) 20px',
          gridGap: '20px',
        }}
      >
        <Dropdown
          overlay={
            <Menu
              className={css(commonStyles.menuWrapper)}
              onClick={({ key }) => {
                onSourceItemContextSelection(key, index, item);
              }}
            >
              {filterList?.map(({ attributeName }) => {
                return (
                  <Menu.Item key={attributeName}>{attributeName}</Menu.Item>
                );
              })}
            </Menu>
          }
          trigger={['click']}
        >
          <div className={css(styles.dropdownLabelWrapper)}>
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '85%',
                textOverflow: 'ellipsis',
              }}
            >
              {item?.attribute ? item?.attribute : 'Select attribute'}
            </div>
            <i className="icon-chevron-down" />
          </div>
        </Dropdown>
        {item?.attribute && filterList.length < originalList.length && (
          <i
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              background: '#C4C4C4',
              borderRadius: '50%',
              height: '18px',
              width: '18px',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            className="icon-Info"
          />
        )}
      </div>
    );
  };

  const alias = entity.alias || '(Alias not specified)';

  return !entity.minimize ? (
    <div
      className={css(
        enrichmentStyles.multiShimAddAttributeItem,
        lastIndex && enrichmentStyles.lastMultiShimItem,
      )}
    >
      <div className={css(enrichmentStyles.multiShimAddAttributeFirstRow)}>
        <div>Alias</div>
        <Input
          placeholder="Enter alias..."
          hideSuffix={true}
          value={entity.alias}
          onChange={(event) => {
            onAttributeAliasChange(event, index);
          }}
        />
        <div className={css(commonStyles.iconWrapper)}>
          <i
            className={`icon-minimize ${css(commonStyles.icon)}`}
            onClick={collapseAttribute}
          />
          <i
            className={`icon-trash ${css(commonStyles.icon)}`}
            onClick={trashAttribute}
          />
        </div>
      </div>

      <div className={css(enrichmentStyles.multiShimSourceLabel)}>
        Source Attributes
      </div>

      {entity?.source.map((item) => {
        return (
          <div
            className={css(enrichmentStyles.multiShimSourceItem)}
            key={item._id}
          >
            <Capsule text={item?.context ? item?.context : 'Select context'} />
            {getDropdownWithInfo(index, item)}
          </div>
        );
      })}
    </div>
  ) : (
    <div
      className={css(
        enrichmentStyles.multiShimAddAttributeItem,
        lastIndex && enrichmentStyles.lastMultiShimItem,
      )}
    >
      <div className={css(enrichmentStyles.multiShimSourceItemLabel)}>
        {alias}
        <div className={css(commonStyles.iconWrapper)}>
          <i
            className={`icon-plus ${css(commonStyles.icon)}`}
            onClick={() => {
              expandAttribute(entity);
            }}
          />
          <i
            className={`icon-trash ${css(commonStyles.icon)}`}
            onClick={() => {
              trashAttribute(index);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiShimSingleAttribute;
