import {
  CoreApp,
  DataFrameDTO,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  ScopedVars,
  toDataFrame,
} from '@grafana/data';
import { getTemplateSrv, TemplateSrv } from '@grafana/runtime';

import { DataSourceTestStatus } from '../constants';
import { StaticDataSourceOptions, StaticQuery, ValuesEditor } from '../types';
import { interpolateVariables } from '../utils';
import { VariableSupport } from './variable';

/**
 * DataSource returns the data frame returned in the query model.
 */
export class DataSource extends DataSourceApi<StaticQuery, StaticDataSourceOptions> {
  readonly codeEditorEnabled: boolean;
  readonly templateSrv: TemplateSrv = getTemplateSrv();

  /**
   * Constructor
   */
  constructor(instanceSettings: DataSourceInstanceSettings<StaticDataSourceOptions>) {
    super(instanceSettings);

    this.codeEditorEnabled = instanceSettings.jsonData.codeEditorEnabled || false;

    /**
     * Enable variable support
     */
    this.variables = new VariableSupport();
  }

  /**
   * Run Code
   */
  async runCode(code: string, frame: DataFrameDTO, scopedVars: ScopedVars): Promise<DataFrameDTO> {
    const func = new Function('frame', this.templateSrv.replace(code, scopedVars));
    const result = await func(frame);

    /**
     * Error
     */
    if (!result) {
      throw new Error('Custom code should return data frame');
    }

    return result;
  }

  /**
   * Query
   */
  async query(options: DataQueryRequest<StaticQuery>): Promise<DataQueryResponse> {
    const readyTargets = options.targets.filter((target) => !target.hide).filter((target) => target.frame);

    const dataFrames = await Promise.all(
      readyTargets.map(async (target) => {
        /**
         * Execute custom code for Custom Values Editor
         */
        if (this.codeEditorEnabled && target.frame.meta?.custom?.valuesEditor === ValuesEditor.CUSTOM) {
          const frame = await this.runCode(target.frame.meta?.custom?.customCode, target.frame, options.scopedVars);
          return { ...toDataFrame(frame), refId: target.refId };
        }

        /**
         * Default Values Editor
         */
        return { ...toDataFrame(target.frame), refId: target.refId };
      })
    );

    /**
     * Add default data frame
     */
    if (options.app === CoreApp.Dashboard && !dataFrames[0]?.fields.length) {
      const defaultDataFrames = dataFrames.map((target) => ({
        ...target,
        fields: [
          {
            name: 'Default',
            type: FieldType.string,
            config: {},
            values: [],
          },
        ],
      }));

      return {
        data: defaultDataFrames.map((target) => interpolateVariables(target, options.scopedVars)),
      };
    }

    return {
      data: dataFrames.map((target) => interpolateVariables(target, options.scopedVars)),
    };
  }

  /**
   * This line adds support for annotation queries in >=7.2.
   */
  annotations = {};

  /**
   * Health Check
   * This data source makes no external requests so no need to test.
   */
  async testDatasource() {
    return {
      status: DataSourceTestStatus.SUCCESS,
      message: 'Success',
    };
  }
}
