import React, { Dispatch } from 'react';
import { cx } from '@emotion/css';
import { FieldType } from '@grafana/data';
import { Icon, InlineField, InlineFieldRow, Input, Select, useTheme2 } from '@grafana/ui';
import { fieldTypes } from '../../constants';
import { getStyles } from '../../styles';
import { DataFrameViewModel } from '../../types';
import { Action } from '../FrameReducer';

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
   * Dispatch
   *
   * @type {Dispatch<Action>}
   */
  dispatch: Dispatch<Action>;
}

/**
 * Fields Editor
 */
export const FieldsEditor = ({ frame, dispatch }: Props) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Add Field
   */
  const addField = (index: number) => {
    dispatch({ type: 'insert-field', index });
  };

  /**
   * Remove Field
   */
  const removeField = (index: number) => {
    dispatch({ type: 'remove-field', index });
  };

  /**
   * Rename Field
   */
  const renameField = (name: string, index: number) => {
    dispatch({ type: 'rename-field', name, index });
  };

  /**
   * Change Field Type
   */
  const changeFieldType = (fieldType: FieldType, index: number) => {
    dispatch({ type: 'set-field-type', fieldType, index });
  };

  /**
   * No rows found
   */
  if (!frame.fields.length) {
    return (
      <InlineFieldRow>
        <a onClick={() => addField(0)} title="Add Field" className={cx('gf-form-label', styles.rowMarginBottom)}>
          <Icon name="plus" />
          Add a field
        </a>
      </InlineFieldRow>
    );
  }

  return (
    <>
      {frame.fields.map((field, i) => {
        return (
          <>
            <InlineFieldRow key={i}>
              <InlineField label="Name">
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
                  options={fieldTypes.map((t) => ({
                    label: t[0].toUpperCase() + t.substr(1),
                    value: t,
                  }))}
                />
              </InlineField>

              <a className="gf-form-label" onClick={() => addField(i)}>
                <Icon name="plus" />
              </a>
              <a className="gf-form-label" onClick={() => removeField(i)}>
                <Icon name="minus" />
              </a>
            </InlineFieldRow>
          </>
        );
      })}
    </>
  );
};
