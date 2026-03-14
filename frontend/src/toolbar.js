// all node types with icons
const mainNodes = [
  { type: 'customInput', label: 'Input' },
  { type: 'customOutput', label: 'Output' },
  { type: 'llm', label: 'LLM' },
  { type: 'text', label: 'Text' },
  { type: 'prompt', label: 'Prompt' },
  { type: 'math', label: 'Math' },
  { type: 'filter', label: 'Filter' },
  { type: 'note', label: 'Note' },
  { type: 'merge', label: 'Merge' },
];

const DockItem = ({ type, label, icon }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="dock-item" draggable onDragStart={onDragStart}>
      <span className="icon">{icon}</span>
      <span className="name">{label}</span>
    </div>
  );
};

export const PipelineToolbar = () => {
  return (
    <div className="dock">
      {mainNodes.map(n => <DockItem key={n.type} {...n} />)}
    </div>
  );
};
