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
import { css } from 'aphrodite';
import commonStyles from 'app/styles/commonStyles';
import MultiSelect from 'components/react-multi-select/src';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { unsetValidationError } from '../actions';
import styles from '../RightPanelEnrichmentTabContent/styles';
import { renderLabel } from '../utils';
import FeatureStyles from './styles';

const AttributeToQueryBy = ({
  selectedFeature,
  updateSelectedFeature,
  list = [],
  validationErrors,
  unsetValidationError,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedDimensions, setSelectedDimensions] = useState([]);
  const [violations, setViolations] = useState({});

  useEffect(() => {
    setSelectedAttributes(selectedFeature?.attributes || []);
  }, [selectedFeature?.attributes]);

  useEffect(() => {
    setSelectedDimensions(selectedFeature?.dimensions || []);
  }, [selectedFeature?.dimensions]);

  useEffect(() => {
    setViolations(
      (validationErrors.features || {})[selectedFeature._id]?.dimensions || {},
    );
  }, [selectedFeature._id, validationErrors]);

  let availableItem = list
    .filter((entity) => {
      return !selectedAttributes.includes(entity);
    })
    .map((item) => {
      return { label: item, value: item };
    });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const updatedDimension = reorder(
      selectedDimensions,
      result.source.index,
      result.destination.index,
    );

    setSelectedDimensions(updatedDimension);
    updateSelectedFeature({
      ...selectedFeature,
      dimensions: updatedDimension,
    });
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: '4px',
    // change background colour if dragging
    background: isDragging ? 'lightGray' : 'transparent',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={css(FeatureStyles.panelWrapper)}>
        <div className={css(FeatureStyles.row)}>
          {renderLabel('Attributes', violations?.__global)}
          <MultiSelect
            options={availableItem}
            selected={selectedDimensions}
            onSelectedChanged={(selected) => {
              setSelectedDimensions(selected);
            }}
            onDropdownToggle={(bool) => {
              if (!bool) {
                updateSelectedFeature({
                  ...selectedFeature,
                  dimensions: selectedDimensions,
                });
              }
            }}
            valueRenderer={(selected, options) => {
              if (selected.length > 2) {
                return `${selected[0]}, ${selected[0]} +${
                  selected.length - 2
                } more`;
              } else {
                return selected.join(',');
              }
            }}
          />
        </div>
        <Droppable droppableId="attributeToQueryDroppable">
          {(provided, snapshot) => (
            <div
              className={css(styles.attributeItem)}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {selectedDimensions.map((item, index) => {
                return (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={css(FeatureStyles.attributeItem)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        {renderLabel(item, violations[item])}
                        <div className={css(FeatureStyles.iconWrapper)}>
                          <i
                            className={`icon-move ${css(commonStyles.icon)}`}
                          />
                          <i
                            className={`icon-trash ${css(commonStyles.icon)}`}
                            onClick={() => {
                              const updatedDimension =
                                selectedDimensions.filter(
                                  (entity) => entity !== item,
                                );
                              unsetValidationError([
                                'features',
                                selectedFeature._id,
                                'dimensions',
                                item,
                              ]);
                              setSelectedDimensions(updatedDimension);
                              updateSelectedFeature({
                                ...selectedFeature,
                                dimensions: updatedDimension,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

AttributeToQueryBy.propTypes = {
  list: PropTypes.array,
  selectedFeature: PropTypes.instanceOf(Object),
  updateSelectedFeature: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { validationErrors } = state.signalDetail;
  return { validationErrors };
};

const mapDispatchToProps = { unsetValidationError };

export default connect(mapStateToProps, mapDispatchToProps)(AttributeToQueryBy);
