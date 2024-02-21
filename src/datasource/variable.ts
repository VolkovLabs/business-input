import { DataSourceVariableSupport } from '@grafana/data';
import { StaticQuery } from 'types';

import { DataSource } from './datasource';

/**
 * Variable Support
 */
export class VariableSupport extends DataSourceVariableSupport<DataSource, StaticQuery> {
  constructor() {
    super();
  }
}
