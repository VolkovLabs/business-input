import { DataFrameDTO } from '@grafana/data';
import { openai } from '@grafana/llm';
import { CodeParameterItem, CodeParametersBuilder } from '@volkovlabs/components';

/**
 * Code Parameters
 */
export const codeParameters = new CodeParametersBuilder({
  detail: 'All properties and methods.',
  items: {
    frame: new CodeParameterItem<DataFrameDTO>('DataFrameDTO'),
    llmResult: new CodeParameterItem<openai.ChatCompletionsResponse | undefined>('Chat Completions Response'),
  },
});
