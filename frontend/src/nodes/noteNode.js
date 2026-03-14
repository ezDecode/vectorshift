import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

export const NoteNode = ({ id, data }) => {
  const updateNodeField = useNodeField();

  const note = data?.note || 'Add a note...';

  return (
    <BaseNode id={id} label="Note" color="var(--c-note)">
      <div className="node-field">
        <label>Note Content</label>
        <textarea
          value={note}
          onChange={e => updateNodeField(id, 'note', e.target.value)}
          rows={3}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
        />
      </div>
    </BaseNode>
  );
};
