import { Field, PreferredVisualisationType } from '@grafana/data';

import { NullableString } from './field';

/**
 * Values Editor
 */
export enum ValuesEditor {
  MANUAL = 'manual',
  CUSTOM = 'custom',
}

export interface ModelField extends Field {
  uid: string;
}

export interface ModelRow {
  value: NullableString[];
  uid: string;
}

export type ModelRows = ModelRow[];

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
   * @type {ModelField[]}
   */
  fields: ModelField[];

  /**
   * Rows
   *
   * @type {NullableString[][]}
   */
  rows: ModelRows;
}
