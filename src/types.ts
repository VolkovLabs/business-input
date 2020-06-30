import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';

export interface MyField {
  name: string;
  type: FieldType;
}

export interface MyDataFrame {
  name: string;
  fields: MyField[];
  rows: any[][];
}

export interface MyQuery extends DataQuery {
  frame: MyDataFrame;
}

export const defaultQuery: Partial<MyQuery> = {
  frame: {
    name: '',
    fields: [],
    rows: [],
  },
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
