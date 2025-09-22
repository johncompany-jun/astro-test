module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./public/**/*.html',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					background: '#eeeeee',
					surface: '#ffffff',
					text: '#000a15',
					subtle: '#4f5a64',
				},
			},
			fontFamily: {
				sans: [
					'"Noto Sans JP"',
					'"Hiragino Kaku Gothic Pro"',
					'Meiryo',
					'sans-serif',
				],
				display: ['Oswald', '"Noto Sans JP"', 'sans-serif'],
			},
			boxShadow: {
				'xl-soft': '0 30px 60px rgba(0, 10, 21, 0.08)',
				'lg-soft': '0 20px 40px rgba(0, 10, 21, 0.15)',
			},
			letterSpacing: {
				'widest-12': '0.12em',
				'widest-16': '0.16em',
				'wider-08': '0.08em',
			},
			backgroundImage: {
				'hero-radial': 'radial-gradient(rgba(0,10,21,0.55), rgba(0,10,21,0.8))',
				'service-gradient': 'linear-gradient(140deg, #01326d 0%, #001b3c 60%, rgba(0, 27, 60, 0.9) 100%)',
				'recruit-gradient': 'linear-gradient(120deg, rgba(0, 27, 60, 0.85), rgba(0, 10, 21, 0.9))',
			},
			keyframes: {
				'scroll-down': {
					'0%': { opacity: '0', transform: 'translateY(-60%)' },
					'50%': { opacity: '1', transform: 'translateY(0%)' },
					'100%': { opacity: '0', transform: 'translateY(60%)' },
				},
			},
			animation: {
				'scroll-down': 'scroll-down 2s infinite',
			},
		},
	},
	plugins: [],
};
