import { FieldType } from '@grafana/data';
import { Button, Icon, InlineField, InlineFieldRow, useStyles2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import React, { useCallback } from 'react';

import { TEST_IDS } from '../../constants';
import { DataFrameModel, NullableString, StaticQuery } from '../../types';
import { convertToDataFrame, reorder } from '../../utils';
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
   * Query
   *
   * @type {StaticQuery}
   */
  query: StaticQuery;

  /**
   * On Change
   */
  onChange: (value: StaticQuery) => void;

  /**
   * On Run Query
   */
  onRunQuery: () => void;
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
export const ValuesEditor = ({ model, query, onChange, onRunQuery }: Props) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * Add Row
   */
  const addRow = useCallback(
    (index: number) => {
      /**
       * New Row
       */
      const newRow = Array.from({ length: model.fields.length }).map((field, i) => {
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
      });

      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        rows: [...model.rows],
      };

      /**
       * Add Row
       */
      updatedModel.rows.splice(index + 1, 0, newRow);

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Remove Row
   */
  const removeRow = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        rows: [...model.rows],
      };

      /**
       * Remove
       */
      updatedModel.rows.splice(index, 1);

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Duplicate Row
   */
  const duplicateRow = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        rows: [...model.rows],
      };

      /**
       * Clone
       */
      updatedModel.rows.splice(index + 1, 0, JSON.parse(JSON.stringify(updatedModel.rows[index])));

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Edit Value
   */
  const editValue = useCallback(
    (value: NullableString, rowIndex: number, fieldIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        rows: [...model.rows],
      };

      /**
       * Update
       */
      updatedModel.rows[rowIndex][fieldIndex] = value;

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
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
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
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
                  >
                    <InlineFieldRow data-testid={TEST_IDS.valuesEditor.row} className={styles.field}>
                      <div className={styles.buttons}>
                        <InlineField className={styles.button}>
                          <Button
                            variant="secondary"
                            title="Copy"
                            onClick={() => duplicateRow(i)}
                            icon="copy"
                            data-testid={TEST_IDS.valuesEditor.buttonCopy}
                          />
                        </InlineField>

                        <InlineField className={styles.button}>
                          <Button
                            variant="secondary"
                            title="Add"
                            onClick={() => addRow(i)}
                            icon="plus"
                            data-testid={TEST_IDS.valuesEditor.buttonAdd}
                          />
                        </InlineField>

                        <InlineField className={styles.button}>
                          <Button
                            variant="destructive"
                            title="Remove"
                            onClick={() => removeRow(i)}
                            icon="trash-alt"
                            data-testid={TEST_IDS.valuesEditor.buttonRemove}
                          />
                        </InlineField>
                        <div {...provided.dragHandleProps}>
                          <Icon title="Drag and drop to reorder" name="draggabledots" size="lg" />
                        </div>
                      </div>
                      <div className={styles.controls}>
                        {row.map((value: NullableString, index: number) => (
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
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
