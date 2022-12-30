import type { PageServerLoad } from './$types';
import { stores } from '$lib/util';

export const load: PageServerLoad = async ({ params: { category } }) => {
	const data = await stores('index.json');
	const list = await stores(category, 'index.json');
	// const index = JSON.parse(fs.readFileSync(stores('index.json'), { encoding: 'utf8' }));
	// const list = JSON.parse(fs.readFileSync(stores(category, '/index.json'), { encoding: 'utf8' }));

	// console.log(list)
	return {
		header: data.find((i: any) => i.slug == category),
		category,
		list
	};
};
