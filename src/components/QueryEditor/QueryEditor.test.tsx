import { CoreApp, DataSourcePluginContextProvider } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { ValuesEditor } from '../../types';
import { QueryEditor } from './QueryEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn(() => null),
  Select: jest.fn().mockImplementation(({ options, onChange, value, isClearable, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      /**
       * Fix jest warnings because null value.
       * For Select component in @grafana/io should be used null to reset value.
       */
      value={value === null ? '' : value}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

/**
 * Query Editor
 */
describe('Query Editor', () => {
  const query = {
    frame: {
      fields: [],
      name: '123',
      meta: {
        custom: {
          valuesEditor: null,
        },
      },
    },
  };
  const onChange = jest.fn();
  const onRunQuery = jest.fn();

  /**
   * Get Tested Component
   * @param restProps
   * @param contextValue
   */
  const getComponent = ({ ...restProps }: any, contextValue = { jsonData: { codeEditorEnabled: true } }) => {
    return (
      <DataSourcePluginContextProvider instanceSettings={contextValue as any}>
        <QueryEditor
          onChange={onChange}
          onRunQuery={onRunQuery}
          datasource={{ codeEditorEnabled: true }}
          {...restProps}
        />
      </DataSourcePluginContextProvider>
    );
  };

  it('Should rename query', () => {
    let currentQuery = query;
    const onChange = jest.fn((query) => (currentQuery = query));
    const { rerender } = render(getComponent({ query: currentQuery, onChange }));

    /**
     * Check name field presence
     */
    expect(screen.getByTestId(TEST_IDS.queryEditor.fieldName)).toBeInTheDocument();

    /**
     * Change name
     */
    const newName = 'new';
    fireEvent.change(screen.getByTestId(TEST_IDS.queryEditor.fieldName), { target: { value: newName } });

    rerender(getComponent({ query: currentQuery, onChange }));

    /**
     * Check if name is changed
     */
    expect(screen.getByTestId(TEST_IDS.queryEditor.fieldName)).toHaveValue(newName);
  });

  it('Should Set Preferred Visualization Type', () => {
    let currentQuery = query;
    const onChange = jest.fn((query) => (currentQuery = query));
    const { rerender } = render(getComponent({ query: currentQuery, onChange, app: CoreApp.Explore }));

    /**
     * Check name field presence
     */
    expect(screen.getByLabelText(TEST_IDS.queryEditor.fieldPreferredVisualizationType)).toBeInTheDocument();

    /**
     * Change type
     */
    const newType = 'graph';
    fireEvent.change(screen.getByLabelText(TEST_IDS.queryEditor.fieldPreferredVisualizationType), {
      target: { value: newType },
    });

    rerender(getComponent({ query: currentQuery, onChange, app: CoreApp.Explore }));

    /**
     * Check if name is changed
     */
    expect(screen.getByLabelText(TEST_IDS.queryEditor.fieldPreferredVisualizationType)).toHaveValue(newType);
  });

  it('Should show custom values editor', () => {
    let currentQuery = query;
    const onChange = jest.fn((query) => (currentQuery = query));
    const { rerender } = render(getComponent({ query: currentQuery, onChange }));

    /**
     * Check if CustomValuesEditor is not rendered
     */
    const fieldValuesEditor = screen.getByLabelText(TEST_IDS.queryEditor.fieldValuesEditor);
    expect(fieldValuesEditor).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.queryEditor.customValuesEditor)).not.toBeInTheDocument();

    /**
     * Change valuesEditor to Custom
     */
    fireEvent.change(fieldValuesEditor, { target: { value: ValuesEditor.CUSTOM } });

    rerender(getComponent({ query: currentQuery, onChange }));

    /**
     * Check if CustomValuesEditor is rendered
     */
    expect(screen.getByTestId(TEST_IDS.queryEditor.customValuesEditor)).toBeInTheDocument();
  });

  it('Should not allow to select values editor if disabled', () => {
    let currentQuery = query;
    const onChange = jest.fn((query) => (currentQuery = query));
    render(getComponent({ query: currentQuery, onChange, datasource: {} }));

    /**
     * Check if Select values editor is not rendered
     */
    expect(screen.queryByLabelText(TEST_IDS.queryEditor.fieldValuesEditor)).not.toBeInTheDocument();
  });

  it('Should render fields if frame is not specified', () => {
    render(getComponent({ query: { frame: null } }));

    expect(screen.getByTestId(TEST_IDS.queryEditor.fieldName)).toBeInTheDocument();
  });
});
