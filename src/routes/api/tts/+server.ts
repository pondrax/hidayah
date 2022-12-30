import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';

export const GET = (async ({ url, setHeaders }) => {
	const resp = await getAudio(url.searchParams.get('q') ?? '');

	setHeaders({
		age: '31536000',
		'cache-control': 'max-age=31536000, immutable'
	});
	return new Response(resp);
}) satisfies RequestHandler;

const chunk = (text: string, len = 180) => {
	//safe mode 180char
	let curr = len,
		prev = 0,
		output = [];
	text = text.replace(/<[^>]*>?/gm, '');
	while (text[curr]) {
		if (text[curr++] == ' ') {
			output.push(text.substring(prev, curr));
			prev = curr;
			curr += len;
		}
	}
	output.push(text.substr(prev));
	return output;
};
// let url=`https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(str)}&lang=id&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male`
const getAudio = async (text: string) => {
	const textArray = chunk(text);
	const buffer = await Promise.all(
		textArray.map(async (str) => {
			const body = await fetch(
				`https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${encodeURIComponent(
					str
				)}&lang=id&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male`
			);
			// const body = await fetch(`http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(str)}&tl=Id`);

			const arrayBuffer = await body.arrayBuffer();
			return Buffer.from(arrayBuffer);
		})
	);
	return Buffer.concat(buffer);
};
