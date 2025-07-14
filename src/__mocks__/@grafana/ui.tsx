import React from 'react';

const actual = jest.requireActual('@grafana/ui');

/**
 * Mock Button Row Toolbar
 */
const ToolbarButtonRowMock = ({ leftItems, children }: any) => {
  return (
    <>
      {leftItems}
      {children}
    </>
  );
};

const ToolbarButtonRow = jest.fn(ToolbarButtonRowMock);

beforeEach(() => {
  ToolbarButtonRow.mockImplementation(ToolbarButtonRowMock);
});

module.exports = {
  ...actual,

  ToolbarButtonRow,
};
