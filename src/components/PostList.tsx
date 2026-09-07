"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/types/post";
import { searchPosts } from "@/lib/search";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";

const PAGE_SIZE = 6;
const SHOW_ALL_WHEN_SEARCHING = true;

interface PostListProps {
  posts: Post[];
  totalReadingTime: number;
}

export default function PostList({ posts, totalReadingTime }: PostListProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const matches = useMemo(() => searchPosts(posts, query), [posts, query]);
  const isSearching = query.trim().length > 0;

  const visiblePosts = isSearching
    ? matches.map((match) => match.post)
    : matches.slice(0, visibleCount).map((match) => match.post);

  const hasMore = !isSearching && visibleCount < matches.length;

  return (
    <div className="w-full flex flex-col items-center">
      <SearchBar value={query} onChange={setQuery} />

      <p className="text-sm text-text-muted mt-6 mb-8">
        {posts.length} posts · {totalReadingTime} min total reading
        {isSearching && (
          <span className="text-accent">
            {" "}· {matches.length} match{matches.length === 1 ? "" : "es"}
          </span>
        )}
      </p>

      {visiblePosts.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-lg text-text-muted">No posts match “{query}”.</p>
          <p className="text-sm text-text-muted mt-1">
            Try a different keyword or clear the search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
            {visiblePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="mt-10 px-6 py-3 bg-accent text-black font-semibold rounded-full hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              See more
            </button>
          )}
        </>
      )}
    </div>
  );
}