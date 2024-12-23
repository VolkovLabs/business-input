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
    buttonCollapseAll: 'data-testid fields-editor button-collapse-all',
    buttonExpandAll: 'data-testid fields-editor button-expand-all',
  },
  queryEditor: {
    root: 'data-testid query-editor root',
    customValuesEditor: 'data-testid query-editor custom-values-editor',
    fieldName: 'data-testid query-editor field-name',
    fieldPreferredVisualizationType: 'query-editor field-preferred-visualization-type',
    fieldValuesEditor: 'query-editor field-values-editor',
    valuesEditor: 'data-testid query-editor values-editor',
    fieldOpenaiMessage: 'data-testid query-editor field-openai-message',
  },
  valueInput: {
    fieldDateTime: (name: string) => `data-testid value-input field-date-time-${name}`,
    fieldNumber: (name: string) => `data-testid value-input field-number-${name}`,
    fieldString: (name: string) => `data-testid value-input field-string-${name}`,
    fieldTextarea: (name: string) => `data-testid value-input field-textarea-${name}`,
    iconDisable: (name: string) => `data-testid value-input icon-disable-${name}`,
  },
  booleanEditor: {
    fieldSwitch: 'data-testid boolean-input field-switch',
    iconDisable: 'data-testid boolean-input icon-disable',
  },
  valuesEditor: {
    root: 'data-testid values-editor',
    buttonAdd: 'data-testid values-editor button-add',
    buttonAddTop: 'data-testid values-editor button-add-start',
    buttonAddEnd: 'data-testid values-editor button-add-end',
    buttonCopy: 'data-testid values-editor button-copy',
    buttonRemove: 'data-testid values-editor button-remove',
    row: 'data-testid values-editor row',
    itemHeader: (name: string) => `data-testid values-editor item-header-${name}`,
    itemContent: (name: string) => `data-testid values-editor item-content-${name}`,
    buttonCollapseAll: 'data-testid values-editor button-collapse-all',
    buttonExpandAll: 'data-testid values-editor button-expand-all',
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
