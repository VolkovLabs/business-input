import React, { useState } from 'react';
import { Icon, InlineField, Input, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { NullableString } from '../../types';

/**
 * Properties
 */
export interface NullableInputProps {
  /**
   * Value
   *
   * @type {NullableString}
   */
  value: NullableString;

  /**
   * label
   *
   * @type {string}
   */
  label: string;

  /**
   * On Change
   */
  onChange: (value: NullableString) => void;

  /**
   * On Validate
   */
  onValidate: (value: NullableString) => boolean;
}

/**
 * Nullable Input
 */
export const NullableInput: React.FC<Partial<NullableInputProps>> = ({ onChange, value, label, onValidate }) => {
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
    <InlineField invalid={!valid} disabled={disabled} label={label} grow>
      <Input
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
    </InlineField>
  );
};
