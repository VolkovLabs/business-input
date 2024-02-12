import { DataSourceSettings } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TestIds } from '../../constants';
import { StaticDataSourceOptions } from '../../types';
import { ConfigEditor } from './ConfigEditor';

/**
 * Override Options
 */
interface OverrideOptions {
  [key: string]: unknown;
  jsonData?: object;
  secureJsonData?: object | null;
}

/**
 * Configuration Options
 */
const getOptions = ({
  jsonData = {},
  secureJsonData = {},
  ...overrideOptions
}: OverrideOptions = {}): DataSourceSettings<StaticDataSourceOptions, any> => ({
  id: 1,
  orgId: 2,
  name: '',
  typeLogoUrl: '',
  type: '',
  uid: '',
  typeName: '',
  access: '',
  url: '',
  user: '',
  database: '',
  basicAuth: false,
  basicAuthUser: '',
  isDefault: false,
  secureJsonFields: {},
  readOnly: false,
  withCredentials: false,
  ...overrideOptions,
  jsonData: {
    codeEditorEnabled: false,
    ...jsonData,
  },
  secureJsonData: {
    apiKey: '',
    ...secureJsonData,
  },
});

/**
 * Config Editor
 */
describe('ConfigEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  /**
   * Code Editor
   */
  describe('Code Editor Enabled', () => {
    it('Should change code editor enabled value', () => {
      let appliedOptions = getOptions({ jsonData: { codeEditorEnabled: false } });
      const onChange = jest.fn((options) => (appliedOptions = options));

      const { rerender } = render(<ConfigEditor options={appliedOptions} onOptionsChange={onChange} />);

      expect(screen.getByTestId(TestIds.configEditor.codeEditorEnabledContainer)).toBeInTheDocument();
      expect(screen.getByLabelText(TestIds.configEditor.codeEditorEnabledOption('false'))).toBeChecked();

      fireEvent.click(screen.getByLabelText(TestIds.configEditor.codeEditorEnabledOption('true')));

      rerender(<ConfigEditor options={appliedOptions} onOptionsChange={onChange} />);

      expect(screen.getByLabelText(TestIds.configEditor.codeEditorEnabledOption('false'))).not.toBeChecked();
      expect(screen.getByLabelText(TestIds.configEditor.codeEditorEnabledOption('true'))).toBeChecked();
    });
  });
});
