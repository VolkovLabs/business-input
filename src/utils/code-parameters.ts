import { DataFrameDTO } from '@grafana/data';
import { openai } from '@grafana/llm';
import { CodeEditorSuggestionItemKind } from '@grafana/ui';
import { CodeParameterItem, CodeParametersBuilder } from '@volkovlabs/components';

/**
 * Code Parameters
 */
export const codeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    frame: new CodeParameterItem<DataFrameDTO>('DataFrameDTO'),
    llmResult: new CodeParameterItem<openai.ChatCompletionsResponse | undefined>('Chat Completions Response'),
    utils: {
      detail: 'Utils and helpers functions.',
      items: {
        toDataFrame: new CodeParameterItem<(data: unknown) => void>(
          'Return as a Data Frame',
          CodeEditorSuggestionItemKind.Method
        ),
      },
    },
  },
});
