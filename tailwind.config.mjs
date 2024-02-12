import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				blue: generateScale("blue"),
				green: generateScale("green"),
				red: generateScale("red"),
				purple: generateScale("purple"),
				gray: generateScale("gray"),
			},
			fontFamily: {
				sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono Variable", ...defaultTheme.fontFamily.mono],
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}

// https://fynn.at/shorts/2023-03-19-how-to-use-radix-colors-with-tailwind-css
function generateScale(name) {
  let scale = Array.from({ length: 12 }, (_, i) => {
    let id = i + 1;
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}-a${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}