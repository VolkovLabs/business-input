import React, { useCallback } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FieldSet, InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui';
import { CodeEditorEnabledOptions, TestIds } from '../../constants';
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
        <InlineField
          label="JavaScript Values Editor"
          labelWidth={20}
          data-testid={TestIds.configEditor.codeEditorEnabledContainer}
        >
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
