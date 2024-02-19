import { FieldType } from '@grafana/data';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { ValuesEditor } from './ValuesEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof ValuesEditor>;

/**
 * Mock @hello-pangea/dnd
 */
jest.mock('@hello-pangea/dnd', () => ({
  ...jest.requireActual('@hello-pangea/dnd'),
  DragDropContext: jest.fn(({ children }) => children),
  Droppable: jest.fn(({ children }) => children({})),
  Draggable: jest.fn(({ children }) =>
    children(
      {
        draggableProps: {},
      },
      {}
    )
  ),
}));

/**
 * Mock uuid
 */
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123456'),
}));

/**
 * Editor
 */
describe('Editor', () => {
  const model = {
    fields: [{ name: 'key', type: FieldType.string, id: '12' }] as any,
    rows: [{ id: '121', value: ['key1'] }],
  };
  const onChange = jest.fn();
  const onRunQuery = jest.fn();

  /**
   * Open Item
   * @param id
   */
  const openItem = (id: string): ReturnType<typeof getSelectors> => {
    /**
     * Check item presence
     */
    expect(selectors.itemHeader(false, id)).toBeInTheDocument();

    /**
     * Make Item is opened
     */
    fireEvent.click(selectors.itemHeader(false, id));

    /**
     * Check if item content exists
     */
    const elementContent = selectors.itemContent(false, id);
    expect(elementContent).toBeInTheDocument();

    /**
     * Return selectors for opened item
     */
    return getSelectors(within(elementContent));
  };

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.valuesEditor);
  const selectors = getSelectors(screen);

  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <ValuesEditor onChange={onChange} onRunQuery={onRunQuery} {...(restProps as any)} />;
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  it('Should add row if there is no any rows', async () => {
    render(
      getComponent({
        model: {
          ...model,
          rows: [],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            value: expect.arrayContaining(['']),
          }),
        ]),
      })
    );
  });

  it('Should add row for number', async () => {
    render(
      getComponent({
        model: {
          fields: [{ name: 'key', type: FieldType.number }] as any,
          rows: [],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            value: expect.arrayContaining([expect.any(String)]),
          }),
        ]),
      })
    );
  });

  it('Should add row for time', async () => {
    render(
      getComponent({
        model: {
          fields: [{ name: 'key', type: FieldType.time }] as any,
          rows: [],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            value: expect.arrayContaining([expect.any(String)]),
          }),
        ]),
      })
    );
  });

  it('Should add row for boolean', async () => {
    render(
      getComponent({
        model: {
          fields: [{ name: 'key', type: FieldType.boolean, id: '12' }] as any,
          rows: [],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          expect.objectContaining({
            name: 'key',
          }),
        ]),
        rows: expect.arrayContaining([
          expect.objectContaining({
            value: expect.arrayContaining(['false']),
          }),
        ]),
      })
    );
  });

  it('Should add row', async () => {
    render(getComponent({ model }));

    expect(selectors.root()).toBeInTheDocument();
    fireEvent.click(selectors.buttonAdd());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([
          { id: '121', value: ['key1'] },
          { id: '123456', value: [''] },
        ]),
      })
    );
  });

  it('Should remove row', async () => {
    render(getComponent({ model }));

    expect(selectors.root()).toBeInTheDocument();
    fireEvent.click(selectors.buttonRemove());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([]),
      })
    );
  });

  it('Should copy row', async () => {
    render(getComponent({ model }));

    expect(selectors.root()).toBeInTheDocument();
    fireEvent.click(selectors.buttonCopy());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([
          { id: '121', value: ['key1'] },
          { id: '123456', value: ['key1'] },
        ]),
      })
    );
  });

  it('Should update row', async () => {
    render(getComponent({ model }));

    expect(selectors.root()).toBeInTheDocument();

    openItem(model.rows[0].id);
    const items = screen.getAllByTestId(TEST_IDS.valuesEditor.row);

    expect(items[0]).toBeInTheDocument();
    const item1Selectors = within(items[0]);

    fireEvent.change(item1Selectors.getByTestId(TEST_IDS.valueInput.fieldString), {
      target: { value: 'New Key' },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: expect.arrayContaining([{ id: '121', value: ['New Key'] }]),
      })
    );
  });

  it('Should reorder items', async () => {
    let onDragEndHandler: (result: DropResult) => void;
    jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
      onDragEndHandler = onDragEnd;
      return children;
    });

    const field1 = {
      name: 'Name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'Name',
      type: FieldType.string,
      id: '13',
    };
    const field3 = {
      name: 'Name',
      type: FieldType.string,
      id: '14',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2, field3] as any,
          name: 'sales',
          rows: [
            { id: '121', value: ['Graph', 'Logs', 'Node Graph'] },
            { id: '122', value: ['Graph 2', 'Logs 2', 'Node Graph 2'] },
          ],
        },
      })
    );

    /**
     * Simulate drop field 1 to index 0
     */
    await act(() =>
      onDragEndHandler({
        destination: {
          index: 0,
        },
        source: {
          index: 1,
        },
      } as any)
    );

    expect(onChange).toHaveBeenCalledWith({
      fields: [
        { name: 'Name', type: 'string', id: '12' },
        { name: 'Name', type: 'string', id: '13' },
        { name: 'Name', type: 'string', id: '14' },
      ],
      name: 'sales',
      rows: [
        { id: '122', value: ['Graph 2', 'Logs 2', 'Node Graph 2'] },
        { id: '121', value: ['Graph', 'Logs', 'Node Graph'] },
      ],
    });
  });

  it('Should not reorder items if drop outside the list', async () => {
    let onDragEndHandler: (result: DropResult) => void;
    jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
      onDragEndHandler = onDragEnd;
      return children;
    });

    const field1 = {
      name: 'Name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'Name',
      type: FieldType.string,
      id: '13',
    };
    const field3 = {
      name: 'Name',
      type: FieldType.string,
      id: '14',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2, field3] as any,
          name: 'sales',
          rows: [{ id: '121', value: ['Graph', 'Logs', 'Node Graph'] }],
        },
      })
    );

    /**
     * Simulate drop field 1 to outside the list
     */
    await act(async () =>
      onDragEndHandler({
        destination: null,
        source: {
          index: 1,
        },
      } as any)
    );

    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should expand/collapse all fields', () => {
    const field1 = {
      name: 'Name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'Name',
      type: FieldType.string,
      id: '13',
    };
    const field3 = {
      name: 'Name',
      type: FieldType.string,
      id: '14',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2, field3] as any,
          name: 'sales',
          rows: [{ id: '121', value: ['Graph', 'Logs', 'Node Graph'] }],
        },
      })
    );

    fireEvent.click(selectors.collapsedAllButton());
    const items = screen.getAllByTestId(TEST_IDS.valuesEditor.row);

    expect(items[0]).toBeInTheDocument();

    fireEvent.click(selectors.collapsedAllButton());
    expect(items[0]).not.toBeInTheDocument();
  });
});
