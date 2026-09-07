import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/PostList";

export default function HomePage() {
  const posts = getAllPosts();
  const totalReadingTime = posts.reduce(
    (sum, post) => sum + post.readingTime,
    0,
  );

  return (
    <section className="w-full max-w-container mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Blog<span className="text-accent">.</span>Michael
        </h1>
        <p className="text-base md:text-lg text-text-muted mt-3 max-w-2xl mx-auto">
          A place to detail/vent various rabbit holes I get into. I hope someone finds this interesting.
          
          Code samples on this blog are dual licensed under MIT.
        </p>
      </div>

      <PostList posts={posts} totalReadingTime={totalReadingTime} />
    </section>
  );
}
