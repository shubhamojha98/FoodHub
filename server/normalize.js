const restaurantIdPattern = /^IRR-[A-Z0-9]{10}$/;

const rows = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value.trim() : '';
const number = value => (typeof value === 'number' || text(value)) && Number.isFinite(Number(value)) ? Number(value) : null;
const paise = value => {
  const rupees = number(value);
  return rupees != null && rupees >= 0 ? Math.round(rupees * 100) : null;
};

function label(value) {
  return text(value).replaceAll(/[-_]+/g, ' ').replace(/\b[a-z]/g, character => character.toUpperCase());
}

function sourceLabel(value) {
  return value === 'osm' || value === 'openstreetmap' ? 'OpenStreetMap'
    : value === 'magicpin' ? 'magicpin'
    : label(value);
}

function providerUrl(value, prefix) {
  if (!text(value)) return null;
  try {
    const url = new URL(value, 'https://indiarestros.com');
    return url.origin === 'https://indiarestros.com' && url.pathname.startsWith(prefix) ? url.href : null;
  } catch {
    return null;
  }
}

function restaurantPhoto(restaurant) {
  for (const photo of rows(restaurant.photos)) {
    if (photo?.kind !== 'photo' || !text(photo.src) || /wikimedia|commons/i.test(photo.src) || photo.representative === true) continue;
    const prefix = '/img/' + restaurant.id + '/';
    const url = providerUrl(photo.thumb, prefix) ?? providerUrl(photo.url, prefix);
    if (url) return url;
  }
  return null;
}

function normalizeRestaurant(restaurant) {
  if (!restaurantIdPattern.test(restaurant?.id ?? '') || !text(restaurant.name)) return null;

  const externalRating = restaurant.rating_external ?? rows(restaurant.ratings?.external)[0];
  const rating = number(externalRating?.value);
  const ratingSource = sourceLabel(externalRating?.src);
  const cuisines = rows(restaurant.cuisine_labels).length
    ? rows(restaurant.cuisine_labels).map(text)
    : rows(restaurant.cuisines).map(label);

  return {
    id: restaurant.id,
    name: text(restaurant.name),
    cuisines: [...new Set(cuisines.filter(Boolean))],
    area: text(restaurant.locality) || text(restaurant.address?.locality),
    rating: ratingSource && rating > 0 && rating <= 5 ? rating : null,
    ratingSource,
    costForTwo: paise(restaurant.cost_for_two?.v ?? restaurant.cost_for_two),
    image: restaurantPhoto(restaurant),
    url: providerUrl(restaurant.url, '/r/'),
  };
}

function normalizeListing(payload) {
  if (!Array.isArray(payload?.results)) throw new Error('IndiaRestros returned an unrecognized listing');
  const restaurants = new Map();
  for (const entry of payload.results) {
    const restaurant = normalizeRestaurant(entry);
    if (restaurant && !restaurants.has(restaurant.id)) restaurants.set(restaurant.id, restaurant);
  }
  if (!restaurants.size) throw new Error('IndiaRestros returned no restaurants for this city');
  return [...restaurants.values()];
}

function normalizeMenu(details, payload, restaurantId) {
  const restaurant = normalizeRestaurant(details);
  if (restaurant?.id !== restaurantId || payload?.restaurant !== restaurantId) {
    throw new Error('IndiaRestros returned a menu for an unexpected restaurant');
  }
  if (payload.menu !== null && !Array.isArray(payload.sections)) {
    throw new Error('IndiaRestros returned an unrecognized menu');
  }

  const occurrences = new Map();
  const sections = rows(payload.sections).map((section, sectionIndex) => {
    const title = text(section?.name) || 'Menu';
    const items = rows(section?.items).flatMap(entry => {
      const name = text(entry?.name);
      if (!name) return [];
      const key = JSON.stringify([title, name, text(entry.dish)]);
      const occurrence = (occurrences.get(key) ?? 0) + 1;
      occurrences.set(key, occurrence);
      return [{
        id: key + ':' + occurrence,
        name,
        description: text(entry.desc),
        price: paise(entry.price),
        vegetarian: entry.veg === true,
      }];
    });
    return { id: String(sectionIndex), title, items };
  }).filter(section => section.items.length);

  if (!sections.length) {
    const error = new Error('IndiaRestros has no menu for this restaurant');
    error.code = 'NO_MENU';
    throw error;
  }

  return {
    restaurant,
    sections,
    source: sourceLabel(payload.source),
    updated: typeof payload.updated === 'string' && Number.isFinite(Date.parse(payload.updated)) ? payload.updated : null,
  };
}

module.exports = { normalizeListing, normalizeMenu, restaurantIdPattern };
