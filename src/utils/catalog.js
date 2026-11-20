export { CITIES as cities } from './constant';

export const money = paise => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0,
}).format(paise / 100);
