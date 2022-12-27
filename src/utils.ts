import { ArrayVector, DataFrame, DataFrameDTO, FieldType, MutableDataFrame, toDataFrameDTO } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { DataFrameViewModel, NullableString } from './types';

/**
 * Parses nullable strings into the given type.
 */
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

/**
 * Data Frame
 */
export const toDataFrame = (model: DataFrameViewModel): DataFrameDTO => {
  /**
   * Create Frame
   */
  const frame = new MutableDataFrame({
    name: model.name,
    meta: {
      preferredVisualisationType: model.meta?.preferredVisualisationType,
    },
    fields: model.fields.map((field) => ({ name: field.name, type: field.type })),
  });

  /**
   * Verify fields
   */
  model.rows.forEach((row) =>
    frame.appendRow(
      row.map((field, i) => {
        const res = toFieldValue(field, frame.fields[i].type);
        return res.ok ? res.value : null;
      })
    )
  );

  return toDataFrameDTO(frame);
};

/**
 * View Model
 */
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

  /**
   * Fields
   */
  const fields = frame.fields.map((field) => ({ name: field.name, type: field.type ?? FieldType.string }));

  /**
   * Rows
   */
  const rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((row, i) =>
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
 * Clone Data Frame
 */
export const cloneDataFrameViewModel = (frame: DataFrameViewModel): DataFrameViewModel => {
  return {
    name: frame.name,
    meta: frame.meta,
    fields: Object.assign([], frame.fields),
    rows: frame.rows.map((v: any) => Object.assign([], v)),
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
