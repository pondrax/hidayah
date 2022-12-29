import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const data = await (await fetch(API_URL)).json();
  
  return {
    list:data
  }
};