import React, { useCallback, useReducer } from 'react';
import { PreferredVisualisationType, QueryEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { preferredVisualizationTypes } from '../../constants';
import { DataSource } from '../../datasource';
import { toDataFrame, toFieldValue, toViewModel } from '../../helpers';
import { DataFrameViewModel, StaticDataSourceOptions, StaticQuery } from '../../types';
import { FieldsEditor } from '../FieldsEditor';
import { frameReducer, useChangeReducer as useOnChangeReducer } from '../FrameReducer';
import { InlineFieldGroup } from '../InlineFieldGroup';
import { ValuesEditor } from '../ValuesEditor';

/**
 * Properties
 */
type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

/**
 * Query Editor
 */
export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  /**
   * On Frame Change
   */
  const onFrameChange = useCallback(
    (frame: DataFrameViewModel) => {
      // Extract frame schema for validation.
      onChange({ ...query, frame: toDataFrame(frame) });
      onRunQuery();
    },
    [query, onChange, onRunQuery]
  );

  const reducer = useOnChangeReducer(frameReducer, onFrameChange);

  /**
   * Load existing data frame, or create a new one.
   */
  const [frame, dispatch] = useReducer(reducer, toViewModel(query.frame ?? { fields: [] }));

  const renameFrame = (name: string) => {
    dispatch({ type: 'rename', name });
  };

  const setPreferredVisualizationType = (preferredVisualisationType?: PreferredVisualisationType) => {
    dispatch({ type: 'set-preferred-visualisation-type', preferredVisualisationType });
  };

  const schema = frame.fields.map((f) => f.type);

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
            label="Preferred visualization type in Explore"
            tooltip="Determines how to visualize the query result in Explore. Please ignore otherwise."
          >
            <Select
              isClearable={true}
              width={17}
              value={frame.meta?.preferredVisualisationType}
              onChange={(e) => {
                setPreferredVisualizationType(e ? (e.value as PreferredVisualisationType) : undefined);
              }}
              options={preferredVisualizationTypes.map((t) => ({
                label: t[0].toUpperCase() + t.substr(1),
                value: t,
              }))}
            />
          </InlineField>
        </InlineFieldRow>
      </InlineFieldGroup>

      {/* Field configuration */}
      <InlineFieldGroup label="Fields">
        <FieldsEditor frame={frame} dispatch={dispatch} />
      </InlineFieldGroup>

      {/* Value configuration */}
      <InlineFieldGroup label="Values">
        <ValuesEditor
          frame={frame}
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
