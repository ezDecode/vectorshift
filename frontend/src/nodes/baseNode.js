import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({ id, label, color, inputs = [], outputs = [], children }) => {
  const { removeNode, setConfirmConfig } = useStore((state) => ({
    removeNode: state.removeNode,
    setConfirmConfig: state.setConfirmConfig
  }));

  return (
    <div className="base-node">
      <div className="node-header">
        <span>{label}</span>
        <button 
          className="node-delete-btn" 
          onClick={() => {
            setConfirmConfig({
              title: `Delete Node`,
              message: `Are you sure you want to delete the "${label}" node?`,
              onConfirm: () => removeNode(id)
            });
          }}
          title="Delete Node"
        >
          ✕
        </button>
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
          style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%`, backgroundColor: color }}
          title={h.label}
        />
      ))}

      {outputs.map((h, i) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%`, backgroundColor: color }}
          title={h.label}
        />
      ))}
    </div>
  );
};
