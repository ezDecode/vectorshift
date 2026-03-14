import React from 'react';
import { PipelineUI } from './ui';
import { Toaster } from 'react-hot-toast';

// Catches render errors so the whole app doesn't white-screen
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', color: '#f1f5f9',
          fontFamily: 'Inter, sans-serif', gap: 12
        }}>
          <h2>Something went wrong</h2>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: '#4f87ff', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 500
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" />
      <PipelineUI />
    </ErrorBoundary>
  );
}

export default App;
