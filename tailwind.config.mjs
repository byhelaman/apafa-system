/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				dark_blue: '#2B2D42',
				soft_blue: '#8D99AE',
				light_blue: '#EDF2F4',
				red: '#EF233C',
				vivid_red: '#D90429',
			}
		},
	},
	plugins: [],
}
