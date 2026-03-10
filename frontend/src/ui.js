import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
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

const proOptions = { hideAttribution: true };
const snapGrid = [20, 20];

const selector = (s) => ({
  nodes: s.nodes,
  edges: s.edges,
  getNodeID: s.getNodeID,
  addNode: s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export const PipelineUI = () => {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);
  const { submit, result, loading, close } = useSubmit();

  const onDrop = useCallback((e) => {
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
  }, [rfInstance]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={snapGrid}
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="#252836" gap={20} />
        <Controls />
        <MiniMap nodeColor={() => '#252836'} maskColor="rgba(12,13,18,0.7)" />
      </ReactFlow>

      <PipelineToolbar onSubmit={submit} />
      <ResultModal result={result} loading={loading} onClose={close} />
    </div>
  );
};
