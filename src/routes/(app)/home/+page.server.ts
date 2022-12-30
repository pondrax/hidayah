import type { PageServerLoad } from './$types';
import { PUBLIC_APP_NAME } from '$env/static/public';
import fs from 'fs';
import { stores } from '$lib/util';

export const load: PageServerLoad = async () => {
	console.log(stores('index.json'));
	// const list = JSON.parse(
	//   fs.readFileSync(stores('index.json'), { encoding: 'utf8' })
	// );
	const list = await stores('/index.json');

	return {
		header: {
			title: PUBLIC_APP_NAME,
			description: 'Aplikasi Untuk'
		},
		list
	};
};
