import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const [sep, setSep] = useState(data?.sep || '\\n');
  const updateNodeField = useStore((state) => state.updateNodeField);

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
          onChange={e => {
            setSep(e.target.value);
            updateNodeField(id, 'sep', e.target.value);
          }}
          placeholder="\n"
        />
      </div>
    </BaseNode>
  );
};
