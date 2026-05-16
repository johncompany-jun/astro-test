import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://happy-m-work.com';
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

async function loadBlogLastmodMap() {
	const domain = env.MICROCMS_SERVICE_DOMAIN ?? process.env.MICROCMS_SERVICE_DOMAIN;
	const apiKey = env.MICROCMS_API_KEY ?? process.env.MICROCMS_API_KEY;
	const endpoint = env.MICROCMS_BLOG_ENDPOINT ?? process.env.MICROCMS_BLOG_ENDPOINT ?? 'blogs';
	const map = new Map();
	if (!domain || !apiKey) return map;

	const limit = 100;
	let offset = 0;
	while (true) {
		const url = `https://${domain}.microcms.io/api/v1/${endpoint}?limit=${limit}&offset=${offset}&fields=id,slug,publishedAt,updatedAt,revisedAt`;
		const res = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
		if (!res.ok) {
			console.warn(`[sitemap] microCMS fetch failed: ${res.status}`);
			break;
		}
		const data = await res.json();
		for (const c of data.contents ?? []) {
			const slug = c.slug && typeof c.slug === 'string' && c.slug.length > 0 ? c.slug : c.id;
			const lastmod = c.revisedAt ?? c.updatedAt ?? c.publishedAt;
			if (lastmod) map.set(`${SITE}/blog/${slug}/`, lastmod);
		}
		offset += limit;
		if (offset >= (data.totalCount ?? 0)) break;
	}
	return map;
}

const blogLastmod = await loadBlogLastmodMap();

// https://astro.build/config
export default defineConfig({
	site: SITE,
	trailingSlash: 'always',
	integrations: [
		mdx(),
		tailwind(),
		sitemap({
			serialize(item) {
				const lastmod = blogLastmod.get(item.url);
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
	],
});
