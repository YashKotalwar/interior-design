import type { Metadata } from "next";
import Link from "next/link";
import { ProjectGrid } from "@/components/ProjectGrid";
import { getProjects } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected interior projects by Kotalwar Interiors.",
};

export const dynamic = "force-dynamic";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = CATEGORIES.some((c) => c.id === category) ? category : undefined;
  const projects = await getProjects({ category: active });

  return (
    <div className="px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-[1240px]">
        <p className="text-[12px] uppercase tracking-[0.18em] text-gold-deep">Work</p>
        <h1 className="mt-3 text-[40px] font-medium tracking-[-0.03em] sm:text-[56px]">The rooms.</h1>
        <p className="mt-4 max-w-[46ch] text-[17px] text-stone">
          Residences, kitchens, and working rooms — photographed as they are lived in.
        </p>
        <div className="mt-10 flex flex-wrap gap-2">
          <Link
            href="/work"
            className={`rounded-full px-4 py-2 text-[13px] ${!active ? "bg-ink text-mist" : "bg-paper text-ink"}`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/work?category=${c.id}`}
              className={`rounded-full px-4 py-2 text-[13px] ${
                active === c.id ? "bg-ink text-mist" : "bg-paper text-ink"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
        <div className="mt-14">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
