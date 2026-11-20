import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { LuShoppingBag } from 'react-icons/lu';
import Header from './component/Header';
import Body from './component/Body';
import RestaurantMenu from './component/ResturantMenu';
import Footer from './component/Footer';
import Cart from './component/Cart';
import About from './component/About';
import Contact from './component/Contact';
import Grocery from './component/Grocery';
import { cities } from './utils/catalog';
import { ShopContext, useStoredState } from './utils/shop';
import '../index.css';

function AppLayout() {
  const [storedCity, setCity] = useStoredState('foodhub-city', 'gurugram');
  const [saved, setSaved] = useStoredState('foodhub-saved', [], key => typeof key === 'string' && !key.includes(':sample-'));
  const [cart, setCart] = useStoredState('foodhub-cart', [], item => typeof item?.key === 'string' && !item.sample && !item.key.includes(':sample-'));
  const [notice, setNotice] = useState('');
  const city = Object.hasOwn(cities, storedCity) ? storedCity : 'gurugram';
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2400);
    return () => clearTimeout(timer);
  }, [notice]);

  function toggleSaved(id) {
    const key = `${city}:${id}`;
    setSaved(current => current.includes(key) ? current.filter(entry => entry !== key) : [...current, key]);
  }

  function changeQuantity(key, delta) {
    setCart(current => current.map(item => item.key === key ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
  }

  function addToCart(restaurant, item, menuCity) {
    const key = `${menuCity}:${restaurant.id}:${item.id}`;
    setCart(current => current.some(entry => entry.key === key)
      ? current.map(entry => entry.key === key ? { ...entry, quantity: entry.quantity + 1 } : entry)
      : [...current, { key, name: item.name, price: item.price, restaurant: restaurant.name, city: menuCity, quantity: 1 }]);
    setNotice(`Added ${item.name} to your bag.`);
  }

  return <ShopContext.Provider value={{ city, setCity, saved, toggleSaved, cart, changeQuantity, addToCart }}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" className="site-main"><Outlet /></main>
    <Footer />
    <div aria-live="polite" className={notice ? 'toast' : 'toast toast-hidden'}>{notice && <><LuShoppingBag /> {notice}</>}</div>
  </ShopContext.Provider>;
}

function InfoPage({ title, children }) {
  return <section className="inner-page"><Link className="text-link" to="/">Back to explore</Link>{title && <h1>{title}</h1>}{children}</section>;
}

const router = createBrowserRouter([{
  element: <AppLayout />,
  children: [
    { index: true, element: <Body /> },
    { path: 'resturant/:resId', element: <RestaurantMenu /> },
    { path: 'restaurant/:resId', element: <RestaurantMenu /> },
    { path: 'cart', element: <Cart /> },
    { path: 'about', element: <InfoPage title="About FoodHub"><About /></InfoPage> },
    { path: 'contact', element: <InfoPage title="Contact"><Contact /></InfoPage> },
    { path: 'grocery', element: <InfoPage><Grocery /></InfoPage> },
    { path: '*', element: <InfoPage title="Page not found"><p>Explore the catalogue to find a restaurant or cuisine.</p></InfoPage> },
  ],
}]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
