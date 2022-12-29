import { shallow } from 'enzyme';
import React from 'react';
import { FieldType } from '@grafana/data';
import { ValueInput } from './ValueInput';

/**
 * Input
 */
describe('Input', () => {
  it('Should find component with Input', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <ValueInput {...restProps} />;
    };

    const wrapper = shallow(getComponent({ value: '123', type: FieldType.string }));
    const input = wrapper.find('Input');
    expect(input.exists()).toBeTruthy();
  });
});
