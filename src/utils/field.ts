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
