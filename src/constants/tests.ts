/**
 * Tests Identifiers
 */
export const TestIds = {
  fieldsEditor: {
    item: 'data-testid fields-editor item',
    fieldName: 'data-testid fields-editor field-name',
    fieldType: 'data-testid fields-editor field-type',
    buttonAdd: 'data-testid fields-editor button-add',
    buttonRemove: 'data-testid fields-editor button-remove',
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
    fieldTextarea: 'data-testid value-input field-textarea',
    fieldDateTime: 'data-testid value-input field-date-time',
    fieldNumber: 'data-testid value-input field-number',
    iconDisable: 'data-testid value-input icon-disable',
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
