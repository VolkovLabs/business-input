import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';

import { StaticQuery, StaticDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<StaticQuery, StaticDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<StaticDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<StaticQuery>): Promise<DataQueryResponse> {
    return {
      data: options.targets
        .filter(target => !target.hide)
        .filter(target => target.frame)
        .map(target => target.frame),
    };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
