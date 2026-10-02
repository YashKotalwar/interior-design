export const CATEGORIES = [
  { id: "residence", label: "Residence" },
  { id: "kitchen", label: "Kitchen" },
  { id: "living", label: "Living" },
  { id: "workplace", label: "Workplace" },
  { id: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Photo = {
  id: number;
  url: string;
  sort_order: number;
  is_cover: boolean;
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  location: string;
  year: number;
  category: string;
  description: string;
  featured: boolean;
  is_hero?: boolean;
  visual_key?: string | null;
  cover_url?: string | null;
  photos: Photo[];
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string;
};

export type SearchHit = {
  slug: string;
  title: string;
  location: string;
  category: string;
  type: string;
};

export const STUDIO = {
  email: "studio@kotalwar.example",
  phone: "+91 00000 00000",
  city: "India",
};
