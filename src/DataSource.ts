import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const data = options.targets
      .filter(target => !target.hide)
      .map(target => {
        const query = target;
        const frame = new MutableDataFrame({
          name: query.frame.name,
          refId: target.refId,
          fields: query.frame.fields.map((field: any) => ({ name: field.name, type: field.type })),
        });

        query.frame.rows.forEach((row: any[]) => {
          const rowVals: any = {};
          row.forEach((cell, i) => {
            rowVals[query.frame.fields[i].name] = cell;
          });
          frame.add(rowVals);
        });

        return frame;
      });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
