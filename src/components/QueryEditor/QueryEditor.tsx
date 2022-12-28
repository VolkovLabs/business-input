import React from 'react';
import { CoreApp, PreferredVisualisationType, preferredVisualizationTypes, QueryEditorProps } from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { DataSource } from '../../datasource';
import { StaticDataSourceOptions, StaticQuery } from '../../types';
import { convertToDataFrame, prepareModel } from '../../utils';
import { FieldsEditor } from '../FieldsEditor';
import { ValuesEditor } from '../ValuesEditor';

/**
 * Properties
 */
type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

/**
 * Query Editor
 */
export const QueryEditor: React.FC<Props> = ({ onChange, onRunQuery, query, app }) => {
  const model = prepareModel(query.frame ?? { fields: [] });

  /**
   * Rename Frame
   */
  const renameFrame = (name: string) => {
    model.name = name;

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  /**
   * Set Preferred Visualization Type
   */
  const setPreferredVisualizationType = (preferredVisualisationType?: PreferredVisualisationType) => {
    model.meta = { ...model.meta, preferredVisualisationType: preferredVisualisationType };

    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame(model) });
    onRunQuery();
  };

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Name" tooltip="Name of the data frame" grow>
          <Input onChange={(e) => renameFrame(e.currentTarget.value)} value={model.name} />
        </InlineField>

        {app === CoreApp.Explore && (
          <InlineField label="Preferred visualization type">
            <Select
              isClearable={true}
              width={17}
              value={model.meta?.preferredVisualisationType}
              onChange={(e) => {
                setPreferredVisualizationType(e ? (e.value as PreferredVisualisationType) : undefined);
              }}
              options={preferredVisualizationTypes
                .map((t) => ({
                  label: t[0].toUpperCase() + t.substring(1),
                  value: t,
                }))
                .sort((a, b) => a.value.localeCompare(b.value))}
            />
          </InlineField>
        )}
      </InlineFieldRow>

      <CollapsableSection label="Fields" isOpen={true}>
        <FieldsEditor query={query} model={model} onChange={onChange} onRunQuery={onRunQuery} />
      </CollapsableSection>

      <CollapsableSection label="Values" isOpen={true}>
        <ValuesEditor query={query} model={model} onChange={onChange} onRunQuery={onRunQuery} />
      </CollapsableSection>
    </>
  );
};
