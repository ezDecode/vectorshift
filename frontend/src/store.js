import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import toast from 'react-hot-toast';

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

  // ──── Real-time cycle prevention ────
  // Prevents cycles as users connect nodes, for instant UX feedback.
  // The backend also validates this on submit as a safety net (main.py → check_dag).
  onConnect: (connection) => {
    // Block self-loops
    if (connection.source === connection.target) {
      toast.error('Self-loops are not allowed!', {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      return;
    }

    const edges = get().edges;
    
    // 1. Build an adjacency list representing current edges
    const adjacencyList = {};
    for (const edge of edges) {
      if (!adjacencyList[edge.source]) {
        adjacencyList[edge.source] = [];
      }
      adjacencyList[edge.source].push(edge.target);
    }

    // 2. Perform a Depth-First Search (DFS) to see if a path exists from target to source
    const hasPath = (start, end) => {
      const visited = new Set();
      const stack = [start];

      while (stack.length > 0) {
        const current = stack.pop();
        if (current === end) return true;
        
        if (!visited.has(current)) {
          visited.add(current);
          const neighbors = adjacencyList[current] || [];
          for (const neighbor of neighbors) {
            stack.push(neighbor);
          }
        }
      }
      return false;
    };

    // 3. If there's a path from target back to source, adding this edge would create a cycle
    if (hasPath(connection.target, connection.source)) {
      toast.error('Cycles are not allowed!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    const newEdge = {
      ...connection,
      type: 'default',
    };
    set({ edges: addEdge(newEdge, edges) });
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

  setEdgesAnimated: (isAnimated) => {
    set({
      edges: get().edges.map((e) => ({ ...e, animated: isAnimated })),
    });
  },
}));

// Convenience hook — avoids repeating the selector in every node
export const useNodeField = () => useStore((s) => s.updateNodeField);
