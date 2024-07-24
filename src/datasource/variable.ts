import { CustomVariableSupport, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { from, Observable } from 'rxjs';
import { StaticQuery } from 'types';

import { QueryEditor } from '../components';
import { DataSource } from './datasource';

/**
 * Variable Support
 */
export class VariableSupport extends CustomVariableSupport<DataSource, StaticQuery> {
  constructor(private readonly datasource: DataSource) {
    super();
  }

  editor = QueryEditor;

  query(options: DataQueryRequest<StaticQuery>): Observable<DataQueryResponse> {
    return from(this.datasource.query(options));
  }
}
