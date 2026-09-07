import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-background/50 backdrop-blur-lg border-b border-white/10 h-20 px-6 md:px-8 flex items-center justify-between"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="text-lg font-semibold hover:text-accent transition-colors"
        aria-label="Michael Wiciak blog home"
      >
        Blog<span className="text-accent">·</span>Michael
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <a
          href="https://michaelwiciak.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent transition-colors"
        >
          Main site
        </a>
        <a
          href="https://github.com/MichaelWiciak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent transition-colors"
        >
          Github
        </a>
      </div>
    </nav>
  );
}
