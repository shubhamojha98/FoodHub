import React from 'react';
import { LuPlus } from 'react-icons/lu';
import { money } from '../utils/catalog';

export default function ItemList({ items, onAdd }) {
  return <ul>
    {items.map(item => <li key={item.id} className="menu-item">
      <div>
        {item.vegetarian && <span className="veg-label">Vegetarian</span>}
        <h3>{item.name}</h3>
        {item.price != null && <strong>{money(item.price)}</strong>}
        {item.description && <p>{item.description}</p>}
      </div>
      <div className="menu-item-action">
        {item.price != null
          ? <button type="button" className="button-outline" aria-label={`Add ${item.name} to bag`} onClick={() => onAdd(item)}><LuPlus /> Add</button>
          : <span>Price unavailable</span>}
      </div>
    </li>)}
  </ul>;
}
