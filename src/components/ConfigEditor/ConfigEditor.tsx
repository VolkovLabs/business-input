import React, { useCallback } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FieldSet, InlineFieldRow, InlineField, RadioButtonGroup } from '@grafana/ui';
import { TestIds, CodeEditorEnabledOptions } from '../../constants';
import { StaticDataSourceOptions } from '../../types';

/**
 * Editor Properties
 */
interface Props extends DataSourcePluginOptionsEditorProps<StaticDataSourceOptions> {}

/**
 * Config Editor
 */
export const ConfigEditor: React.FC<Props> = ({ options, onOptionsChange }) => {
  /**
   * Code Editor Enabled Change
   */
  const onChangeCodeEditorEnabled = useCallback(
    (value: boolean) => {
      onOptionsChange({
        ...options,
        jsonData: {
          codeEditorEnabled: value,
        },
      });
    },
    [onOptionsChange, options]
  );

  return (
    <FieldSet data-testid={TestIds.configEditor.root}>
      <InlineFieldRow>
        <InlineField label="Code Editor" labelWidth={14} data-testid={TestIds.configEditor.codeEditorEnabledContainer}>
          <RadioButtonGroup
            options={CodeEditorEnabledOptions}
            value={options.jsonData.codeEditorEnabled || false}
            onChange={onChangeCodeEditorEnabled}
          />
        </InlineField>
      </InlineFieldRow>
    </FieldSet>
  );
};
