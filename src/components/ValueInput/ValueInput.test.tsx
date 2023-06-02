import React from 'react';
import { FieldType } from '@grafana/data';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
import { ValueInput } from './ValueInput';

/**
 * Input
 */
describe('Input', () => {
  it('Should find component with Input', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <ValueInput {...restProps} />;
    };

    render(getComponent({ value: '123', type: FieldType.string }));

    expect(screen.getByTestId(TestIds.valueInput.fieldString)).toBeInTheDocument();
  });
});
