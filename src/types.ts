import { DataQuery, DataSourceJsonData, FieldType } from '@grafana/data';

export interface MyField {
  name: string;
  type: FieldType;
}

export type FieldValue = string | number | boolean | null;

export interface MyDataFrame {
  name: string;
  fields: MyField[];
  rows: FieldValue[][];
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
export interface MyDataSourceOptions extends DataSourceJsonData {}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
