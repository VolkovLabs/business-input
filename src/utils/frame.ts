import { createDataFrame, DataFrameDTO, FieldType, toDataFrameDTO } from '@grafana/data';
import { v4 as uuidv4 } from 'uuid';

import { DataFrameModel, FieldValue, ModelField, ModelRows } from '../types';
import { verifyFieldValue } from './field';

/**
 * Convert to Data Frame
 */
export const convertToDataFrame = (model: DataFrameModel): DataFrameDTO => {
  /**
   * Create Frame
   */
  let frame = createDataFrame(model);

  /**
   * Verify fields
   */
  const fields = frame.fields.map((field, fieldIndex) =>
    model.rows.map((row) => verifyFieldValue(row.value[fieldIndex], field.type).value)
  );

  frame = {
    ...frame,
    fields: frame.fields.map((field, fieldIndex) => ({
      ...field,
      values: fields[fieldIndex],
    })),
  };

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
      (field) => ({ name: field.name, type: field.type ?? FieldType.string, id: uuidv4() }) as ModelField
    );

    rows = Array.from({ length: frame.fields[0].values?.length ?? 0 }).map((row, i) => ({
      value: frame.fields.map((field) => (field.values as FieldValue[])[i]?.toString() ?? null),
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

/**
 * Convert available string value to boolean
 */
export const convertStringValueToBoolean = (value: string): boolean => {
  switch (value) {
    case 'true':
    case 'yes':
    case '1': {
      return true;
    }
    case 'false':
    case 'no':
    case '1': {
      return false;
    }
    default: {
      return false;
    }
  }
};

/**
 * Convert value to boolean
 */
export const convertValueToBoolean = (isVerified: boolean, value: FieldValue): boolean => {
  if (!isVerified) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return convertStringValueToBoolean(value);
  }

  return false;
};
