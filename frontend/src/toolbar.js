import { useState } from 'react';

// all node types with icons
const mainNodes = [
  { type: 'customInput', label: 'Input', icon: '' },
  { type: 'customOutput', label: 'Output', icon: '' },
  { type: 'llm', label: 'LLM', icon: '' },
  { type: 'text', label: 'Text', icon: '' },
  { type: 'prompt', label: 'Prompt', icon: '' },
];

const moreNodes = [
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

export const PipelineToolbar = ({ onSubmit }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="dock">
      {mainNodes.map(n => <DockItem key={n.type} {...n} />)}

      <div className="dock-sep" />

      <div className="dock-more">
        <button className="dock-more-btn" onClick={() => setShowMore(!showMore)}>
          <span>More</span>
        </button>
        {showMore && (
          <div className="dock-dropdown">
            {moreNodes.map(n => {
              const onDragStart = (e) => {
                e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: n.type }));
                e.dataTransfer.effectAllowed = 'move';
                setShowMore(false);
              };
              return (
                <div key={n.type} className="dock-dropdown-item" draggable onDragStart={onDragStart}>
                  <span>{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="dock-sep" />

      <button className="submit-btn" onClick={onSubmit}>
        Run
      </button>
    </div>
  );
};
