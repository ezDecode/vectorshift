import { useStore } from './store';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const TOAST_STYLE = {
  borderRadius: '10px',
  background: '#333',
  color: '#fff',
};

const AnalysisResult = ({ data }) => {
  const color = data.is_dag ? '#4ade80' : '#f87171';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '150px' }}>
      <span style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>Analysis Complete</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a1a1aa' }}>
        <span>Nodes: <strong style={{ color: '#fff', fontWeight: 500 }}>{data.num_nodes}</strong></span>
        <span>Edges: <strong style={{ color: '#fff', fontWeight: 500 }}>{data.num_edges}</strong></span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a1a1aa', marginTop: '2px' }}>
        <span>Valid DAG:</span>
        <strong style={{ color, fontWeight: 500 }}>{data.is_dag ? 'Yes' : 'No'}</strong>
      </div>
    </div>
  );
};

export const useSubmit = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const setEdgesAnimated = useStore((s) => s.setEdgesAnimated);

  const submit = async () => {
    setEdgesAnimated(true);
    
    const toastId = toast.loading('Analyzing pipeline...', { style: TOAST_STYLE });
    
    // Artificial visual delay for the data flow animation to play
    await new Promise(res => setTimeout(res, 800));

    try {
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      
      toast.dismiss(toastId);

      if (data.error) {
        toast.error(data.error, { style: TOAST_STYLE });
      } else {
        toast(
          <AnalysisResult data={data} />,
          {
            icon: data.is_dag ? '✅' : '❌',
            duration: 5000,
            style: { borderRadius: '8px', background: '#27272a', color: '#fff', padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }
          }
        );
      }
    } catch {
      toast.dismiss(toastId);
      toast.error('Could not connect to backend.', { style: TOAST_STYLE });
    } finally {
      setEdgesAnimated(false);
    }
  };

  return { submit };
};
