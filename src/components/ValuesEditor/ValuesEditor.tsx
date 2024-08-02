import { FieldType } from '@grafana/data';
import { Button, ButtonGroup, Icon, IconButton, InlineField, InlineFieldRow, useStyles2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TEST_IDS } from '../../constants';
import { DataFrameModel, ModelRow, NullableString } from '../../types';
import { reorder } from '../../utils';
import { ValueInput } from '../ValueInput';
import { getStyles } from './ValuesEditor.style';
/**
 * Properties
 */
interface Props {
  /**
   * Model
   *
   * @type {DataFrameModel}
   */
  model: DataFrameModel;

  /**
   * On Change
   */
  onChange: (value: DataFrameModel) => void;
}

/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggables
   */
  ...draggableStyle,
});

/**
 * Values Editor
 */
export const ValuesEditor = ({ model, onChange }: Props) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  /**
   * Create another object to prevent mutations
   */
  const createUpdatedModel = useCallback(() => {
    return {
      ...model,
      rows: [...model.rows],
    };
  }, [model]);

  /**
   * Toggle collapse state for item
   */
  const onToggleItem = useCallback((row: ModelRow) => {
    setCollapseState((prev) => ({
      ...prev,
      [row.id]: !prev[row.id],
    }));
  }, []);

  /**
   * Toggle collapse state for all item
   */
  const onToggleAllItems = useCallback(
    (isOpen: boolean) => {
      const ids = model.rows.reduce((acc, item) => {
        return { ...acc, [item.id]: isOpen };
      }, {});

      setCollapseState(ids);
    },
    [model.rows]
  );

  /**
   * Add Row
   */
  const addRow = useCallback(
    (index: number) => {
      /**
       * New Row
       */
      const newRow = {
        value: Array.from({ length: model.fields.length }).map((field, i) => {
          switch (model.fields[i].type) {
            case FieldType.number:
              return '0';
            case FieldType.time:
              return Date.now().valueOf().toString();
            case FieldType.boolean:
              return 'false';
            default:
              return '';
          }
        }),
        id: uuidv4(),
      };

      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Add Row
       */
      updatedModel.rows.splice(index + 1, 0, newRow);

      /**
       * Change
       */
      onToggleItem(newRow);
      onChange(updatedModel);
    },
    [createUpdatedModel, model.fields, onChange, onToggleItem]
  );

  /**
   * Remove Row
   */
  const removeRow = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Remove
       */
      updatedModel.rows.splice(index, 1);

      /**
       * Change
       */
      onChange(updatedModel);
    },
    [createUpdatedModel, onChange]
  );

  /**
   * Duplicate Row
   */
  const duplicateRow = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Clone
       */

      const cloneRow = {
        value: JSON.parse(JSON.stringify(updatedModel.rows[index].value)),
        id: uuidv4(),
      };

      updatedModel.rows.splice(index + 1, 0, cloneRow);

      /**
       * Change
       */
      onToggleItem(cloneRow);
      onChange(updatedModel);
    },
    [createUpdatedModel, onChange, onToggleItem]
  );

  /**
   * Edit Value
   */
  const editValue = useCallback(
    (value: NullableString, rowIndex: number, fieldIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Update
       */
      updatedModel.rows[rowIndex].value[fieldIndex] = value;

      /**
       * Change
       */
      onChange(updatedModel);
    },
    [createUpdatedModel, onChange]
  );

  /**
   * Drag End
   */
  const onDragEnd = useCallback(
    (result: DropResult) => {
      /**
       * Dropped outside the list
       */
      if (!result.destination) {
        return;
      }

      /**
       * Сreate rows with the new order
       */
      const newRows = reorder(model.rows, result.source.index, result.destination.index);

      /**
       * Set updated rows
       */
      const updatedModel = {
        ...model,
        rows: newRows,
      };

      /**
       * Change
       */
      onChange(updatedModel);
    },
    [model, onChange]
  );

  /**
   * No rows found
   */
  if (!model.rows.length) {
    return (
      <InlineFieldRow>
        <InlineField>
          <Button variant="primary" onClick={() => addRow(0)} icon="plus" data-testid={TEST_IDS.valuesEditor.buttonAdd}>
            Add a Row
          </Button>
        </InlineField>
      </InlineFieldRow>
    );
  }

  /**
   * Display rows
   */
  return (
    <div data-testid={TEST_IDS.valuesEditor.root}>
      <div className={styles.header}>
        <ButtonGroup>
          <Button
            icon="angle-double-down"
            tooltip="Expand all rows"
            tooltipPlacement="top"
            variant="secondary"
            onClick={() => onToggleAllItems(true)}
            data-testid={TEST_IDS.valuesEditor.buttonExpandAll}
          />
          <Button
            icon="angle-double-up"
            tooltip="Collapse all rows"
            tooltipPlacement="top"
            variant="secondary"
            onClick={() => onToggleAllItems(false)}
            data-testid={TEST_IDS.valuesEditor.buttonCollapseAll}
          />
        </ButtonGroup>
        <Button
          variant="primary"
          title="Add Field"
          icon="plus"
          data-testid={TEST_IDS.valuesEditor.buttonAdd}
          onClick={() => addRow(model.rows.length ? model.rows.length - 1 : 0)}
        >
          Add a Row
        </Button>{' '}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dataset">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {model.rows.map((row, i) => (
                <Draggable disableInteractiveElementBlocking={false} draggableId={`draggable-${i}`} key={i} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      className={styles.field}
                    >
                      <Collapse
                        headerTestId={TEST_IDS.valuesEditor.itemHeader(row.id)}
                        contentTestId={TEST_IDS.valuesEditor.itemContent(row.id)}
                        fill="solid"
                        isOpen={collapseState[row.id]}
                        onToggle={() => onToggleItem(row)}
                        title={<>#{i + 1}</>}
                        actions={
                          <div className={styles.buttons}>
                            <IconButton
                              name="copy"
                              tooltip="Copy row"
                              variant="secondary"
                              aria-label="Copy row"
                              data-testid={TEST_IDS.valuesEditor.buttonCopy}
                              onClick={() => duplicateRow(i)}
                            />
                            <IconButton
                              name="trash-alt"
                              size="md"
                              tooltip="Remove row"
                              variant="secondary"
                              aria-label="Remove row"
                              data-testid={TEST_IDS.valuesEditor.buttonRemove}
                              onClick={() => removeRow(i)}
                            />
                            <div {...provided.dragHandleProps} className={styles.dragIcon}>
                              <Icon title="Drag and drop to reorder" name="draggabledots" />
                            </div>
                          </div>
                        }
                      >
                        <InlineFieldRow data-testid={TEST_IDS.valuesEditor.row}>
                          <div className={styles.controls}>
                            {row.value.map((value: NullableString, index: number) => (
                              <ValueInput
                                key={index}
                                value={value}
                                type={model.fields[index].type}
                                label={model.fields[index].name}
                                onChange={(value) => editValue(value, i, index)}
                              />
                            ))}
                          </div>
                        </InlineFieldRow>
                      </Collapse>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        className={styles.add}
        variant="primary"
        title="Add Field"
        icon="plus"
        data-testid={TEST_IDS.valuesEditor.buttonAdd}
        onClick={() => addRow(model.rows.length ? model.rows.length - 1 : 0)}
      >
        Add a Row
      </Button>
    </div>
  );
};
