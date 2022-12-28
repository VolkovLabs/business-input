import { shallow } from 'enzyme';
import React from 'react';
import { QueryEditor } from './QueryEditor';

/**
 * Editor
 */
describe('Editor', () => {
  const query = {};

  it('Should find component with Input', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <QueryEditor {...restProps} />;
    };

    const wrapper = shallow(getComponent({ query }));
    const input = wrapper.find('Input');
    expect(input.exists()).toBeTruthy();
  });
});
