import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";
import fs from 'fs';
import { stores } from "$lib/util";

export const load: PageServerLoad = async ({ params: { category } }) => {
  const index = JSON.parse(fs.readFileSync(stores('index.json'), { encoding: 'utf8' }));
  const list = JSON.parse(fs.readFileSync(stores(category, '/index.json'), { encoding: 'utf8' }));

  // console.log(list)
  return {
    header: index.find((i: any) => i.slug == category),
    category,
    list
  }
};