import React, { useCallback } from 'react';
import {
  CoreApp,
  DataSourceInstanceSettings,
  isDataSourcePluginContext,
  PreferredVisualisationType,
  preferredVisualizationTypes,
  QueryEditorProps,
  SelectableValue,
  usePluginContext,
} from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { TestIds, ValuesEditorOptions } from '../../constants';
import { DataSource } from '../../datasource';
import { StaticDataSourceOptions, StaticQuery, ValuesEditor as ValuesEditorType } from '../../types';
import { convertToDataFrame, prepareModel } from '../../utils';
import { CustomValuesEditor } from '../CustomValuesEditor';
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
  const pluginContext = usePluginContext();

  /**
   * Check Code Editor is Enabled
   */
  let isCodeEditorEnabled = false;
  if (isDataSourcePluginContext(pluginContext)) {
    isCodeEditorEnabled =
      (pluginContext.instanceSettings as DataSourceInstanceSettings<StaticDataSourceOptions>).jsonData
        .codeEditorEnabled || false;
  }

  /**
   * Rename Frame
   */
  const renameFrame = (name: string) => {
    /**
     * Change
     */
    onChange({ ...query, frame: convertToDataFrame({ ...model, name }) });
    onRunQuery();
  };

  /**
   * Set Preferred Visualization Type
   */
  const onChangePreferredVisualizationType = useCallback(
    (event: SelectableValue<PreferredVisualisationType>) => {
      /**
       * Change
       */
      onChange({
        ...query,
        frame: convertToDataFrame({
          ...model,
          meta: {
            ...model.meta,
            preferredVisualisationType: event.value,
          },
        }),
      });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Set Value Editor
   */
  const onChangeValuesEditor = useCallback(
    (event: SelectableValue<ValuesEditorType>) => {
      /**
       * Change
       */
      onChange({
        ...query,
        frame: convertToDataFrame({
          ...model,
          meta: {
            ...model.meta,
            custom: {
              ...(model.meta?.custom || {}),
              valuesEditor: event.value,
            },
          },
        }),
      });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Name" tooltip="Name of the data frame" grow>
          <Input
            onChange={(e) => renameFrame(e.currentTarget.value)}
            value={model.name}
            data-testid={TestIds.queryEditor.fieldName}
          />
        </InlineField>

        {app === CoreApp.Explore && (
          <InlineField label="Preferred visualization type">
            <Select
              isClearable={true}
              width={17}
              value={model.meta?.preferredVisualisationType}
              onChange={onChangePreferredVisualizationType}
              options={preferredVisualizationTypes
                .map((t) => ({
                  label: t[0].toUpperCase() + t.substring(1),
                  value: t,
                }))
                .sort((a, b) => a.value.localeCompare(b.value))}
              aria-label={TestIds.queryEditor.fieldPreferredVisualizationType}
            />
          </InlineField>
        )}

        {isCodeEditorEnabled && (
          <InlineField label="Values Editor">
            <Select
              width={17}
              value={model.meta?.custom?.valuesEditor || ValuesEditorType.MANUAL}
              onChange={onChangeValuesEditor}
              options={ValuesEditorOptions}
              aria-label={TestIds.queryEditor.fieldValuesEditor}
            />
          </InlineField>
        )}
      </InlineFieldRow>
      <CollapsableSection label="Fields" isOpen={true}>
        <FieldsEditor query={query} model={model} onChange={onChange} onRunQuery={onRunQuery} />
      </CollapsableSection>

      {model.meta?.custom?.valuesEditor === ValuesEditorType.CUSTOM && isCodeEditorEnabled ? (
        <CollapsableSection
          label="JavaScript Values Editor"
          isOpen={true}
          contentDataTestId={TestIds.queryEditor.customValuesEditor}
        >
          <CustomValuesEditor query={query} model={model} onChange={onChange} onRunQuery={onRunQuery} />
        </CollapsableSection>
      ) : (
        <CollapsableSection label="Values" isOpen={true} contentDataTestId={TestIds.queryEditor.valuesEditor}>
          <ValuesEditor query={query} model={model} onChange={onChange} onRunQuery={onRunQuery} />
        </CollapsableSection>
      )}
    </>
  );
};
