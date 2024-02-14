import React, { useState } from 'react';

interface VariableEditorProps {
  variable: VariableModel;
  onChange: (variable: VariableModel) => void;
}

interface VariableModel {
  name: string;
  query: string;
}

export const VariableQueryEditor: React.FC<VariableEditorProps> = ({ onChange, query, datasource }) => {
  const [name, setName] = useState('');
  const [queryCurrent, setQueryCurrent] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryCurrent(e.target.value);
  };

  const handleSave = () => {
    // todo
    console.log('console > click click');
    // onChange(updatedVariable);
  };

  return (
    <div>
      <p>Test Visual</p>
      <label>Name:</label>
      <input type="text" value={name} onChange={handleNameChange} />

      <label>Query:</label>
      <textarea value={queryCurrent} onChange={handleQueryChange} />

      <button onClick={handleSave}>Save</button>
    </div>
  );
};
