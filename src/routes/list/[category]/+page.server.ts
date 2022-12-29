import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";
import fs from 'fs';

export const load: PageServerLoad = async ({ params:{category} }) => {
  // const list = fs.readdirSync('./static/store/' + params.category)
  // console.log(list)

  const path = './static/store/' + category + '/index.json';
  const list = JSON.parse(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }));

  // console.log(list)
  return {
    category,
    list
  }
};