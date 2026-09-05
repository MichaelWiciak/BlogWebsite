interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

const baseClasses =
  "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border transition-colors duration-200";

const activeClasses = "bg-accent text-background border-accent";
const interactiveClasses =
  "bg-surface text-text-muted border-white/10 hover:text-accent hover:border-accent";
const staticClasses = "bg-surface text-text-muted border-white/10";

export default function Tag({ label, active = false, onClick, href }: TagProps) {
  const classes = [
    baseClasses,
    active ? activeClasses : href || onClick ? interactiveClasses : staticClasses,
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {label}
      </button>
    );
  }

  return <span className={classes}>{label}</span>;
}