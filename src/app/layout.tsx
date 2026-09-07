import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostHog from "@/components/PostHog";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-family",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.michaelwiciak.com";

const DESCRIPTION =
  "Software engineering blog by Michael Wiciak";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Michael Wiciak | Blog",
    template: "%s | Michael Wiciak | Blog",
  },
  description: DESCRIPTION,
  keywords: [
    "software engineering",
    "systems",
    "algorithms",
    "blog",
  ],
  authors: [{ name: "Michael Wiciak", url: "https://michaelwiciak.com" }],
  creator: "Michael Wiciak",
  openGraph: {
    type: "website",
    siteName: "Michael Wiciak | Blog",
    title: "Michael Wiciak | Blog",
    description: DESCRIPTION,
    url: siteUrl,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Wiciak | Blog",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  name: "Michael Wiciak | Blog",
  description: DESCRIPTION,
  publisher: {
    "@type": "Person",
    name: "Michael Wiciak",
    url: "https://michaelwiciak.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="flex flex-col min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-black focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <PostHog>
          <Navbar />
          <main id="main-content" className="grow w-full flex flex-col">
            {children}
          </main>
          <Footer />
        </PostHog>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
