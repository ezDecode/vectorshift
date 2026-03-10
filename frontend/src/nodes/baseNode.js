import { Handle, Position } from 'reactflow';

export const BaseNode = ({ id, label, color, inputs = [], outputs = [], children }) => {
  return (
    <div className="base-node" style={{ borderTop: `2px solid ${color}` }}>
      <div className="node-header">
        <div className="dot" style={{ background: color }} />
        <span>{label}</span>
      </div>
      <div className="node-body">
        {children}
      </div>

      {inputs.map((h, i) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
          title={h.label}
        />
      ))}

      {outputs.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
          title={h.label}
        />
      ))}
    </div>
  );
};
