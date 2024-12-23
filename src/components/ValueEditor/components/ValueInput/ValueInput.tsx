import { DateTime, dateTime, FieldType } from '@grafana/data';
import { DateTimePicker, Icon, InlineField, Input, TextArea, useStyles2 } from '@grafana/ui';
import React, { useCallback, useState } from 'react';

import { TEST_IDS, TEXT_AREA_LENGTH } from '../../../../constants';
import { FieldValue } from '../../../../types';
import { verifyFieldValue } from '../../../../utils';
import { getStyles } from './ValueInput.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {Exclude<FieldValue, boolean>}
   */
  value: Exclude<FieldValue, boolean>;

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
 * Value Input
 */
export const ValueInput: React.FC<Props> = ({ onChange, value, type, label }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Save the last value so we can toggle between null.
   */
  const [lastValue, setLastValue] = useState(value);
  const [valid, setValid] = useState(verifyFieldValue(value, type).ok);
  const [disabled, setDisabled] = useState(value === null);

  /**
   * Disable Input
   */
  const disableInput = useCallback(() => {
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
  }, [disabled, lastValue, onChange, type, value]);

  /**
   * Icon
   */
  const suffixElement = (
    <div data-testid={TEST_IDS.valueInput.iconDisable(label)} onClick={disableInput}>
      <Icon className={styles.suffixElement} name={disabled ? 'eye-slash' : 'eye'} />
    </div>
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
          value={disabled ? undefined : (value ?? '')}
          suffix={suffixElement}
          data-testid={TEST_IDS.valueInput.fieldNumber(label)}
        />
      </InlineField>
    );
  }

  /**
   * Date Time Picker for not disabled
   */
  if (type === FieldType.time && !disabled) {
    return (
      <InlineField invalid={!valid} label={label} grow>
        <DateTimePicker
          date={dateTime(Number(value))}
          onChange={(dateTime?: DateTime) => {
            if (dateTime) {
              const timestamp = dateTime.valueOf().toString();
              setValid(verifyFieldValue(timestamp, type).ok);
              onChange(timestamp);
            }
          }}
          data-testid={TEST_IDS.valueInput.fieldDateTime(label)}
        />
      </InlineField>
    );
  }

  /**
   * Text Area
   */
  if (type === FieldType.string && value?.length && value.length > TEXT_AREA_LENGTH) {
    return (
      <InlineField invalid={!valid} disabled={disabled} label={label} grow>
        <TextArea
          value={value}
          onChange={(event) => {
            setValid(verifyFieldValue(event.currentTarget.value, type).ok);
            onChange(event.currentTarget.value);
          }}
          data-testid={TEST_IDS.valueInput.fieldTextarea(label)}
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
        value={disabled ? 'null' : (value ?? '')}
        suffix={suffixElement}
        data-testid={TEST_IDS.valueInput.fieldString(label)}
      />
    </InlineField>
  );
};
