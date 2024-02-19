import { FieldType } from '@grafana/data';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

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

type Props = React.ComponentProps<typeof FieldsEditor>;

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [], rows: [] };
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
   * Create On Change Handler
   */
  const createOnChangeHandler = (initialValue: any) => {
    let value = initialValue;
    return {
      value,
      onChange: jest.fn((newValue) => {
        value = newValue;
      }),
    };
  };

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.fieldsEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <FieldsEditor onChange={onChange} onRunQuery={onRunQuery} {...(restProps as any)} />;
  };

  beforeEach(() => {
    onChange.mockClear();
    onRunQuery.mockClear();
  });

  it('Should add field if there is no any fields', async () => {
    render(getComponent({ model }));

    expect(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith({
      fields: expect.arrayContaining([
        expect.objectContaining({
          type: FieldType.string,
          name: '',
          id: '123456',
        }),
      ]),
      rows: [],
    });
  });

  it('Should render fields with values', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
      id: '13',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.itemHeader(false, '12')).toBeInTheDocument();
    expect(selectors.itemHeader(false, '13')).toBeInTheDocument();
  });

  it('Should change name', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
      id: '13',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    const item = openItem(field1.id);
    const item2 = openItem(field2.id);
    fireEvent.change(item.fieldName(), { target: { value: 'Name New' } });

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.fieldName);

    expect(items[0]).toBeInTheDocument();
    expect(items[1]).toBeInTheDocument();
    expect(item.fieldName()).toHaveValue('Name New');
    expect(item2.fieldName()).toHaveValue('amount');
  });

  it('Should change type', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
      id: '13',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );
    openItem(field1.id);
    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.item);
    expect(items[0]).toBeInTheDocument();

    const item1Selectors = within(items[0]);

    fireEvent.change(item1Selectors.getByLabelText(TEST_IDS.fieldsEditor.fieldType), {
      target: { value: FieldType.geo },
    });

    expect(onChange).toHaveBeenCalledWith({
      fields: [
        { name: 'name', type: 'geo', id: '12' },
        { name: 'amount', type: 'number', id: '13' },
      ],
      rows: [],
    });
  });

  it('Should add field', async () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };

    render(
      getComponent({
        model: {
          fields: [field1] as any,
          rows: [{ id: 'row123', value: ['some data'] }],
        },
      })
    );

    fireEvent.click(screen.getByTestId(TEST_IDS.fieldsEditor.buttonAdd));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: expect.arrayContaining([
          { name: 'name', type: 'string', id: '12' },
          { name: '', type: 'string', id: '123456' },
        ]),
      })
    );
  });

  it('Should remove field', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };

    const { value } = createOnChangeHandler({
      model: {
        fields: [field1] as any,
        rows: [{ id: 'row123', value: ['some data'] }],
      },
    });

    const { rerender } = render(getComponent(value));

    expect(selectors.root()).toBeInTheDocument();
    const item = selectors.itemHeader(false, '12');

    fireEvent.click(getSelectors(within(item)).buttonRemove());

    rerender(getComponent(value));

    expect(selectors.itemHeader(true, '12')).not.toBeInTheDocument();
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
      id: '12',
    };
    const field2 = {
      name: 'Drag Key 2',
      type: FieldType.number,
      id: '13',
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

    expect(getSelectors(within(items[0])).itemHeader(false, '13')).toBeInTheDocument();
    expect(getSelectors(within(items[1])).itemHeader(false, '12')).toBeInTheDocument();
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
      id: '12',
    };
    const field2 = {
      name: 'Drag Key 2',
      type: FieldType.number,
      id: '13',
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

    expect(getSelectors(within(items[0])).itemHeader(false, '12')).toBeInTheDocument();
    expect(getSelectors(within(items[1])).itemHeader(false, '13')).toBeInTheDocument();
  });

  it('Should expand/collapse all fields', () => {
    const field1 = {
      name: 'name',
      type: FieldType.string,
      id: '12',
    };
    const field2 = {
      name: 'amount',
      type: FieldType.number,
      id: '13',
    };

    render(
      getComponent({
        model: {
          fields: [field1, field2] as any,
          rows: [],
        },
      })
    );

    fireEvent.click(selectors.collapsedAllButton());

    const items = screen.getAllByTestId(TEST_IDS.fieldsEditor.fieldName);

    expect(items[0]).toBeInTheDocument();
    expect(items[1]).toBeInTheDocument();

    fireEvent.click(selectors.collapsedAllButton());

    expect(items[0]).not.toBeInTheDocument();
    expect(items[1]).not.toBeInTheDocument();
  });
});
