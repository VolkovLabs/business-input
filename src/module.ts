import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { QueryEditor } from './components/QueryEditor';
import { StaticQuery, StaticDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, StaticQuery, StaticDataSourceOptions>(DataSource).setQueryEditor(
  QueryEditor
);
