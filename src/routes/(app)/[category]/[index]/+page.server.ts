import type { PageServerLoad } from './$types';
import fs from 'fs';
import { stores } from '$lib/util';

const RECITER: any = {
	husary: 'https://www.everyayah.com/data/Husary_128kbps/',
	mishary: 'https://www.everyayah.com/data/Alafasy_128kbps/',
	rifai: 'https://www.everyayah.com/data/Hani_Rifai_64kbps/'
};

export const load: PageServerLoad = async ({
	url: { searchParams },
	params: { index, category }
}) => {
	const reciter = searchParams.get('reciter') || 'mishary';
	// const categories = await stores('index.json');
	const data = await stores(category, 'index.json');
	const ar = await stores(category, 'ar', index + '.json');
	const locale = await stores(category, 'id', index + '.json');
	const timestamp = await stores(category, 'reciter', reciter, index + '.json');
	const list = merge(merge(ar, timestamp), locale);

	return {
		header: Object.assign(
			data.find((i: any) => i.no == index),
			{
				category,
				reciter,
				reciterList: RECITER,
				reciterUrl: RECITER[reciter]
			}
		),
		categories: data.map((d: any) => d.title),
		list: Object.entries(list) as any
	};
};

function merge(a: any, b: object) {
	return Object.entries(b).reduce((o, [k, v]) => {
		o[k] = v && typeof v === 'object' ? merge((o[k] = o[k] || (Array.isArray(v) ? [] : {})), v) : v;
		return o;
	}, a);
}
