import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuChevronDown, LuHeart, LuMapPin, LuShoppingBag, LuUtensils } from 'react-icons/lu';
import { cities } from '../utils/catalog';
import { useShop } from '../utils/shop';

export function Brand() {
  return <Link className="brand" to="/" aria-label="FoodHub home"><span className="brand-mark"><LuUtensils /></span>food<span>hub<span className="brand-dot">.</span></span></Link>;
}

export default function Header() {
  const { city, setCity, cart } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const isSaved = new URLSearchParams(location.search).get('view') === 'saved';
  const isExplore = location.pathname === '/' && !isSaved;
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  return <header className="site-header">
    <div className="header-inner">
      <Brand />
      <label className="location-picker">
        <LuMapPin aria-hidden="true" />
        <span className="location-text">Explore in</span>
        <span className="select-wrap">
          <select aria-label="Restaurant city" value={city} onChange={event => {
            setCity(event.target.value);
            if (location.pathname !== '/') navigate('/');
          }}>
            {Object.entries(cities).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <LuChevronDown aria-hidden="true" />
        </span>
      </label>
      <nav className="top-nav" aria-label="Main navigation">
        <Link className="explore-link" to="/" aria-current={isExplore ? 'page' : undefined}>Explore</Link>
        <Link className="saved-link" to="/?view=saved" aria-label="Saved restaurants" aria-current={isSaved ? 'page' : undefined}><LuHeart /> <span>Saved</span></Link>
        <Link className="bag-link" to="/cart" aria-label={`Bag, ${count} items`} aria-current={location.pathname === '/cart' ? 'page' : undefined}><LuShoppingBag /> <span>Bag</span><span className="bag-count">{count}</span></Link>
      </nav>
    </div>
  </header>;
}
