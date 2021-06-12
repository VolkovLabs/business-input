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

export const frameReducer = (frame: DataFrameViewModel, action: Action): DataFrameViewModel => {
  switch (action.type) {
    case 'rename':
      return { ...frame, name: action.name };
    case 'set-preferred-visualisation-type':
      return { ...frame, meta: { ...frame.meta, preferredVisualisationType: action.preferredVisualisationType } };
    case 'insert-field':
      const frameInserted = { ...frame };

      // Insert a field after the current position.
      frameInserted.fields.splice(action.index + 1, 0, {
        name: '',
        type: FieldType.string,
      });

      // Rebuild rows with the added field.
      frameInserted.rows.forEach((row) => {
        row.splice(action.index + 1, 0, '');
      });

      return frameInserted;
    case 'remove-field':
      const frameRemoved = { ...frame };

      // Remove the field at given position.
      frameRemoved.fields.splice(action.index, 1);

      // Rebuild rows without the removed field.
      frameRemoved.rows.forEach((row) => {
        row.splice(action.index, 1);
      });

      // Remove all rows if there are no fields.
      if (frameRemoved.fields.length === 0) {
        frameRemoved.rows = [];
      }

      return frameRemoved;
    case 'rename-field':
      const frameRenamed = { ...frame };
      frameRenamed.fields[action.index].name = action.name;
      return frameRenamed;
    case 'set-field-type':
      const frame1 = { ...frame };
      frame1.fields[action.index].type = action.fieldType;
      return frame1;
    case 'insert-row':
      const frame2 = { ...frame };
      const emptyRow: NullableString[] = Array.from({ length: frame2.fields.length }).map((_, i) => {
        switch (frame2.fields[i].type) {
          case 'number':
            return '0';
          case 'time':
            return Date.now().valueOf().toString();
          case 'boolean':
            return 'false';
        }
        return '';
      });
      frame2.rows.splice(action.index + 1, 0, emptyRow);
      return frame2;
    case 'remove-row':
      const frame3 = { ...frame };
      frame3.rows.splice(action.index, 1);
      return frame3;
    case 'duplicate-row':
      const frame4 = { ...frame };
      frame4.rows.splice(action.index + 1, 0, JSON.parse(JSON.stringify(frame4.rows[action.index])));
      return frame4;
    case 'edit-cell':
      const frame5 = { ...frame };
      frame5.rows[action.rowIndex][action.fieldIndex] = action.value;
      return frame5;
  }
};
