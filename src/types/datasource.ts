import { DataFrameDTO, DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

/**
 * Datasource Options
 */
export interface StaticDataSourceOptions extends DataSourceJsonData {}

/**
 * Query
 */
export interface StaticQuery extends DataQuery {
  /**
   * Frame
   *
   * @type {DataFrameDTO}
   */
  frame: DataFrameDTO;
}
