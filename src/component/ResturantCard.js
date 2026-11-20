import React from 'react';
import { Link } from 'react-router-dom';
import { LuHeart, LuMapPin, LuStar } from 'react-icons/lu';
import { useShop } from '../utils/shop';
import { money } from '../utils/catalog';
import FoodPhoto from './FoodPhoto';

export default function RestaurantCard({ restaurant }) {
  const { city, saved, toggleSaved } = useShop();
  const isSaved = saved.includes(`${city}:${restaurant.id}`);
  return <article className="restaurant-card">
    <Link className="restaurant-link" to={`/resturant/${restaurant.id}?city=${city}`}>
      <FoodPhoto image={restaurant.image} />
      <div className="card-copy">
        <div className="card-title">
          <h3>{restaurant.name}</h3>
          {restaurant.rating != null && <span className="rating"><LuStar aria-hidden="true" /> {restaurant.rating.toFixed(1)}</span>}
        </div>
        {restaurant.cuisines.length > 0 && <p className="card-cuisines">{restaurant.cuisines.join(' · ')}</p>}
        <div className="card-details">
          {restaurant.rating != null && <span>Rating from {restaurant.ratingSource}</span>}
          {restaurant.area && <span><LuMapPin aria-hidden="true" />{restaurant.area}</span>}
          {restaurant.costForTwo != null && <span className="card-cost">{money(restaurant.costForTwo)} for two</span>}
        </div>
      </div>
    </Link>
    {restaurant.url && <a className="provider-link card-source" href={restaurant.url}>View on IndiaRestros<span className="visually-hidden"> for {restaurant.name}</span></a>}
    <button type="button" className={`favorite ${isSaved ? 'is-saved' : ''}`} aria-pressed={isSaved}
      aria-label={`${isSaved ? 'Unsave' : 'Save'} ${restaurant.name}`} onClick={() => toggleSaved(restaurant.id)}><LuHeart /></button>
  </article>;
}
