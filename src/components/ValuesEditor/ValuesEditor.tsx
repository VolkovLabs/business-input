import React, { useCallback } from 'react';
import { FieldType } from '@grafana/data';
import { Button, InlineField, InlineFieldRow } from '@grafana/ui';
import { TestIds } from '../../constants';
import { DataFrameModel, NullableString, StaticQuery } from '../../types';
import { convertToDataFrame } from '../../utils';
import { ValueInput } from '../ValueInput';

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
 * Values Editor
 */
export const ValuesEditor = ({ model, query, onChange, onRunQuery }: Props) => {
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
   * No rows found
   */
  if (!model.rows.length) {
    return (
      <InlineFieldRow>
        <InlineField>
          <Button variant="primary" onClick={() => addRow(0)} icon="plus" data-testid={TestIds.valuesEditor.buttonAdd}>
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
    <>
      {model.rows.map((row, i) => (
        <InlineFieldRow key={i} data-testid={TestIds.valuesEditor.row}>
          {row.map((value: NullableString, index: number) => (
            <ValueInput
              key={index}
              value={value}
              type={model.fields[index].type}
              label={model.fields[index].name}
              onChange={(value) => editValue(value, i, index)}
            />
          ))}

          <InlineField>
            <Button
              variant="secondary"
              title="Copy"
              onClick={() => duplicateRow(i)}
              icon="copy"
              data-testid={TestIds.valuesEditor.buttonCopy}
            />
          </InlineField>

          <InlineField>
            <Button
              variant="secondary"
              title="Add"
              onClick={() => addRow(i)}
              icon="plus"
              data-testid={TestIds.valuesEditor.buttonAdd}
            />
          </InlineField>

          <InlineField>
            <Button
              variant="destructive"
              title="Remove"
              onClick={() => removeRow(i)}
              icon="trash-alt"
              data-testid={TestIds.valuesEditor.buttonRemove}
            />
          </InlineField>
        </InlineFieldRow>
      ))}
    </>
  );
};
