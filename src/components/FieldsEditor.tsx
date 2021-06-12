import React, { Dispatch } from 'react';
import { css, cx } from 'emotion';
import { Icon, InlineFieldRow, InlineField, Select, Input } from '@grafana/ui';
import { DataFrameViewModel } from '../types';
import { FieldType } from '@grafana/data';
import { Action } from './reducer';

const allFieldTypes = [
  FieldType.boolean,
  FieldType.number,
  FieldType.other,
  FieldType.string,
  FieldType.time,
  FieldType.trace,
];

interface Props {
  frame: DataFrameViewModel;
  onChange: (frame: DataFrameViewModel) => void;
  dispatch: Dispatch<Action>;
}

export const FieldsEditor = ({ frame, onChange, dispatch }: Props) => {
  const addField = (index: number) => {
    dispatch({ type: 'insert-field', index });
    onChange(frame);
  };
  const removeField = (index: number) => {
    dispatch({ type: 'remove-field', index });
    onChange(frame);
  };
  const renameField = (name: string, index: number) => {
    dispatch({ type: 'rename-field', name, index });
    onChange(frame);
  };
  const changeFieldType = (fieldType: FieldType, index: number) => {
    dispatch({ type: 'set-field-type', fieldType, index });
    onChange(frame);
  };

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
                  options={allFieldTypes.map((t) => ({
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

      {/* Display a helper button if no fields have been added. */}
      {frame.fields.length === 0 ? (
        <InlineFieldRow>
          <a
            onClick={() => addField(0)}
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
            Add a field
          </a>
        </InlineFieldRow>
      ) : null}
    </>
  );
};
