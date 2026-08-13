import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', message = '' }) => {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className={`loader-spinner ${size}`} />
      {message && <span className="loader-text">{message}</span>}
    </div>
  );
};

export default Loader;
