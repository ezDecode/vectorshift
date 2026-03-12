import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MathNode } from './nodes/mathNode';
import { FilterNode } from './nodes/filterNode';
import { NoteNode } from './nodes/noteNode';
import { PromptNode } from './nodes/promptNode';
import { MergeNode } from './nodes/mergeNode';
import { PipelineToolbar } from './toolbar';
import { useSubmit, ResultModal } from './submit';

import 'reactflow/dist/style.css';

const ConfirmModal = () => {
  const { confirmConfig, setConfirmConfig } = useStore(
    (state) => ({ confirmConfig: state.confirmConfig, setConfirmConfig: state.setConfirmConfig }),
    shallow
  );

  if (!confirmConfig) return null;

  const handleConfirm = () => {
    confirmConfig.onConfirm();
    setConfirmConfig(null);
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h3>{confirmConfig.title}</h3>
        <p>{confirmConfig.message}</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={() => setConfirmConfig(null)}>Cancel</button>
          <button className="btn-delete" onClick={handleConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  note: NoteNode,
  prompt: PromptNode,
  merge: MergeNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  removeEdge: state.removeEdge,
  setConfirmConfig: state.setConfirmConfig,
});

export const PipelineUI = () => {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect, removeEdge, setConfirmConfig } =
    useStore(selector, shallow);
  const { submit, result, loading, close } = useSubmit();

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const id = getNodeID(nodeType);
      addNode({ id, type: nodeType, position, data: { id, nodeType } });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleEdgeClick = useCallback(
    (_, edge) => {
      setConfirmConfig({
        title: 'Delete Connection',
        message: 'Are you sure you want to delete this connection?',
        onConfirm: () => removeEdge(edge.id),
      });
    },
    [removeEdge, setConfirmConfig]
  );

  return (
    <ReactFlowProvider>
      <div ref={wrapperRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={handleEdgeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          snapGrid={[20, 20]}
          connectionLineType="default"
          fitView
        >
          <Background color="#3d4559" gap={20} size={1} />
          <MiniMap nodeColor={() => '#64748b'} maskColor="rgba(30,41,59,0.7)" />
        </ReactFlow>

        <div className="bottom-layout">
          <div className="dock-controls">
            <Controls showInteractive={false} />
          </div>
          
          <PipelineToolbar />
          
          <div className="dock-submit">
            <button className="submit-btn" onClick={submit}>Run</button>
          </div>
        </div>

        <ResultModal result={result} loading={loading} onClose={close} />
        <ConfirmModal />
      </div>
    </ReactFlowProvider>
  );
};
