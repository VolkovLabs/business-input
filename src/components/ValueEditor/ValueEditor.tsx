import { FieldType } from '@grafana/data';
import React from 'react';

import { FieldValue } from '../../types';
import { BooleanEditor, ValueInput } from './components';

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {FieldValue}
   */
  value: FieldValue;

  /**
   * Type
   *
   * @type {FieldType}
   */
  type: FieldType;

  /**
   * label
   *
   * @type {string}
   */
  label: string;

  /**
   * On Change
   */
  onChange: (value: FieldValue) => void;
}

/**
 * Value Editor
 */
export const ValueEditor: React.FC<Props> = ({ onChange, value, type, label }) => {
  /**
   * Render Value Editor
   */
  const renderValueEditor = (type: FieldType) => {
    switch (type) {
      case FieldType.boolean: {
        return <BooleanEditor value={value} onChange={onChange} type={type} label={label} />;
      }
      default: {
        return <ValueInput value={value as string | null} onChange={onChange} type={type} label={label} />;
      }
    }
  };

  return renderValueEditor(type);
};
