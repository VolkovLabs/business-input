import { Field, FieldType } from '@grafana/data';
import { Button, Icon, IconButton, InlineField, InlineFieldRow, Input, Select, useStyles2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useState } from 'react';

import { FIELD_TYPES, TEST_IDS } from '../../constants';
import { DataFrameModel, StaticQuery } from '../../types';
import { convertToDataFrame, reorder } from '../../utils';
import { getStyles } from './FieldsEditor.styles';

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
 * Fields Editor
 */
export const FieldsEditor = ({ query, model, onChange, onRunQuery }: Props) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * State
   */
  const [items, setItems] = useState(model.fields);
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});
  /**
   * Toggle collapse state for item
   */
  const onToggleItem = useCallback((item: Field, index: number) => {
    setCollapseState((prev) => ({
      ...prev,
      [`${item.name}-${item.type}`]: !prev[`${item.name}-${item.type}`],
    }));
  }, []);

  /**
   * Add Field
   */
  const addField = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        fields: [...model.fields],
        rows: [...model.rows],
      };

      /**
       * Insert a field after the current position.
       */
      updatedModel.fields.splice(index + 1, 0, {
        name: '',
        type: FieldType.string,
      } as Field);

      /**
       * Rebuild rows with the added field.
       */
      updatedModel.rows.forEach((row) => {
        row.splice(index + 1, 0, '');
      });

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
      setItems(updatedModel.fields);
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Remove Field
   */
  const removeField = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        fields: [...model.fields],
        rows: [...model.rows],
      };

      /**
       * Remove the field at given position.
       */
      updatedModel.fields.splice(index, 1);

      /**
       * Rebuild rows without the removed field.
       */
      updatedModel.rows.forEach((row) => {
        row.splice(index, 1);
      });

      /**
       * Remove all rows if there are no fields.
       */
      if (!updatedModel.fields.length) {
        updatedModel.rows = [];
      }

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
      setItems(updatedModel.fields);
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Rename Field
   */
  const renameField = useCallback(
    (name: string, updatedIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        fields: [...model.fields],
      };

      /**
       * Rename
       */
      updatedModel.fields = updatedModel.fields.map((field, index) =>
        index === updatedIndex
          ? {
              ...field,
              name,
            }
          : field
      );

      /**
       * Change
       */
      // setCollapseState((prev) => ({
      //   ...prev,
      //   [`${item.name}-${item.type}`]: !prev[`${item.name}-${item.type}`],
      // }));
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
      setItems(updatedModel.fields);
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Change Field Type
   */
  const changeFieldType = useCallback(
    (fieldType: FieldType, updatedIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = {
        ...model,
        fields: [...model.fields],
      };

      /**
       * Set Field Type
       */
      updatedModel.fields = updatedModel.fields.map((field, index) =>
        index === updatedIndex
          ? {
              ...field,
              type: fieldType,
            }
          : field
      );

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
      setItems(updatedModel.fields);
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
       * Сreate fields with the new order
       */
      const newFields = reorder(items, result.source.index, result.destination.index);

      const newRows = model.rows.map((row) => {
        if (!result.destination) {
          return row;
        }
        return reorder(row, result.source.index, result.destination.index);
      });

      /**
       * Set updated fields
       */
      const updatedModel = {
        ...model,
        fields: newFields,
        rows: newRows,
      };
      setItems(newFields);

      /**
       * Change
       */
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
    },
    [items, model, onChange, onRunQuery, query]
  );

  /**
   * No rows found
   */
  if (!model.fields.length) {
    return (
      <InlineFieldRow>
        <InlineField>
          <Button
            variant="primary"
            title="Add a Field"
            onClick={() => addField(0)}
            icon="plus"
            data-testid={TEST_IDS.fieldsEditor.buttonAdd}
          >
            Add a Field
          </Button>
        </InlineField>
      </InlineFieldRow>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="dataset">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((field, index) => (
              <Draggable
                disableInteractiveElementBlocking={false}
                draggableId={`draggable-${index}`}
                key={index}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <Collapse
                      fill="solid"
                      isOpen={collapseState[`${field.name}-${field.type}`]}
                      onToggle={() => onToggleItem(field, index)}
                      title={
                        <>
                          {field.name} | {field.type}
                        </>
                      }
                      actions={
                        <div className={styles.buttons}>
                          <IconButton
                            name="plus"
                            size="md"
                            tooltip="Add new field"
                            variant="destructive"
                            ariaLabel="Add new field"
                            data-testid={TEST_IDS.fieldsEditor.buttonAdd}
                            onClick={() => addField(index)}
                            className={styles.button}
                          />
                          <IconButton
                            name="trash-alt"
                            size="md"
                            tooltip="Remove field"
                            variant="destructive"
                            ariaLabel="Remove field"
                            data-testid={TEST_IDS.fieldsEditor.buttonRemove}
                            onClick={() => removeField(index)}
                            className={styles.button}
                          />
                          <div {...provided.dragHandleProps}>
                            <Icon title="Drag and drop to reorder" name="draggabledots" size="md" />
                          </div>
                        </div>
                      }
                    >
                      <InlineFieldRow data-testid={TEST_IDS.fieldsEditor.item}>
                        <div className={styles.controls}>
                          <InlineField label="Name" grow>
                            <Input
                              value={field.name}
                              onChange={(e) => {
                                renameField(e.currentTarget.value, index);
                              }}
                              data-testid={TEST_IDS.fieldsEditor.fieldName}
                            />
                          </InlineField>
                          <InlineField label="Type">
                            <Select
                              width={12}
                              value={field.type}
                              onChange={(e) => {
                                changeFieldType(e.value as FieldType, index);
                              }}
                              options={FIELD_TYPES.map((t) => ({
                                label: t[0].toUpperCase() + t.substring(1),
                                value: t,
                              }))}
                              aria-label={TEST_IDS.fieldsEditor.fieldType}
                            />
                          </InlineField>
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
  );
};
