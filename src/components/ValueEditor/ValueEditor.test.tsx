import { FieldType } from '@grafana/data';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { ValueEditor } from './ValueEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof ValueEditor>;

/**
 * Value Editor
 */
describe('Value Editor', () => {
  const onChange = jest.fn();
  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <ValueEditor onChange={onChange} {...(restProps as any)} />;
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  it('Should render boolean type', () => {
    render(getComponent({ value: false, type: FieldType.boolean }));
    expect(screen.getByTestId(TEST_IDS.booleanEditor.fieldSwitch)).toBeInTheDocument();
  });

  it('Should render default ValueInput for string type', () => {
    render(getComponent({ value: '123', type: FieldType.string, label: 'string' }));
    expect(screen.getByTestId(TEST_IDS.valueInput.fieldString('string'))).toBeInTheDocument();
  });

  it('Should render default ValueInput for number type', () => {
    render(getComponent({ value: '123', type: FieldType.number, label: 'number' }));
    expect(screen.getByTestId(TEST_IDS.valueInput.fieldNumber('number'))).toBeInTheDocument();
  });
});
