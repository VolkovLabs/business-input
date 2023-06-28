import { dateTime, FieldType, toDataFrame } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { DataSourceTestStatus } from '../constants';
import { ValuesEditor } from '../types';
import { DataSource } from './datasource';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn(),
}));

/**
 * Data Source
 */
describe('DataSource', () => {
  const instanceSettings: any = {
    jsonData: {},
  };
  const dataSource = new DataSource(instanceSettings);

  /**
   * Time Range
   */
  const range = {
    from: dateTime(),
    to: dateTime(),
    raw: {
      from: dateTime(),
      to: dateTime(),
    },
  };

  /**
   * Query
   */
  describe('Query', () => {
    beforeAll(() => {
      jest.mocked(getTemplateSrv).mockImplementation(
        () =>
          ({
            replace: jest.fn((str: string) => str),
          } as any)
      );
    });

    it('Should return correct data for MUTABLE frame', async () => {
      const targets = [{ refId: 'A' }];

      const response = await dataSource.query({ targets, range } as any);
      const frames = response.data;
      expect(frames.length).toEqual(0);
    });

    it('Should return correct data for manual values editor is used', async () => {
      const targets = [
        {
          refId: 'A',
          frame: toDataFrame({
            fields: [
              {
                name: 'key',
                type: FieldType.string,
                values: ['a', 'b'],
              },
            ],
          }),
        },
      ];

      const response = await dataSource.query({ targets, range } as any);
      const frames = response.data;

      const frame = frames.find((frame) => frame.refId === 'A');

      expect(frame).toEqual(
        expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: 'key',
              type: FieldType.string,
            }),
          ]),
        })
      );

      const valuesArray = frame.fields[0].values.toArray();
      expect(valuesArray).toEqual(['a', 'b']);
    });

    it('Should execute code if custom values editor is used', async () => {
      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: true } } as any);
      const customCode = `
        return {
          ...frame,
          fields: frame.fields.map((field) => ({
            ...field,
            values: ['111', '123'],
          }))
        }
      `;
      const customValuesDataFrame = toDataFrame({
        meta: { custom: { valuesEditor: ValuesEditor.CUSTOM, customCode } },
        fields: [
          {
            type: FieldType.string,
            name: 'name',
            values: [],
          },
        ],
      });
      const targets = [{ refId: 'A' }, { refId: 'B', frame: customValuesDataFrame }];

      const response = await dataSource.query({ targets, range } as any);
      const frames = response.data;

      const frame = frames.find((frame) => frame.refId === 'B');

      expect(frame).toEqual(
        expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: 'name',
              type: FieldType.string,
            }),
          ]),
        })
      );

      const valuesArray = frame.fields[0].values.toArray();
      expect(valuesArray).toEqual(['111', '123']);
    });

    it('Should throw error if custom code returns nothing', async () => {
      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: true } } as any);
      const customCode = `
        return null
      `;
      const customValuesDataFrame = toDataFrame({
        meta: { custom: { valuesEditor: ValuesEditor.CUSTOM, customCode } },
        fields: [
          {
            type: FieldType.string,
            name: 'name',
            values: ['111'],
          },
        ],
      });
      const targets = [{ refId: 'A' }, { refId: 'B', frame: customValuesDataFrame }];

      try {
        await dataSource.query({ targets, range } as any);
        /**
         * Fail test if error is not thrown
         */
        expect(false).toBeTruthy();
      } catch (e: any) {
        expect(e.message).toEqual('Custom code should return dataFrame');
      }
    });

    it('Should throw error above if execution custom code throws error', async () => {
      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: true } } as any);
      const customCode = `
        a.b()
      `;
      const customValuesDataFrame = toDataFrame({
        meta: { custom: { valuesEditor: ValuesEditor.CUSTOM, customCode } },
        fields: [
          {
            type: FieldType.string,
            name: 'name',
            values: ['111'],
          },
        ],
      });
      const targets = [{ refId: 'A' }, { refId: 'B', frame: customValuesDataFrame }];

      try {
        await dataSource.query({ targets, range } as any);

        /**
         * Fail test if error is not thrown
         */
        expect(false).toBeTruthy();
      } catch (e: any) {
        expect(e.message).toEqual('a is not defined');
      }
    });

    it('Should not execute custom code if code editor disabled', async () => {
      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: false } } as any);
      const customCode = `
        return {
          ...frame,
          fields: frame.fields.map((field) => ({
            ...field,
            values: ['111', '123'],
          }))
        }
      `;
      const customValuesDataFrame = toDataFrame({
        meta: { custom: { valuesEditor: ValuesEditor.CUSTOM, customCode } },
        fields: [
          {
            type: FieldType.string,
            name: 'name',
            values: ['111'],
          },
        ],
      });
      const targets = [{ refId: 'A' }, { refId: 'B', frame: customValuesDataFrame }];

      const response = await dataSource.query({ targets, range } as any);
      const frames = response.data;

      const frame = frames.find((frame) => frame.refId === 'B');

      expect(frame).toEqual(
        expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: 'name',
              type: FieldType.string,
            }),
          ]),
        })
      );

      const valuesArray = frame.fields[0].values.toArray();
      expect(valuesArray).toEqual(['111']);
    });
  });

  /**
   * Health Check
   */
  describe('testDatasource', () => {
    it('Should handle Success state', async () => {
      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.SUCCESS,
        message: `Success`,
      });
    });
  });
});
