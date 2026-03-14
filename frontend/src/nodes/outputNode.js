import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const name = data?.outputName || id.replace('customOutput-', 'output_');
  const type = data?.outputType || 'Text';

  return (
    <BaseNode
      id={id}
      label="Output"
      color="var(--c-output)"
      inputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-field">
        <label>Name</label>
        <input
          value={name}
          onChange={e => updateNodeField(id, 'outputName', e.target.value)}
        />
      </div>
      <div className="node-field">
        <label>Type</label>
        <select
          value={type}
          onChange={e => updateNodeField(id, 'outputType', e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
