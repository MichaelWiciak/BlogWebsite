---
title: "Filename Conventions"
excerpt: "Date-prefixed filenames mean the build can infer dates and slugs from the file name alone."
tags: [meta]
---

## Name a file with a date

`2026-09-02-filename-conventions.md`

That's how this very post gets its slug (`filename-conventions`) and its date
(`2026-09-02`): the date prefix means neither one needs a `date` field in the
frontmatter.

## Drafting

Set `published: false` in frontmatter to keep a post out of the list, the
sitemap, and its URL while you write it.