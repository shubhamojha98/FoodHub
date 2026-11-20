const { normalizeListing, normalizeMenu, restaurantIdPattern } = require('./normalize');
const { CITIES } = require('../src/utils/constant');

const api = 'https://indiarestros.com/api/v1';

function json(res, status, payload, cacheControl = 'no-store') {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cacheControl });
  res.end(JSON.stringify(payload));
}

function createHandler(fetchUpstream = fetch) {
  async function read(path, signal) {
    const response = await fetchUpstream(new URL(api + path), {
      headers: { Accept: 'application/json', 'User-Agent': 'FoodHub/1.0' },
      signal,
      redirect: 'error',
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(`IndiaRestros returned HTTP ${response.status}`);
    }
    const cache = response.headers.get('cache-control') ?? '';
    const age = /(?:^|,)\s*max-age=(\d+)\s*(?:,|$)/i.exec(cache)?.[1];
    const cacheAge = /(?:^|,)\s*public\s*(?:,|$)/i.test(cache) && !/\bno-(?:store|cache)\b/i.test(cache)
      ? Number(age ?? 0)
      : 0;
    return { data: await response.json(), cacheAge };
  }

  return async function handleCatalog(req, res) {
    const request = new URL(req.url, 'http://localhost');
    const listing = request.pathname === '/api/food/restaurants';
    const restaurantId = request.pathname.match(/^\/api\/food\/menus\/([^/]+)$/)?.[1];
    if (!listing && !restaurantIdPattern.test(restaurantId ?? '')) {
      return json(res, 404, { error: 'Unknown food endpoint' });
    }
    if (req.method !== 'GET') return json(res, 405, { error: 'Use GET' });

    const city = request.searchParams.get('city') ?? 'gurugram';
    if (!Object.hasOwn(CITIES, city)) return json(res, 400, { error: 'Unknown city' });

    try {
      const signal = AbortSignal.timeout(6000);
      const path = `/restaurants/${restaurantId}`;
      const results = listing
        ? [await read(`/restaurants?${new URLSearchParams({ city, limit: '40' })}`, signal)]
        : await Promise.all([read(path, signal), read(path + '/menu', signal)]);
      const data = listing
        ? normalizeListing(results[0].data)
        : normalizeMenu(results[0].data, results[1].data, restaurantId);
      const cacheAge = Math.min(...results.map(result => result.cacheAge));
      return json(res, 200, data, cacheAge ? `public, max-age=${cacheAge}` : 'no-store');
    } catch (error) {
      return json(res, error.code === 'NO_MENU' ? 404 : 502, { error: error.message });
    }
  };
}

module.exports = { createHandler, handleCatalog: createHandler() };
