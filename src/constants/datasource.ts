import { SelectableValue } from '@grafana/data';

import { TEST_IDS } from './tests';

/**
 * Datasource test status
 */
export enum DataSourceTestStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Code Editor Enabled Options
 */
export const CODE_EDITOR_ENABLED_OPTIONS: Array<SelectableValue<boolean>> = [
  { value: false, label: 'Disabled', ariaLabel: TEST_IDS.configEditor.codeEditorEnabledOption('false') },
  { value: true, label: 'Enabled', ariaLabel: TEST_IDS.configEditor.codeEditorEnabledOption('true') },
];
