import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const MergeNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const sep = data?.sep || '\\n';

  return (
    <BaseNode
      id={id}
      label="Merge"
      color="var(--c-merge)"
      inputs={[{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]}
      outputs={[{ id: 'merged', label: 'merged' }]}
    >
      <div className="node-field">
        <label>Separator</label>
        <input
          value={sep}
          onChange={e => updateNodeField(id, 'sep', e.target.value)}
          placeholder="\n"
        />
      </div>
    </BaseNode>
  );
};
