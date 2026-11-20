import React from 'react';
import ItemList from './ItemList';

export default function RestaurantCategory({ section, onAdd }) {
  return <details className="menu-section" open>
    <summary>{section.title} <span>{section.items.length} items</span></summary>
    <ItemList items={section.items} onAdd={onAdd} />
  </details>;
}
