import { FieldType } from '@grafana/data';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { TestIds } from '../../constants';
import { ValuesEditor } from './ValuesEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof ValuesEditor>;

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

    fireEvent.click(screen.getByTestId(TestIds.valuesEditor.buttonAdd));

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

    fireEvent.click(screen.getByTestId(TestIds.valuesEditor.buttonAdd));

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

    fireEvent.click(screen.getByTestId(TestIds.valuesEditor.buttonAdd));

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

    fireEvent.click(screen.getByTestId(TestIds.valuesEditor.buttonAdd));

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

    const row = screen.getByTestId(TestIds.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TestIds.valuesEditor.buttonAdd));

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

    const row = screen.getByTestId(TestIds.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TestIds.valuesEditor.buttonRemove));

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

    const row = screen.getByTestId(TestIds.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.click(rowSelectors.getByTestId(TestIds.valuesEditor.buttonCopy));

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

    const row = screen.getByTestId(TestIds.valuesEditor.row);

    expect(row).toBeInTheDocument();

    const rowSelectors = within(row);

    fireEvent.change(rowSelectors.getByTestId(TestIds.valueInput.fieldString), { target: { value: '123' } });

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
});
