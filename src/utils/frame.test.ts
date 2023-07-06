import { FieldType } from '@grafana/data';
import { prepareModel } from './frame';

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
        ['key1', 'value1', null],
        ['key2', 'value2', null],
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
});
