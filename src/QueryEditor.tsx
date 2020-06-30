import defaults from 'lodash/defaults';
import React from 'react';
import { QueryEditorProps, FieldType } from '@grafana/data';
import { Segment } from '@grafana/ui';
import { DataSource } from './DataSource';

import { Form, FormGroup, FormLabel, FormField, FormSection, FormSpacer, FormButton, FormIndent } from './Forms';

import { MyDataSourceOptions, MyQuery, defaultQuery, MyDataFrame } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  const frame: MyDataFrame = JSON.parse(JSON.stringify(defaults(query, defaultQuery).frame));

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
    frame.fields.splice(pos + 1, 0, {
      name: '',
      type: FieldType.string,
    });
    for (let i = 0; i < frame.rows.length; i++) {
      frame.rows[i].splice(pos + 1, 0, null);
    }
    onQueryChange({ ...query, frame });
  };

  const removeField = (field: number) => {
    frame.fields.splice(field, 1);

    for (let i = 0; i < frame.rows.length; i++) {
      frame.rows[i].splice(field, 1);
    }
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
    frame.rows.splice(pos + 1, 0, Array.from({ length: frame.fields.length }));
    onQueryChange({ ...query, frame });
  };

  const removeRow = (row: number) => {
    frame.rows.splice(row, 1);
    onQueryChange({ ...query, frame });
  };

  const editCell = (value: any, rowIndex: number, fieldIndex: number) => {
    frame.rows[rowIndex][fieldIndex] = value;
    onQueryChange({ ...query, frame });
  };

  return (
    <>
      <Form>
        <FormGroup>
          <FormField label="Name">
            <input onChange={e => renameFrame(e.target.value)} value={frame.name} className="gf-form-input" />
          </FormField>
          <FormSpacer />
        </FormGroup>
        <FormSection label="Schema">
          {frame.fields.map((field, i) => (
            <FormGroup>
              <FormIndent level={2} />
              <FormField label="Field">
                <input onChange={e => renameField(e.target.value, i)} value={field.name} className="gf-form-input" />
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
          {frame.fields.length === 0 ? (
            <FormGroup>
              <FormIndent level={2} />
              <FormButton text="Add a field" icon="plus" onClick={() => addField(0)} />
              <FormSpacer />
            </FormGroup>
          ) : null}
        </FormSection>
        <FormSection label="Values">
          {frame.fields.length > 0 ? (
            <>
              <FormGroup>
                <FormIndent level={2} />
                <div className="gf-form">
                  {frame.fields.map((field, i) => (
                    <FormLabel text={field.name || '<no name>'} keyword />
                  ))}
                </div>
                <FormSpacer />
              </FormGroup>

              {frame.rows.map((row, i) => (
                <FormGroup>
                  <FormIndent level={2} />
                  {row.map((cellValue, j) => (
                    <div className="gf-form">
                      <input
                        className="gf-form-input width-8"
                        onChange={e => editCell(e.target.value, i, j)}
                        value={cellValue ?? ''}
                      />
                    </div>
                  ))}
                  <FormSpacer />
                  <FormButton icon="plus" onClick={() => addRow(i)} />
                  <FormButton icon="trash-alt" onClick={() => removeRow(i)} />
                </FormGroup>
              ))}
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
