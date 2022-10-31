import { useCallback } from 'react';
import { FieldType, PreferredVisualisationType } from '@grafana/data';
import { DataFrameViewModel, NullableString } from '../types';

export type Action =
  | { type: 'rename'; name: string }
  | { type: 'set-preferred-visualisation-type'; preferredVisualisationType?: PreferredVisualisationType }
  | { type: 'insert-field'; index: number }
  | { type: 'remove-field'; index: number }
  | { type: 'rename-field'; name: string; index: number }
  | { type: 'set-field-type'; fieldType: FieldType; index: number }
  | { type: 'insert-row'; index: number }
  | { type: 'remove-row'; index: number }
  | { type: 'duplicate-row'; index: number }
  | { type: 'edit-cell'; rowIndex: number; fieldIndex: number; value: NullableString };

type DataFrameReducer = React.Reducer<DataFrameViewModel, Action>;

// onChangeReducer decorates the reducer with a side effect to update the query
// model.
export const useChangeReducer = (
  reducer: DataFrameReducer,
  onChange: (frame: DataFrameViewModel) => void
): DataFrameReducer => {
  return useCallback(
    (frame: DataFrameViewModel, action: Action) => {
      const res = reducer(frame, action);
      onChange(res);
      return res;
    },
    [reducer, onChange]
  );
};

const cloneDataFrameViewModel = (frame: DataFrameViewModel): DataFrameViewModel => {
  return {
    name: frame.name,
    meta: frame.meta,
    fields: Object.assign([], frame.fields),
    rows: frame.rows.map((v) => Object.assign([], v)),
  };
};

export const frameReducer: DataFrameReducer = (state: DataFrameViewModel, action: Action): DataFrameViewModel => {
  const frame = cloneDataFrameViewModel(state);

  switch (action.type) {
    case 'rename':
      return { ...state, name: action.name };
    case 'set-preferred-visualisation-type':
      return { ...state, meta: { ...state.meta, preferredVisualisationType: action.preferredVisualisationType } };
    case 'insert-field':
      // Insert a field after the current position.
      frame.fields.splice(action.index + 1, 0, {
        name: '',
        type: FieldType.string,
      });

      // Rebuild rows with the added field.
      frame.rows.forEach((row) => {
        row.splice(action.index + 1, 0, '');
      });

      return frame;
    case 'remove-field':
      // Remove the field at given position.
      frame.fields.splice(action.index, 1);

      // Rebuild rows without the removed field.
      frame.rows.forEach((row) => {
        row.splice(action.index, 1);
      });

      // Remove all rows if there are no fields.
      if (frame.fields.length === 0) {
        frame.rows = [];
      }

      return frame;
    case 'rename-field':
      frame.fields[action.index].name = action.name;
      return frame;
    case 'set-field-type':
      frame.fields[action.index].type = action.fieldType;
      return frame;
    case 'insert-row':
      const emptyRow: NullableString[] = Array.from({ length: frame.fields.length }).map((_, i) => {
        switch (frame.fields[i].type) {
          case 'number':
            return '0';
          case 'time':
            return Date.now().valueOf().toString();
          case 'boolean':
            return 'false';
        }
        return '';
      });
      frame.rows.splice(action.index + 1, 0, emptyRow);
      return frame;
    case 'remove-row':
      frame.rows.splice(action.index, 1);
      return frame;
    case 'duplicate-row':
      frame.rows.splice(action.index + 1, 0, JSON.parse(JSON.stringify(frame.rows[action.index])));
      return frame;
    case 'edit-cell':
      frame.rows[action.rowIndex][action.fieldIndex] = action.value;
      return frame;
  }
};
