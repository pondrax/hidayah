import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";
import fs from 'fs';

type Aya = {
  word: Array<string>,
  aya: string
}
export const load: PageServerLoad = async ({ params: { path, category } }) => {
  let dir = './static/store/' + category;
  const index = JSON.parse(fs.readFileSync(dir + '/index.json', { encoding: 'utf8' }));
  const ar = JSON.parse(fs.readFileSync(dir + '/ar/' + path + '.json', { encoding: 'utf8' }));
  const locale = JSON.parse(fs.readFileSync(dir + '/id/' + path + '.json', { encoding: 'utf8' }));
  const timestamp = JSON.parse(fs.readFileSync(dir + '/reciter/mishary/' + path + '.json', { encoding: 'utf8' }));
  const list = merge(merge(ar, timestamp), locale);

  return {
    header: index.find((i: any) => i.no == path),
    category,
    path,
    list: Object.entries(list) as any
  }
};


function merge(a: any, b: object) {
  return Object.entries(b).reduce((o, [k, v]) => {
    o[k] = v && typeof v === 'object'
      ? merge(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
      : v;
    return o;
  }, a);
}
