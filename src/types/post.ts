export interface Post {
  slug: string;
  title: string;
  date: string; // ISO "YYYY-MM-DD"
  excerpt: string;
  readingTime: number; // minutes
  tags: string[];
  content?: string; // raw markdown body — omitted from list payloads
}