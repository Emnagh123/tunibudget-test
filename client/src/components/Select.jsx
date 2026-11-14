import { useState, useEffect } from 'react';

// Custom animated dropdown (replaces the native <select>, whose popup cannot be styled)
export default function Select({ value, onChange, options, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => String(o.value) === String(value));

  // close when clicking anywhere outside the open dropdown
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!e.target.closest('.dd.open')) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className={`dd ${open ? 'open' : ''}`}>
      <button type="button" className="dd-btn" onClick={() => setOpen(!open)}>
        <span className={current ? '' : 'ph'}>{current ? current.label : placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <ul className="dd-menu">
        {options.map((o) => (
          <li key={o.value} className={String(o.value) === String(value) ? 'sel' : ''}
            onClick={() => { onChange(o.value); setOpen(false); }}>{o.label}</li>))}
      </ul>
    </div>
  );
}
