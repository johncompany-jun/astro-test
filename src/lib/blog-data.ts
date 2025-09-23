import { getCollection } from 'astro:content';
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

type BlogEntryData = {
  title: string;
  description: string;
  category: 'programming' | 'telework' | 'skills';
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
};

type LocalBlogEntry = {
  slug: string;
  data: BlogEntryData;
  render: () => Promise<{ Content: unknown }>;
};

// Ensure we always have a usable entry type even when the collection folder is empty.
async function getLocalBlogEntries(): Promise<LocalBlogEntry[]> {
  return (await getCollection('blog')) as LocalBlogEntry[];
}

export interface LocalBlogDetail {
  source: 'local';
  slug: string;
  entry: LocalBlogEntry;
}

export type RemoteBlogDetail = MicroCMSBlogDetail & { source: 'microcms' };

export type BlogPostDetail = RemoteBlogDetail | LocalBlogDetail;

function toLocalSummary(entry: LocalBlogEntry): BlogPostSummary {
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

  const entries = await getLocalBlogEntries();
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

  const entries = await getLocalBlogEntries();
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

  const entries = await getLocalBlogEntries();
  return entries.map((entry) => entry.slug);
}
