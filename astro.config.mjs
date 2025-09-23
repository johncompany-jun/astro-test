import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://happy-m-work.com',
	trailingSlash: 'always',
	integrations: [mdx(), tailwind(), sitemap()],
});
