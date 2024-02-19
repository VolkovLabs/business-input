import { FieldType } from '@grafana/data';

import { FieldResult, NullableString } from '../types';

/**
 * Parses nullable strings into the given type.
 */
export const verifyFieldValue = (value: NullableString, type: FieldType): FieldResult => {
  /**
   * Null is ok
   */
  if (value === null) {
    return { ok: true, value };
  }

  switch (type) {
    case FieldType.number:
      const num = Number(value);

      /**
       * Empty or Not a Number
       */
      if (value === '' || isNaN(num)) {
        return { ok: false, error: 'Invalid number', value: null };
      }

      return { ok: true, value: num };
    case FieldType.time:
      const time = Number(value);

      /**
       * Empty or Not a Number
       */
      if (value === '' || isNaN(time)) {
        return { ok: false, error: 'Invalid timestamp', value: null };
      }

      return { ok: true, value: time };
    case FieldType.boolean:
      if (!['1', '0', 'true', 'yes', 'false', 'no'].includes(value)) {
        return { ok: false, error: 'Invalid boolean', value: null };
      }

      return { ok: true, value: value };
    default:
      return { ok: true, value: value.toString() };
  }
};

/**
 * Reorder
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
