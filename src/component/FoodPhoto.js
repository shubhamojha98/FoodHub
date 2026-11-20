import React, { useState } from 'react';

export default function FoodPhoto({ image }) {
  const [failed, setFailed] = useState(null);
  if (!image || failed === image) return null;
  return <img className="food-photo" src={image} alt="" loading="lazy" onError={() => setFailed(image)} />;
}
