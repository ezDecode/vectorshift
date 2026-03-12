import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  confirmConfig: null,
  nodeIDs: {},

  setConfirmConfig: (config) => set({ confirmConfig: config }),

  getNodeID: (type) => {
    const nodeIDs = { ...get().nodeIDs };
    const nextId = (nodeIDs[type] || 0) + 1;
    nodeIDs[type] = nextId;
    set({ nodeIDs });
    return `${type}-${nextId}`;
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    });
  },

  removeEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const newEdge = {
      ...connection,
      type: 'default',
      animated: true,
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node
      ),
    });
  },
}));
