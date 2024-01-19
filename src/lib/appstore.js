import { writable } from 'svelte/store';

export const productList = writable(null); // JSON of all the products
export const shelfList = writable(null); // JSON of all the shelves

export const productInfoModal = writable(null); // Display the product info modal
