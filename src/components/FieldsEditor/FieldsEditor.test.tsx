import { shallow } from 'enzyme';
import React from 'react';
import { FieldsEditor } from './FieldsEditor';

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [] };

  it('Should find component with Button', async () => {
    const getComponent = ({ query = {}, ...restProps }: any) => {
      return <FieldsEditor {...restProps} query={query} />;
    };

    const wrapper = shallow(getComponent({ model }));
    const button = wrapper.find('Button');
    expect(button.exists()).toBeTruthy();
  });
});
