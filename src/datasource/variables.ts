import { CustomVariableSupport, DataQueryRequest, DataQueryResponse } from '@grafana/data';
import { getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import { VariableQueryEditor } from 'components';
import { Observable } from 'rxjs';

import { DataSource } from './datasource';

/**
 * Variable Support
 */
export class VariableSupport extends CustomVariableSupport<DataSource> {
  constructor(private readonly datasource: DataSource, private readonly templateSrv: TemplateSrv = getTemplateSrv()) {
    super();
  }

  editor = VariableQueryEditor;

  query(request: DataQueryRequest<any>): Observable<DataQueryResponse> {
    throw new Error('Method not implemented.');
  }
}
