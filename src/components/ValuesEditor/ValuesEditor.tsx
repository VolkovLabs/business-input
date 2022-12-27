import React, { Dispatch } from 'react';
import { Button, InlineField, InlineFieldRow } from '@grafana/ui';
import { DataFrameViewModel, NullableString } from '../../types';
import { Action } from '../FrameReducer';
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
   * On Validate
   *
   * @type {boolean}
   */
  onValidate: (value: NullableString, j: number) => boolean;

  /**
   * Dispatch
   *
   * @type {Dispatch<Action>}
   */
  dispatch: Dispatch<Action>;
}

/**
 * ValuesEditor is a grid of text inputs, much like a spreadsheet.
 * Each text input can be toggled to be null.
 */
export const ValuesEditor = ({ frame, dispatch, onValidate }: Props) => {
  /**
   * Add Row
   */
  const addRow = (index: number) => {
    dispatch({ type: 'insert-row', index });
  };

  /**
   * Remove Row
   */
  const removeRow = (index: number) => {
    dispatch({ type: 'remove-row', index });
  };

  /**
   * Duplicate Row
   */
  const duplicateRow = (index: number) => {
    dispatch({ type: 'duplicate-row', index });
  };

  /**
   * Edit Cell
   */
  const editCell = (value: NullableString, rowIndex: number, fieldIndex: number) => {
    dispatch({ type: 'edit-cell', rowIndex, fieldIndex, value });
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
              onChange={(value) => editCell(value, i, index)}
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
