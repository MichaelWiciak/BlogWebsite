---
title: "Welcome to the Blog"
date: 2026-09-01
excerpt: "Every file in content/posts/ becomes a page. No CMS, no manual routes — just markdown, maths, and static generation."
tags: [markdown, nextjs, meta]
---

## How this blog works

The rule is simple: **drop a markdown file in `content/posts/` and it becomes a
page.** The build reads the folder, parses frontmatter with `gray-matter`, and
lets Next.js generate a static route per file.

## Inline and display math

KaTeX is wired up, so `$E = mc^2$` renders inline nicely:

$E = mc^2$

And display equations get their own line and are scrollable when wide:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

## Code with syntax highlighting

```python
def fib(n: int) -> int:
    """Return the nth Fibonacci number."""
    return n if n < 2 else fib(n - 1) + fib(n - 2)


if __name__ == "__main__":
    print([fib(i) for i in range(10)])
```

```bash
curl -s "https://api.github.com/repos/MichaelWiciak/PersonalWebiste" \
  | grep -i description
```

## GFM tables

| Language | Paradigm   | Fun |
|----------|------------|-----|
| Rust     | Systems    | yes |
| Python   | Scripting  | yes |
| Haskell  | Functional | also yes |

## Blockquotes

> The best way to predict the future is to invent it.

## Everything else

- Task lists: `- [x] ship the blog`
- Strikethrough: ~~not shipped~~
- Links: [visit the main site](https://michaelwiciak.com)
- Images: standard markdown `![alt](url)`, rounded + shadowed via CSS