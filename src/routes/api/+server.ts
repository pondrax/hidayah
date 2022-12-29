import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';

export const GET = (({ url }) => {
  const categories = fs.readdirSync('./static/store/');
  const list = import.meta.glob('/static/store/**/*.md');
  // console.log(categories)
  let data = Object.keys(list).map(d => {
    let name = d.replace('.md', '').split('/').pop()||'';
    let [no,title] = name?.split('.')
    return {
      title: title,
      no: no,
      path: d
    }
  });
  return new Response(JSON.stringify(categories));
}) satisfies RequestHandler;