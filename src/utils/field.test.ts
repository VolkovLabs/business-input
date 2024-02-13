import { FieldType } from '@grafana/data';

import { verifyFieldValue } from './field';

describe('Field Utils', () => {
  describe('Vefiry Field Value', () => {
    it('Null value should be valid', () => {
      expect(verifyFieldValue(null, FieldType.string)).toEqual({
        ok: true,
        value: null,
      });
    });

    it('Correct number value should be valid', () => {
      expect(verifyFieldValue('0', FieldType.number)).toEqual({
        ok: true,
        value: 0,
      });
    });

    it('Empty value should be invalid number', () => {
      expect(verifyFieldValue('', FieldType.number)).toEqual({
        ok: false,
        error: 'Invalid number',
        value: null,
      });
    });

    it('Correct time value should be valid', () => {
      expect(verifyFieldValue('0', FieldType.time)).toEqual({
        ok: true,
        value: 0,
      });
    });

    it('Empty value should be invalid time', () => {
      expect(verifyFieldValue('', FieldType.time)).toEqual({
        ok: false,
        error: 'Invalid timestamp',
        value: null,
      });
    });

    it('Correct boolean value should be valid', () => {
      expect(verifyFieldValue('0', FieldType.boolean)).toEqual({
        ok: true,
        value: '0',
      });
    });

    it('Empty value should be invalid boolean', () => {
      expect(verifyFieldValue('', FieldType.boolean)).toEqual({
        ok: false,
        error: 'Invalid boolean',
        value: null,
      });
    });

    it('Any value should be valid with another types', () => {
      expect(verifyFieldValue('', FieldType.geo)).toEqual({
        ok: true,
        value: '',
      });
    });
  });
});
