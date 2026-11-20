import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LuHeart, LuSearch, LuStar, LuX } from 'react-icons/lu';
import { cities } from '../utils/catalog';
import { useCatalog } from '../utils/catalogClient';
import { useShop } from '../utils/shop';
import RestaurantCard from './ResturantCard';
import CatalogError from './CatalogError';
import Shimmer from './Shimmer';

export default function Body() {
  const { city, saved } = useShop();
  const [params] = useSearchParams();
  const onlySaved = params.get('view') === 'saved';
  const { data, error, loading, retry } = useCatalog(city);
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [topRated, setTopRated] = useState(false);
  const cuisines = useMemo(() => [...new Set(data?.flatMap(restaurant => restaurant.cuisines))].sort((a, b) => a.localeCompare(b)), [data]);
  const activeCuisine = cuisines.includes(cuisine) ? cuisine : '';
  const matches = useMemo(() => {
    if (!data) return [];
    if (onlySaved) return data.filter(restaurant => saved.includes(`${city}:${restaurant.id}`));
    const text = query.trim().toLowerCase();
    const result = data.filter(restaurant => (
      (!activeCuisine || restaurant.cuisines.includes(activeCuisine))
      && [restaurant.name, ...restaurant.cuisines, restaurant.area].some(value => value.toLowerCase().includes(text))
    ));
    if (topRated) return result.filter(restaurant => restaurant.rating >= 4.3).sort((a, b) => b.rating - a.rating);
    return result;
  }, [data, query, activeCuisine, topRated, onlySaved, saved, city]);

  const showResults = () => document.getElementById('restaurants')?.scrollIntoView({ block: 'start' });
  const reset = () => { setQuery(''); setCuisine(''); setTopRated(false); };

  return <>
    {!onlySaved && <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <p className="eyebrow hero-label">THE LOCAL FOOD GUIDE</p>
          <h1 id="hero-title">Good food.<br /> <em>Close to home.</em></h1>
          <p className="hero-description">Find the dishes you love and the neighbourhood kitchens that make them.</p>
          <form className="hero-search" onSubmit={event => { event.preventDefault(); showResults(); }}>
            <LuSearch aria-hidden="true" />
            <input type="search" aria-label="Search restaurants or cuisines" placeholder="Search for food" value={query} onChange={event => setQuery(event.target.value)} />
            <button type="submit">Find food</button>
          </form>
        </div>
      </section>
      {cuisines.length > 0 && <section className="cuisines" aria-labelledby="cuisine-title">
        <h2 id="cuisine-title">What are you craving?</h2>
        <div className="cuisine-list">
          {cuisines.map(label => <button key={label} type="button" aria-pressed={activeCuisine === label} onClick={() => {
            setCuisine(current => current === label ? '' : label);
            showResults();
          }}>
            <span>{label}</span>
          </button>)}
        </div>
      </section>}
    </>}
    <section id="restaurants" className="restaurants" aria-labelledby="restaurant-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{cities[city]}</p>
          <h2 id="restaurant-title">{onlySaved ? 'Saved restaurants' : 'Restaurants near you'}</h2>
        </div>
        {!onlySaved && data && <div className="filter-list">
          {activeCuisine && <button type="button" aria-label={`Clear ${activeCuisine} filter`} onClick={() => setCuisine('')}><LuX />{activeCuisine}</button>}
          <button type="button" aria-pressed={topRated} onClick={() => setTopRated(current => !current)}><LuStar /> Top rated</button>
        </div>}
      </div>
      {error && <CatalogError message="We couldn’t load restaurants from IndiaRestros." onRetry={retry} />}
      {data && !matches.length && <div className="empty-state">
        {onlySaved ? <LuHeart /> : <LuSearch />}
        <h3>{onlySaved ? 'Your favourites will appear here' : 'No matching restaurants'}</h3>
        <p>{onlySaved ? 'Tap the heart on a restaurant to save it for later.' : 'Try a different search or clear the filters.'}</p>
        {!onlySaved && <button className="button-solid" onClick={reset}>Clear filters</button>}
      </div>}
      {loading && <Shimmer />}
      {matches.length > 0 && <div className="restaurant-grid">
        {matches.map(restaurant => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
      </div>}
    </section>
  </>;
}
