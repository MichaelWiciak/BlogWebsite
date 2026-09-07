"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function TrackRead({ title }: { title: string }) {
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture("blog_post_read", { post_title: title });
    }
  }, [title]);

  return null;
}