import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/posts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.michaelwiciak.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...getAllSlugs().map((slug) => ({
      url: `${siteUrl}/posts/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}