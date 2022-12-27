import React, { useCallback, useReducer } from 'react';
import { PreferredVisualisationType, QueryEditorProps } from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { PreferredVisualizationTypes } from '../../constants';
import { DataSource } from '../../datasource';
import { DataFrameViewModel, StaticDataSourceOptions, StaticQuery } from '../../types';
import { toDataFrame, toFieldValue, toViewModel } from '../../utils';
import { FieldsEditor } from '../FieldsEditor';
import { frameReducer, useChangeReducer as useOnChangeReducer } from '../FrameReducer';
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
      /**
       * Extract frame schema for validation.
       */
      onChange({ ...query, frame: toDataFrame(frame) });
      onRunQuery();
    },
    [query, onChange, onRunQuery]
  );

  /**
   * Reducer
   */
  const reducer = useOnChangeReducer(frameReducer, onFrameChange);

  /**
   * Load existing data frame, or create a new one.
   */
  const [frame, dispatch] = useReducer(reducer, toViewModel(query.frame ?? { fields: [] }));

  /**
   * Rename Frame
   */
  const renameFrame = (name: string) => {
    dispatch({ type: 'rename', name });
  };

  /**
   * Set Preferred Visualization Type
   */
  const setPreferredVisualizationType = (preferredVisualisationType?: PreferredVisualisationType) => {
    dispatch({ type: 'set-preferred-visualisation-type', preferredVisualisationType });
  };

  /**
   * Schema
   */
  const schema = frame.fields.map((f) => f.type);

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Name" tooltip="Name of the data frame" grow>
          <Input onChange={(e) => renameFrame(e.currentTarget.value)} value={frame.name} />
        </InlineField>
        <InlineField
          label="Preferred visualization type in Explore"
          tooltip="Determines how to visualize the query result in Explore. Ignore otherwise."
        >
          <Select
            isClearable={true}
            width={17}
            value={frame.meta?.preferredVisualisationType}
            onChange={(e) => {
              setPreferredVisualizationType(e ? (e.value as PreferredVisualisationType) : undefined);
            }}
            options={PreferredVisualizationTypes.map((t) => ({
              label: t[0].toUpperCase() + t.substring(1),
              value: t,
            }))}
          />
        </InlineField>
      </InlineFieldRow>

      <CollapsableSection label="Fields" isOpen={true}>
        <FieldsEditor frame={frame} dispatch={dispatch} />
      </CollapsableSection>

      <CollapsableSection label="Values" isOpen={true}>
        <ValuesEditor frame={frame} onValidate={(value, j) => toFieldValue(value, schema[j]).ok} dispatch={dispatch} />
      </CollapsableSection>
    </>
  );
};
