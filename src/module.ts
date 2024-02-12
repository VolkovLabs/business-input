import { DataSourcePlugin } from '@grafana/data';

import { ConfigEditor, QueryEditor } from './components';
import { DataSource } from './datasource';
import { StaticDataSourceOptions, StaticQuery } from './types';

/**
 * Datasource Plugin
 */
export const plugin = new DataSourcePlugin<DataSource, StaticQuery, StaticDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
