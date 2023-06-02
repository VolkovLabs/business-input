import React, { useState } from 'react';
import { DateTime, dateTime, FieldType } from '@grafana/data';
import { DateTimePicker, Icon, InlineField, Input, TextArea, useStyles2 } from '@grafana/ui';
import { TestIds, TextAreaLength } from '../../constants';
import { Styles } from '../../styles';
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
 * Value Input
 */
export const ValueInput: React.FC<Props> = ({ onChange, value, type, label }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Save the last value so we can toggle between null.
   */
  const [lastValue, setLastValue] = useState(value);
  const [valid, setValid] = useState(verifyFieldValue(value, type).ok);
  const [disabled, setDisabled] = useState(value === null);

  /**
   * Disable Input
   */
  const disableInput = () => {
    setDisabled(!disabled);

    /**
     * Disable
     */
    if (!disabled) {
      setLastValue(value);
      onChange(null);
      setValid(true);
      return;
    }

    onChange(lastValue ?? null);
    setValid(verifyFieldValue(value, type).ok);
    setLastValue(null);
  };

  /**
   * Icon
   */
  const suffixElement = (
    <Icon className={styles.suffixElement} name={disabled ? 'eye-slash' : 'eye'} onClick={disableInput} />
  );

  /**
   * Number
   */
  if (type === FieldType.number) {
    return (
      <InlineField invalid={!valid} disabled={disabled} label={label} grow>
        <Input
          onChange={(event) => {
            setValid(verifyFieldValue(event.currentTarget.value, type).ok);
            onChange(event.currentTarget.value);
          }}
          type="number"
          value={disabled ? undefined : value ?? ''}
          suffix={suffixElement}
        />
      </InlineField>
    );
  }

  /**
   * Date Time Picker for not disabled
   */
  if (type === FieldType.time && !disabled) {
    return (
      <InlineField invalid={!valid} disabled={disabled} label={label} grow>
        <DateTimePicker
          date={disabled ? undefined : dateTime(Number(value))}
          onChange={(dateTime: DateTime) => {
            const timestamp = dateTime.valueOf().toString();
            setValid(verifyFieldValue(timestamp, type).ok);
            onChange(timestamp);
          }}
        />
      </InlineField>
    );
  }

  /**
   * Text Area
   */
  if (type === FieldType.string && value?.length && value.length > TextAreaLength) {
    return (
      <InlineField invalid={!valid} disabled={disabled} label={label} grow>
        <TextArea
          value={value}
          onChange={(event) => {
            setValid(verifyFieldValue(event.currentTarget.value, type).ok);
            onChange(event.currentTarget.value);
          }}
        />
      </InlineField>
    );
  }

  /**
   * String Input
   */
  return (
    <InlineField invalid={!valid} disabled={disabled} label={label} grow>
      <Input
        onChange={(event) => {
          setValid(verifyFieldValue(event.currentTarget.value, type).ok);
          onChange(event.currentTarget.value);
        }}
        value={disabled ? 'null' : value ?? ''}
        suffix={suffixElement}
        data-testid={TestIds.valueInput.fieldString}
      />
    </InlineField>
  );
};
