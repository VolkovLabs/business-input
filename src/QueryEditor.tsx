import defaults from 'lodash/defaults';
import React from 'react';
import { QueryEditorProps, FieldType } from '@grafana/data';
import { Segment } from '@grafana/ui';
import { DataSource } from './DataSource';
import { FieldValue } from './types';

import {
  Form,
  FormGroup,
  FormLabel,
  FormField,
  FormInput,
  FormSection,
  FormSpacer,
  FormButton,
  FormIndent,
  FormNullableInput,
} from './Forms';

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

  const editCell = (value: any, rowIndex: number, fieldIndex: number) => {
    frame.rows[rowIndex][fieldIndex] = value;
    onQueryChange({ ...query, frame });
  };

  return (
    <>
      <Form>
        {/* Data frame configuration */}
        <FormGroup>
          <FormField label="Name">
            <FormInput onChange={e => renameFrame(e.target.value)} value={frame.name} />
          </FormField>
          <FormSpacer />
        </FormGroup>

        {/* Schema configuration */}
        <FormSection label="Schema">
          {frame.fields.map((field, i) => (
            <FormGroup>
              <FormIndent level={2} />

              <FormField label="Field">
                <FormInput onChange={e => renameField(e.target.value, i)} value={field.name} />
              </FormField>

              <FormLabel text="Type" keyword />
              <Segment
                className="width-8"
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
              ></Segment>

              <FormSpacer />
              <FormButton icon="plus" onClick={() => addField(i)} />
              <FormButton icon="trash-alt" onClick={() => removeField(i)} />
            </FormGroup>
          ))}

          {/* Display a helper button if no fields have been added. */}
          {frame.fields.length === 0 ? (
            <FormGroup>
              <FormIndent level={2} />
              <FormButton text="Add a field" icon="plus" onClick={() => addField(0)} />
              <FormSpacer />
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
                  <FormLabel text={field.name || '<no name>'} keyword />
                ))}
                <FormSpacer />
              </FormGroup>

              {frame.rows.map((row, i) => (
                <FormGroup>
                  <FormIndent level={2} />
                  {row.map((cellValue, j) => (
                    <div className="gf-form">
                      <FormNullableInput onChange={value => editCell(value, i, j)} value={cellValue} />
                    </div>
                  ))}

                  <FormSpacer />
                  <FormButton icon="plus" onClick={() => addRow(i)} />
                  <FormButton icon="trash-alt" onClick={() => removeRow(i)} />
                </FormGroup>
              ))}

              {/* Display a helper button if no rows have been added. */}
              {frame.rows.length === 0 ? (
                <FormGroup>
                  <FormIndent level={2} />
                  <FormButton text="Add a row" icon="plus" onClick={() => addRow(0)} />
                  <FormSpacer />
                </FormGroup>
              ) : null}
            </>
          ) : null}
        </FormSection>
      </Form>
    </>
  );
};
