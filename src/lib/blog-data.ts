// src/lib/blog-data.ts
import type { BlogDetail as MicroBlogDetail, BlogSummary as MicroBlogSummary } from './microcms';
import {
  fetchBlogSummaries as fetchMicroSummaries,
  fetchBlogDetail as fetchMicroDetail,
  fetchBlogSlugs as fetchMicroSlugs,
  isMicroCMSEnabled,
} from './microcms';

// （任意）ローカルMD記事を使う場合の型
export interface LocalEntry {
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date | null;
    heroImage?: string | null;
    category?: string | null;
    slug: string;
  };
  render: () => Promise<{ Content: any }>;
}

export type BlogPostSummary =
  | (MicroBlogSummary & { source: 'microcms' })
  | ({
      source: 'local';
      slug: string;
      title: string;
      description: string;
      category: string | null;
      pubDate: Date;
      updatedDate: Date | null;
      heroImage: string | null;
      entry: LocalEntry;
    });

export type BlogPostDetail =
  | (MicroBlogDetail & { source: 'microcms' })
  | ({
      source: 'local';
      slug: string;
      title: string;
      description: string;
      category: string | null;
      pubDate: Date;
      updatedDate: Date | null;
      heroImage: string | null;
      entry: LocalEntry;
    });

// （任意）ローカルMDの読み込み（使わないなら空配列でOK）
async function getLocalEntries(): Promise<LocalEntry[]> {
  // 例: Astro content collections を使うならここで読み込む
  // const posts = await getCollection('blog');
  // return posts as unknown as LocalEntry[];
  return [];
}

export async function getAllPostSummaries(): Promise<BlogPostSummary[]> {
  const results: BlogPostSummary[] = [];

  // 1) microCMS 側（全件 + 新しい順で取得）
  if (isMicroCMSEnabled()) {
    const micro = await fetchMicroSummaries(); // ← ここが全件ページネーション対応版
    results.push(
      ...micro.map((m) => ({
        ...m,
        source: 'microcms' as const,
      })),
    );
  }

  // 2) ローカルMD側（必要なら）
  const local = await getLocalEntries();
  results.push(
    ...local.map((e) => ({
      source: 'local' as const,
      slug: e.data.slug,
      title: e.data.title,
      description: e.data.description,
      category: e.data.category ?? null,
      pubDate: e.data.pubDate,
      updatedDate: e.data.updatedDate ?? null,
      heroImage: e.data.heroImage ?? null,
      entry: e,
    })),
  );

  // 公開日時の降順で返す
  return results.sort((a, b) => {
    const da = a.pubDate.valueOf();
    const db = b.pubDate.valueOf();
    return db - da;
  });
}

export async function getBlogSlugs(): Promise<string[]> {
  const slugs: string[] = [];

  if (isMicroCMSEnabled()) {
    const ms = await fetchMicroSlugs(); // ← ここも全件版
    slugs.push(...ms);
  }

  const local = await getLocalEntries();
  slugs.push(...local.map((e) => e.data.slug));

  // 重複除去
  return Array.from(new Set(slugs));
}

export async function getBlogDetail(slug: string): Promise<BlogPostDetail> {
  // まず microCMS を見る
  if (isMicroCMSEnabled()) {
    try {
      const d = await fetchMicroDetail(slug);
      return { ...d, source: 'microcms' as const };
    } catch {
      // microCMS に無ければローカルを探す
    }
  }

  const local = await getLocalEntries();
  const hit = local.find((e) => e.data.slug === slug);
  if (!hit) {
    throw new Error(`記事が見つかりませんでした（slug: ${slug}）`);
  }
  return {
    source: 'local',
    slug: hit.data.slug,
    title: hit.data.title,
    description: hit.data.description,
    category: hit.data.category ?? null,
    pubDate: hit.data.pubDate,
    updatedDate: hit.data.updatedDate ?? null,
    heroImage: hit.data.heroImage ?? null,
    entry: hit,
  };
}
