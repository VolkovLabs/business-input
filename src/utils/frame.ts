import { DataFrameDTO, FieldType, MutableDataFrame, toDataFrameDTO } from '@grafana/data';
import { v4 as uuidv4 } from 'uuid';

import { DataFrameModel, ModelField, ModelRows, NullableString } from '../types';
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
      row.value.map((field, i) => {
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
  let fields: ModelField[] = [];
  let rows: ModelRows = [];

  /**
   * Set Field Types and Rows
   */
  if (frame.fields.length !== 0) {
    fields = frame.fields.map(
      (field) => ({ name: field.name, type: field.type ?? FieldType.string, id: uuidv4() } as ModelField)
    );

    rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((row, i) => ({
      value: frame.fields.map((field) => (field.values as NullableString[])[i]?.toString() ?? null),
      id: uuidv4(),
    }));
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
