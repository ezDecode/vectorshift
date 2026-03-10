import { useState } from 'react';
import { BaseNode } from './baseNode';

export const MergeNode = ({ id, data }) => {
  const [sep, setSep] = useState(data?.sep || '\\n');

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
          onChange={e => setSep(e.target.value)}
          placeholder="\n"
        />
      </div>
    </BaseNode>
  );
};
