import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { LuMapPin, LuStar } from 'react-icons/lu';
import { cities, money } from '../utils/catalog';
import useRestaurantMenu from '../utils/useResturnatMenu';
import { useShop } from '../utils/shop';
import FoodPhoto from './FoodPhoto';
import CatalogError from './CatalogError';
import RestaurantCategory from './ResturantCategory';

export default function RestaurantMenu() {
  const { resId } = useParams();
  const [params] = useSearchParams();
  const { city, addToCart } = useShop();
  const requestedCity = params.get('city');
  const menuCity = requestedCity && Object.hasOwn(cities, requestedCity) ? requestedCity : city;
  const { data, error, loading, retry } = useRestaurantMenu(resId, menuCity);

  return <section className="inner-page menu-page">
    <Link className="text-link" to="/">Back to explore</Link>
    {loading && <p className="menu-status" role="status">Loading menu…</p>}
    {error && <CatalogError message={error === 'missing'
      ? 'IndiaRestros has no menu for this restaurant.'
      : 'We couldn’t load this menu from IndiaRestros.'} onRetry={retry} />}
    {data && <>
      <div className="menu-hero">
        <FoodPhoto image={data.restaurant.image} />
        <div className="menu-intro">
          <p className="eyebrow">{cities[menuCity]}</p>
          <h1>{data.restaurant.name}</h1>
          <p>{data.restaurant.cuisines.join(' · ')}</p>
          <div className="card-details">
            {data.restaurant.rating != null && <span className="rating"><LuStar />{data.restaurant.rating.toFixed(1)} on {data.restaurant.ratingSource}</span>}
            {data.restaurant.area && <span><LuMapPin />{data.restaurant.area}</span>}
            {data.restaurant.costForTwo != null && <span>{money(data.restaurant.costForTwo)} for two</span>}
          </div>
          {data.restaurant.url && <a className="provider-link" href={data.restaurant.url}>View on IndiaRestros</a>}
        </div>
      </div>
      <h2 className="menu-heading">The menu</h2>
      {(data.source || data.updated) && <p className="data-note">
        {[data.source && `Menu source ${data.source}`, data.updated && `Updated ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(data.updated))}`].filter(Boolean).join(' · ')}
      </p>}
      {data.sections.map(section => <RestaurantCategory section={section} key={section.id}
        onAdd={item => addToCart(data.restaurant, item, menuCity)} />)}
    </>}
  </section>;
}
