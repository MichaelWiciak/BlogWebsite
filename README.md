# Blog Site for me

Blog deployed at https://blog.michaelwiciak.com on Vercel.

## Write a post

1. Create a file in `content/posts/`.
2. Add frontmatter of `title`, `date`, `excerpt`, `tags`, and `published`.

- **Math:** KaTeX. Inline `$...$`, display `$$...$$`.
- **Code:** fenced code blocks get syntax highlighting automatically.
- **Drafts:** set `published: false` to hide a post from the list, sitemap, and
  URL while you write it.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · react-markdown ·
remark-gfm · remark-math / rehype-katex · rehype-highlight · gray-matter ·
Vercel.

## Development

```bash
npm install
npm run dev      
npm run build
npm run typecheck
```

## How pages are generated

At build time, `src/lib/posts.ts` reads `content/posts/`, parses frontmatter,
sorting newest to oldest. `generateStaticParams()` in
`src/app/posts/[slug]/page.tsx` turns each file into a static route.