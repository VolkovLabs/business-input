import React, { useState } from 'react';
import { Field, Icon, Input, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { NullableString } from '../../types';

/**
 * Properties
 */
export interface NullableInputProps {
  value: NullableString;
  onChange: (value: NullableString) => void;
  onValidate: (value: NullableString) => boolean;
}

/**
 * Nullable Input
 */
export const NullableInput: React.FC<Partial<NullableInputProps>> = ({ onChange, value, onValidate }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Save the last value so we can toggle between null.
   */
  const [lastValue, setLastValue] = useState(value);
  const [valid, setValid] = useState(onValidate ? onValidate(value ?? null) : true);
  const [disabled, setDisabled] = useState(value === null);

  if (onValidate) {
    const ok = onValidate(value ?? null);
    if (ok !== valid) {
      setValid(ok);
    }
  }

  const suffixEl = (
    <Icon
      className={styles.suffixElement}
      name={disabled ? 'eye-slash' : 'eye'}
      onClick={() => {
        setDisabled(!disabled);
        if (onChange) {
          if (!disabled) {
            setLastValue(value);
            onChange(null);
            setValid(true);
          } else {
            onChange(lastValue ?? null);
            if (onValidate) {
              setValid(onValidate(lastValue ?? null));
            }
            setLastValue(null);
          }
        }
      }}
    />
  );

  /**
   * Return
   */
  return (
    <Field className={styles.field} invalid={!valid} disabled={disabled}>
      <Input
        className={styles.rootInput}
        onChange={(e) => {
          if (onValidate) {
            const res = onValidate(e.currentTarget.value);
            setValid(res);
          }
          if (onChange) {
            onChange(e.currentTarget.value);
          }
        }}
        value={disabled ? 'null' : value ?? ''}
        suffix={suffixEl}
      />
    </Field>
  );
};
