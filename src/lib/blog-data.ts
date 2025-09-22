import { getCollection, type CollectionEntry } from 'astro:content';
import {
  fetchBlogDetail as fetchMicroCMSBlogDetail,
  fetchBlogSlugs as fetchMicroCMSBlogSlugs,
  fetchBlogSummaries as fetchMicroCMSBlogSummaries,
  isMicroCMSEnabled,
  type BlogDetail as MicroCMSBlogDetail,
  type BlogSummary as MicroCMSBlogSummary,
} from './microcms';

export interface BlogPostSummary {
  source: 'microcms' | 'local';
  slug: string;
  title: string;
  description: string;
  category: string | null;
  pubDate: Date;
  updatedDate: Date | null;
  heroImage: string | null;
}

export interface LocalBlogDetail {
  source: 'local';
  slug: string;
  entry: CollectionEntry<'blog'>;
}

export type RemoteBlogDetail = MicroCMSBlogDetail & { source: 'microcms' };

export type BlogPostDetail = RemoteBlogDetail | LocalBlogDetail;

function toLocalSummary(entry: CollectionEntry<'blog'>): BlogPostSummary {
  return {
    source: 'local',
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category ?? null,
    pubDate: entry.data.pubDate,
    updatedDate: entry.data.updatedDate ?? null,
    heroImage: entry.data.heroImage ?? null,
  };
}

function toRemoteSummary(entry: MicroCMSBlogSummary): BlogPostSummary {
  return {
    source: 'microcms',
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    pubDate: entry.pubDate,
    updatedDate: entry.updatedDate,
    heroImage: entry.heroImage,
  };
}

export async function getAllPostSummaries(): Promise<BlogPostSummary[]> {
  if (isMicroCMSEnabled()) {
    try {
      const remote = await fetchMicroCMSBlogSummaries();
      return remote.map(toRemoteSummary);
    } catch (error) {
      console.warn('microCMSからの取得に失敗したため、ローカルコンテンツにフォールバックします。', error);
    }
  }

  const entries = await getCollection('blog');
  return entries.map(toLocalSummary);
}

export async function getLatestPostSummaries(limit: number): Promise<BlogPostSummary[]> {
  const posts = await getAllPostSummaries();
  return posts
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, limit);
}

export async function getPostSummariesByCategory(): Promise<Record<string, BlogPostSummary[]>> {
  const posts = await getAllPostSummaries();
  const grouped = posts.reduce<Record<string, BlogPostSummary[]>>((acc, post) => {
    if (!post.category) return acc;
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

  for (const categoryPosts of Object.values(grouped)) {
    categoryPosts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  }

  return grouped;
}

export async function getBlogDetail(slug: string): Promise<BlogPostDetail> {
  if (isMicroCMSEnabled()) {
    try {
      const remote = await fetchMicroCMSBlogDetail(slug);
      return { ...remote, source: 'microcms' } satisfies RemoteBlogDetail;
    } catch (error) {
      console.warn(`microCMSの記事取得に失敗しました (slug: ${slug})。ローカルコンテンツを試みます。`, error);
    }
  }

  const entries = await getCollection('blog');
  const entry = entries.find((post) => post.slug === slug);

  if (!entry) {
    throw new Error(`Slug "${slug}" に一致するブログ記事が見つかりませんでした。`);
  }

  return { source: 'local', slug: entry.slug, entry } satisfies LocalBlogDetail;
}

export async function getBlogSlugs(): Promise<string[]> {
  if (isMicroCMSEnabled()) {
    try {
      return await fetchMicroCMSBlogSlugs();
    } catch (error) {
      console.warn('microCMSからスラッグ一覧の取得に失敗しました。ローカルコンテンツにフォールバックします。', error);
    }
  }

  const entries = await getCollection('blog');
  return entries.map((entry) => entry.slug);
}
