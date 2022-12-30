import type { RequestHandler } from './$types';
import fs from 'fs';

const RECITER = [
	'rifai',
	'mishary',
	'husary'
	// 'sudais',
];
export const GET = (async ({}) => {
	Promise.all(
		Array.from({ length: 114 }, async (x, i: number) => {
			i++;
			const dir = `./static/store/Al Quran/reciter/`;
			await Promise.all(
				RECITER.map(async (reciter) => {
					try {
						let json = await (
							await fetch(
								`https://quranwbw.com/assets/data/${i}/word-timestamps/${reciter}.json?v=30`
							)
						).json();

						json = Object.fromEntries(
							Object.entries(json).map(([id, aya]: any) => [
								id,
								{
									word: aya.split('/').map((ts: any, i: number, arr: any) => ({
										start: parseFloat(ts),
										end: parseFloat(arr[i + 1] || null)
									}))
								}
							])
						);

						if (!fs.existsSync(dir + reciter)) {
							fs.mkdirSync(dir + reciter);
						}

						fs.writeFileSync(dir + `${reciter}/${i}.json`, JSON.stringify(json, null, 0));
					} catch (e) {
						console.log(
							e,
							`https://quranwbw.com/assets/data/${i}/word-timestamps/${reciter}.json?v=30`
						);
					}
				})
			);
		})
	);

	return new Response('done');
}) satisfies RequestHandler;
