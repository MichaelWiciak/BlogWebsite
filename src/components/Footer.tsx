export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-surface py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-text-muted border-t border-white/10"
      role="contentinfo"
    >
      <p>Copyright © {year} Michael Wiciak. All rights reserved.</p>
    </footer>
  );
}
