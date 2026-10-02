import Link from "next/link";
import type { Project } from "@/lib/types";
import { categoryLabel } from "@/lib/format";
import { ProjectCover } from "./ProjectCover";
import { Reveal } from "./Reveal";

export function ProjectGrid({
  projects,
  empty = "No projects in this room yet.",
}: {
  projects: Project[];
  empty?: string;
}) {
  if (!projects.length) {
    return <p className="py-20 text-center text-[16px] text-stone">{empty}</p>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={i * 0.05}>
          <Link href={`/work/${project.slug}`} className="group block">
            <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-paper">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]">
                <ProjectCover project={project} />
              </div>
            </div>
            <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-stone">
              {categoryLabel(project.category)} · {project.year}
            </p>
            <h2 className="mt-1 text-[22px] font-medium tracking-tight">{project.title}</h2>
            <p className="text-[14px] text-stone">{project.location}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
