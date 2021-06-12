import { Icon, InlineFieldRow } from '@grafana/ui';
import { css, cx } from 'emotion';
import React, { Dispatch } from 'react';
import { DataFrameViewModel, NullableString } from '../types';
import { NullableInput } from './NullableInput';
import { Action } from './reducer';

interface Props {
  frame: DataFrameViewModel;
  onChange: (frame: DataFrameViewModel) => void;
  onValidate: (value: NullableString, j: number) => boolean;
  dispatch: Dispatch<Action>;
}

/**
 * ValuesEditor is a grid of text inputs, much like a spreadsheet. Each text
 * input can be toggled to be null.
 */
export const ValuesEditor = ({ frame, onChange, dispatch, onValidate }: Props) => {
  const addRow = (index: number) => {
    dispatch({ type: 'insert-row', index });
    onChange(frame);
  };
  const removeRow = (index: number) => {
    dispatch({ type: 'remove-row', index });
    onChange(frame);
  };
  const duplicateRow = (index: number) => {
    dispatch({ type: 'duplicate-row', index });
    onChange(frame);
  };
  const editCell = (value: NullableString, rowIndex: number, fieldIndex: number) => {
    dispatch({ type: 'edit-cell', rowIndex, fieldIndex, value });
    onChange(frame);
  };

  return (
    <>
      {frame.fields.length > 0 ? (
        <>
          {/* Display the name of each field as a column header. */}
          <InlineFieldRow
            className={css`
              margin-bottom: 4px;
            `}
          >
            {frame.fields.map((field, i) => (
              <span key={i} className={cx('gf-form-label', 'width-9', 'query-keyword')}>
                {field.name || '<no name>'}
              </span>
            ))}
          </InlineFieldRow>

          {/* Add all the rows. */}
          {frame.rows.map((row, i) => {
            return (
              <InlineFieldRow
                key={i}
                className={css`
                  margin-bottom: 4px;
                `}
              >
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
                <a className="gf-form-label" onClick={() => duplicateRow(i)}>
                  <Icon name="copy" />
                </a>
                <a className="gf-form-label" onClick={() => addRow(i)}>
                  <Icon name="plus" />
                </a>
                <a className="gf-form-label" onClick={() => removeRow(i)}>
                  <Icon name="minus" />
                </a>
              </InlineFieldRow>
            );
          })}

          {/* Display a helper button if no rows have been added. */}
          {frame.rows.length === 0 ? (
            <InlineFieldRow>
              <a
                onClick={() => addRow(0)}
                className={cx(
                  'gf-form-label',
                  css`
                    margin-bottom: 4px;
                  `
                )}
              >
                <Icon
                  name="plus"
                  className={css`
                    margin-right: 4px;
                  `}
                />
                Add a row
              </a>
            </InlineFieldRow>
          ) : null}
        </>
      ) : null}
    </>
  );
};
