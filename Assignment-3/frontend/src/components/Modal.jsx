import React from 'react';

export default function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal-card ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
