import { DataFrame, FieldType, ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

/**
 * Interpolate variables in String fields.
 */
export const interpolateVariables = (frame: DataFrame, scopedVars: ScopedVars) => {
  for (let i = 0; i < frame.fields.length; i++) {
    const field = frame.fields[i];

    /**
     * Update String fields
     */
    if (field.type === FieldType.string) {
      field.values = field.values.map((value) => getTemplateSrv().replace(value, scopedVars, 'csv'));
    }

    frame.fields[i] = field;
  }

  return frame;
};
