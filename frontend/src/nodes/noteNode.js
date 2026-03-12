import { useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note...');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode id={id} label="Note" color="var(--c-note)">
      <div className="node-field">
        <label>Note Content</label>
        <textarea
          value={note}
          onChange={e => {
            setNote(e.target.value);
            updateNodeField(id, 'note', e.target.value);
          }}
          rows={3}
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
        />
      </div>
    </BaseNode>
  );
};
