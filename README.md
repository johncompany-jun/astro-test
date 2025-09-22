# astro-test

Astro 製のブログ／コンテンツサイト。高速・SEO 対応・MD/MDX 記事に対応し、CI/CD とホスティング（Vercel / Netlify / GitHub Pages）を前提にしています。

## ✨ 特長

- 🚀 高速ビルド & 100 点に近いパフォーマンス
- 📝 Markdown / MDX 記事対応（Content Collections）
- 🔍 OGP / canonical / sitemap / RSS 対応
- 🧾 型安全なフロントマター（Zod）
- 🤖 GitHub Actions で CI/CD 構築可能

## 📁 プロジェクト構成
```
├── public/ # 直配信アセット（favicons, 画像等）
├── src/
│ ├── components/ # UI コンポーネント（.astro/.tsx 等）
│ ├── content/ # 記事やコンテンツ（blog コレクション等）
│ ├── layouts/ # ページレイアウト
│ └── pages/ # ルーティングされるページ
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## 🧑‍💻 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー localhost:4321
npm run dev

# 本番ビルド（./dist へ出力）
npm run build

# ビルドのローカル確認
npm run preview

## 🔌 microCMS 連携設定

1. microCMS でブログ用 API を用意し、サービスドメインと API キーを取得します。
2. プロジェクトルートに `.env`（本番ではデプロイ先の環境変数）を作成し、以下を設定します。

   ```bash
   MICROCMS_SERVICE_DOMAIN=your-service-id
   MICROCMS_API_KEY=your-api-key
   # 任意: API エンドポイント名を変更したい場合
   # MICROCMS_BLOG_ENDPOINT=blogs
   # 任意: API バージョンを変更したい場合
   # MICROCMS_API_VERSION=v1
   ```

3. microCMS 側で以下のフィールドを用意しておくと既存 UI と親和性が高まります。
   - `title` (テキスト)
   - `description` (テキスト)
   - `category` (プルダウン or コンテンツ参照／ID が `programming` / `telework` / `skills` である前提)
   - `slug` (テキスト、任意。未設定の場合は microCMS の `id` を使用)
   - `publishedAt` (公開日時)
   - `body` または `content` (リッチエディタ or Markdown フィールド)
   - `heroImage` / `eyecatch` (画像フィールド、任意)

microCMS の環境変数が未設定、または取得に失敗した場合は従来どおり `src/content/blog` のローカル記事にフォールバックします。
