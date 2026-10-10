# happy-m-work

[Happy Web Engineer](https://happy-m-work.com) のソースコードリポジトリ。会社員エンジニアの独立／迷い／戻り判断を、エージェントで失敗した現役 SWE が実体験で支援するメディアサイト。

- Production: https://happy-m-work.com
- Repository: https://github.com/johncompany-jun/happy-m-work

## 技術スタック

- **Framework**: Astro 4.5（MDX / Content Collections）
- **Styling**: Tailwind CSS 3
- **CMS**: microCMS（SDK: `microcms-js-sdk`）／ローカル Markdown にフォールバック
- **Type Check**: TypeScript 5 + `@astrojs/check`
- **SEO**: `@astrojs/sitemap`, RSS, robots.txt, 構造化データ（HowTo JSON-LD 等）

## ディレクトリ構成

```
├── public/              # 直配信アセット（favicon, 画像など）
├── src/
│   ├── components/      # 共通 UI（Header, Hero, Breadcrumbs, TOC, CTA ほか）
│   ├── content/         # ローカル記事（Content Collections, blog）
│   ├── layouts/         # ページレイアウト
│   ├── lib/             # microCMS クライアント・SEO ヘルパー・ブログデータ
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── [...slug].astro      # 記事詳細
│   │   │   ├── [category]/          # カテゴリ一覧
│   │   │   ├── index.astro          # 記事一覧
│   │   │   └── search.astro         # サイト内検索
│   │   ├── about.astro
│   │   ├── privacy-policy.astro
│   │   ├── index.astro
│   │   ├── robots.txt.ts
│   │   └── rss.xml.js
│   ├── styles/
│   └── consts.ts        # サイトタイトル・ディスクリプション
├── drafts/              # 下書き・テンプレート置き場（デプロイ対象外）
├── astro.config.mjs
├── tailwind.config.cjs
└── package.json
```

## カテゴリ構成

記事は 4 カテゴリで管理（`src/content/config.ts` の Zod schema）：

| カテゴリ ID    | 内容                               |
| ------------- | --------------------------------- |
| `freelance`   | 独立／エージェント／単価判断       |
| `programming` | 技術・実装 Tips                    |
| `skills`      | キャリアアップ・スキル習得         |
| `ai`          | AI 活用・副業・プロンプト          |

## 開発コマンド

```bash
npm install              # 依存インストール
npm run dev              # 開発サーバ (http://localhost:4321)
npm run build            # astro check + astro build → ./dist
npm run preview          # ビルド結果のローカル確認
```

## microCMS 連携

`.env`（本番はデプロイ先の環境変数）に以下を設定：

```bash
MICROCMS_SERVICE_DOMAIN=your-service-id
MICROCMS_API_KEY=your-api-key
# 任意（既定: blogs / v1）
# MICROCMS_BLOG_ENDPOINT=blogs
# MICROCMS_API_VERSION=v1
```

microCMS 側で揃えておくフィールド：

- `title` / `description` / `category`（`programming` / `freelance` / `skills` / `ai`）
- `slug`（任意。未設定時は microCMS の `id`）
- `publishedAt` / `updatedAt` / `revisedAt`
- `body` または `content`（リッチエディタ or Markdown）
- `heroImage` / `eyecatch`（任意）

環境変数が未設定、または取得失敗時は `src/content/blog` のローカル記事にフォールバックします。

## サイトマップ

ビルド時に microCMS から全記事を取得し、`revisedAt` → `updatedAt` → `publishedAt` の優先順で `lastmod` を注入します（`astro.config.mjs`）。

優先度 / 更新頻度：

- トップ: `priority 1.0`, `daily`
- `/blog/` 一覧・カテゴリトップ: `priority 0.9`, `daily`
- 個別記事: `priority 0.7`, `weekly`
- `/about/`, `/privacy-policy/`: `priority 0.6`, `monthly`

## デプロイ

静的サイト（SSG）として `./dist` を配信。WordPress は不採用（攻撃面削減のため、素の静的配信を優先）。

## ライセンス

Private.
