import { useState } from 'react';
import { useStore } from './store';

export const useSubmit = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Could not connect to backend.' });
    }
    setLoading(false);
  };

  return { submit, result, loading, close: () => setResult(null) };
};

export const ResultModal = ({ result, loading, onClose }) => {
  if (loading) return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Analyzing pipeline...</p>
      </div>
    </div>
  );

  if (!result) return null;

  if (result.error) return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Error</h3>
        <p style={{ color: '#f87171', fontSize: 13 }}>{result.error}</p>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3>Pipeline Analysis</h3>
        <div className="modal-stat">
          <span>Nodes</span>
          <span className="val">{result.num_nodes}</span>
        </div>
        <div className="modal-stat">
          <span>Edges</span>
          <span className="val">{result.num_edges}</span>
        </div>
        <div className="modal-stat">
          <span>Valid DAG</span>
          <span className="val" style={{ color: result.is_dag ? 'var(--c-input)' : 'var(--c-output)' }}>
            {result.is_dag ? 'Yes' : 'No'}
          </span>
        </div>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
