import { shallow } from 'enzyme';
import React from 'react';
import { ValuesEditor } from './ValuesEditor';

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [], rows: [] };

  it('Should find component with Button', async () => {
    const getComponent = ({ query = {}, ...restProps }: any) => {
      return <ValuesEditor {...restProps} query={query} />;
    };

    const wrapper = shallow(getComponent({ model }));
    const button = wrapper.find('Button');
    expect(button.exists()).toBeTruthy();
  });
});
