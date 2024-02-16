import {
  CoreApp,
  PreferredVisualisationType,
  preferredVisualizationTypes,
  QueryEditorProps,
  SelectableValue,
} from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React, { useCallback, useState } from 'react';

import { TEST_IDS, VALUES_EDITOR_OPTIONS } from '../../constants';
import { DataSource } from '../../datasource';
import { DataFrameModel, StaticDataSourceOptions, StaticQuery, ValuesEditor as ValuesEditorType } from '../../types';
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
export const QueryEditor: React.FC<Props> = ({ datasource, onChange, onRunQuery, query, app }) => {
  const [model, setModel] = useState(prepareModel(query.frame ?? { fields: [] }));

  /**
   * Rename Frame
   */
  const renameFrame = useCallback(
    (name: string) => {
      /**
       * Change
       */
      setModel({
        ...model,
        name: name,
      });
      onChange({ ...query, frame: convertToDataFrame({ ...model, name }) });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  const onChangeModel = useCallback(
    (value: DataFrameModel) => {
      setModel(value);
      onChange({ ...query, frame: convertToDataFrame(value) });
      onRunQuery();
    },
    [onChange, onRunQuery, query]
  );

  /**
   * Set Preferred Visualization Type
   */
  const onChangePreferredVisualizationType = useCallback(
    (event: SelectableValue<PreferredVisualisationType>) => {
      /**
       * Change
       */
      setModel({
        ...model,
        meta: {
          ...model.meta,
          preferredVisualisationType: event.value,
        },
      });
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
      setModel({
        ...model,
        meta: {
          ...model.meta,
          custom: {
            ...(model.meta?.custom || {}),
            valuesEditor: event.value,
          },
        },
      });
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
            data-testid={TEST_IDS.queryEditor.fieldName}
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
              aria-label={TEST_IDS.queryEditor.fieldPreferredVisualizationType}
            />
          </InlineField>
        )}

        {datasource.codeEditorEnabled && (
          <InlineField label="Values Editor">
            <Select
              width={17}
              value={model.meta?.custom?.valuesEditor || ValuesEditorType.MANUAL}
              onChange={onChangeValuesEditor}
              options={VALUES_EDITOR_OPTIONS}
              aria-label={TEST_IDS.queryEditor.fieldValuesEditor}
            />
          </InlineField>
        )}
      </InlineFieldRow>
      <CollapsableSection label="Fields" isOpen={true}>
        <FieldsEditor model={model} onChange={onChangeModel} />
      </CollapsableSection>

      {model.meta?.custom?.valuesEditor === ValuesEditorType.CUSTOM && datasource.codeEditorEnabled ? (
        <CollapsableSection
          label="JavaScript Values Editor"
          isOpen={true}
          contentDataTestId={TEST_IDS.queryEditor.customValuesEditor}
        >
          <CustomValuesEditor model={model} onChange={onChangeModel} />
        </CollapsableSection>
      ) : (
        <CollapsableSection label="Values" isOpen={true} contentDataTestId={TEST_IDS.queryEditor.valuesEditor}>
          <ValuesEditor model={model} onChange={onChangeModel} />
        </CollapsableSection>
      )}
    </>
  );
};
