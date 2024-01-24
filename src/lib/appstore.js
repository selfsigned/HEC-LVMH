import { writable } from 'svelte/store';

export const itemData = writable(null); // JSON of all the items (products + services)
export const objectsData = writable(null); // JSON of all the objects
export const categoryData = writable(null); // JSON of all the shelves

// App window states
export const productInfoModal = writable(null); // Display the product info modal

// App user state
export const currentCategory = writable(null); // The currently selected category
export const currentItem = writable(null); // The current selected item
export const currentShelf = writable(null); // The currently selected shelf (on the 3D map)
