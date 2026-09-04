import Link from "next/link";

export default function NotFound() {
  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-24 flex flex-col items-center text-center">
      <p className="text-accent text-6xl font-bold mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">Post not found</h1>
      <p className="text-text-muted mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-black font-semibold rounded-full hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-300"
      >
        Back to all posts
      </Link>
    </section>
  );
}
