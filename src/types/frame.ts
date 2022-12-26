import { FieldType, PreferredVisualisationType } from '@grafana/data';

/**
 * NullableString
 */
export type NullableString = string | null;

/**
 * Field
 */
export interface Field {
  /**
   * Name
   *
   * @type {string}
   */
  name: string;

  /**
   * Type
   *
   * @type {FieldType}
   */
  type: FieldType;
}

/**
 * DataFrameViewModel is used as a intermediate frame state for easier
 * manipulation and validation.
 */
export interface DataFrameViewModel {
  /**
   * Name
   *
   * @type {string}
   */
  name?: string;

  /**
   * Meta
   *
   * @type {string}
   */
  meta?: {
    preferredVisualisationType?: PreferredVisualisationType;
  };

  /**
   * Fields
   *
   * @type {Field[]}
   */
  fields: Field[];

  /**
   * Rows
   *
   * @type {NullableString[][]}
   */
  rows: NullableString[][];
}
