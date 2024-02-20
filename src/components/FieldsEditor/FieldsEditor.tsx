import { FieldType } from '@grafana/data';
import { Button, Icon, IconButton, InlineField, InlineFieldRow, Input, Select, useStyles2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FIELD_TYPES, TEST_IDS } from '../../constants';
import { DataFrameModel, ModelField } from '../../types';
import { reorder } from '../../utils';
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
 * Fields Editor
 */
export const FieldsEditor = ({ model, onChange }: Props) => {
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
  const onToggleItem = useCallback((item: ModelField) => {
    setCollapseState((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  }, []);

  /**
   * Toggle collapse state for all item
   */

  const onToggleAllItems = useCallback(
    (isOpen: boolean) => {
      const ids = items.reduce((acc, item) => {
        return { ...acc, [item.id]: isOpen };
      }, {});

      setCollapseState(ids);
    },
    [items]
  );

  /**
   * Create another object to prevent mutations
   */
  const createUpdatedModel = useCallback(() => {
    return {
      ...model,
      fields: [...model.fields],
      rows: [...model.rows],
    };
  }, [model]);

  /**
   * Add Field
   */
  const addField = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Insert a field after the current position.
       */
      updatedModel.fields.splice(index + 1, 0, {
        name: '',
        type: FieldType.string,
        id: uuidv4(),
      } as ModelField);

      /**
       * Rebuild rows with the added field.
       */
      updatedModel.rows.forEach((row) => {
        row.value.splice(index + 1, 0, '');
      });

      /**
       * Change
       */
      onToggleItem(updatedModel.fields[updatedModel.fields.length - 1]);
      onChange(updatedModel);
      setItems(updatedModel.fields);
    },
    [createUpdatedModel, onChange, onToggleItem]
  );

  /**
   * Remove Field
   */
  const removeField = useCallback(
    (index: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

      /**
       * Remove the field at given position.
       */
      updatedModel.fields.splice(index, 1);

      /**
       * Rebuild rows without the removed field.
       */
      updatedModel.rows.forEach((row) => {
        row.value.splice(index, 1);
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
      onChange(updatedModel);
      setItems(updatedModel.fields);
    },
    [createUpdatedModel, onChange]
  );

  /**
   * Rename Field
   */
  const renameField = useCallback(
    (name: string, updatedIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

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
      onChange(updatedModel);
      setItems(updatedModel.fields);
    },
    [createUpdatedModel, onChange]
  );

  /**
   * Change Field Type
   */
  const changeFieldType = useCallback(
    (fieldType: FieldType, updatedIndex: number) => {
      /**
       * Create another object to prevent mutations
       */
      const updatedModel = createUpdatedModel();

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
      onChange(updatedModel);
      setItems(updatedModel.fields);
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
       * Сreate fields with the new order
       */
      const newFields = reorder(items, result.source.index, result.destination.index);

      const newRows = model.rows.map((row) => {
        if (!result.destination) {
          return row;
        }
        return {
          ...row,
          value: reorder(row.value, result.source.index, result.destination.index),
        };
      });

      /**
       * Set updated fields
       */
      const updatedModel = {
        ...model,
        fields: newFields,
        rows: newRows,
      };

      /**
       * Change
       */
      onChange(updatedModel);
      setItems(newFields);
    },
    [items, model, onChange]
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
    <div data-testid={TEST_IDS.fieldsEditor.root}>
      <div className={styles.field}>
        <Button
          icon="angle-double-down"
          tooltip="Expand all fields"
          tooltipPlacement="top"
          variant="secondary"
          onClick={() => onToggleAllItems(true)}
          data-testid={TEST_IDS.fieldsEditor.buttonExpandAll}
        />
        <Button
          icon="angle-double-up"
          tooltip="Collapse all fields"
          tooltipPlacement="top"
          variant="secondary"
          onClick={() => onToggleAllItems(false)}
          data-testid={TEST_IDS.fieldsEditor.buttonCollapseAll}
        />
        <Button
          variant="secondary"
          title="Add a Field"
          icon="plus"
          data-testid={TEST_IDS.fieldsEditor.buttonAdd}
          onClick={() => addField(items.length ? items.length - 1 : 0)}
        >
          Add a Field
        </Button>
      </div>
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
                      className={styles.field}
                      data-testid={TEST_IDS.fieldsEditor.item}
                    >
                      <Collapse
                        headerTestId={TEST_IDS.fieldsEditor.itemHeader(field.id)}
                        contentTestId={TEST_IDS.fieldsEditor.itemContent(field.id)}
                        fill="solid"
                        isOpen={collapseState[field.id]}
                        onToggle={() => onToggleItem(field)}
                        title={
                          <>
                            {field.name} [{field.type}]
                          </>
                        }
                        actions={
                          <div className={styles.buttons}>
                            <IconButton
                              name="trash-alt"
                              tooltip="Remove field"
                              variant="secondary"
                              ariaLabel="Remove field"
                              data-testid={TEST_IDS.fieldsEditor.buttonRemove}
                              onClick={() => removeField(index)}
                            />
                            <div {...provided.dragHandleProps} className={styles.dragIcon}>
                              <Icon title="Drag and drop to reorder" name="draggabledots" />
                            </div>
                          </div>
                        }
                      >
                        <InlineFieldRow>
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
    </div>
  );
};
