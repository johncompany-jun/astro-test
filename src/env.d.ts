/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly MICROCMS_SERVICE_DOMAIN?: string;
	readonly MICROCMS_API_KEY?: string;
	readonly MICROCMS_BLOG_ENDPOINT?: string;
	readonly MICROCMS_API_VERSION?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
