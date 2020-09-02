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

export interface MyDataSourceOptions extends DataSourceJsonData {}

export interface MySecureJsonData {}
