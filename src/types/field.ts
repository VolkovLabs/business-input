/**
 * Field Value
 */
export type FieldValue = string | null | boolean;

/**
 * Result
 */
export interface FieldResult {
  /**
   * Status
   *
   * @type {boolean}
   */
  ok: boolean;

  /**
   * Value
   *
   * @type {string | number | boolean | null}
   */
  value: string | number | boolean | null;

  /**
   * Error
   *
   * @type {string}
   */
  error?: string;
}
