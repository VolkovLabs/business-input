import defaults from 'lodash/defaults';
import React from 'react';
import { QueryEditorProps, FieldType } from '@grafana/data';
import { Select, Input } from '@grafana/ui';
import { DataSource } from './DataSource';
import { AddRemoveRow } from './AddRemoveRow';
import { FieldValue } from './types';
import { css, cx } from 'emotion';

import { Form, FormGroup, FormLabel, FormField, FormSection, FormButton, FormIndent, FormNullableInput } from './Forms';

import { MyDataSourceOptions, MyQuery, defaultQuery, MyDataFrame } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  // Clone the frame object. Otherwise you'll modify the frame for all queries.
  const frame: MyDataFrame = JSON.parse(JSON.stringify(defaults(query, defaultQuery).frame));

  // Call this whenever you modify the frame object.
  const onQueryChange = (query: any) => {
    onChange(query);
    onRunQuery();
  };

  /*
   * Frame manipulations
   */
  const renameFrame = (name: string) => {
    frame.name = name;
    onQueryChange({ ...query, frame });
  };

  /*
   * Field manipulations
   */
  const addField = (pos: number) => {
    // Insert a field after the current position.
    frame.fields.splice(pos + 1, 0, {
      name: '',
      type: FieldType.string,
    });

    // Rebuild rows with the added field.
    frame.rows.forEach(row => {
      row.splice(pos + 1, 0, '');
    });

    onQueryChange({ ...query, frame });
  };

  const removeField = (pos: number) => {
    // Remove the field at given position.
    frame.fields.splice(pos, 1);

    // Rebuild rows without the removed field.
    frame.rows.forEach(row => {
      row.splice(pos, 1);
    });

    onQueryChange({ ...query, frame });
  };

  const renameField = (text: string, i: number) => {
    frame.fields[i].name = text;
    onQueryChange({ ...query, frame });
  };

  const changeFieldType = (t: FieldType, i: number) => {
    frame.fields[i].type = t;
    onQueryChange({ ...query, frame });
  };

  /*
   * Row manipulations
   */
  const addRow = (pos: number) => {
    const emptyRow: FieldValue[] = Array.from({ length: frame.fields.length }).map((_, i) => {
      switch (frame.fields[i].type) {
        case 'number':
          return 0;
        case 'time':
          return Date.now().valueOf();
        case 'boolean':
          return false;
      }
      return '';
    });
    frame.rows.splice(pos + 1, 0, emptyRow);
    onQueryChange({ ...query, frame });
  };

  const removeRow = (pos: number) => {
    frame.rows.splice(pos, 1);
    onQueryChange({ ...query, frame });
  };

  const editCell = (value: string | null, rowIndex: number, fieldIndex: number) => {
    frame.fields[fieldIndex].type;
    frame.rows[rowIndex][fieldIndex] = value;
    onQueryChange({ ...query, frame });
  };

  return (
    <>
      <Form>
        {/* Data frame configuration */}
        <FormGroup>
          <FormField label="Name">
            <Input onChange={e => renameFrame(e.currentTarget.value)} value={frame.name} />
          </FormField>
        </FormGroup>

        {/* Schema configuration */}
        <FormSection label="Schema">
          {frame.fields.map((field, i) => (
            <AddRemoveRow onAdd={() => addField(i)} onRemove={() => removeField(i)}>
              <div className="gf-form">
                <Select
                  className={cx(
                    'width-6',
                    css`
                      margin-right: 4px;
                    `
                  )}
                  onChange={e => {
                    changeFieldType(e.value as FieldType, i);
                  }}
                  value={field.type}
                  options={[
                    FieldType.boolean,
                    FieldType.number,
                    FieldType.other,
                    FieldType.string,
                    FieldType.time,
                    FieldType.trace,
                  ].map(t => ({
                    label: t,
                    value: t,
                  }))}
                ></Select>
              </div>
              <div className="gf-form">
                <Input
                  className={cx(css`
                    margin-right: 4px;
                  `)}
                  onChange={e => renameField(e.currentTarget.value, i)}
                  value={field.name}
                />
              </div>
            </AddRemoveRow>
          ))}

          {/* Display a helper button if no fields have been added. */}
          {frame.fields.length === 0 ? (
            <FormGroup>
              <FormIndent level={2} />
              <FormButton text="Add a field" icon="plus" onClick={() => addField(0)} />
            </FormGroup>
          ) : null}
        </FormSection>

        {/* Value configuration */}
        <FormSection label="Values">
          {frame.fields.length > 0 ? (
            <>
              {/* Display the name of each field as a column header. */}
              <FormGroup>
                <FormIndent level={2} />
                {frame.fields.map((field, i) => (
                  <div className="gf-form">
                    <FormLabel text={field.name || '<no name>'} keyword />
                  </div>
                ))}
              </FormGroup>

              {frame.rows.map((row, i) => (
                <AddRemoveRow onAdd={() => addRow(i)} onRemove={() => removeRow(i)}>
                  {row.map((cellValue, j) => (
                    <div className="gf-form">
                      <FormNullableInput onChange={value => editCell(value, i, j)} value={cellValue?.toString()} />
                    </div>
                  ))}
                </AddRemoveRow>
              ))}

              {/* Display a helper button if no rows have been added. */}
              {frame.rows.length === 0 ? (
                <FormGroup>
                  <FormIndent level={2} />
                  <FormButton text="Add a row" icon="plus" onClick={() => addRow(0)} />
                </FormGroup>
              ) : null}
            </>
          ) : null}
        </FormSection>
      </Form>
    </>
  );
};
