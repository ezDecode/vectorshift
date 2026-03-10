import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      label="LLM"
      color="var(--c-llm)"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', padding: '2px 0' }}>
        Large Language Model
      </div>
    </BaseNode>
  );
};
