import { FieldType } from '@grafana/data';

import { convertStringValueToBoolean, convertToDataFrame, convertValueToBoolean, prepareModel } from './frame';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123456'),
}));

describe('Frame Utils', () => {
  describe('Prepare Model', () => {
    it('Should take rows', () => {
      const dataFrame = {
        fields: [
          {
            name: 'key',
            type: FieldType.string,
            values: ['key1', 'key2'],
          },
          {
            name: 'value',
            type: FieldType.string,
            values: ['value1', 'value2'],
          },
          {
            name: 'country',
            values: [],
          },
        ],
      };
      expect(prepareModel(dataFrame).rows).toEqual([
        { id: '123456', value: ['key1', 'value1', null] },
        { id: '123456', value: ['key2', 'value2', null] },
      ]);
    });

    it('Should work if first field without values', () => {
      const dataFrame = {
        fields: [
          {
            name: 'key',
            type: FieldType.string,
          },
        ],
      };
      expect(prepareModel(dataFrame).rows).toEqual([]);
    });
  });

  /**
   * convertToDataFrame
   */
  describe('convertToDataFrame', () => {
    it('should map rows and verify field values', () => {
      /**
       * Model
       */
      const model = {
        meta: {},
        fields: [
          {
            name: 'Field',
            type: 'string',
            id: '053c4d18-9954-4fea-b8ef-83eb2da95147',
          },
          {
            name: 'value',
            type: 'number',
            id: '5a544f7c-27ff-4042-bcb7-2873e1eef6c3',
          },
        ],
        rows: [
          {
            value: ['Test 1', 10],
            id: '12380cd9-9ddf-4a26-bdae-87bfcaf590e4',
          },
          {
            value: ['Test 2', 151],
            id: 'df1f7a2b-2fc4-40a4-a88b-d661079131bb',
          },
        ],
      };

      const frame = convertToDataFrame(model as any);

      /**
       *  Should return correct values
       */
      expect(frame.fields[0].values).toEqual(['Test 1', 'Test 2']);
      expect(frame.fields[1].values).toEqual([10, 151]);
    });

    it('should handle fields without values', () => {
      /**
       * Model
       */
      const model = {
        meta: {},
        fields: [
          {
            name: 'Field',
            type: 'string',
            id: '053c4d18-9954-4fea-b8ef-83eb2da95147',
          },
          {
            name: 'value',
            type: 'number',
            id: '5a544f7c-27ff-4042-bcb7-2873e1eef6c3',
          },
        ],
        rows: [],
      };

      const frame = convertToDataFrame(model as any);

      /**
       *  Should return correct values
       */
      expect(frame.fields[0].values).toEqual([]);
      expect(frame.fields[1].values).toEqual([]);
    });

    it('should handle fields if types different', () => {
      /**
       * Model
       */
      const model = {
        meta: {},
        fields: [
          {
            name: 'Field',
            type: 'string',
            id: '053c4d18-9954-4fea-b8ef-83eb2da95147',
          },
          {
            name: 'value',
            type: 'boolean',
            id: '5a544f7c-27ff-4042-bcb7-2873e1eef6c3',
          },
        ],
        rows: [
          {
            value: ['Test 1', 10],
            id: '12380cd9-9ddf-4a26-bdae-87bfcaf590e4',
          },
          {
            value: ['Test 2', 151],
            id: 'df1f7a2b-2fc4-40a4-a88b-d661079131bb',
          },
        ],
      };

      const frame = convertToDataFrame(model as any);

      /**
       *  Should return correct values
       */
      expect(frame.fields[0].values).toEqual(['Test 1', 'Test 2']);
      expect(frame.fields[1].values).toEqual([null, null]);
    });
  });

  /**
   * convertStringValueToBoolean
   */
  describe('convertStringValueToBoolean', () => {
    it.each([
      ['true', true],
      ['yes', true],
      ['1', true],
      ['false', false],
      ['no', false],
      ['random', false],
      ['', false],
      ['0', false],
    ])('should return value as boolean', (input, expected) => {
      expect(convertStringValueToBoolean(input)).toBe(expected);
    });
  });

  /**
   * convertStringValueToBoolean
   */
  describe('convertValueToBoolean', () => {
    it.each([
      [true, true, true],
      [true, false, false],
      [true, 'true', true],
      [true, 'false', false],
      [true, 'random', false],
      [false, null, false],
      [false, 'fals', false],
    ])('should correct convert to boolean', (isVerified, value, expected) => {
      expect(convertValueToBoolean(isVerified, value)).toBe(expected);
    });
  });
});
