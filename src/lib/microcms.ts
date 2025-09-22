/*
 * microCMS API client utilities for fetching blog content.
 */

import { createClient, type MicroCMSQueries } from 'microcms-js-sdk';

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

let cachedClient: ReturnType<typeof createClient> | null = null;

export function isMicroCMSEnabled(): boolean {
  return Boolean(serviceDomain && apiKey);
}

function getClient() {
  if (!serviceDomain || !apiKey) {
    throw new Error('microCMSの環境変数 (MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY) が設定されていません。');
  }

  if (!cachedClient) {
    if (apiVersion !== 'v1') {
      console.warn(`microCMS-js-sdk は apiVersion "${apiVersion}" を直接サポートしていません。v1 を利用します。`);
    }

    cachedClient = createClient({
      serviceDomain,
      apiKey,
    });
  }

  return cachedClient;
}

async function requestList<T>(queries?: MicroCMSQueries): Promise<MicroCMSListResponse<T>> {
  try {
    const client = getClient();
    return await client.getList<T>({ endpoint: blogEndpoint, queries });
  } catch (error) {
    throw formatMicroCMSError(error);
  }
}

async function requestDetail<T>(contentId: string, queries?: MicroCMSQueries): Promise<T> {
  try {
    const client = getClient();
    return await client.getListDetail<T>({ endpoint: blogEndpoint, contentId, queries });
  } catch (error) {
    throw formatMicroCMSError(error);
  }
}

function formatMicroCMSError(error: unknown) {
  if (error instanceof Error && 'status' in error) {
    const status = (error as { status?: number }).status;
    return new Error(`microCMSリクエストに失敗しました (${status ?? 'unknown'}): ${error.message}`);
  }
  return error instanceof Error ? error : new Error(String(error));
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
  const queries: MicroCMSQueries = {
    limit: params?.limit,
    orders: params?.orders ?? '-publishedAt',
    draftKey: params?.draftKey,
  };

  const data = await requestList<MicroCMSBlogContent>(queries);
  return data.contents.map(toSummary);
}

export async function fetchBlogDetail(slug: string, params?: { draftKey?: string }): Promise<BlogDetail> {
  const queries: MicroCMSQueries = {
    draftKey: params?.draftKey,
  };

  let entry: MicroCMSBlogContent;

  try {
    entry = await requestDetail<MicroCMSBlogContent>(slug, queries);
  } catch (error) {
    if (slug) {
      const list = await requestList<MicroCMSBlogContent>({
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
  const data = await requestList<MicroCMSBlogContent>({
    fields: 'id,slug',
    limit: 100,
  });

  return data.contents.map((entry) =>
    entry.slug && typeof entry.slug === 'string' && entry.slug.length > 0 ? entry.slug : entry.id
  );
}
