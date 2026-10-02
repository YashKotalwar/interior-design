import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/api";
import { categoryLabel } from "@/lib/format";
import { ProjectCover } from "@/components/ProjectCover";
import { ProjectGrid } from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    return { title: project.title, description: project.description.slice(0, 160) };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }
  const related = (await getProjects()).filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <article className="pt-[52px]">
      <div className="relative h-[70vh] min-h-[420px] w-full">
        <ProjectCover project={project} className="h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <div className="absolute bottom-10 left-5 right-5 mx-auto max-w-[1240px] md:left-8 md:right-8">
          <p className="text-[12px] uppercase tracking-[0.18em] text-gold">
            {categoryLabel(project.category)} · {project.year}
          </p>
          <h1 className="mt-2 text-[40px] font-medium tracking-tight text-mist sm:text-[56px]">{project.title}</h1>
          <p className="mt-2 text-[16px] text-mist/80">{project.location}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[720px] px-5 py-16 md:px-8 md:py-24">
        <p className="text-[18px] leading-relaxed text-stone">{project.description}</p>
      </div>
      <div className="mx-auto max-w-[1240px] space-y-6 px-5 pb-24 md:px-8">
        {project.photos.map((photo, index) => (
          <div key={photo.id} className="overflow-hidden rounded-[20px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={`${project.title} ${index + 1}`} className="w-full" loading="lazy" />
          </div>
        ))}
        {!project.photos.length ? (
          <div className="aspect-[16/10] overflow-hidden rounded-[20px]">
            <ProjectCover project={project} />
          </div>
        ) : null}
      </div>
      {related.length ? (
        <div className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="mb-10 text-[24px] font-medium">More rooms</h2>
            <ProjectGrid projects={related} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
