import { FieldType } from '@grafana/data';
import { Icon, InlineField, InlineFieldRow, InlineSwitch, useStyles2 } from '@grafana/ui';
import React, { useCallback, useState } from 'react';

import { TEST_IDS } from '../../../../constants';
import { FieldValue } from '../../../../types';
import { convertValueToBoolean, verifyFieldValue } from '../../../../utils';
import { getStyles } from './BooleanEditor.styles';

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
 * Boolean editor
 */
export const BooleanEditor: React.FC<Props> = ({ onChange, value, type, label }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Save the last value so we can toggle between null.
   */
  const [lastValue, setLastValue] = useState(value);
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
      onChange(false);
      return;
    }

    onChange(lastValue ?? null);
  }, [disabled, lastValue, onChange, value]);

  return (
    <InlineFieldRow>
      <InlineField disabled={disabled} label={label} grow>
        <InlineSwitch
          onChange={(event) => {
            onChange(event.currentTarget.checked);
          }}
          disabled={disabled}
          /**
           * Convert value to support all prev. version with values
           */
          value={convertValueToBoolean(verifyFieldValue(value, type).ok, value)}
          data-testid={TEST_IDS.booleanEditor.fieldSwitch}
        />
      </InlineField>
      <div className={styles.icon} data-testid={TEST_IDS.booleanEditor.iconDisable} onClick={disableInput}>
        <Icon className={styles.suffixElement} name={disabled ? 'eye-slash' : 'eye'} />
      </div>
    </InlineFieldRow>
  );
};
