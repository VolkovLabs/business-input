import { DataFrameDTO, DataQuery, DataSourceJsonData, FieldType, PreferredVisualisationType } from '@grafana/data';

export type NullableString = string | null;

export interface Field {
  name: string;
  type: FieldType;
}

// DataFrameViewModel is used as a intermediate frame state for easier
// manipulation and validation.
export interface DataFrameViewModel {
  name?: string;
  meta?: {
    preferredVisualisationType?: PreferredVisualisationType;
  };
  fields: Field[];
  rows: NullableString[][];
}

export interface StaticQuery extends DataQuery {
  frame: DataFrameDTO;
}

export interface StaticDataSourceOptions extends DataSourceJsonData {}

export interface StaticSecureJsonData {}
