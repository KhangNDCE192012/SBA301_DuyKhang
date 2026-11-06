import React from 'react';

export default function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div className={`notice notice-${notice.type || 'info'}`} role="status">
      <span>{notice.message}</span>
      <button onClick={onClose} type="button" aria-label="Dismiss">×</button>
    </div>
  );
}
