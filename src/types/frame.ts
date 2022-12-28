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
 * Data Frame Model is used as a intermediate frame state for easier
 * manipulation and validation.
 */
export interface DataFrameModel {
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
