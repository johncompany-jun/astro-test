import { DEFAULT_OG_IMAGE } from './seo';

const CATEGORY_OG_FALLBACK: Record<string, string> = {
  programming:
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
  freelance:
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

/**
 * 本文からFAQセクション(H2「よくある質問」等)配下のH3+回答を抽出
 * - H3テキストを質問、次のH3/H2までの<p><ul><ol>テキストを回答とする
 * - FAQセクションが見つからない場合は空配列
 */
export function extractFaqItems(html: string | null | undefined): Array<{ question: string; answer: string }> {
  if (!html) return [];

  const FAQ_H2_PATTERN = /よくある質問|FAQ|Q\s*&\s*A|質問と回答/i;

  const h2Match = html.match(
    new RegExp(`<h2[^>]*>([\\s\\S]*?)<\\/h2>`, 'gi')
  );
  if (!h2Match) return [];

  let faqSection: string | null = null;
  const h2SplitRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const parts: Array<{ heading: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = h2SplitRegex.exec(html)) !== null) {
    parts.push({ heading: stripInnerHtml(m[1]), start: m.index, end: m.index + m[0].length });
  }

  for (let i = 0; i < parts.length; i++) {
    if (FAQ_H2_PATTERN.test(parts[i].heading)) {
      const sectionStart = parts[i].end;
      const sectionEnd = i + 1 < parts.length ? parts[i + 1].start : html.length;
      faqSection = html.slice(sectionStart, sectionEnd);
      break;
    }
  }

  if (!faqSection) return [];

  const items: Array<{ question: string; answer: string }> = [];
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const h3Matches: Array<{ text: string; start: number; end: number }> = [];
  let h3m: RegExpExecArray | null;
  while ((h3m = h3Regex.exec(faqSection)) !== null) {
    h3Matches.push({
      text: stripInnerHtml(h3m[1]),
      start: h3m.index,
      end: h3m.index + h3m[0].length,
    });
  }

  for (let i = 0; i < h3Matches.length; i++) {
    const q = h3Matches[i].text.trim();
    if (!q) continue;
    const answerStart = h3Matches[i].end;
    const answerEnd = i + 1 < h3Matches.length ? h3Matches[i + 1].start : faqSection.length;
    const answerBlock = faqSection.slice(answerStart, answerEnd);
    const answer = stripInnerHtml(answerBlock).trim();
    if (answer) items.push({ question: q, answer });
  }

  return items;
}

/**
 * 本文からHowToステップ(H2「〜手順」「〜ステップ」等の配下のH3/olリスト)を抽出
 * - 手順系H2が無ければ空配列
 * - H3見出し or olのli要素を各ステップとして扱う
 */
export function extractHowToSteps(
  html: string | null | undefined
): Array<{ name: string; text: string }> {
  if (!html) return [];

  const HOWTO_H2_PATTERN = /手順|ステップ|やり方|進め方|方法|作り方|使い方|フロー|導入手順|開設フロー|開設手順|全体フロー/i;

  const h2SplitRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const parts: Array<{ heading: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = h2SplitRegex.exec(html)) !== null) {
    parts.push({ heading: stripInnerHtml(m[1]), start: m.index, end: m.index + m[0].length });
  }
  if (!parts.length) return [];

  // 最も早く見つかった手順系H2セクションを採用
  let howtoSection: string | null = null;
  for (let i = 0; i < parts.length; i++) {
    if (HOWTO_H2_PATTERN.test(parts[i].heading)) {
      const sectionStart = parts[i].end;
      const sectionEnd = i + 1 < parts.length ? parts[i + 1].start : html.length;
      howtoSection = html.slice(sectionStart, sectionEnd);
      break;
    }
  }
  if (!howtoSection) return [];

  const steps: Array<{ name: string; text: string }> = [];

  // パターン1: H3見出しをステップ名として扱う
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const h3Matches: Array<{ text: string; start: number; end: number }> = [];
  let h3m: RegExpExecArray | null;
  while ((h3m = h3Regex.exec(howtoSection)) !== null) {
    h3Matches.push({
      text: stripInnerHtml(h3m[1]),
      start: h3m.index,
      end: h3m.index + h3m[0].length,
    });
  }

  if (h3Matches.length >= 2) {
    for (let i = 0; i < h3Matches.length; i++) {
      const name = h3Matches[i].text.trim();
      if (!name) continue;
      const bodyStart = h3Matches[i].end;
      const bodyEnd = i + 1 < h3Matches.length ? h3Matches[i + 1].start : howtoSection.length;
      const text = stripInnerHtml(howtoSection.slice(bodyStart, bodyEnd)).trim();
      if (text) steps.push({ name, text: text.slice(0, 500) });
    }
    return steps;
  }

  // パターン2: ol/liをステップとして扱う
  const olMatch = howtoSection.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (olMatch) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liM: RegExpExecArray | null;
    let step = 1;
    while ((liM = liRegex.exec(olMatch[1])) !== null) {
      const text = stripInnerHtml(liM[1]).trim();
      if (text) steps.push({ name: `ステップ${step}`, text: text.slice(0, 500) });
      step++;
    }
  }

  return steps;
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
