import { Field, PreferredVisualisationType } from '@grafana/data';

import { FieldValue } from './field';

/**
 * Values Editor
 */
export enum ValuesEditor {
  MANUAL = 'manual',
  CUSTOM = 'custom',
}

/**
 * Model Field
 */
export interface ModelField extends Field {
  /**
   * Id
   *
   * @type {string}
   */
  id: string;
}

/**
 * Model Row
 */
export interface ModelRow {
  /**
   * Value
   *
   * @type {FieldValue[]}
   */
  value: FieldValue[];

  /**
   * Id
   *
   * @type {string}
   */
  id: string;
}

/**
 * Model Rows
 */
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
   * @type {FieldValue[][]}
   */
  rows: ModelRows;
}
