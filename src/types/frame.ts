import { Field, PreferredVisualisationType } from '@grafana/data';

import { NullableString } from './field';

/**
 * Values Editor
 */
export enum ValuesEditor {
  MANUAL = 'manual',
  CUSTOM = 'custom',
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
    custom?: {
      valuesEditor?: ValuesEditor;
      customCode?: string;
    };
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
