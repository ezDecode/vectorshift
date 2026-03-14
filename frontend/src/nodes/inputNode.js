import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const name = data?.inputName || id.replace('customInput-', 'input_');
  const type = data?.inputType || 'Text';

  return (
    <BaseNode
      id={id}
      label="Input"
      color="var(--c-input)"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-field">
        <label>Name</label>
        <input
          value={name}
          onChange={e => updateNodeField(id, 'inputName', e.target.value)}
        />
      </div>
      <div className="node-field">
        <label>Type</label>
        <select
          value={type}
          onChange={e => updateNodeField(id, 'inputType', e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
