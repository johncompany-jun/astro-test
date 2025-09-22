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