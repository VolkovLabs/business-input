import { FieldType } from '@grafana/data';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';
import { ValuesEditor } from '../types';

/**
 * Field Types
 */
export const FieldTypes = [
  FieldType.boolean,
  FieldType.geo,
  FieldType.number,
  FieldType.other,
  FieldType.string,
  FieldType.time,
  FieldType.trace,
];

/**
 * Length to show Text Area instead of Input
 */
export const TextAreaLength = 100;

/**
 * Values Editor Options
 */
export const ValuesEditorOptions = [
  {
    label: 'Manual',
    value: ValuesEditor.MANUAL,
  },
  {
    label: 'Custom',
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
 * Custom Values Editor Suggestions
 */
export const CustomValuesEditorSuggestions: CodeEditorSuggestionItem[] = [
  {
    label: 'frame',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'DataFrameDTO',
  },
];
