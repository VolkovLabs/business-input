import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

import { ValuesEditor } from '../types';
import { codeParameters } from '../utils';

/**
 * Custom Editor
 */
export const CUSTOM_CODE = `const result = {
    ...frame,
    fields: frame.fields.map((field) => ({
      ...field,
      values: []
    }))
  }
  
  return Promise.resolve(result);`;

/**
 * Values Editor Options
 */
export const VALUES_EDITOR_OPTIONS = [
  {
    label: 'Manual',
    value: ValuesEditor.MANUAL,
  },
  {
    label: 'JavaScript',
    value: ValuesEditor.CUSTOM,
  },
];

/**
 * Supported Languages
 */
export const enum CodeLanguage {
  JAVASCRIPT = 'javascript',
}

/**
 * Suggestions
 */
export const CUSTOM_VALUES_EDITOR_SUGGESTIONS: CodeEditorSuggestionItem[] = [
  {
    label: 'frame',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'DataFrameDTO',
  },

  /**
   * Context Parameters
   */
  ...codeParameters.suggestions,
];
