import React from 'react';
import { Field, FieldType } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { FieldTypes, TestIds } from '../../constants';
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
  const addField = (index: number) => {
    /**
     * Insert a field after the current position.
     */
    model.fields.splice(index + 1, 0, {
      name: '',
      type: FieldType.string,
    } as Field);

    /**
     * Rebuild rows with the added field.
     */
    model.rows.forEach((row: any) => {
      row.splice(index + 1, 0, '');
    });

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Remove Field
   */
  const removeField = (index: number) => {
    /**
     * Remove the field at given position.
     */
    model.fields.splice(index, 1);

    /**
     * Rebuild rows without the removed field.
     */
    model.rows.forEach((row) => {
      row.splice(index, 1);
    });

    /**
     * Remove all rows if there are no fields.
     */
    if (!model.fields.length) {
      model.rows = [];
    }

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Rename Field
   */
  const renameField = (name: string, index: number) => {
    /**
     * Rename
     */
    model.fields[index].name = name;

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Change Field Type
   */
  const changeFieldType = (fieldType: FieldType, index: number) => {
    /**
     * Set Field Type
     */
    model.fields[index].type = fieldType;

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

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
            data-testid={TestIds.fieldsEditor.buttonAdd}
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
        <InlineFieldRow key={i}>
          <InlineField label="Name" grow>
            <Input
              value={field.name}
              onChange={(e) => {
                renameField(e.currentTarget.value, i);
              }}
            />
          </InlineField>

          <InlineField label="Type">
            <Select
              width={12}
              value={field.type}
              onChange={(e) => {
                changeFieldType(e.value as FieldType, i);
              }}
              options={FieldTypes.map((t) => ({
                label: t[0].toUpperCase() + t.substring(1),
                value: t,
              }))}
            />
          </InlineField>

          <InlineField>
            <Button variant="secondary" title="Add" onClick={() => addField(i)} icon="plus"></Button>
          </InlineField>

          <InlineField>
            <Button variant="destructive" title="Remove" onClick={() => removeField(i)} icon="trash-alt"></Button>
          </InlineField>
        </InlineFieldRow>
      ))}
    </>
  );
};
