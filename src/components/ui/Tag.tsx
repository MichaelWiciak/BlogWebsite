interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function Tag({ label, active = false, onClick, href }: TagProps) {
  const classes = [
    "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border transition-colors duration-200",
    active
      ? "bg-accent text-background border-accent"
      : "bg-surface text-text-muted border-white/10 hover:text-accent hover:border-accent",
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  );
}