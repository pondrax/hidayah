import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const lastRead = writable({});

if (browser && localStorage) {
  lastRead.set(JSON.parse(localStorage?.lastRead || "{}"))
}
lastRead.subscribe(val => {
  if (browser && localStorage) {
    localStorage.lastRead = JSON.stringify(val);
  }
})