import React from 'react';
import { FieldType } from '@grafana/data';
import { Button, InlineField, InlineFieldRow } from '@grafana/ui';
import { DataFrameViewModel, NullableString, StaticQuery } from '../../types';
import { cloneDataFrameViewModel, toDataFrame } from '../../utils';
import { NullableInput } from '../NullableInput';

/**
 * Properties
 */
interface Props {
  /**
   * Frame
   *
   * @type {DataFrameViewModel}
   */
  frame: DataFrameViewModel;

  /**
   * Query
   *
   * @type {StaticQuery}
   */
  query: StaticQuery;

  /**
   * On Validate
   *
   * @type {boolean}
   */
  onValidate: (value: NullableString, j: number) => boolean;

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
 * ValuesEditor is a grid of text inputs, much like a spreadsheet.
 * Each text input can be toggled to be null.
 */
export const ValuesEditor = ({ frame, query, onValidate, onChange, onRunQuery }: Props) => {
  /**
   * Add Row
   */
  const addRow = (index: number) => {
    const model = cloneDataFrameViewModel(frame);

    /**
     * New Row
     */
    const newRow = Array.from({ length: frame.fields.length }).map((field, i) => {
      switch (frame.fields[i].type) {
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
    onChange({ ...query, frame: toDataFrame(model) });
    onRunQuery();
  };

  /**
   * Remove Row
   */
  const removeRow = (index: number) => {
    const model = cloneDataFrameViewModel(frame);

    /**
     * Remove
     */
    model.rows.splice(index, 1);

    /**
     * Change
     */
    onChange({ ...query, frame: toDataFrame(model) });
    onRunQuery();
  };

  /**
   * Duplicate Row
   */
  const duplicateRow = (index: number) => {
    const model = cloneDataFrameViewModel(frame);

    /**
     * Clone
     */
    model.rows.splice(index + 1, 0, JSON.parse(JSON.stringify(frame.rows[index])));

    /**
     * Change
     */
    onChange({ ...query, frame: toDataFrame(model) });
    onRunQuery();
  };

  /**
   * Edit Value
   */
  const editValue = (value: NullableString, rowIndex: number, fieldIndex: number) => {
    const model = cloneDataFrameViewModel(frame);

    /**
     * Update
     */
    model.rows[rowIndex][fieldIndex] = value;

    /**
     * Change
     */
    onChange({ ...query, frame: toDataFrame(model) });
    onRunQuery();
  };

  /**
   * No rows found
   */
  if (!frame.rows.length) {
    return (
      <InlineFieldRow>
        <InlineField>
          <Button variant="primary" onClick={() => addRow(0)} icon="plus">
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
      {frame.rows.map((row, i) => (
        <InlineFieldRow key={i}>
          {row.map((value: NullableString, index: number) => (
            <NullableInput
              key={index}
              value={value}
              label={frame.fields[index].name}
              onChange={(value) => editValue(value, i, index)}
              onValidate={(value) => onValidate(value, index)}
            />
          ))}

          <InlineField>
            <Button variant="secondary" title="Copy" onClick={() => duplicateRow(i)} icon="copy"></Button>
          </InlineField>

          <InlineField>
            <Button variant="secondary" title="Add" onClick={() => addRow(i)} icon="plus"></Button>
          </InlineField>

          <InlineField>
            <Button variant="destructive" title="Remove" onClick={() => removeRow(i)} icon="trash-alt"></Button>
          </InlineField>
        </InlineFieldRow>
      ))}
    </>
  );
};
