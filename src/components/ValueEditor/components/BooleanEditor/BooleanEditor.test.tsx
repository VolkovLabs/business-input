import { FieldType } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../../../constants';
import { BooleanEditor } from './BooleanEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof BooleanEditor>;

/**
 * Boolean Editor
 */
describe('Boolean', () => {
  const onChange = jest.fn();
  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <BooleanEditor onChange={onChange} {...(restProps as any)} />;
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  it('Should update value', () => {
    render(getComponent({ value: false, type: FieldType.boolean }));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Should display disabled state', () => {
    render(getComponent({ value: null, type: FieldType.boolean }));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable)).toBeInTheDocument();
    expect(screen.getByTestId('eye-slash')).toBeInTheDocument();
  });

  it('Should toggle disabled state and keep last value', () => {
    render(getComponent({ value: true, type: FieldType.boolean }));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).not.toBeDisabled();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeChecked();

    fireEvent.click(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeDisabled();

    fireEvent.click(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable));
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).not.toBeDisabled();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeChecked();
  });

  it('Should be disabled state if initial value is null', () => {
    render(getComponent({ value: null, type: FieldType.boolean }));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeDisabled();

    fireEvent.click(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable));

    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).not.toBeDisabled();

    fireEvent.click(screen.getByTestId(TEST_IDS.booleanEditor.iconDisable));
  });
});
