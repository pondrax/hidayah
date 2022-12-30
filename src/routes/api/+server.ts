import type { RequestHandler } from './$types';
import fs from 'fs';

export const GET = (({}) => {
	const categories = fs.readdirSync('./static/store/');
	// const list = import.meta.glob('/static/store/**/*.md');
	// console.log(categories)
	// const data = Object.keys(list).map((d) => {
	// 	const name = d.replace('.md', '').split('/').pop() || '';
	// 	const [no, title] = name?.split('.');
	// 	return {
	// 		title: title,
	// 		no: no,
	// 		path: d
	// 	};
	// });
	return new Response(JSON.stringify(categories));
}) satisfies RequestHandler;
