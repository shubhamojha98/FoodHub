import { createContext, useContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

export function useStoredState(key, initial, keepEntry) {
  const [value, setValue] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key)) ?? initial;
      return keepEntry ? (Array.isArray(stored) ? stored.filter(keepEntry) : initial) : stored;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}
