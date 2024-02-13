import { Field, FieldType } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React, { useCallback } from 'react';

import { FIELD_TYPES, TEST_IDS } from '../../constants';
import { DataFrameModel, StaticQuery } from '../../types';
import { convertToDataFrame } from '../../utils';

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
 * Fields Editor
 */
export const FieldsEditor = ({ query, model, onChange, onRunQuery }: Props) => {
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
      onChange({ ...query, frame: convertToDataFrame(updatedModel) });
      onRunQuery();
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
    },
    [model, onChange, onRunQuery, query]
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
    <>
      {model.fields.map((field, i) => (
        <InlineFieldRow key={i} data-testid={TEST_IDS.fieldsEditor.item}>
          <InlineField label="Name" grow>
            <Input
              value={field.name}
              onChange={(e) => {
                renameField(e.currentTarget.value, i);
              }}
              data-testid={TEST_IDS.fieldsEditor.fieldName}
            />
          </InlineField>

          <InlineField label="Type">
            <Select
              width={12}
              value={field.type}
              onChange={(e) => {
                changeFieldType(e.value as FieldType, i);
              }}
              options={FIELD_TYPES.map((t) => ({
                label: t[0].toUpperCase() + t.substring(1),
                value: t,
              }))}
              aria-label={TEST_IDS.fieldsEditor.fieldType}
            />
          </InlineField>

          <InlineField>
            <Button
              variant="secondary"
              title="Add"
              onClick={() => addField(i)}
              icon="plus"
              data-testid={TEST_IDS.fieldsEditor.buttonAdd}
            />
          </InlineField>

          <InlineField>
            <Button
              variant="destructive"
              title="Remove"
              onClick={() => removeField(i)}
              data-testid={TEST_IDS.fieldsEditor.buttonRemove}
              icon="trash-alt"
            />
          </InlineField>
        </InlineFieldRow>
      ))}
    </>
  );
};
