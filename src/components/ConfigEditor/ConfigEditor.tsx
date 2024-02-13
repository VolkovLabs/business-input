import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FieldSet, InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui';
import React, { useCallback } from 'react';

import { CODE_EDITOR_ENABLED_OPTIONS, TEST_IDS } from '../../constants';
import { StaticDataSourceOptions } from '../../types';

/**
 * Editor Properties
 */
type Props = DataSourcePluginOptionsEditorProps<StaticDataSourceOptions>;

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
    <FieldSet data-testid={TEST_IDS.configEditor.root}>
      <InlineFieldRow>
        <InlineField
          label="JavaScript Values Editor"
          labelWidth={20}
          data-testid={TEST_IDS.configEditor.codeEditorEnabledContainer}
        >
          <RadioButtonGroup
            options={CODE_EDITOR_ENABLED_OPTIONS}
            value={options.jsonData.codeEditorEnabled || false}
            onChange={onChangeCodeEditorEnabled}
          />
        </InlineField>
      </InlineFieldRow>
    </FieldSet>
  );
};
