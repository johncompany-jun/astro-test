import type { APIRoute } from 'astro';

export const prerender = true;

const DEFAULT_SITE = 'https://happy-m-work.com';

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site?.toString() ?? DEFAULT_SITE;
	const sitemapUrl = new URL('sitemap-index.xml', siteUrl);

	const body = [
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${sitemapUrl.href}`,
		'',
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
