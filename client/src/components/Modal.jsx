import { useEffect } from 'react';

// Animated pop-up window. Click outside or press Escape to close.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3>
          <button className="x" aria-label="Close" onClick={onClose}>×</button></div>
        {children}
      </div>
    </div>
  );
}
