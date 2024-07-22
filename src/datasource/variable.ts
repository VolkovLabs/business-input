import { CustomVariableSupport, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { StaticQuery } from 'types';
import { Observable, from } from 'rxjs';

import { DataSource } from './datasource';
import { QueryEditor } from '../components';

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
