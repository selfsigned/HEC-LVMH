import { writable } from 'svelte/store';

export const itemData = writable(null); // JSON of all the items (products + services)
export const shelfData = writable(null); // JSON of all the shelves

export const productInfoModal = writable(null); // Display the product info modal
