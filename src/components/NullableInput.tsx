import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Field, Icon, Input, useTheme } from '@grafana/ui';
import { NullableString } from '../types';

export interface NullableInputProps {
  value: NullableString;
  onChange: (value: NullableString) => void;
  onValidate: (value: NullableString) => boolean;
}

export const NullableInput: React.FC<Partial<NullableInputProps>> = ({ onChange, value, onValidate }) => {
  const theme = useTheme();

  // Save the last value so we can toggle between null.
  const [lastValue, setLastValue] = useState(value);

  const [valid, setValid] = useState(onValidate ? onValidate(value ?? null) : true);
  const [disabled, setDisabled] = useState(value === null);

  if (onValidate) {
    const ok = onValidate(value ?? null);
    if (ok !== valid) {
      setValid(ok);
    }
  }

  const styles = {
    root: css`
      width: 144px;
      margin-right: 4px;
    `,
    suffix: css`
      &:hover {
        cursor: pointer;
        color: ${theme.colors.text};
      }
    `,
  };

  const suffixEl = (
    <Icon
      className={styles.suffix}
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

  return (
    <Field
      className={css`
        margin: 0;
      `}
      invalid={!valid}
      disabled={disabled}
    >
      <Input
        className={styles.root}
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
