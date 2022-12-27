import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  toDataFrame,
} from '@grafana/data';
import { DataSourceTestStatus } from '../constants';
import { StaticDataSourceOptions, StaticQuery } from '../types';
import { interpolateVariables } from '../utils';

/**
 * DataSource returns the data frame returned in the query model.
 */
export class DataSource extends DataSourceApi<StaticQuery, StaticDataSourceOptions> {
  /**
   * Constructor
   */
  constructor(instanceSettings: DataSourceInstanceSettings<StaticDataSourceOptions>) {
    super(instanceSettings);
  }

  /**
   * Query
   */
  async query(options: DataQueryRequest<StaticQuery>): Promise<DataQueryResponse> {
    return {
      data: options.targets
        .filter((target) => !target.hide)
        .filter((target) => target.frame)
        .map((target) => ({ ...toDataFrame(target.frame), refId: target.refId }))
        .map(interpolateVariables),
    };
  }

  /**
   * This line adds support for annotation queries in >=7.2.
   */
  annotations = {};

  /**
   * Health Check
   * This data source makes no external requests so no need to test.
   */
  async testDatasource() {
    return {
      status: DataSourceTestStatus.SUCCESS,
      message: 'Success',
    };
  }
}
