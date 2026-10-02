import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-20 text-center">
      <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">404</p>
      <h1 className="mt-3 text-[40px] font-medium tracking-tight">This room is not in the archive.</h1>
      <Link href="/work" className="mt-8 rounded-full bg-ink px-6 py-3 text-[15px] text-mist">
        See the work
      </Link>
    </div>
  );
}
