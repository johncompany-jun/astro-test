import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export const SITE_URL = 'https://happy-m-work.com';
export const DEFAULT_OG_IMAGE =
  'https://happy-m-work.com/wp-content/uploads/2025/01/software-development-6523979_1280.jpg';

export interface CategoryMeta {
  id: string;
  label: string;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'programming',
    label: 'PROGRAMMING',
    name: 'プログラミング',
    description:
      'プログラミング言語やフレームワークの最新トレンド、実務で使えるヒントを解説するカテゴリーです。',
  },
  {
    id: 'telework',
    label: 'TELEWORK',
    name: 'テレワーク',
    description:
      '働く場所を自由にするための環境構築術や、リモートチームのコラボレーション事例をまとめたカテゴリーです。',
  },
  {
    id: 'skills',
    label: 'SKILLS',
    name: 'キャリアアップ',
    description:
      'キャリアアップや学習計画、生成 AI 時代に求められるリテラシーをまとめたカテゴリーです。',
  },
  {
    id: 'ai',
    label: 'AI',
    name: 'AI活用',
    description:
      'ChatGPT・Claude・Copilot などの生成 AI を、エンジニアの開発・学習・副業に活かす実践ノウハウをまとめたカテゴリーです。',
  },
];

export const CATEGORY_MAP: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryMeta(id: string | null | undefined): CategoryMeta | null {
  if (!id) return null;
  return CATEGORY_MAP[id] ?? null;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${trimmed}`;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: 'ja',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_TITLE,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
    },
  };
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  url: string;
  image: string | null;
  pubDate: Date;
  updatedDate: Date | null;
  category: string | null;
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const categoryMeta = getCategoryMeta(input.category);
  const image = input.image ?? DEFAULT_OG_IMAGE;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: [image],
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.url),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    author: {
      '@type': 'Organization',
      name: SITE_TITLE,
      url: SITE_URL,
    },
    inLanguage: 'ja',
    ...(categoryMeta && { articleSection: categoryMeta.name }),
  };
}
