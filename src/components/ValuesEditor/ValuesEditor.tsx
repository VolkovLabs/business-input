import React from 'react';
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
  const addRow = (index: number) => {
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
     * Add Row
     */
    model.rows.splice(index + 1, 0, newRow);

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Remove Row
   */
  const removeRow = (index: number) => {
    /**
     * Remove
     */
    model.rows.splice(index, 1);

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Duplicate Row
   */
  const duplicateRow = (index: number) => {
    /**
     * Clone
     */
    model.rows.splice(index + 1, 0, JSON.parse(JSON.stringify(model.rows[index])));

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Edit Value
   */
  const editValue = (value: NullableString, rowIndex: number, fieldIndex: number) => {
    /**
     * Update
     */
    model.rows[rowIndex][fieldIndex] = value;

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * No rows found
   */
  if (!model.rows.length) {
    return (
      <InlineFieldRow>
        <InlineField>
          <Button
            variant="primary"
            onClick={() => addRow(0)}
            icon="plus"
            data-testid={TestIds.valuesEditor.buttonAddRow}
          >
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
        <InlineFieldRow key={i}>
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
            <Button variant="secondary" title="Copy" onClick={() => duplicateRow(i)} icon="copy" />
          </InlineField>

          <InlineField>
            <Button variant="secondary" title="Add" onClick={() => addRow(i)} icon="plus" />
          </InlineField>

          <InlineField>
            <Button variant="destructive" title="Remove" onClick={() => removeRow(i)} icon="trash-alt" />
          </InlineField>
        </InlineFieldRow>
      ))}
    </>
  );
};
