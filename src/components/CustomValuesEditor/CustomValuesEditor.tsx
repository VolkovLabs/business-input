import { getTemplateSrv } from '@grafana/runtime';
import { CodeEditor, CodeEditorSuggestionItem, CodeEditorSuggestionItemKind, InlineField } from '@grafana/ui';
/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback } from 'react';

import { CodeLanguage, CUSTOM_CODE, CUSTOM_VALUES_EDITOR_SUGGESTIONS, TEST_IDS } from '../../constants';
import { DataFrameModel, StaticQuery } from '../../types';
import { convertToDataFrame } from '../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Model
   *
   * @type {DataFrameModel}
   */
  model: DataFrameModel;

  /**
   * Query
   *
   * @type {StaticQuery}
   */
  query: StaticQuery;

  /**
   * On Change
   */
  onChange: (value: StaticQuery) => void;

  /**
   * On Run Query
   */
  onRunQuery: () => void;
}

/**
 * Custom Values Editor
 */
export const CustomValuesEditor = ({ model, query, onChange, onRunQuery }: Props) => {
  /**
   * Template Service to get Variables
   */
  const templateSrv = getTemplateSrv();

  /**
   * Change code
   */
  const onChangeCode = useCallback(
    (code: string) => {
      onChange({
        ...query,
        frame: convertToDataFrame({
          ...model,
          meta: {
            ...(model.meta || {}),
            custom: {
              ...(model.meta?.custom || {}),
              customCode: code,
            },
          },
        }),
      });
      onRunQuery();
    },
    [model, onChange, onRunQuery, query]
  );

  /**
   * Format On Mount
   */
  const onEditorMount = (editor: monacoType.editor.IStandaloneCodeEditor) => {
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument').run();
    }, 100);
  };

  /**
   * Suggestions
   */
  const getSuggestions = useCallback((): CodeEditorSuggestionItem[] => {
    /**
     * Add Variables
     */
    const suggestions = templateSrv.getVariables().map((variable) => {
      return {
        label: `\$\{${variable.name}\}`,
        kind: CodeEditorSuggestionItemKind.Property,
        detail: variable.description ? variable.description : variable.label,
      };
    });

    return [...CUSTOM_VALUES_EDITOR_SUGGESTIONS, ...suggestions];
  }, [templateSrv]);

  return (
    <>
      <InlineField grow={true} data-testid={TEST_IDS.customValuesEditor.root}>
        <CodeEditor
          value={model?.meta?.custom?.customCode || CUSTOM_CODE}
          language={CodeLanguage.JAVASCRIPT}
          height={300}
          monacoOptions={{ formatOnPaste: true, formatOnType: true }}
          onBlur={onChangeCode}
          onSave={onChangeCode}
          showLineNumbers={true}
          getSuggestions={getSuggestions}
          onEditorDidMount={onEditorMount}
        />
      </InlineField>
    </>
  );
};
