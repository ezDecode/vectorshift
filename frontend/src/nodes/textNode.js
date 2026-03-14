import { useEffect, useRef } from 'react';
import { BaseNode } from './baseNode';
import { useNodeField } from '../store';

// Extract {{varName}} patterns from text
function getVars(text) {
  const matches = [...text.matchAll(/\{\{(\w+)\}\}/g)];
  const seen = new Set();
  const vars = [];
  for (const m of matches) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      vars.push(m[1]);
    }
  }
  return vars;
}

export const TextNode = ({ id, data }) => {
  const textareaRef = useRef(null);
  const updateNodeField = useNodeField();

  const text = data?.text ?? '{{input}}';
  const vars = getVars(text);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  // Node width grows with text length
  const nodeWidth = Math.max(200, Math.min(400, 200 + text.length * 1.2));

  return (
    <div style={{ width: nodeWidth }}>
      <BaseNode
        id={id}
        label="Text"
        color="var(--c-text)"
        inputs={vars.map(v => ({ id: v, label: v }))}
        outputs={[{ id: 'output', label: 'output' }]}
      >
        <div className="node-field">
          <label>Content</label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => updateNodeField(id, 'text', e.target.value)}
            rows={1}
            style={{ width: '100%' }}
          />
        </div>
      </BaseNode>
    </div>
  );
};
