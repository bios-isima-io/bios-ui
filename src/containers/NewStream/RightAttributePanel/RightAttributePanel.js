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
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';
import { useDeviceDetect } from 'common/hooks';
import { Header } from 'containers/components';
import SignalBasicProperties from 'containers/SignalDetail/RightPanelAttributeTabContent/BasicProperties';
import SignalAttributeTags from 'containers/SignalDetail/RightPanelAttributeTabContent/AttributeTags';
import ContextBasicProperties from 'containers/ContextDetail/Attribute/BasicProperties';
import ContextAttributeTags from 'containers/ContextDetail/Attribute/AttributeTags';
import CollapsableWrapper from 'containers/components/CollapsableWrapper';
import styles from './styles';
import { cloneDeep } from 'lodash-es';
import { connect } from 'react-redux';

const RightAttributePanel = ({
  tags,
  flowMapping,
  updateFlowMapping,
  attributes,
  setShowRightPanel,
  selectedAttribute,
  setSelectedAttribute,
  streamType,
  signalDetail,
  contextDetail,
  updateAttributes,
  contexts,
}) => {
  const isMobile = useDeviceDetect();
  const [activePanel, setActivePanel] = useState('basic');

  const signalRightPanels = [
    {
      component: (
        <SignalBasicProperties
          selectedAttribute={selectedAttribute}
          isEnriched={false}
          signalDetail={signalDetail}
          setSelectedAttribute={setSelectedAttribute}
        />
      ),
      header: 'Basic Properties',
      key: 'basic',
    },
    {
      component: (
        <SignalAttributeTags
          tags={tags}
          selectedAttribute={selectedAttribute}
          setSelectedAttribute={setSelectedAttribute}
          signalDetail={signalDetail}
          contexts={contexts}
        />
      ),
      header: 'Tags',
      key: 'tags',
    },
  ];

  const contextRightPanels = [
    {
      component: (
        <ContextBasicProperties
          selectedAttribute={selectedAttribute}
          contextDetail={contextDetail}
          setSelectedAttribute={setSelectedAttribute}
        />
      ),
      header: 'Basic Properties',
      key: 'basic',
    },
    {
      component: (
        <ContextAttributeTags
          tags={tags}
          selectedAttribute={selectedAttribute}
          setSelectedAttribute={setSelectedAttribute}
        />
      ),
      header: 'Tags',
      key: 'tags',
    },
  ];

  const applyChanges = () => {
    let selectedIndex = null;
    let prevName = null;
    const updatedAttributes = attributes.map((attribute, index) => {
      if (index === selectedAttribute.index) {
        selectedIndex = selectedAttribute.index;
        prevName = attribute.attributeName;
        const { index, ...temp } = selectedAttribute;
        return temp;
      } else {
        return attribute;
      }
    });
    if (
      flowMapping &&
      updateFlowMapping &&
      selectedIndex !== null &&
      prevName !== selectedAttribute.attributeName
    ) {
      const mapping = cloneDeep(flowMapping);
      const currentAttributeMapping = cloneDeep(mapping.attributeMapping);
      currentAttributeMapping[selectedAttribute.attributeName] = {
        ...currentAttributeMapping[prevName],
        name: selectedAttribute.attributeName,
      };
      delete currentAttributeMapping[prevName];
      const updatedMapping = {
        ...flowMapping,
        attributeMapping: currentAttributeMapping,
      };
      updateFlowMapping({ flowMapping: updatedMapping });
    }
    updateAttributes(updatedAttributes, 'update');
    setShowRightPanel(false);
  };

  const deleteAttribute = () => {
    let prevName = null;
    const updatedAttributes = attributes.filter(
      (attribute, index) => index !== selectedAttribute.index,
    );
    updateAttributes(updatedAttributes);
    if (flowMapping && updateFlowMapping && prevName !== null) {
      const mapping = cloneDeep(flowMapping);
      const currentAttributeMapping = cloneDeep(mapping.attributeMapping);
      delete currentAttributeMapping[prevName];
      const updatedMapping = {
        ...flowMapping,
        attributeMapping: currentAttributeMapping,
      };
      updateFlowMapping({ flowMapping: updatedMapping });
    }
    setSelectedAttribute(null);
    setShowRightPanel(false);
  };

  return (
    <div>
      <Header
        title={selectedAttribute.attributeName}
        backLinkText={isMobile ? null : 'Attribute'}
        EmptyTitleText="Enter name..."
        placeholder="Enter name..."
        rightPanel={true}
        onChange={(value) => {
          setSelectedAttribute({
            ...selectedAttribute,
            attributeName: value,
          });
        }}
        actionPanel={() => {
          return (
            <div
              className={css(styles.actionControlWrapper, styles.threeColGrid)}
            >
              <Tooltip title="Apply">
                <i
                  className={`icon-check ${css(styles.icon)}`}
                  onClick={applyChanges}
                />
              </Tooltip>

              <Tooltip title="Delete">
                <i
                  className={`icon-trash ${css(styles.icon)}`}
                  onClick={deleteAttribute}
                />
              </Tooltip>

              <Tooltip title="Close">
                <i
                  className={`icon-close ${css(styles.icon)}`}
                  onClick={() => {
                    setShowRightPanel(false);
                    setSelectedAttribute(null);
                  }}
                />
              </Tooltip>
            </div>
          );
        }}
      />
      <div className={css(styles.RPWrapper)}>
        <CollapsableWrapper
          activePanel={activePanel}
          panels={
            streamType === 'signal' ? signalRightPanels : contextRightPanels
          }
          setActiveRightPanel={(key) => {
            setActivePanel(key);
          }}
        />
      </div>
    </div>
  );
};

RightAttributePanel.propTypes = {
  selectedAttribute: PropTypes.instanceOf(Object),
  tags: PropTypes.instanceOf(Object),
  attributes: PropTypes.array,
  setShowRightPanel: PropTypes.func,
  setSelectedAttribute: PropTypes.func,
  updateAttributes: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { contexts } = state.contexts;
  return {
    contexts,
  };
};

export default connect(mapStateToProps)(RightAttributePanel);
