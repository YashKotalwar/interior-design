import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-ink text-mist hover:bg-ink-soft",
  ghost:
    "border border-ink/15 text-ink hover:border-ink/40 hover:bg-paper",
  gold:
    "bg-gold text-ink hover:bg-gold-deep",
  light:
    "bg-mist text-ink hover:bg-white",
  lightGhost:
    "border border-white/25 text-mist hover:border-white/60 hover:bg-white/10",
} as const;

type Variant = keyof typeof variants;

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-[15px] font-medium transition-colors duration-200 disabled:opacity-50";

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
