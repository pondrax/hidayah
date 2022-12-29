import type { PageServerLoad } from "./$types";
import { PUBLIC_APP_NAME } from "$env/static/public";
import fs from 'fs'
import path from 'path'

export const load: PageServerLoad = async () => {
  console.log(path.resolve('./static/store/index.json'))
  const list = JSON.parse(
    fs.readFileSync(path.resolve('./static/store/index.json'), { encoding: 'utf8' })
  );

  return {
    header: {
      title: PUBLIC_APP_NAME,
      description: 'Aplikasi Untuk'
    },
    list
  }
};