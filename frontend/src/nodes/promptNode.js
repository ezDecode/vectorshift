import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const PromptNode = ({ id, data }) => {
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [role, setRole] = useState(data?.role || 'user');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      label="Prompt"
      color="var(--c-prompt)"
      outputs={[{ id: 'prompt', label: 'prompt' }]}
    >
      <div className="node-field">
        <label>Role</label>
        <select value={role} onChange={e => {
          setRole(e.target.value);
          updateNodeField(id, 'role', e.target.value);
        }}>
          <option value="user">User</option>
          <option value="system">System</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>
      <div className="node-field">
        <label>Prompt</label>
        <textarea
          value={prompt}
          onChange={e => {
            setPrompt(e.target.value);
            updateNodeField(id, 'prompt', e.target.value);
          }}
          rows={3}
          placeholder="Enter prompt..."
        />
      </div>
    </BaseNode>
  );
};
