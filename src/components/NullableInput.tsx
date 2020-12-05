import React, { useState } from 'react';
import { Icon, useTheme } from '@grafana/ui';
import { NullableString } from '../types';
import { css } from 'emotion';

export interface NullableInputProps {
  value: NullableString;
  onChange: (value: NullableString) => void;
  onValidate: (value: NullableString) => boolean;
}

export const NullableInput: React.FC<Partial<NullableInputProps>> = ({ onChange, value, onValidate }) => {
  const theme = useTheme();
  const [disabled, setDisabled] = useState(value === null);
  const [lastValue, setLastValue] = useState(value);
  const [valid, setValid] = useState(onValidate ? onValidate(value ?? null) : true);

  if (onValidate) {
    const ok = onValidate(value ?? null);
    if (ok !== valid) {
      setValid(ok);
    }
  }

  const styles = {
    root: css`
      width: 128px;
      display: flex;

      background-color: ${disabled ? theme.colors.formInputBgDisabled : theme.colors.formInputBg};
      border: 1px solid ${valid ? theme.colors.formInputBorder : theme.colors.formInputBorderInvalid};
      padding: 0 ${theme.spacing.sm};

      border-radius: 4px;
      height: 100%;
      min-height: 32px;
      align-items: center;
      margin-right: 4px;

      &:focus-within {
        outline: 2px dotted transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 2px ${theme.colors.bodyBg}, 0 0 0px 4px ${theme.colors.formFocusOutline};
        transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
      }

      & > svg {
        color: transparent;
      }

      &:hover svg {
        color: ${theme.colors.textWeak};
      }
    `,
    input: css`
      font-size: ${theme.typography.size.md};
      background-color: transparent;
      min-width: 0;
      &:focus {
        outline: none;
      }
      &:disabled {
        color: ${theme.colors.textFaint};
        background-color: transparent;
      }
    `,
    button: css`
      display: inline-block;
      position: relative;
      right: 0px;
      border: 0;
      color: transparent;

      &:hover {
        cursor: pointer;
      }
    `,
  };

  return (
    <div className={styles.root}>
      <input
        disabled={disabled}
        className={styles.input}
        onChange={e => {
          if (onValidate) {
            setValid(onValidate(e.target.value));
          }
          if (onChange) {
            setLastValue(e.target.value);
            onChange(e.target.value);
          }
        }}
        value={disabled ? 'null' : value ?? ''}
      />
      <div
        className={styles.button}
        onClick={() => {
          setDisabled(!disabled);
          if (onChange) {
            if (!disabled) {
              onChange(null);
              setValid(true);
            } else {
              onChange(lastValue ?? null);
              if (onValidate) {
                setValid(onValidate(lastValue ?? null));
              }
            }
          }
        }}
      >
        <Icon name={disabled ? 'eye-slash' : 'eye'} />
      </div>
    </div>
  );
};
