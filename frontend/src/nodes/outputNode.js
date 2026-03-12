import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      label="Output"
      color="var(--c-output)"
      inputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-field">
        <label>Name</label>
        <input value={name} onChange={e => {
          setName(e.target.value);
          updateNodeField(id, 'outputName', e.target.value);
        }} />
      </div>
      <div className="node-field">
        <label>Type</label>
        <select value={type} onChange={e => {
          setType(e.target.value);
          updateNodeField(id, 'outputType', e.target.value);
        }}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
