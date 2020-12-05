import React, { useState } from 'react';
import { QueryEditorProps, FieldType, DataFrameDTO, toDataFrameDTO, MutableDataFrame } from '@grafana/data';
import { Icon, InlineFieldRow, InlineField, Select, Input } from '@grafana/ui';
import { DataSource } from '../datasource';
import { NullableString, DataFrameViewModel } from '../types';
import { css, cx } from 'emotion';
import { InlineFieldGroup } from './InlineFieldGroup';
import { NullableInput } from './NullableInput';
import { StaticDataSourceOptions, StaticQuery } from '../types';

import {} from '@emotion/core';

const allFieldTypes = [
  FieldType.boolean,
  FieldType.number,
  FieldType.other,
  FieldType.string,
  FieldType.time,
  FieldType.trace,
];

type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  // Load existing data frame, or create a new one.
  const frame: DataFrameDTO = query.frame ?? { fields: [] };

  // Create a view model for the data frame.
  const [frameModel, setFrameModel] = useState<DataFrameViewModel>(toViewModel(frame));

  const [schema, setSchema] = useState<FieldType[]>([]);

  // Call this whenever you modify the view model object.
  const onFrameChange = (frameModel: DataFrameViewModel) => {
    setFrameModel(frameModel);
    setSchema(frameModel.fields.map(f => f.type));
    onSaveFrame(frameModel);
  };

  // Call this whenever you want to save the changes to the view model.
  const onSaveFrame = (frameModel: DataFrameViewModel) => {
    const frame = toDataFrame(frameModel);
    onChange({ ...query, frame });
    onRunQuery();
  };

  /*
   * Frame manipulations
   */
  const renameFrame = (name: string) => {
    frameModel.name = name;
    onFrameChange(frameModel);
  };

  /*
   * Field manipulations
   */
  const addField = (pos: number) => {
    // Insert a field after the current position.
    frameModel.fields.splice(pos + 1, 0, {
      name: '',
      type: FieldType.string,
    });

    // Rebuild rows with the added field.
    frameModel.rows.forEach(row => {
      row.splice(pos + 1, 0, '');
    });

    onFrameChange(frameModel);
  };

  const removeField = (pos: number) => {
    // Remove the field at given position.
    frameModel.fields.splice(pos, 1);

    // Rebuild rows without the removed field.
    frameModel.rows.forEach(row => {
      row.splice(pos, 1);
    });

    // Remove all rows if there are no fields.
    if (frameModel.fields.length === 0) {
      frameModel.rows = [];
    }

    onFrameChange(frameModel);
  };

  const renameField = (text: string, i: number) => {
    frameModel.fields[i].name = text;
    onFrameChange(frameModel);
  };

  const changeFieldType = (t: FieldType, i: number) => {
    frameModel.fields[i].type = t;
    onFrameChange(frameModel);
  };

  /*
   * Row manipulations
   */
  const addRow = (pos: number) => {
    const emptyRow: NullableString[] = Array.from({ length: frameModel.fields.length }).map((_, i) => {
      switch (frameModel.fields[i].type) {
        case 'number':
          return '0';
        case 'time':
          return Date.now()
            .valueOf()
            .toString();
        case 'boolean':
          return 'false';
      }
      return '';
    });
    frameModel.rows.splice(pos + 1, 0, emptyRow);
    onFrameChange(frameModel);
  };

  const removeRow = (pos: number) => {
    frameModel.rows.splice(pos, 1);
    onFrameChange(frameModel);
  };

  /*
   * Cell manipulations
   */
  const editCell = (value: NullableString, rowIndex: number, fieldIndex: number) => {
    frameModel.rows[rowIndex][fieldIndex] = value;
    onFrameChange(frameModel);
  };

  return (
    <>
      {/* Data frame configuration */}
      <InlineFieldRow>
        <InlineField label="Name">
          <Input className="width-12" onChange={e => renameFrame(e.currentTarget.value)} value={frameModel.name} />
        </InlineField>
      </InlineFieldRow>

      {/* Schema configuration */}
      <InlineFieldGroup label="Schema">
        {frameModel.fields.map((field, i) => {
          return (
            <>
              <InlineFieldRow key={i}>
                <FormIndent />
                <InlineField label="Name">
                  <Input
                    value={field.name}
                    onChange={e => {
                      renameField(e.currentTarget.value, i);
                    }}
                  />
                </InlineField>
                <InlineField label="Type">
                  <Select
                    value={field.type}
                    onChange={e => {
                      changeFieldType(e.value as FieldType, i);
                    }}
                    options={allFieldTypes.map(t => ({
                      label: t,
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
        {frameModel.fields.length === 0 ? (
          <InlineFieldRow>
            <FormIndent />
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
      </InlineFieldGroup>

      {/* Value configuration */}
      <InlineFieldGroup label="Values">
        {frameModel.fields.length > 0 ? (
          <>
            {/* Display the name of each field as a column header. */}
            <InlineFieldRow
              className={css`
                margin-bottom: 4px;
              `}
            >
              <FormIndent />
              {frameModel.fields.map((field, i) => (
                <span key={i} className={cx('gf-form-label', 'width-8', 'query-keyword')}>
                  {field.name || '<no name>'}
                </span>
              ))}
            </InlineFieldRow>

            {/* Add all the rows. */}
            {frameModel.rows.map((row, i) => {
              return (
                <InlineFieldRow
                  key={i}
                  className={css`
                    margin-bottom: 4px;
                  `}
                >
                  <FormIndent />
                  {row.map((value: NullableString, j: number) => {
                    return (
                      <NullableInput
                        key={j}
                        onValidate={value => {
                          return toFieldValue(value, schema[j]).ok;
                        }}
                        onChange={value => {
                          editCell(value, i, j);
                        }}
                        value={value}
                      />
                    );
                  })}
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
            {frameModel.rows.length === 0 ? (
              <InlineFieldRow>
                <FormIndent />
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
      </InlineFieldGroup>
    </>
  );
};

const toFieldValue = (
  value: NullableString,
  type: FieldType
): { ok: boolean; value?: string | number | boolean | null; error?: string } => {
  if (value === null) {
    return { ok: true, value };
  }

  switch (type) {
    case FieldType.number:
      const num = Number(value);
      return value === '' || isNaN(num) ? { ok: false, error: 'Invalid number' } : { ok: true, value: num };
    case FieldType.time:
      const time = Number(value);
      return value === '' || isNaN(time) ? { ok: false, error: 'Invalid timestamp' } : { ok: true, value: time };
    case FieldType.boolean:
      const truthy = !!['1', 'true', 'yes'].find(_ => _ === value);
      const falsy = !!['0', 'false', 'no'].find(_ => _ === value);

      if (!truthy && !falsy) {
        return { ok: false, error: 'Invalid boolean' };
      }
      return { ok: true, value: truthy };
    default:
      return { ok: true, value: value.toString() };
  }
};

const toDataFrame = (model: DataFrameViewModel): DataFrameDTO => {
  const frame = new MutableDataFrame({
    name: model.name,
    fields: model.fields.map(_ => ({ name: _.name, type: _.type })),
  });
  model.rows.forEach(_ =>
    frame.appendRow(
      _.map((_, i) => {
        const res = toFieldValue(_, frame.fields[i].type);
        return res.ok ? res.value : null;
      })
    )
  );
  return toDataFrameDTO(frame);
};

const toViewModel = (frame: DataFrameDTO): DataFrameViewModel => {
  if (frame.fields.length === 0) {
    return {
      name: frame.name,
      fields: [],
      rows: [],
    };
  }
  const fields = frame.fields.map(_ => ({ name: _.name, type: _.type ?? FieldType.string }));
  const rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((_, i) =>
    frame.fields.map(field => (field.values as any[])[i]?.toString() ?? null)
  );

  return {
    name: frame.name,
    fields,
    rows,
  };
};

export const FormIndent = () => <span className={`width-1`}></span>;
