import React, { Dispatch } from 'react';
import { cx } from '@emotion/css';
import { Icon, InlineFieldRow, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { DataFrameViewModel, NullableString } from '../../types';
import { Action } from '../FrameReducer';
import { NullableInput } from '../NullableInput';

/**
 * Properties
 */
interface Props {
  frame: DataFrameViewModel;
  onValidate: (value: NullableString, j: number) => boolean;
  dispatch: Dispatch<Action>;
}

/**
 * ValuesEditor is a grid of text inputs, much like a spreadsheet.
 * Each text input can be toggled to be null.
 */
export const ValuesEditor = ({ frame, dispatch, onValidate }: Props) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

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
        <a onClick={() => addRow(0)} className={cx('gf-form-label', styles.rowMarginBottom)}>
          <Icon name="plus" title="Add Row" />
          Add a row
        </a>
      </InlineFieldRow>
    );
  }

  /**
   * Display rows
   */
  return (
    <>
      <InlineFieldRow className={styles.rowMarginBottom}>
        {frame.fields.map((field, i) => (
          <span key={i} className={cx('gf-form-label', 'width-9')}>
            {field.name || '<no name>'}
          </span>
        ))}
      </InlineFieldRow>

      {frame.rows.map((row, i) => {
        return (
          <InlineFieldRow key={i} className={styles.rowMarginBottom}>
            {row.map((value: NullableString, index: number) => {
              return (
                <NullableInput
                  key={index}
                  value={value}
                  onChange={(value) => editCell(value, i, index)}
                  onValidate={(value: NullableString) => onValidate(value, index)}
                />
              );
            })}

            <a className="gf-form-label" title="Copy" onClick={() => duplicateRow(i)}>
              <Icon name="copy" />
            </a>
            <a className="gf-form-label" title="Add" onClick={() => addRow(i)}>
              <Icon name="plus" />
            </a>
            <a className="gf-form-label" title="Remove" onClick={() => removeRow(i)}>
              <Icon name="minus" />
            </a>
          </InlineFieldRow>
        );
      })}
    </>
  );
};
