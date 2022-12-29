import { Field, PreferredVisualisationType } from '@grafana/data';
import { NullableString } from './field';

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
