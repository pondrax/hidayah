import type { PageServerLoad } from "./$types";
import fs from 'fs'
import path from 'path'

export const load: PageServerLoad = async ({ params: { index, category } }) => {
  let dir = './static/store/' + category;
  
  const data = JSON.parse(fs.readFileSync(path.resolve(dir + '/index.json'), { encoding: 'utf8' }));
  const ar = JSON.parse(fs.readFileSync(path.resolve(dir + '/ar/' + index + '.json'), { encoding: 'utf8' }));
  const locale = JSON.parse(fs.readFileSync(path.resolve(dir + '/id/' + index + '.json'), { encoding: 'utf8' }));
  const timestamp = JSON.parse(fs.readFileSync(path.resolve(dir + '/reciter/mishary/' + index + '.json'), { encoding: 'utf8' }));
  // console.log(timestamp)
  const list = merge(merge(ar, timestamp), locale);

  return {
    header: data.find((i: any) => i.no == index),
    category,
    // index,
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
