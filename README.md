# FoodHub

FoodHub is a React restaurant guide built from the Namaste React course project. It supports cuisine and name search, city selection, restaurant menus, saved restaurants, and a locally saved bag.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm start
```

Parcel prints the local URL. For a production build, run `npm run build` followed by `npm run serve`. The Node server serves the built app and the same food API routes used in development. Set `HOST` and `PORT` when hosting elsewhere.

## How the code fits together

- `src/component/` renders the restaurant list, menu sections, saved restaurants, and bag. Your existing About, Contact, and Grocery pages are still routed through the shared layout.
- `src/utils/catalogClient.js` loads the live food catalogue, cancels stale requests, and reports failed or empty responses.
- `server/indiarestros.js` asks IndiaRestros for city listings and retrieves restaurant details and menus by IRR ID. The API requires no key. `server/normalize.js` maps fields such as `locality`, `rating_external`, `cost_for_two`, and section `items` to the UI. It converts prices from rupees to integer paise.
- `src/utils/shop.js` provides shared state for the city, saved restaurants, and bag. Those preferences are stored in the browser.

When IndiaRestros returns an error or no data, FoodHub shows a retry button. Restaurant records link to their IndiaRestros page. Listings without a verified restaurant-specific image appear without one. Menu prices are periodically refreshed by IndiaRestros. The bag is local, and FoodHub has no live delivery estimates, checkout, or payment integration.
