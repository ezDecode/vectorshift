import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const op = data?.op || '+';

  return (
    <BaseNode
      id={id}
      label="Math"
      color="var(--c-math)"
      inputs={[{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]}
      outputs={[{ id: 'result', label: 'result' }]}
    >
      <div className="node-field">
        <label>Operation</label>
        <select
          value={op}
          onChange={e => updateNodeField(id, 'op', e.target.value)}
        >
          <option value="+">Add (+)</option>
          <option value="-">Subtract (−)</option>
          <option value="*">Multiply (×)</option>
          <option value="/">Divide (÷)</option>
        </select>
      </div>
    </BaseNode>
  );
};
