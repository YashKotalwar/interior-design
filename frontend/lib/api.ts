import type { Inquiry, Project, SearchHit } from "./types";

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

const SERVER = process.env.API_URL ?? "http://localhost:8000";

export async function serverApi<T>(path: string): Promise<T> {
  const res = await fetch(`${SERVER}${path}`, { cache: "no-store" });
  return parse<T>(res);
}

export async function clientApi<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, { credentials: "include", ...init, headers });
  return parse<T>(res);
}

export async function getProjects(opts?: {
  featured?: boolean;
  hero?: boolean;
  category?: string;
}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (opts?.featured) params.set("featured", "1");
  if (opts?.hero) params.set("hero", "1");
  if (opts?.category) params.set("category", opts.category);
  const q = params.toString();
  const data = await serverApi<{ items: Project[] }>(`/api/projects${q ? `?${q}` : ""}`);
  return data.items;
}

export async function getProject(slug: string): Promise<Project> {
  return serverApi<Project>(`/api/projects/${slug}`);
}

export function searchProjects(q: string): Promise<{ items: SearchHit[] }> {
  return clientApi(`/api/search?q=${encodeURIComponent(q)}`);
}

export function sendInquiry(body: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ ok: boolean; message?: string }> {
  return clientApi("/api/inquiries", { method: "POST", body: JSON.stringify(body) });
}

export function adminMe(): Promise<{ ok: boolean }> {
  return clientApi("/api/admin/me");
}

export function adminLogin(username: string, password: string) {
  return clientApi<{ ok: boolean }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function adminLogout() {
  return clientApi("/api/admin/logout", { method: "POST" });
}

export function adminProjects(): Promise<{ items: Project[] }> {
  return clientApi("/api/admin/projects");
}

export function adminGetProject(id: number): Promise<Project> {
  return clientApi(`/api/admin/projects/${id}`);
}

export function adminCreateProject(body: Record<string, unknown>): Promise<Project> {
  return clientApi("/api/admin/projects", { method: "POST", body: JSON.stringify(body) });
}

export function adminPatchProject(id: number, body: Record<string, unknown>): Promise<Project> {
  return clientApi(`/api/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function adminSetHero(id: number): Promise<Project> {
  return clientApi(`/api/admin/projects/${id}/hero`, { method: "POST" });
}

export function adminDeleteProject(id: number) {
  return clientApi(`/api/admin/projects/${id}`, { method: "DELETE" });
}

export function adminUploadPhoto(id: number, file: File): Promise<Project> {
  const data = new FormData();
  data.append("file", file);
  return clientApi(`/api/admin/projects/${id}/photos`, { method: "POST", body: data });
}

export function adminPatchPhoto(id: number, body: { is_cover?: boolean; sort_order?: number }) {
  return clientApi<Project>(`/api/admin/photos/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function adminDeletePhoto(id: number) {
  return clientApi(`/api/admin/photos/${id}`, { method: "DELETE" });
}

export function adminInquiries(): Promise<{ items: Inquiry[] }> {
  return clientApi("/api/admin/inquiries");
}
