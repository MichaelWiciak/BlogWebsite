# Michael Wiciak — Blog

Software engineering blog deployed at https://blog.michaelwiciak.com on Vercel.

## Write a post

1. Create a file in `content/posts/` — e.g. `2026-09-15-my-post.md`.
2. Add frontmatter: `title` (and optionally `date`, `excerpt`, `tags`, `published`).
3. Commit and push. Vercel rebuilds; the post is live at `/posts/my-post`.

- **Math:** KaTeX. Inline `$...$`, display `$$...$$`.
- **Code:** fenced code blocks get syntax highlighting automatically.
- **Drafts:** set `published: false` to keep a post out of the list and sitemap
  while you write it.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · react-markdown ·
remark-gfm · remark-math / rehype-katex · rehype-highlight · gray-matter ·
Vercel.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (generates all static posts)
npm run typecheck
```

## How pages are generated

At build time, `src/lib/posts.ts` reads `content/posts/`, parses frontmatter,
sorting newest → oldest. `generateStaticParams()` in
`src/app/posts/[slug]/page.tsx` turns each file into a static route. No manual
route or manifest maintenance.