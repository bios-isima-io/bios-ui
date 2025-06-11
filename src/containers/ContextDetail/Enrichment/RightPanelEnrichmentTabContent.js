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
import { useDeviceDetect } from 'common/hooks';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Header } from '../../components';
import CollapsableWrapper from '../../components/CollapsableWrapper';
import styles from '../../SignalDetail/RightPanelEnrichmentTabContent/styles';
import { updateContextDetail } from '../actions';
import { getAvailableRemoteContexts, getContextAndAttributes } from '../utils';
import AttributePanel from './AttributePanel';
import ContextPanel from './ContextPanel';
import EnrichmentHeader from './EnrichmentHeader';
import MultiShimAttributePanel from './MultiShimAttributePanel';

const RightPanelEnrichmentTabContent = ({
  selectedEnrichment,
  setShowRightPanel,
  contextDetail,
  updateContextDetail,
  contexts,
  setSelectedEnrichment,
  setSelectedAttribute,
  history,
}) => {
  const isMobile = useDeviceDetect();
  const [activeCarousel, setActiveCarousel] = useState(null);

  const [availableRemoteContexts, setAvailableRemoteContexts] = useState([]);
  const [allAvailableRemoteContexts, setAllAvailableRemoteContexts] = useState(
    {},
  );
  const [remoteContexts, setRemoteContexts] = useState([]);
  const [availableAttributesMap, setAvailableAttributesMap] = useState({});

  const [currentEnrichmentName, setCurrentEnrichmentName] = useState();
  const [currentEnrichedAttributes, setCurrentEnrichedAttributes] = useState(
    [],
  );
  const [currentForeignKey, setCurrentForeignKey] = useState();

  useEffect(() => {
    setCurrentEnrichmentName(selectedEnrichment?.enrichmentName);
  }, [selectedEnrichment?.enrichmentName]);

  useEffect(() => {
    const res = getContextAndAttributes(selectedEnrichment.enrichedAttributes);
    setRemoteContexts(res.remoteContexts);
    setCurrentEnrichedAttributes(res.internalEnrichedAttributes);

    const nextAvailableRemoteContexts = {};
    contextDetail?.attributes?.forEach((attribute) => {
      const remoteContexts = getAvailableRemoteContexts(
        contexts,
        contextDetail,
        [attribute.attributeName],
      );
      if (remoteContexts.length > 0) {
        nextAvailableRemoteContexts[attribute.attributeName] = remoteContexts;
      }
    });
    setAllAvailableRemoteContexts(nextAvailableRemoteContexts);

    const foreignKey = selectedEnrichment?.foreignKey;
    setCurrentForeignKey(foreignKey);
    setAvailableRemoteContexts(nextAvailableRemoteContexts[foreignKey[0]]);

    const availableAttributesMap = {};
    nextAvailableRemoteContexts[foreignKey[0]]?.forEach((context) => {
      if (res.remoteContexts.includes(context.contextName)) {
        availableAttributesMap[context.contextName] =
          context.attributes.slice(1);
      }
    });
    setAvailableAttributesMap(availableAttributesMap);
  }, [
    selectedEnrichment.enrichedAttributes,
    contextDetail,
    contexts,
    selectedEnrichment?.foreignKey,
    selectedEnrichment?.attributes,
  ]);

  const getPossibleForeignKeys = () => {
    return Object.keys(allAvailableRemoteContexts);
  };

  const multiShimEnabled = remoteContexts?.length > 1;

  const addSelectedContext = (addingContext) => {
    const nextRemoteContexts = [...remoteContexts, addingContext];
    setRemoteContexts(nextRemoteContexts);

    const availableAttributesMap = {};
    contexts?.forEach((context) => {
      if (nextRemoteContexts.includes(context.contextName)) {
        availableAttributesMap[context.contextName] =
          context.attributes.slice(1);
      }
    });
    setAvailableAttributesMap(availableAttributesMap);

    const nextEnrichedAttributes = currentEnrichedAttributes.map(
      (attribute) => {
        let ctxs = [...nextRemoteContexts];
        const source = [...attribute.source];
        source.forEach(
          (src) => (ctxs = ctxs.filter((ctx) => ctx !== src.context)),
        );
        ctxs.forEach((ctx) =>
          source.push({
            context: ctx,
            attribute: '',
            _id: shortid.generate(),
          }),
        );
        return { ...attribute, source };
      },
    );
    setCurrentEnrichedAttributes(nextEnrichedAttributes);
  };

  const removeSelectedContext = (context) => {
    const nextEnrichedAttributes = currentEnrichedAttributes?.map(
      (attribute) => {
        return {
          ...attribute,
          source: attribute.source.filter((src) => src.context !== context),
        };
      },
    );
    setCurrentEnrichedAttributes(nextEnrichedAttributes);
    setRemoteContexts(remoteContexts.filter((ctx) => ctx !== context));
  };

  const getContextHeaderLabel = () => {
    let label = 'Context';
    if (remoteContexts.length > 0) {
      if (remoteContexts.length === 1) {
        label = `Context : [${remoteContexts[0]}]`;
      } else {
        label = `Context : [${remoteContexts[0]} +${
          remoteContexts.length - 1
        } more...]`;
      }
    }
    return label;
  };

  const panels = [
    {
      component: (
        <ContextPanel
          selectedContexts={remoteContexts}
          availableRemoteContexts={availableRemoteContexts}
          addContext={addSelectedContext}
          removeContext={removeSelectedContext}
        />
      ),
      header: getContextHeaderLabel(),
      key: 'context',
    },
    {
      component: (
        <div>
          {multiShimEnabled ? (
            <MultiShimAttributePanel
              selectedAttributes={currentEnrichedAttributes}
              setSelectedAttributes={setCurrentEnrichedAttributes}
              selectedContexts={remoteContexts}
              availableAttributesMap={availableAttributesMap}
            />
          ) : (
            <AttributePanel
              contexts={contexts}
              selectedContexts={remoteContexts}
              availableAttributesMap={availableAttributesMap}
              setSelectedEnrichment={setSelectedEnrichment}
              selectedEnrichment={selectedEnrichment}
              setSelectedContexts={setRemoteContexts}
              setSelectedAttributes={setCurrentEnrichedAttributes}
              selectedAttributes={currentEnrichedAttributes}
            />
          )}
        </div>
      ),
      header: 'Attribute(s)',
      key: 'attribute',
    },
  ];

  const KeyMenu = (
    <Menu
      className={css(commonStyles.menuWrapper)}
      onClick={({ key }) => {
        // Ignore when the same key is selected again
        if (key === currentForeignKey) {
          return;
        }

        const nextForeignKey = [key.trim()];
        setCurrentForeignKey(nextForeignKey);
        const nextAvailableRemoteContexts = allAvailableRemoteContexts[key];
        setAvailableRemoteContexts(nextAvailableRemoteContexts);
        const availableAttributesMap = {};
        nextAvailableRemoteContexts?.forEach((context) => {
          if (remoteContexts.includes(context.contextName)) {
            availableAttributesMap[context.contextName] =
              context.attributes.slice(1);
          }
        });
        setAvailableAttributesMap(availableAttributesMap);

        setRemoteContexts([]);
        setCurrentEnrichedAttributes([]);
      }}
    >
      {getPossibleForeignKeys().map((attribute) => {
        return <Menu.Item key={attribute}>{attribute}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div>
      <Header
        title={currentEnrichmentName}
        backLinkText={isMobile ? null : 'Enrichment'}
        EmptyTitleText="Untitled_Enrichment"
        placeholder="Enrichment name..."
        rightPanel={true}
        onChange={(name) => setCurrentEnrichmentName(name.trim())}
        actionPanel={() => {
          return (
            <EnrichmentHeader
              history={history}
              setShowRightPanel={setShowRightPanel}
              contextDetail={contextDetail}
              selectedEnrichment={selectedEnrichment}
              updateContextDetail={updateContextDetail}
              setSelectedEnrichment={setSelectedEnrichment}
              setSelectedAttribute={setSelectedAttribute}
              currentEnrichmentName={currentEnrichmentName}
              currentForeignKey={currentForeignKey}
              currentEnrichedAttributes={currentEnrichedAttributes}
              remoteContexts={remoteContexts}
              contexts={contexts}
            />
          );
        }}
      />
      <div className={css(styles.wrapper)}>
        <div className={css(styles.row)}>
          <div>Foreign Key</div>
          <Dropdown overlay={KeyMenu} trigger={['click']}>
            <div className={css(styles.dropdownLabelWrapper)}>
              <div>{currentForeignKey || 'Pick a key from context...'}</div>
              <i className="icon-chevron-down" />
            </div>
          </Dropdown>
        </div>
        <div>
          <CollapsableWrapper
            activePanel={activeCarousel}
            panels={panels}
            setActiveRightPanel={(val) => {
              setActiveCarousel(val);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateContextDetail: (payload) => updateContextDetail(payload),
};

const mapStateToProps = (state) => {
  const { contextDetail } = state.contextDetail;
  const { contexts } = state.contexts;
  return {
    contextDetail,
    contexts,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanelEnrichmentTabContent);
