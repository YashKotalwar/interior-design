import Link from "next/link";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const word = inverted ? "text-mist" : "text-ink";
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Kotalwar Interiors home">
      <span className="h-6 w-px bg-gold" aria-hidden />
      <span className={`text-[16px] font-semibold tracking-[0.14em] ${word}`}>Kotalwar</span>
    </Link>
  );
}
