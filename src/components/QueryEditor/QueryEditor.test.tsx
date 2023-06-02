import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
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

    render(getComponent({ query }));

    expect(screen.getByTestId(TestIds.queryEditor.fieldName)).toBeInTheDocument();
  });
});
