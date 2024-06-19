import { dateTime, FieldType, toDataFrame } from '@grafana/data';
import { openai } from '@grafana/llm';
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
 * Mock @grafana/llm
 */
jest.mock('@grafana/llm', () => ({
  openai: {
    enabled: jest.fn(),
    chatCompletions: jest.fn(),
  },
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

  beforeEach(() => {
    jest.mocked(openai.chatCompletions).mockClear();
  });

  /**
   * Query
   */
  describe('Query', () => {
    beforeAll(() => {
      jest.mocked(getTemplateSrv).mockImplementation(
        () =>
          ({
            replace: jest.fn((str: string) => str),
          }) as any
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

    it('Should run openai if enabled and message set', async () => {
      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: true } } as any);
      const customCode = `
        return {
          ...frame,
          fields: frame.fields.map((field) => ({
            ...field,
            values: context.llmResult,
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
      const targets = [
        { refId: 'A' },
        {
          refId: 'B',
          frame: customValuesDataFrame,
          llm: {
            openai: {
              message: 'get list',
            },
          },
        },
      ];

      /**
       * Enable openai
       */
      jest.mocked(openai.enabled).mockResolvedValue(true);
      jest.mocked(openai.chatCompletions).mockResolvedValue([1, 2] as any);

      const response = await dataSource.query({ targets, range } as any);
      const frames = response.data;

      const frame = frames.find((frame) => frame.refId === 'B');

      const valuesArray = frame.fields[0].values.toArray();
      expect(valuesArray).toEqual([1, 2]);

      /**
       * Check if message passed to openai
       */
      expect(openai.chatCompletions).toHaveBeenCalledWith({
        messages: [{ role: 'user', content: 'get list' }],
      });
    });

    it('Should replace variables in custom code', async () => {
      /**
       * Mock template srv
       */
      const templateServiceMock = {
        replace: jest.fn(
          () => `
          return {
            ...frame,
            fields: frame.fields.map((field) => ({
              ...field,
              values: 'value1' === 'value1' ? ['111', '123'] : ['111'],
            }))
          }
        `
        ),
      };
      jest.mocked(getTemplateSrv).mockImplementationOnce(() => templateServiceMock as any);

      const dataSource = new DataSource({ jsonData: { codeEditorEnabled: true } } as any);
      const customCode = `
        return {
          ...frame,
          fields: frame.fields.map((field) => ({
            ...field,
            values: '$var' === 'value1' ? ['111', '123'] : ['111'],
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

      const scopedVars = { var: { value: 'value1' } };
      const response = await dataSource.query({ targets, range, scopedVars } as any);
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

      /**
       * Check if replace variables was called
       */
      expect(templateServiceMock.replace).toHaveBeenCalledWith(customCode, scopedVars);
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
        expect(e.message).toEqual('Custom code should return data frame');
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

    it('Should return default data frames when app is "dashboard" and data frames are empty', async () => {
      const targets = [
        { refId: 'A', hide: false, frame: { fields: [] } },
        { refId: 'B', hide: false, frame: { fields: [] } },
      ];

      const options = {
        targets,
        app: 'dashboard',
        scopedVars: {},
      };

      const response = await dataSource.query(options as any);
      const frames = response.data;

      /**
       * Assert that the frames contain the expected data
       */
      expect(frames.length).toEqual(2);
      expect(frames[0].fields.length).toEqual(1);
      expect(frames[0].fields[0].name).toEqual('Default');
      expect(frames[0].fields[0].type).toEqual(FieldType.string);
      expect(frames[0].fields[0].values.length).toEqual(0);
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
