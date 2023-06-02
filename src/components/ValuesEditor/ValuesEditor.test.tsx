import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
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

    render(getComponent({ model }));

    expect(screen.getByTestId(TestIds.valuesEditor.buttonAddRow)).toBeInTheDocument();
  });
});
