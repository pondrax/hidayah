import type { RequestHandler } from './$types';
import fs from 'fs';

const pad = (surah: any, ayah: any) => {
	return String(surah).padStart(3, '0') + String(ayah).padStart(3, '0');
};
export const GET = (async ({}) => {
	Promise.all(
		Array.from({ length: 114 }, async (_, i: number) => {
			i++;
			const dir = `./static/store/Al Quran/`;
			if (!fs.existsSync(dir + 'ar')) {
				fs.mkdirSync(dir + 'ar');
				fs.mkdirSync(dir + 'tl');
				fs.mkdirSync(dir + 'id');
			}

			let wordAR, wordID, ayaID: { [x: string]: any };
			wordAR = await (
				await fetch(`https://quranwbw.com/assets/data/${i}/word-translations/arabic.json?v=30`)
			).json();
			ayaID = await (
				await fetch(`https://quranwbw.com/assets/data/${i}/ayah-translations/id.bahasa.json?v=30`)
			).json();
			wordID = await (
				await fetch(`https://quranwbw.com/assets/data/${i}/word-translations/indonesian.json?v=30`)
			).json();

			wordAR = Object.fromEntries(
				Object.entries(wordAR).map(([id, aya]: any) => [
					id,
					{
						id: pad(i, id),
						word: aya.split('//').map((word: string) => ({
							ar: word.split('/')[1],
							tl: word.split('/')[2]
						}))
						// tl: aya.split('//').map((word: string) => (word.split('/')[2])).join(' ')
					}
				])
			);
			wordID = Object.fromEntries(
				Object.entries(wordID).map(([id, val]: any) => [
					id,
					{
						word: val.split('//').map((word: string) => ({ locale: word })),
						aya: ayaID[id]
					}
				])
			);

			fs.writeFileSync(dir + `ar/${i}.json`, JSON.stringify(wordAR, null, 0));
			fs.writeFileSync(dir + `id/${i}.json`, JSON.stringify(wordID, null, 0));
		})
	);

	return new Response('done');
}) satisfies RequestHandler;
