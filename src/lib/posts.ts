import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";
import { estimateReadingTime } from "./reading-time";
import type { Post } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const DATE_PREFIX = /^(\d{4}-?\d{2}?-?\d{2}?)-(.*)$/;

interface PostFrontmatter {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
}

interface InternalPost extends Post {
  fileName: string;
  published: boolean;
}

/** Strip markdown syntax so a meaningful excerpt can be extracted. */
function autoExcerpt(markdown: string, length = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= length) return plain;
  const cut = plain.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : length)}…`;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normaliseDate(date: string | Date): string {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return new Date(`${String(date).slice(0, 10)}T00:00:00Z`)
    .toISOString()
    .slice(0, 10);
}

/** "2026-09-01-my-slug.md" → { slug: "my-slug", date: "2026-09-01" } */
function parseFilename(fileName: string): { slug: string; date?: string } {
  const base = path.basename(fileName).replace(/\.mdx?$/, "");
  const match = base.match(DATE_PREFIX);
  if (match && !isNaN(Date.parse(match[1]))) {
    return { slug: match[2], date: normaliseDate(match[1]) };
  }
  return { slug: base };
}

/** Last-resort date: the file's first git commit timestamp. */
function inferDateFromGit(fileName: string): string {
  try {
    const gitDate = execSync(
      `git log -1 --format=%cI -- "${path.join(POSTS_DIR, fileName)}"`,
      { stdio: ["ignore", "pipe", "ignore"] },
    )
      .toString()
      .trim();
    return new Date(gitDate).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function readPostFile(fileName: string): InternalPost {
  const filePath = path.join(POSTS_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  const { slug, date: filenameDate } = parseFilename(fileName);

  return {
    slug,
    title: fm.title ?? slugToTitle(slug),
    date: fm.date
      ? normaliseDate(fm.date)
      : filenameDate ?? inferDateFromGit(fileName),
    excerpt: fm.excerpt ?? autoExcerpt(content),
    readingTime: estimateReadingTime(content),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    content,
    fileName,
    published: fm.published !== false,
  };
}

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file));
}

function toPublicPost(post: InternalPost): Post {
  const { fileName: _fileName, published: _published, ...meta } = post;
  return meta;
}

/** List payloads exclude the raw body. */
function toSummaryPost(post: Post): Post {
  const { content: _content, ...meta } = post;
  return meta;
}

export function getAllPosts(): Post[] {
  const posts = listPostFiles()
    .map(readPostFile)
    .filter((post) => post.published)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );

  return posts.map(toPublicPost).map(toSummaryPost);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

/** Returns any post (including unpublished drafts) by its slug. */
export function getPostBySlug(slug: string): Post | null {
  const match = listPostFiles().find(
    (fileName) => parseFilename(fileName).slug === slug,
  );
  if (!match) return null;
  return toPublicPost(readPostFile(match));
}