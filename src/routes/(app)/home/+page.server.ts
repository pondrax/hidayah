import { API_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";
import fs from 'fs'
import { PUBLIC_APP_NAME } from "$env/static/public";

export const load: PageServerLoad = async () => {
  const list = JSON.parse(fs.readFileSync('./static/store/index.json', { encoding: 'utf8' }));

  return {
    header:{
      title: PUBLIC_APP_NAME,
      description: 'Aplikasi Untuk'
    },
    list
  }
};