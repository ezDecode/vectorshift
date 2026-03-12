import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      label="Filter"
      color="var(--c-filter)"
      inputs={[{ id: 'data', label: 'data' }]}
      outputs={[{ id: 'pass', label: 'pass' }, { id: 'fail', label: 'fail' }]}
    >
      <div className="node-field">
        <label>Condition</label>
        <input
          value={condition}
          onChange={e => {
            setCondition(e.target.value);
            updateNodeField(id, 'condition', e.target.value);
          }}
          placeholder="e.g. value > 10"
        />
      </div>
    </BaseNode>
  );
};
