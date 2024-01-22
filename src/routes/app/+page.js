import itemsJson from './items.json';
import shelvesJson from './shelves.json';
import categoriesJson from './categories.json';
import { itemData, shelfData, categoryData } from '$lib/appstore.js';

export function load({ url }) {
	// Load data
	itemData.set(itemsJson);
	shelfData.set(shelvesJson);
	categoryData.set(categoriesJson);
}
