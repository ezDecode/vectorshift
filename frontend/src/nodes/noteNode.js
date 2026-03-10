import { useState } from 'react';
import { BaseNode } from './baseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note...');

  return (
    <BaseNode id={id} label="Note" color="var(--c-note)">
      <div className="node-field">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
        />
      </div>
    </BaseNode>
  );
};
