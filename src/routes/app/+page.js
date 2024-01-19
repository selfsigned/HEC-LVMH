import productsJson from './products.json';
import shelvesJson from './shelves.json';
import { productList, shelfList, productInfoModal } from '$lib/appstore.js';

export function load({ url }) {
	// Load data
	productList.set(productsJson);
	shelfList.set(shelvesJson);
}
