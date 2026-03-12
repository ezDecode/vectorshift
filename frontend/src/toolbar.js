import { useState } from 'react';

// all node types with icons
const mainNodes = [
  { type: 'customInput', label: 'Input', icon: '' },
  { type: 'customOutput', label: 'Output', icon: '' },
  { type: 'llm', label: 'LLM', icon: '' },
  { type: 'text', label: 'Text', icon: '' },
  { type: 'prompt', label: 'Prompt', icon: '' },
  { type: 'math', label: 'Math', icon: '' },
  { type: 'filter', label: 'Filter', icon: '' },
  { type: 'note', label: 'Note', icon: '' },
  { type: 'merge', label: 'Merge', icon: '' },
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
