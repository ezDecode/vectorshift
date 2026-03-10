import { useState } from 'react';
import { BaseNode } from './baseNode';

export const OutputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Output"
      color="var(--c-output)"
      inputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-field">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="node-field">
        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
