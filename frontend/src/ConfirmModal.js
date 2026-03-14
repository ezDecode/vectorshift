import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

export const ConfirmModal = () => {
  const { confirmConfig, setConfirmConfig } = useStore(
    useShallow((state) => ({ confirmConfig: state.confirmConfig, setConfirmConfig: state.setConfirmConfig }))
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
