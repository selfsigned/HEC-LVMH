import { writable } from 'svelte/store';

// Data stores
export const itemData = writable(null); // JSON of all the items (products + services)
export const shelfData = writable(null); // JSON of all the shelves
export const categoryData = writable(null); // JSON of all the shelves

// App window states
export const productInfoModal = writable(null); // Display the product info modal

// App user state
export const currentCategory = writable(null);
