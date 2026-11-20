import { useCatalog } from './catalogClient';

export default function useRestaurantMenu(restaurantId, city) {
  return useCatalog(city, restaurantId);
}
