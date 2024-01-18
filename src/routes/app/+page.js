import products from './products.json';
import shelves from './shelves.json';

export function load() {
	return {
		products: products,
		shelves: shelves
	};
}
