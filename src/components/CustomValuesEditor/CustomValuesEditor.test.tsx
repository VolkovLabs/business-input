import { getTemplateSrv } from '@grafana/runtime';
import { CodeEditor, CodeEditorSuggestionItemKind } from '@grafana/ui';
import { render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';

import { CUSTOM_VALUES_EDITOR_SUGGESTIONS, TEST_IDS } from '../../constants';
import { CustomValuesEditor } from './CustomValuesEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn(() => null),
  PageToolbar: jest.fn(({ leftItems, children }) => {
    return (
      <>
        {leftItems}
        {children}
      </>
    );
  }),
}));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn(),
}));

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Custom Values Editor
 */
describe('Custom Values Editor', () => {
  const model = { fields: [], rows: [] };
  const onRunQuery = jest.fn();

  /**
   * Get tested component
   * @param query
   * @param restProps
   */
  const getComponent = ({ ...restProps }: any) => {
    return <CustomValuesEditor model={model} onRunQuery={onRunQuery} {...restProps} />;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should find component', async () => {
    render(getComponent({}));
    expect(screen.getByTestId(TEST_IDS.customValuesEditor.root)).toBeInTheDocument();
  });

  it('Should enable formatting if enabled', () => {
    const runFormatDocument = jest.fn();
    const editor = {
      getAction: jest.fn().mockImplementation(() => ({
        run: runFormatDocument,
      })),
    };

    jest.mocked(CodeEditor).mockImplementation(({ onEditorDidMount }: any) => {
      useEffect(() => {
        onEditorDidMount(editor);
      }, [onEditorDidMount]);
      return null;
    });

    render(getComponent({}));
    jest.runAllTimers();

    expect(CodeEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        monacoOptions: {
          formatOnPaste: true,
          formatOnType: true,
        },
      }),
      expect.anything()
    );
    expect(editor.getAction).toHaveBeenCalledWith('editor.action.formatDocument');
    expect(runFormatDocument).toHaveBeenCalled();
  });

  it('Should save changes on blur', () => {
    const value = 'some value';
    const onChange = jest.fn();

    jest.mocked(CodeEditor).mockImplementation(({ onBlur }: any) => {
      onBlur(value);
      return null;
    });

    render(
      getComponent({
        onChange,
      })
    );

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          custom: {
            customCode: value,
          },
        }),
      })
    );
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('Should pass value on save', () => {
    const value = 'some value';
    const onChange = jest.fn();

    jest.mocked(CodeEditor).mockImplementation(({ onSave }: any) => {
      onSave(value);
      return null;
    });

    render(
      getComponent({
        onChange,
      })
    );

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          custom: {
            customCode: value,
          },
        }),
      })
    );
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('Should make correct suggestions', () => {
    let suggestionsResult;
    const variableWithDescription = { name: 'var1', description: 'Var description', label: 'Var Label' };
    const variableWithoutDescription = { name: 'var2', description: '', label: 'Var 2' };
    const variables = [variableWithDescription, variableWithoutDescription];

    jest.mocked(CodeEditor).mockImplementation(({ getSuggestions }: any) => {
      suggestionsResult = getSuggestions();
      return null;
    });
    jest.mocked(getTemplateSrv).mockImplementation(
      () =>
        ({
          getVariables: jest.fn().mockImplementation(() => variables),
        }) as any
    );

    render(getComponent({}));

    expect(suggestionsResult).toEqual(expect.arrayContaining(CUSTOM_VALUES_EDITOR_SUGGESTIONS));
    expect(suggestionsResult).toEqual(
      expect.arrayContaining([
        {
          label: `\$\{${variableWithDescription.name}\}`,
          kind: CodeEditorSuggestionItemKind.Property,
          detail: variableWithDescription.description,
        },
      ])
    );
    expect(suggestionsResult).toEqual(
      expect.arrayContaining([
        {
          label: `\$\{${variableWithoutDescription.name}\}`,
          kind: CodeEditorSuggestionItemKind.Property,
          detail: variableWithoutDescription.label,
        },
      ])
    );
  });
});
