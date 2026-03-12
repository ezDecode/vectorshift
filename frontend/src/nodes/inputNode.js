import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      label="Input"
      color="var(--c-input)"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-field">
        <label>Name</label>
        <input value={name} onChange={e => {
          setName(e.target.value);
          updateNodeField(id, 'inputName', e.target.value);
        }} />
      </div>
      <div className="node-field">
        <label>Type</label>
        <select value={type} onChange={e => {
          setType(e.target.value);
          updateNodeField(id, 'inputType', e.target.value);
        }}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
