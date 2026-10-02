"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminDeleteProject, adminPatchProject, adminProjects, adminSetHero } from "@/lib/api";
import type { Project } from "@/lib/types";
import { categoryLabel } from "@/lib/format";
import { Button } from "@/components/Button";
import { ProjectCover } from "@/components/ProjectCover";

export function AdminProjects() {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminProjects();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-medium tracking-tight">Projects</h1>
          <p className="mt-1 text-[15px] text-stone">Upload photographs and keep the public gallery current.</p>
        </div>
        <Button href="/admin/projects/new">New project</Button>
      </div>
      {saved ? (
        <p className="mt-6 text-[15px] text-success" role="status">
          {saved} has been saved.
        </p>
      ) : null}
      {error ? <p className="mt-6 text-red-800">{error}</p> : null}
      <ul className="mt-10 space-y-4">
        {items.map((project) => (
          <li key={project.id} className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-4 sm:flex-row sm:items-center">
            <div className="h-24 w-full overflow-hidden rounded-2xl sm:h-20 sm:w-28">
              <ProjectCover project={project} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{project.title}</p>
              <p className="text-[13px] text-stone">
                {project.location} · {categoryLabel(project.category)} · {project.year}
                {project.featured ? " · Selected" : ""}
                {project.is_hero ? " · Home" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-line px-3 py-2 text-[13px]"
                onClick={async () => {
                  await adminPatchProject(project.id, { featured: !project.featured });
                  await load();
                }}
              >
                {project.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                type="button"
                className="rounded-full border border-line px-3 py-2 text-[13px]"
                onClick={async () => {
                  await adminSetHero(project.id);
                  await load();
                }}
              >
                {project.is_hero ? "Homepage photo" : "Set as home"}
              </button>
              <Link href={`/admin/projects/${project.id}`} className="rounded-full bg-ink px-3 py-2 text-[13px] text-mist">
                Edit
              </Link>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-[13px] text-stone"
                onClick={async () => {
                  if (!confirm(`Delete ${project.title}?`)) return;
                  await adminDeleteProject(project.id);
                  await load();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
