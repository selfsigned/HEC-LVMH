import itemsJson from './items.json';
import shelvesJson from './shelves.json';
import { itemData, shelfData } from '$lib/appstore.js';

export function load({ url }) {
	// Load data
	itemData.set(itemsJson);
	shelfData.set(shelvesJson);
}
