import { DataFrameDTO, Field, FieldType, MutableDataFrame, toDataFrameDTO } from '@grafana/data';

import { DataFrameModel } from '../types';
import { NullableString } from '../types/field';
import { verifyFieldValue } from './field';

/**
 * Convert to Data Frame
 */
export const convertToDataFrame = (model: DataFrameModel): DataFrameDTO => {
  /**
   * Create Frame
   */
  const frame = new MutableDataFrame({
    name: model.name,
    meta: {
      preferredVisualisationType: model.meta?.preferredVisualisationType,
      custom: model.meta?.custom,
    },
    fields: model.fields.map((field) => ({ name: field.name, type: field.type })),
  });

  /**
   * Verify fields
   */
  model.rows.forEach((row) =>
    frame.appendRow(
      row.map((field, i) => {
        return verifyFieldValue(field, frame.fields[i].type).value;
      })
    )
  );

  return toDataFrameDTO(frame);
};

/**
 * Prepare Model
 */
export const prepareModel = (frame: DataFrameDTO): DataFrameModel => {
  let fields: Field[] = [];
  let rows: NullableString[][] = [];

  /**
   * Set Field Types and Rows
   */
  if (frame.fields.length !== 0) {
    fields = frame.fields.map((field) => ({ name: field.name, type: field.type ?? FieldType.string } as Field));

    rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((row, i) => {
      return frame.fields.map((field) => (field.values as NullableString[])[i]?.toString() ?? null);
    });
  }

  return {
    name: frame.name,
    meta: {
      preferredVisualisationType: frame.meta?.preferredVisualisationType,
      custom: frame.meta?.custom,
    },
    fields,
    rows,
  };
};
