/**
 * Tests Identifiers
 */
export const TestIds = {
  fieldsEditor: {
    buttonAdd: 'data-testid fields-editor button-add',
  },
  queryEditor: {
    fieldName: 'data-testid query-editor field-name',
    fieldPreferredVisualizationType: 'query-editor field-preferred-visualization-type',
    fieldValuesEditor: 'query-editor field-values-editor',
    valuesEditor: 'data-testid query-editor values-editor',
    customValuesEditor: 'data-testid query-editor custom-values-editor',
  },
  valueInput: {
    fieldString: 'data-testid value-input field-string',
  },
  valuesEditor: {
    buttonAddRow: 'data-testid values-editor button-add-row',
  },
  customValuesEditor: {
    root: 'data-testid custom-values-editor',
  },
  configEditor: {
    root: 'data-testid config-editor',
    codeEditorEnabledContainer: 'data-testid config-editor code-editor-enabled-container',
    codeEditorEnabledOption: (name: string) => `data-testid config-editor code-editor-enabled-option-${name}`,
  },
};
