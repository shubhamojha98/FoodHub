import { useEffect, useState } from 'react';

export function useCatalog(city, restaurantId) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = JSON.stringify([city, restaurantId, attempt]);

  useEffect(() => {
    const controller = new AbortController();
    const finish = outcome => {
      if (!controller.signal.aborted) setResult({ key, ...outcome });
    };

    async function load() {
      try {
        const endpoint = restaurantId ? `menus/${encodeURIComponent(restaurantId)}` : 'restaurants';
        const response = await fetch(`/api/food/${endpoint}?city=${encodeURIComponent(city)}`, { signal: controller.signal });
        if (restaurantId && response.status === 404) {
          finish({ error: 'missing' });
          return;
        }
        if (!response.ok) throw new Error('The live catalogue is unavailable');
        const data = await response.json();
        const hasData = restaurantId
          ? data?.restaurant && Array.isArray(data.sections) && data.sections.length > 0
          : Array.isArray(data) && data.length > 0;
        if (!hasData) throw new Error('Invalid or empty catalogue response');
        finish({ data });
      } catch {
        finish({ error: true });
      }
    }

    load();
    return () => controller.abort();
  }, [city, restaurantId, key]);

  const current = result?.key === key ? result : null;
  return { data: current?.data, error: current?.error, loading: !current, retry: () => setAttempt(count => count + 1) };
}
