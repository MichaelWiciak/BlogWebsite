"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const TOKEN = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export default function PostHog({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (TOKEN && HOST && typeof window !== "undefined") {
      posthog.init(TOKEN, { api_host: HOST, person_profiles: "identified_only" });
    }
  }, []);

  return <>{children}</>;
}