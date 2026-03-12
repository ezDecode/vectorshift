import { useState } from 'react';
import { useStore } from './store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useSubmit = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: 'Could not connect to backend.' });
    }
    setLoading(false);
  };

  const close = () => setResult(null);

  return { submit, result, loading, close };
};

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const StatRow = ({ label, value, color }) => (
  <div className="modal-stat">
    <span>{label}</span>
    <span className="val" style={{ color }}>{value}</span>
  </div>
);

export const ResultModal = ({ result, loading, onClose }) => {
  if (loading) {
    return (
      <Modal>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Analyzing pipeline...</p>
      </Modal>
    );
  }

  if (!result) return null;

  if (result.error) {
    return (
      <Modal onClose={onClose}>
        <h3>Error</h3>
        <p style={{ color: '#f87171', fontSize: 13 }}>{result.error}</p>
        <button className="modal-close" onClick={onClose}>Close</button>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3>Pipeline Analysis</h3>
      <StatRow label="Nodes" value={result.num_nodes} />
      <StatRow label="Edges" value={result.num_edges} />
      <StatRow
        label="Valid DAG"
        value={result.is_dag ? 'Yes' : 'No'}
        color={result.is_dag ? 'var(--c-input)' : 'var(--c-output)'}
      />
      <button className="modal-close" onClick={onClose}>Close</button>
    </Modal>
  );
};
