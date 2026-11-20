import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Header';

export default function Footer() {
  return <footer className="site-footer"><div className="footer-inner">
    <Brand />
    <nav aria-label="Footer navigation"><Link to="/">Explore</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/grocery">Grocery</Link></nav>
    <span>© {new Date().getFullYear()} FoodHub · Created by Shubham Ojha<br />
      Restaurant data from <a className="provider-link" href="https://indiarestros.com/">IndiaRestros</a> · <a className="provider-link" href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>
    </span>
  </div></footer>;
}
