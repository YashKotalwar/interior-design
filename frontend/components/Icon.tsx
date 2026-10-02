export function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="11" cy="11" r="6.2" {...stroke} />
        <path d="m16 16 4 4" {...stroke} />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path d="M5 8h14M5 12h14M5 16h14" {...stroke} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="m7 7 10 10M17 7 7 17" {...stroke} />
    </svg>
  );
}
