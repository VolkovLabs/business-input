import React, { useState } from 'react';

import { FormIndent, FormGroup, FormButton } from './Forms';

interface AddRemoveRowProps {
  children: React.ReactNode;
  onAdd: () => void;
  onRemove: () => void;
}

export const AddRemoveRow: React.FC<AddRemoveRowProps> = ({ children, onAdd, onRemove }) => {
  const [hover, setHover] = useState(false);

  const onMouseEnter = () => {
    console.log('onMouseEnter');
    setHover(true);
  };
  const onMouseLeave = () => {
    console.log('onMouseLeave');
    setHover(false);
  };

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <FormGroup>
        <FormIndent level={2} />

        {children}

        {hover ? (
          <>
            <FormButton icon="plus" onClick={onAdd} />
            <FormButton icon="trash-alt" onClick={onRemove} />
          </>
        ) : null}
      </FormGroup>
    </div>
  );
};
