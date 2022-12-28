import { ArrayVector, DataFrame, FieldType } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

/**
 * Interpolate variables in string fields.
 */
export const interpolateVariables = (frame: DataFrame) => {
  for (let i = 0; i < frame.fields.length; i++) {
    const field = frame.fields[i];

    /**
     * Update String fields
     */
    if (field.type === FieldType.string) {
      field.values = new ArrayVector(field.values.toArray().map((value) => getTemplateSrv().replace(value, {}, 'csv')));
    }

    frame.fields[i] = field;
  }

  return frame;
};
