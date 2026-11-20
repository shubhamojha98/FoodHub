import React from 'react';
import { Link } from 'react-router-dom';
import { LuMinus, LuPlus, LuShoppingBag } from 'react-icons/lu';
import { cities, money } from '../utils/catalog';
import { useShop } from '../utils/shop';

export default function Cart() {
  const { cart, changeQuantity } = useShop();
  return <section className="inner-page cart-page">
    <Link className="text-link" to="/">Back to explore</Link>
    <h1>Your bag</h1>
    {cart.length ? <>
      <ul className="cart-items">
        {cart.map(item => <li key={item.key}>
          <div><h3>{item.name}</h3><p>{item.restaurant} · {cities[item.city]}</p></div>
          <div className="quantity">
            <button type="button" onClick={() => changeQuantity(item.key, -1)} aria-label={`Remove one ${item.name}`}><LuMinus /></button>
            <span aria-label="Quantity">{item.quantity}</span>
            <button type="button" onClick={() => changeQuantity(item.key, 1)} aria-label={`Add one ${item.name}`}><LuPlus /></button>
          </div>
          <strong>{money(item.price * item.quantity)}</strong>
        </li>)}
      </ul>
      <div className="cart-total"><span>Subtotal</span><strong>{money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}</strong></div>
      <p className="data-note">Your bag is saved on this device. Checkout is unavailable in FoodHub.</p>
    </> : <div className="empty-state"><LuShoppingBag /><h2>Your bag is empty</h2><p>Browse a menu and add something you like.</p><Link className="button-solid" to="/">Explore restaurants</Link></div>}
  </section>;
}
