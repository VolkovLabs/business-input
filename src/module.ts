import { DataSourcePlugin } from '@grafana/data';
import { QueryEditor } from './components/QueryEditor';
import { DataSource } from './datasource';
import { StaticDataSourceOptions, StaticQuery } from './types';

/**
 * Datasource Plugin
 */
export const plugin = new DataSourcePlugin<DataSource, StaticQuery, StaticDataSourceOptions>(DataSource).setQueryEditor(
  QueryEditor
);
