import React, { Dispatch } from 'react';
import { FieldType } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { FieldTypes } from '../../constants';
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
        <InlineField>
          <Button variant="primary" title="Add a Field" onClick={() => addField(0)} icon="plus">
            Add a Field
          </Button>
        </InlineField>
      </InlineFieldRow>
    );
  }

  return (
    <>
      {frame.fields.map((field, i) => {
        return (
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
              <Button variant="secondary" onClick={() => addField(i)} icon="plus"></Button>
            </InlineField>

            <InlineField>
              <Button variant="destructive" onClick={() => removeField(i)} icon="trash-alt"></Button>
            </InlineField>
          </InlineFieldRow>
        );
      })}
    </>
  );
};
