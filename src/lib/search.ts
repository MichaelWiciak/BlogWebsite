import type { Post } from "@/types/post";

export interface PostMatch {
  post: Post;
  score: number;
}

export function searchPosts(posts: Post[], query: string): PostMatch[] {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return posts.map((post) => ({ post, score: 0 }));
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const results: PostMatch[] = [];

  for (const post of posts) {
    const title = post.title.toLowerCase();
    const excerpt = post.excerpt.toLowerCase();
    const tags = post.tags.join(" ").toLowerCase();
    const haystack = `${title} ${tags} ${excerpt}`;

    // Every typed token must appear somewhere (AND semantics).
    if (!tokens.every((token) => haystack.includes(token))) continue;

    let score = 0;
    for (const token of tokens) {
      if (title.startsWith(token)) score += 100; // prefix match — strongest
      else if (title.includes(token)) score += 80;
      else if (tags.includes(token)) score += 40;
      else if (excerpt.includes(token)) score += 20;
      else score += 10;
    }

    results.push({ post, score });
  }

  return results.sort(
    (a, b) =>
      b.score - a.score ||
      b.post.date.localeCompare(a.post.date) || // newest first on ties
      a.post.slug.localeCompare(b.post.slug),
  );
}