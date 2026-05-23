import { DEFAULT_OG_IMAGE } from './seo';

const CATEGORY_OG_FALLBACK: Record<string, string> = {
  programming:
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
  telework:
    'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80',
  skills:
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
  ai:
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
};

export function resolveOgImage(
  heroImage: string | null | undefined,
  category: string | null | undefined
): string {
  if (heroImage) return optimizeImage(heroImage, { width: 1200, quality: 80, format: 'webp' });
  if (category && CATEGORY_OG_FALLBACK[category]) return CATEGORY_OG_FALLBACK[category];
  return DEFAULT_OG_IMAGE;
}

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'auto';
}

/**
 * microCMSのCDN画像URLにimgixパラメータを付与して最適化
 * - 外部URL（unsplash等）はそのまま返す
 */
export function optimizeImage(url: string, opts: ImageOptimizeOptions = {}): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('images.microcms-assets.io')) return url;

  const { width, height, quality = 80, format = 'webp' } = opts;
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  params.set('q', String(quality));
  if (format === 'webp') params.set('fm', 'webp');

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * contentHtmlからh2/h3を抽出してTOCを生成
 * - microCMSはh2/h3にidを自動付与するが、同名idが重複することがあるため一意化
 * - 同時にHTML側のidも一意化して返す（リンクが壊れないように）
 */
export function buildToc(html: string | null | undefined): { toc: TocItem[]; html: string } {
  if (!html) return { toc: [], html: html ?? '' };

  const toc: TocItem[] = [];
  const idCounts = new Map<string, number>();

  const transformedHtml = html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      const level = tag.toLowerCase() === 'h2' ? 2 : 3;
      const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
      const baseId =
        idMatch?.[1] ?? `heading-${toc.length + 1}-${Math.random().toString(36).slice(2, 7)}`;

      const count = idCounts.get(baseId) ?? 0;
      idCounts.set(baseId, count + 1);
      const uniqueId = count === 0 ? baseId : `${baseId}-${count + 1}`;

      const text = stripInnerHtml(inner).trim();
      if (text) {
        toc.push({ id: uniqueId, text, level: level as 2 | 3 });
      }

      const newAttrs = idMatch
        ? attrs.replace(/\sid=["'][^"']+["']/i, ` id="${uniqueId}"`)
        : `${attrs} id="${uniqueId}"`;

      return `<${tag}${newAttrs}>${inner}</${tag}>`;
    }
  );

  return { toc, html: transformedHtml };
}

/**
 * 本文中のimgタグを最適化
 * - microCMS画像にWebP/quality params付与
 * - loading="lazy" / decoding="async" を付与（既に無ければ）
 */
export function optimizeBodyImages(html: string): string {
  if (!html) return html;

  return html.replace(/<img\b([^>]*)>/gi, (_match, attrs: string) => {
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);
    if (!srcMatch) return _match;
    const originalSrc = srcMatch[1];
    const optimized = optimizeImage(originalSrc, { width: 1200, quality: 80, format: 'webp' });

    let newAttrs = attrs.replace(/\ssrc=["'][^"']+["']/i, ` src="${optimized}"`);

    if (!/\sloading=/i.test(newAttrs)) {
      newAttrs += ' loading="lazy"';
    }
    if (!/\sdecoding=/i.test(newAttrs)) {
      newAttrs += ' decoding="async"';
    }

    return `<img${newAttrs}>`;
  });
}

function stripInnerHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');
}
