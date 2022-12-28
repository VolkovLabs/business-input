import React, { useState } from 'react';
import { FieldType } from '@grafana/data';
import { Icon, InlineField, Input, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { NullableString } from '../../types';
import { verifyFieldValue } from '../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {NullableString}
   */
  value: NullableString;

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
  onChange: (value: NullableString) => void;
}

/**
 * Nullable Input
 */
export const NullableInput: React.FC<Props> = ({ onChange, value, type, label }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Save the last value so we can toggle between null.
   */
  const [lastValue, setLastValue] = useState(value);
  const [valid, setValid] = useState(verifyFieldValue(value, type).ok);
  const [disabled, setDisabled] = useState(value === null);

  const suffixElement = (
    <Icon
      className={styles.suffixElement}
      name={disabled ? 'eye-slash' : 'eye'}
      onClick={() => {
        setDisabled(!disabled);

        if (!disabled) {
          setLastValue(value);
          onChange(null);
          setValid(true);
        } else {
          onChange(lastValue ?? null);
          setValid(verifyFieldValue(value, type).ok);
          setLastValue(null);
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
          setValid(verifyFieldValue(e.currentTarget.value, type).ok);
          onChange(e.currentTarget.value);
        }}
        value={disabled ? 'null' : value ?? ''}
        suffix={suffixElement}
      />
    </InlineField>
  );
};
