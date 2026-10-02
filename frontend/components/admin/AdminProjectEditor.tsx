"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminCreateProject,
  adminDeletePhoto,
  adminGetProject,
  adminPatchPhoto,
  adminPatchProject,
  adminSetHero,
  adminUploadPhoto,
} from "@/lib/api";
import { compressPhoto } from "@/lib/compressPhoto";
import { CATEGORIES, type Project } from "@/lib/types";
import { Button } from "@/components/Button";

export function AdminProjectEditor({ id }: { id?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState("residence");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!id) return;
    void adminGetProject(id).then((p) => {
      setProject(p);
      setTitle(p.title);
      setLocation(p.location);
      setYear(p.year);
      setCategory(p.category);
      setDescription(p.description);
      setFeatured(p.featured);
      setIsHero(!!p.is_hero);
    });
  }, [id]);

  useEffect(() => {
    if (searchParams.get("created") === "1") {
      setNote("Project created. Add photographs on the right.");
    }
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const body = { title, location, year, category, description, featured, is_hero: isHero };
    try {
      if (id) {
        const next = await adminPatchProject(id, body);
        if (isHero) {
          await adminSetHero(id);
        }
        router.push(`/admin?saved=${encodeURIComponent(next.title)}`);
        return;
      }
      const created = await adminCreateProject(body);
      router.replace(`/admin/projects/${created.id}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  async function onFiles(files: FileList | null) {
    if (!id || !files?.length) return;
    setError(null);
    setPhotoNote(null);
    try {
      let current: Project | null = project;
      for (const file of Array.from(files)) {
        current = await adminUploadPhoto(id, await compressPhoto(file));
      }
      if (current) setProject(current);
      setPhotoNote("Photograph added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  const field = "mt-2 h-12 w-full rounded-xl border border-line bg-paper px-4 outline-none focus:border-gold";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-[32px] font-medium tracking-tight">{id ? "Edit project" : "New project"}</h1>
        <div>
          <label className="text-[13px] text-stone">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-[13px] text-stone">Location</label>
          <input required value={location} onChange={(e) => setLocation(e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] text-stone">Year</label>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={field}
            />
          </div>
          <div>
            <label className="text-[13px] text-stone">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[13px] text-stone">Description</label>
          <textarea
            required
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-gold"
          />
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Selected on the homepage
        </label>
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={isHero} onChange={(e) => setIsHero(e.target.checked)} />
          Use as homepage photo
        </label>
        <p className="text-[13px] text-stone">
          Only one project can be the full-screen home image. Use Cover on the right to choose which photograph.
        </p>
        {error ? <p className="text-[14px] text-red-800">{error}</p> : null}
        {note ? <p className="text-[14px] text-success">{note}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>

      <div>
        <h2 className="text-[20px] font-medium">Photographs</h2>
        {!id ? (
          <p className="mt-3 text-[15px] text-stone">Save the project first, then add photographs.</p>
        ) : (
          <>
            <label className="mt-4 flex min-h-24 cursor-pointer items-center justify-center rounded-[20px] border border-dashed border-line bg-paper text-[14px] text-stone">
              Add JPEG, PNG, or WebP
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            {photoNote ? <p className="mt-3 text-[14px] text-success">{photoNote}</p> : null}
            <ul className="mt-6 space-y-4">
              {project?.photos.map((photo) => (
                <li key={photo.id} className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="h-20 w-28 rounded-xl object-cover" />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-line px-3 py-1 text-[13px]"
                      onClick={async () => setProject(await adminPatchPhoto(photo.id, { is_cover: true }))}
                    >
                      {photo.is_cover ? "Cover" : "Set cover"}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-line px-3 py-1 text-[13px]"
                      onClick={async () => {
                        const photos = project.photos;
                        const index = photos.findIndex((p) => p.id === photo.id);
                        if (index <= 0) return;
                        const prev = photos[index - 1];
                        await adminPatchPhoto(photo.id, { sort_order: prev.sort_order });
                        await adminPatchPhoto(prev.id, { sort_order: photo.sort_order });
                        setProject(await adminGetProject(id));
                      }}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-line px-3 py-1 text-[13px]"
                      onClick={async () => {
                        const photos = project.photos;
                        const index = photos.findIndex((p) => p.id === photo.id);
                        if (index < 0 || index >= photos.length - 1) return;
                        const next = photos[index + 1];
                        await adminPatchPhoto(photo.id, { sort_order: next.sort_order });
                        await adminPatchPhoto(next.id, { sort_order: photo.sort_order });
                        setProject(await adminGetProject(id));
                      }}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="rounded-full px-3 py-1 text-[13px] text-stone"
                      onClick={async () => {
                        await adminDeletePhoto(photo.id);
                        setProject(await adminGetProject(id));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
