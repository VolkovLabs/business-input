import { FieldType } from '@grafana/data';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { TEST_IDS } from '../../constants';
import { FieldsEditor } from './FieldsEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  /**
   * Mock Select component
   */
  Select: jest.fn().mockImplementation(({ options, onChange, value, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      value={value}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

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

type Props = React.ComponentProps<typeof FieldsEditor>;

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [], rows: [] };
  const onChange = jest.fn();
  const onRunQuery = jest.fn();

  /**
   * Get Tested Component
   * @param query
   * @param restProps
   */
  const getComponent = ({ query, ...restProps }: Partial<Props>) => {
    return <FieldsEditor onChange={onChange} onRunQuery={onRunQuery} {...(restProps as any)} query={query || {}} />;
  };

  beforeEach(() => {
    onChange.mockClear();
    onRunQuery.mockClear();
  });

  it('Should add field if there is no any fields', async () => {
    render(getComponent({ model }));

    expect(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              type: FieldType.string,
              name: 'Field 1',
            }),
          ]),
        }),
      })
    );
  });

  it('Should render fields with values', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
    };
    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);

    /**
     * Check name
     */
    expect(items[0]).toBeInTheDocument();

    const item1Selectors = within(items[0]);

    expect(item1Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field1.name);
    expect(item1Selectors.getByLabelText(TEST_IDS.fieldsEditor.fieldType)).toHaveValue(field1.type);

    /**
     * Check amount
     */
    expect(items[1]).toBeInTheDocument();

    const item2Selectors = within(items[1]);

    expect(item2Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field2.name);
    expect(item2Selectors.getByLabelText(TEST_IDS.fieldsEditor.fieldType)).toHaveValue(field2.type);
  });

  it('Should change name', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
    };
    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);
    expect(items[0]).toBeInTheDocument();

    const item1Selectors = within(items[0]);

    fireEvent.change(item1Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName), { target: { value: 'hello' } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              name: 'hello',
            }),
          ]),
        }),
      })
    );
  });

  it('Should change type', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
    };
    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);
    expect(items[0]).toBeInTheDocument();

    const item1Selectors = within(items[0]);

    fireEvent.change(item1Selectors.getByLabelText(TEST_IDS.fieldsEditor.fieldType), {
      target: { value: FieldType.geo },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              type: FieldType.geo,
            }),
          ]),
        }),
      })
    );
  });

  it('Should add field', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
    };
    render(
      getComponent({
        model: {
          fields: [field1] as any,
          rows: [['some data']],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              type: FieldType.string,
              name: 'Field 2',
            }),
          ]),
        }),
      })
    );
  });

  it('Should remove field', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
    };
    render(
      getComponent({
        model: {
          fields: [field1] as any,
          rows: [['some data']],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.fieldsEditor.buttonRemove));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        frame: expect.objectContaining({
          fields: [],
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
    const field1 = {
      name: 'Drag Key',
      type: FieldType.string,
    };
    const field2 = {
      name: 'Drag Key 2',
      type: FieldType.number,
    };
    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
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

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);

    const item1Selectors = within(items[0]);
    const item2Selectors = within(items[1]);

    /**
     * Check if items order is changed
     */
    expect(item1Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field2.name);
    expect(item2Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field1.name);
  });

  it('Should not reorder items if drop outside the list', async () => {
    let onDragEndHandler: (result: DropResult) => void;
    jest.mocked(DragDropContext).mockImplementation(({ children, onDragEnd }: any) => {
      onDragEndHandler = onDragEnd;
      return children;
    });
    const field1 = {
      name: 'Drag Key',
      type: FieldType.string,
    };
    const field2 = {
      name: 'Drag Key 2',
      type: FieldType.number,
    };
    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
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

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);

    const item1Selectors = within(items[0]);
    const item2Selectors = within(items[1]);

    /**
     * Check if items order is not changed
     */
    expect(item1Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field1.name);
    expect(item2Selectors.getByTestId(TEST_IDS.fieldsEditor.fieldName)).toHaveValue(field2.name);
  });
});
