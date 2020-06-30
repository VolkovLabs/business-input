import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { QueryEditor } from './QueryEditor';
import { MyQuery, MyDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, MyQuery, MyDataSourceOptions>(DataSource).setQueryEditor(
  QueryEditor
);
