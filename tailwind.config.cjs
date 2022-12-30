/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {}
	},
	mode: 'jit',
	content: ['./src/routes/**/*.{svelte,js,ts}', './src/lib/**/*.{svelte,js,ts}'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dark', 'cupcake', 'pastel', 'winter']
	}
};
