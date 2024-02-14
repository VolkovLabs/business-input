import { FieldType } from '@grafana/data';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { StaticQuery } from 'types';

import { TEST_IDS } from '../../constants';
import { ValuesEditor } from './ValuesEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof ValuesEditor>;

/**
 * Mock react-beautiful-dnd
 */
jest.mock('react-beautiful-dnd', () => ({
  ...jest.requireActual('react-beautiful-dnd'),
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
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [{ name: 'key', type: FieldType.string }] as any, rows: [['key1']] };
  const onChange = jest.fn();
  const onRunQuery = jest.fn();

  const getComponent = ({ query, ...restProps }: Partial<Props>) => {
    return <ValuesEditor query={query || {}} onChange={onChange} onRunQuery={onRunQuery} {...(restProps as any)} />;
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
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: [''],
            }),
          ]),
        }),
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
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: [0],
            }),
          ]),
        }),
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
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              /**
               * Unstable date, so just check if any number
               */
              values: [expect.any(Number)],
            }),
          ]),
        }),
      })
    );
  });

  it('Should add row for boolean', async () => {
    render(
      getComponent({
        model: {
          fields: [{ name: 'key', type: FieldType.boolean }] as any,
          rows: [],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: [false],
            }),
          ]),
        }),
      })
    );
  });

  it('Should add row', async () => {
    render(getComponent({ model }));

    const row = screen.getByTestId(TEST_IDS.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TEST_IDS.valuesEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: ['key1', ''],
            }),
          ]),
        }),
      })
    );
  });

  it('Should remove row', async () => {
    render(getComponent({ model }));

    const row = screen.getByTestId(TEST_IDS.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TEST_IDS.valuesEditor.buttonRemove));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: [],
            }),
          ]),
        }),
      })
    );
  });

  it('Should copy row', async () => {
    render(getComponent({ model }));

    const row = screen.getByTestId(TEST_IDS.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TEST_IDS.valuesEditor.buttonCopy));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: ['key1', 'key1'],
            }),
          ]),
        }),
      })
    );
  });

  it('Should update row', async () => {
    render(getComponent({ model }));

    const row = screen.getByTestId(TEST_IDS.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.change(rowSelectors.getByTestId(TEST_IDS.valueInput.fieldString), { target: { value: '123' } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: ['123'],
            }),
          ]),
        }),
      })
    );
  });

  it('Should reorder items', async () => {
    let onDragEndHandler: (result: DropResult) => void;
    jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
      onDragEndHandler = onDragEnd;
      return children;
    });

    const query: StaticQuery = {
      datasource: {
        type: 'datasource',
        uid: 'P1D2C73DC01F2359B',
      },
      frame: {
        fields: [
          {
            name: 'Name',
            type: FieldType.string,
            config: {},
            values: ['Graph', 'Logs', 'Node Graph', 'Table', 'Trace'],
          },
        ],
        meta: {},
        name: 'sales',
      },
      refId: 'A',
    };
    const field1 = {
      name: 'Name',
      type: FieldType.string,
    };
    render(
      getComponent({
        query,
        model: {
          fields: [field1] as any,
          name: 'sales',
          rows: [['Graph'], ['Logs'], ['Node Graph'], ['Table'], ['Trace']],
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

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              values: ['Logs', 'Graph', 'Node Graph', 'Table', 'Trace'],
            }),
          ]),
        }),
      })
    );
  });

  it('Should not reorder items if drop outside the list', async () => {
    let onDragEndHandler: (result: DropResult) => void;
    jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
      onDragEndHandler = onDragEnd;
      return children;
    });

    const query: StaticQuery = {
      datasource: {
        type: 'datasource',
        uid: 'P1D2C73DC01F2359B',
      },
      frame: {
        fields: [
          {
            name: 'Name',
            type: FieldType.string,
            config: {},
            values: ['Graph', 'Logs', 'Node Graph', 'Table', 'Trace'],
          },
        ],
        meta: {},
        name: 'sales',
      },
      refId: 'A',
    };
    const field1 = {
      name: 'Name',
      type: FieldType.string,
    };
    render(
      getComponent({
        query,
        model: {
          fields: [field1] as any,
          name: 'sales',
          rows: [['Graph'], ['Logs'], ['Node Graph'], ['Table'], ['Trace']],
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
});
