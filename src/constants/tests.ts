/**
 * Tests Identifiers
 */
export const TEST_IDS = {
  fieldsEditor: {
    root: 'data-testid fields-editor',
    buttonAdd: 'data-testid fields-editor button-add',
    buttonRemove: 'data-testid fields-editor button-remove',
    fieldName: 'data-testid fields-editor field-name',
    fieldType: 'data-testid fields-editor field-type',
    item: 'data-testid fields-editor item',
    itemHeader: (name: string) => `data-testid fields-editor item-header-${name}`,
    itemContent: (name: string) => `data-testid fields-editor item-content-${name}`,
  },
  queryEditor: {
    customValuesEditor: 'data-testid query-editor custom-values-editor',
    fieldName: 'data-testid query-editor field-name',
    fieldPreferredVisualizationType: 'query-editor field-preferred-visualization-type',
    fieldValuesEditor: 'query-editor field-values-editor',
    valuesEditor: 'data-testid query-editor values-editor',
  },
  valueInput: {
    fieldDateTime: 'data-testid value-input field-date-time',
    fieldNumber: 'data-testid value-input field-number',
    fieldString: 'data-testid value-input field-string',
    fieldTextarea: 'data-testid value-input field-textarea',
    iconDisable: 'data-testid value-input icon-disable',
  },
  valuesEditor: {
    root: 'data-testid values-editor',
    buttonAdd: 'data-testid values-editor button-add',
    buttonCopy: 'data-testid values-editor button-copy',
    buttonRemove: 'data-testid values-editor button-remove',
    row: 'data-testid values-editor row',
    itemHeader: (name: string) => `data-testid values-editor item-header-${name}`,
    itemContent: (name: string) => `data-testid values-editor item-content-${name}`,
  },
  customValuesEditor: {
    root: 'data-testid custom-values-editor',
  },
  configEditor: {
    codeEditorEnabledContainer: 'data-testid config-editor code-editor-enabled-container',
    codeEditorEnabledOption: (name: string) => `data-testid config-editor code-editor-enabled-option-${name}`,
    root: 'data-testid config-editor',
  },
};
