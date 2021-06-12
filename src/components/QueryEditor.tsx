import React, { useState, useReducer } from 'react';
import { QueryEditorProps, FieldType, PreferredVisualisationType } from '@grafana/data';
import { InlineFieldRow, InlineField, Select, Input } from '@grafana/ui';

import { DataSource } from '../datasource';
import { InlineFieldGroup } from './InlineFieldGroup';
import { FieldsEditor } from './FieldsEditor';
import { ValuesEditor } from './ValuesEditor';

import { frameReducer } from './reducer';
import { toDataFrame, toFieldValue, toViewModel } from './helpers';
import { StaticDataSourceOptions, StaticQuery, DataFrameViewModel } from '../types';

import {} from '@emotion/core';

const allPreferredVisualizationTypes: PreferredVisualisationType[] = ['graph', 'table', 'logs', 'trace', 'nodeGraph'];

type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  // Load existing data frame, or create a new one.
  const [frame, dispatch] = useReducer(frameReducer, toViewModel(query.frame ?? { fields: [] }));
  const [schema, setSchema] = useState<FieldType[]>([]);

  // Call this whenever you modify the view model object.
  const onFrameChange = (frame: DataFrameViewModel) => {
    // Extract frame schema for validation.
    setSchema(frame.fields.map((f) => f.type));

    onChange({ ...query, frame: toDataFrame(frame) });
    onRunQuery();
  };
  const renameFrame = (name: string) => {
    dispatch({ type: 'rename', name });
    onFrameChange(frame);
  };
  const setPreferredVisualizationType = (preferredVisualisationType?: PreferredVisualisationType) => {
    dispatch({ type: 'set-preferred-visualisation-type', preferredVisualisationType });
    onFrameChange(frame);
  };

  return (
    <>
      {/* Data frame configuration */}
      <InlineFieldRow>
        <InlineField label="Name" tooltip="Name of the data frame">
          <Input className="width-12" onChange={(e) => renameFrame(e.currentTarget.value)} value={frame.name} />
        </InlineField>
      </InlineFieldRow>

      {/* Metadata  configuration */}
      <InlineFieldGroup label="Metadata">
        <InlineFieldRow>
          <InlineField
            label="Preferred visualization type"
            tooltip="Determines how to visualize the query result in Explore."
          >
            <Select
              isClearable={true}
              width={17}
              value={frame.meta?.preferredVisualisationType}
              onChange={(e) => {
                setPreferredVisualizationType(e ? (e.value as PreferredVisualisationType) : undefined);
              }}
              options={allPreferredVisualizationTypes.map((t) => ({
                label: t[0].toUpperCase() + t.substr(1),
                value: t,
              }))}
            />
          </InlineField>
        </InlineFieldRow>
      </InlineFieldGroup>

      {/* Field configuration */}
      <InlineFieldGroup label="Fields">
        <FieldsEditor frame={frame} onChange={onFrameChange} dispatch={dispatch} />
      </InlineFieldGroup>

      {/* Value configuration */}
      <InlineFieldGroup label="Values">
        <ValuesEditor
          frame={frame}
          onChange={onFrameChange}
          onValidate={(value, j) => {
            return toFieldValue(value, schema[j]).ok;
          }}
          dispatch={dispatch}
        />
      </InlineFieldGroup>
    </>
  );
};

export const FormIndent = () => <span className={`width-1`}></span>;
