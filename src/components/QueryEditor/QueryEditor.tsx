import {
  CoreApp,
  PreferredVisualisationType,
  preferredVisualizationTypes,
  QueryEditorProps,
  SelectableValue,
} from '@grafana/data';
import { openai } from '@grafana/llm';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select, TextArea, useStyles2 } from '@grafana/ui';
import React, { useCallback, useEffect, useState } from 'react';

import { CUSTOM_CODE, TEST_IDS, VALUES_EDITOR_OPTIONS } from '../../constants';
import { DataSource } from '../../datasource';
import { DataFrameModel, StaticDataSourceOptions, StaticQuery, ValuesEditor as ValuesEditorType } from '../../types';
import { convertToDataFrame, prepareModel } from '../../utils';
import { CustomValuesEditor } from '../CustomValuesEditor';
import { FieldsEditor } from '../FieldsEditor';
import { ValuesEditor } from '../ValuesEditor';
import { getStyles } from './QueryEditor.styles';
/**
 * Properties
 */
type Props = QueryEditorProps<DataSource, StaticQuery, StaticDataSourceOptions>;

/**
 * Query Editor
 */
export const QueryEditor: React.FC<Props> = ({ datasource, onChange, onRunQuery, query, app }) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [model, setModel] = useState(prepareModel(query.frame ?? { fields: [] }));
  const [llmEnabled, setLlmEnabled] = useState(false);

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
            customCode: model.meta?.custom?.customCode || CUSTOM_CODE,
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
              customCode: model.meta?.custom?.customCode || CUSTOM_CODE,
            },
          },
        }),
      });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Change AI Message
   */
  const onChangeOpenaiMessage = useCallback(
    (message: string) => {
      onChange({
        ...query,
        frame: convertToDataFrame(model),
        llm: {
          ...query.llm,
          openai: {
            ...query.llm?.openai,
            message,
          },
        },
      });
    },
    [model, onChange, query]
  );

  /**
   * Check AI enabled
   */
  useEffect(() => {
    const check = async () => {
      const enabled = await openai.enabled();

      setLlmEnabled(enabled);
    };

    check();
  }, []);

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
      <CollapsableSection label="Fields" isOpen={true} contentClassName={styles.content}>
        <FieldsEditor model={model} onChange={onChangeModel} />
      </CollapsableSection>

      {model.meta?.custom?.valuesEditor === ValuesEditorType.CUSTOM && datasource.codeEditorEnabled ? (
        <>
          {llmEnabled && (
            <CollapsableSection label="OpenAI" isOpen={true}>
              <InlineField label="Message" grow={true}>
                <TextArea
                  value={query.llm?.openai?.message || ''}
                  onChange={(event) => onChangeOpenaiMessage(event.currentTarget.value)}
                  onBlur={() => onRunQuery()}
                  data-testid={TEST_IDS.queryEditor.fieldOpenaiMessage}
                />
              </InlineField>
            </CollapsableSection>
          )}
          <CollapsableSection
            label="JavaScript Values Editor"
            isOpen={true}
            contentDataTestId={TEST_IDS.queryEditor.customValuesEditor}
            contentClassName={styles.content}
          >
            <CustomValuesEditor model={model} onChange={onChangeModel} />
          </CollapsableSection>
        </>
      ) : (
        <CollapsableSection
          label="Values"
          isOpen={true}
          contentDataTestId={TEST_IDS.queryEditor.valuesEditor}
          contentClassName={styles.content}
        >
          <ValuesEditor model={model} onChange={onChangeModel} />
        </CollapsableSection>
      )}
    </>
  );
};
