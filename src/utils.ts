import { ArrayVector, DataFrame, DataFrameDTO, FieldType, MutableDataFrame, toDataFrameDTO } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { DataFrameViewModel, NullableString } from './types';

// toFieldValue parses nullable strings into the given type.
export const toFieldValue = (
  value: NullableString,
  type: FieldType
): { ok: boolean; value?: string | number | boolean | null; error?: string } => {
  if (value === null) {
    return { ok: true, value };
  }

  switch (type) {
    case FieldType.number:
      const num = Number(value);
      return value === '' || isNaN(num) ? { ok: false, error: 'Invalid number' } : { ok: true, value: num };
    case FieldType.time:
      const time = Number(value);
      return value === '' || isNaN(time) ? { ok: false, error: 'Invalid timestamp' } : { ok: true, value: time };
    case FieldType.boolean:
      const truthy = !!['1', 'true', 'yes'].find((_) => _ === value);
      const falsy = !!['0', 'false', 'no'].find((_) => _ === value);

      if (!truthy && !falsy) {
        return { ok: false, error: 'Invalid boolean' };
      }
      return { ok: true, value: truthy };
    default:
      return { ok: true, value: value.toString() };
  }
};

export const toDataFrame = (model: DataFrameViewModel): DataFrameDTO => {
  const frame = new MutableDataFrame({
    name: model.name,
    meta: {
      preferredVisualisationType: model.meta?.preferredVisualisationType,
    },
    fields: model.fields.map((_) => ({ name: _.name, type: _.type })),
  });
  model.rows.forEach((_) =>
    frame.appendRow(
      _.map((_, i) => {
        const res = toFieldValue(_, frame.fields[i].type);
        return res.ok ? res.value : null;
      })
    )
  );
  return toDataFrameDTO(frame);
};

export const toViewModel = (frame: DataFrameDTO): DataFrameViewModel => {
  if (frame.fields.length === 0) {
    return {
      name: frame.name,
      meta: {
        preferredVisualisationType: frame.meta?.preferredVisualisationType,
      },
      fields: [],
      rows: [],
    };
  }
  const fields = frame.fields.map((_) => ({ name: _.name, type: _.type ?? FieldType.string }));
  const rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((_, i) =>
    frame.fields.map((field: any) => (field.values as any[])[i]?.toString() ?? null)
  );

  return {
    name: frame.name,
    meta: {
      preferredVisualisationType: frame.meta?.preferredVisualisationType,
    },
    fields,
    rows,
  };
};

/**
 * Interpolate variables in string fields.
 */
export const interpolateVariables = (frame: DataFrame) => {
  for (let i = 0; i < frame.fields.length; i++) {
    const field = frame.fields[i];

    // Skip non-text fields.
    if (field.type === FieldType.string) {
      field.values = new ArrayVector(field.values.toArray().map((_) => getTemplateSrv().replace(_, {}, 'csv')));
    }

    frame.fields[i] = field;
  }
  return frame;
};
