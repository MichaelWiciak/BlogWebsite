import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import Markdown from "@/components/Markdown";
import Tag from "@/components/ui/Tag";
import TrackRead from "@/components/TrackRead";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.michaelwiciak.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: `${post.date}T00:00:00Z`,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || typeof post.content !== "string") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.date}T00:00:00Z`,
    author: {
      "@type": "Person",
      name: "Michael Wiciak",
      url: "https://michaelwiciak.com",
    },
    url: `${siteUrl}/posts/${post.slug}`,
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${siteUrl}/posts/${post.slug}`,
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to all posts
      </Link>

      <article className="bg-surface-elevated rounded-xl shadow-card p-6 md:p-10">
        <header className="mb-8 pb-8 border-b border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        <Markdown content={post.content} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackRead title={post.title} />
    </section>
  );
}