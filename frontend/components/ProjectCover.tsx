import type { Project } from "@/lib/types";
import { RoomVisual } from "./RoomVisual";

export function ProjectCover({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const src = project.cover_url ?? project.photos[0]?.url;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={project.title}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }
  return <RoomVisual kind={project.visual_key} className={`h-full w-full ${className}`} />;
}
