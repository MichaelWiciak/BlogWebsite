import Link from "next/link";
import { FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";
import type { Post } from "@/types/post";
import { formatDate } from "@/lib/format";
import Tag from "./ui/Tag";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col h-full p-6 bg-surface-elevated rounded-xl shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar className="w-3.5 h-3.5" />
          {formatDate(post.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiClock className="w-3.5 h-3.5" />
          {post.readingTime} min read
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
        <Link
          href={`/posts/${post.slug}`}
          className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {post.title}
        </Link>
      </h2>

      <p className="text-sm text-text-muted flex-grow mb-4">{post.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <Link
        href={`/posts/${post.slug}`}
        className="inline-flex items-center gap-2 text-sm text-link hover:underline"
      >
        Read more <FiArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}