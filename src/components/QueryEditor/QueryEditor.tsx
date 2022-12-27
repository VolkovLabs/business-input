import React from 'react';
import { PreferredVisualisationType, QueryEditorProps } from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { PreferredVisualizationTypes } from '../../constants';
import { DataSource } from '../../datasource';
import { StaticDataSourceOptions, StaticQuery } from '../../types';
import { toFieldValue, toViewModel } from '../../utils';
import { FieldsEditor } from '../FieldsEditor';
import { ValuesEditor } from '../ValuesEditor';

/**
 * Properties
 */
type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

/**
 * Query Editor
 */
export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query }) => {
  const frame = toViewModel(query.frame ?? { fields: [] });

  /**
   * Rename Frame
   */
  const renameFrame = (name: string) => {
    onChange({ ...query, frame: { ...query.frame, name: name } });
    onRunQuery();
  };

  /**
   * Set Preferred Visualization Type
   */
  const setPreferredVisualizationType = (preferredVisualisationType?: PreferredVisualisationType) => {
    onChange({
      ...query,
      frame: { ...query.frame, meta: { ...query.frame.meta, preferredVisualisationType: preferredVisualisationType } },
    });
    onRunQuery();
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
        <FieldsEditor query={query} frame={frame} onChange={onChange} onRunQuery={onRunQuery} />
      </CollapsableSection>

      <CollapsableSection label="Values" isOpen={true}>
        <ValuesEditor
          query={query}
          frame={frame}
          onValidate={(value, j) => toFieldValue(value, schema[j]).ok}
          onChange={onChange}
          onRunQuery={onRunQuery}
        />
      </CollapsableSection>
    </>
  );
};
