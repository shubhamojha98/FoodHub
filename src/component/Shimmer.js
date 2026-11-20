import React from 'react';

export default function Shimmer() {
  return <div className="restaurant-grid skeleton-grid" role="status" aria-label="Loading restaurants">
    {[0, 1, 2].map(id => <div className="skeleton-card" key={id} />)}
  </div>;
}
