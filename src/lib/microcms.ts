/*
 * microCMS API client utilities for fetching blog content.
 */

export interface MicroCMSImageField {
  url: string;
  width?: number;
  height?: number;
}

export interface MicroCMSCategoryField {
  id: string;
  name?: string;
}

export interface MicroCMSBlogContent {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  category?: MicroCMSCategoryField | string | null;
  body?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  revisedAt?: string | null;
  createdAt?: string | null;
  heroImage?: MicroCMSImageField | null;
  eyecatch?: MicroCMSImageField | null;
  thumbnail?: MicroCMSImageField | null;
  cover?: MicroCMSImageField | null;
  [key: string]: unknown;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const apiVersion = import.meta.env.MICROCMS_API_VERSION ?? 'v1';
const blogEndpoint = import.meta.env.MICROCMS_BLOG_ENDPOINT ?? 'blogs';

const baseUrl = serviceDomain
  ? `https://${serviceDomain}.microcms.io/api/${apiVersion}`
  : undefined;

export function isMicroCMSEnabled(): boolean {
  return Boolean(baseUrl && apiKey);
}

function resolveConfiguration() {
  if (!baseUrl || !apiKey) {
    throw new Error('microCMSの環境変数 (MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY) が設定されていません。');
  }

  return { baseUrl, apiKey } as const;
}

async function request<T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> {
  const { baseUrl: resolvedBaseUrl, apiKey: resolvedApiKey } = resolveConfiguration();
  const url = new URL(path, `${resolvedBaseUrl}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    headers: {
      'X-MICROCMS-API-KEY': resolvedApiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`microCMSリクエストに失敗しました (${response.status}): ${details}`);
  }

  return response.json() as Promise<T>;
}

function pickImageUrl(entry: MicroCMSBlogContent): string | null {
  const candidate = entry.heroImage ?? entry.eyecatch ?? entry.thumbnail ?? entry.cover;
  return typeof candidate === 'object' && candidate ? candidate.url ?? null : null;
}

function resolveCategory(entry: MicroCMSBlogContent): string | null {
  const category = entry.category;
  if (!category) return null;
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && 'id' in category && typeof category.id === 'string') {
    return category.id;
  }
  return null;
}

function resolveDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

export interface BlogSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  pubDate: Date;
  updatedDate: Date | null;
  heroImage: string | null;
  raw: MicroCMSBlogContent;
}

export interface BlogDetail extends BlogSummary {
  contentHtml: string | null;
  contentRaw: string | null;
}

function toSummary(entry: MicroCMSBlogContent): BlogSummary {
  const slug = entry.slug && typeof entry.slug === 'string' && entry.slug.length > 0 ? entry.slug : entry.id;
  const pubDate =
    resolveDate(entry.publishedAt) ?? resolveDate(entry.createdAt) ?? resolveDate(entry.updatedAt) ?? new Date();
  const updatedDate = resolveDate(entry.revisedAt) ?? resolveDate(entry.updatedAt) ?? null;

  return {
    id: entry.id,
    slug,
    title: entry.title ?? slug,
    description: typeof entry.description === 'string' ? entry.description : '',
    category: resolveCategory(entry),
    pubDate,
    updatedDate,
    heroImage: pickImageUrl(entry),
    raw: entry,
  };
}

export async function fetchBlogSummaries(params?: {
  limit?: number;
  orders?: string;
  draftKey?: string;
}): Promise<BlogSummary[]> {
  const query: Record<string, string | number | undefined> = {
    limit: params?.limit,
    orders: params?.orders ?? '-publishedAt',
    draftKey: params?.draftKey,
  };

  const data = await request<MicroCMSListResponse<MicroCMSBlogContent>>(`${blogEndpoint}`, query);
  return data.contents.map(toSummary);
}

export async function fetchBlogDetail(slug: string, params?: { draftKey?: string }): Promise<BlogDetail> {
  const query: Record<string, string | number | undefined> = {
    draftKey: params?.draftKey,
  };

  let entry: MicroCMSBlogContent;

  try {
    entry = await request<MicroCMSBlogContent>(`${blogEndpoint}/${slug}`, query);
  } catch (error) {
    // When the entry slug differs from microCMS id, retry via search.
    if (slug) {
      const list = await request<MicroCMSListResponse<MicroCMSBlogContent>>(`${blogEndpoint}`, {
        filters: `slug[equals]${slug}`,
        limit: 1,
        draftKey: params?.draftKey,
      });
      if (list.contents.length === 0) {
        throw error;
      }
      entry = list.contents[0];
    } else {
      throw error;
    }
  }

  const summary = toSummary(entry);
  const content = typeof entry.body === 'string' ? entry.body : typeof entry.content === 'string' ? entry.content : null;

  return {
    ...summary,
    contentHtml: content,
    contentRaw: content,
  };
}

export async function fetchBlogSlugs(): Promise<string[]> {
  const data = await request<MicroCMSListResponse<MicroCMSBlogContent>>(`${blogEndpoint}`, {
    fields: 'id,slug',
    limit: 100,
  });

  return data.contents.map((entry) =>
    entry.slug && typeof entry.slug === 'string' && entry.slug.length > 0 ? entry.slug : entry.id
  );
}
