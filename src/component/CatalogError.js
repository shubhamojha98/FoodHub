import React from 'react';

export default function CatalogError({ message, onRetry }) {
  return <div className="empty-state">
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
    <button type="button" className="button-solid" onClick={onRetry}>Try again</button>
  </div>;
}
