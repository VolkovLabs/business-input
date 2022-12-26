import { DataFrameDTO, DataQuery, DataSourceJsonData } from '@grafana/data';

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
