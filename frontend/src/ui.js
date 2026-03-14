import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { nodeTypes } from './nodes';
import { PipelineToolbar } from './toolbar';
import { useSubmit } from './submit';
import { ConfirmModal } from './ConfirmModal';

import 'reactflow/dist/style.css';

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
    useStore(useShallow(selector));
  const { submit } = useSubmit();

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

        <ConfirmModal />
      </div>
    </ReactFlowProvider>
  );
};
