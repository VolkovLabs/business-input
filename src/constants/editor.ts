import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';
import { ValuesEditor } from '../types';

/**
 * Custom Editor
 */
export const CustomCode = `const result = {
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
export const ValuesEditorOptions = [
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
export const CustomValuesEditorSuggestions: CodeEditorSuggestionItem[] = [
  {
    label: 'frame',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'DataFrameDTO',
  },
];
