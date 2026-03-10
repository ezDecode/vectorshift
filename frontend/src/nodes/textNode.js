import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

// extract {{varName}} patterns from text
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
  const [text, setText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const vars = getVars(text);

  // auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  // node width grows with text length
  const nodeWidth = Math.max(200, Math.min(400, 200 + text.length * 1.2));

  return (
    <div
      className="base-node"
      style={{ borderTop: '2px solid var(--c-text)', width: nodeWidth, position: 'relative' }}
    >
      <div className="node-header">
        <div className="dot" style={{ background: 'var(--c-text)' }} />
        <span>Text</span>
      </div>
      <div className="node-body">
        <div className="node-field">
          <label>Content</label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={1}
          />
        </div>
      </div>

      {/* dynamic variable handles on the left */}
      {vars.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (vars.length + 1)) * 100}%` }}
          title={v}
        />
      ))}

      {/* output on right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: '50%' }}
      />
    </div>
  );
};
