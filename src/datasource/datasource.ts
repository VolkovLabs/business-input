import {
  DataFrameDTO,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  toDataFrame,
} from '@grafana/data';

import { DataSourceTestStatus } from '../constants';
import { StaticDataSourceOptions, StaticQuery, ValuesEditor } from '../types';
import { interpolateVariables } from '../utils';

/**
 * DataSource returns the data frame returned in the query model.
 */
export class DataSource extends DataSourceApi<StaticQuery, StaticDataSourceOptions> {
  readonly codeEditorEnabled: boolean;

  /**
   * Constructor
   */
  constructor(instanceSettings: DataSourceInstanceSettings<StaticDataSourceOptions>) {
    super(instanceSettings);

    this.codeEditorEnabled = instanceSettings.jsonData.codeEditorEnabled || false;
  }

  /**
   * Run Code
   */
  async runCode(code: string, frame: DataFrameDTO): Promise<DataFrameDTO> {
    const func = new Function('frame', code);
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
          const frame = await this.runCode(target.frame.meta?.custom?.customCode, target.frame);
          return { ...toDataFrame(frame), refId: target.refId };
        }

        /**
         * Default Values Editor
         */
        return { ...toDataFrame(target.frame), refId: target.refId };
      })
    );

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
