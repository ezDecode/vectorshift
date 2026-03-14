import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const PromptNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const prompt = data?.prompt || '';
  const role = data?.role || 'user';

  return (
    <BaseNode
      id={id}
      label="Prompt"
      color="var(--c-prompt)"
      outputs={[{ id: 'prompt', label: 'prompt' }]}
    >
      <div className="node-field">
        <label>Role</label>
        <select
          value={role}
          onChange={e => updateNodeField(id, 'role', e.target.value)}
        >
          <option value="user">User</option>
          <option value="system">System</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>
      <div className="node-field">
        <label>Prompt</label>
        <textarea
          value={prompt}
          onChange={e => updateNodeField(id, 'prompt', e.target.value)}
          rows={3}
          placeholder="Enter prompt..."
        />
      </div>
    </BaseNode>
  );
};
