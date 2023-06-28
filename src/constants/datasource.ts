import { SelectableValue } from '@grafana/data';
import { TestIds } from './tests';

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
export const CodeEditorEnabledOptions: Array<SelectableValue<boolean>> = [
  { value: false, label: 'Disabled', ariaLabel: TestIds.configEditor.codeEditorEnabledOption('false') },
  { value: true, label: 'Enabled', ariaLabel: TestIds.configEditor.codeEditorEnabledOption('true') },
];
