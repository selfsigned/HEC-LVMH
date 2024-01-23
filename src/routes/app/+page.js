import itemsJson from './items.json';
import objectsJson from './objects.json';
import categoriesJson from './categories.json';
import { itemData, objectsData, categoryData } from '$lib/appstore.js';

export function load({ url }) {
	// Load data
	itemData.set(itemsJson);
	objectsData.set(objectsJson);
	categoryData.set(categoriesJson);
}
