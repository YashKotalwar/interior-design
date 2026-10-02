# Kotalwar Interiors — Studio Specification

Single source of truth for the Kotalwar Interiors website. Apple is a **quality** reference (spacing, type, photography scale, quiet motion) — not a brand to copy.

---

## 1. Brand

**Name:** Kotalwar Interiors  
**Wordmark:** Kotalwar  
**Positioning:** Considered rooms for living and work.  
**Voice:** Calm, specific. Talk about light, material, and how a room is used. No “luxury interiors,” “dream home,” or Apple slogans.

**Tagline:** Rooms, considered.

**Supporting line:** Interior design for houses that are meant to be lived in.

**Mark:** A thin gold vertical line (a door jamb / plumb line), not a fruit or crescent. Wordmark in Geist Semibold, open tracking.

**Accent:** Champagne gold `#C4A37A` — hairlines, focus, “Selected.” Never large fills.

**Palette:** ink `#0B0B0C`, mist `#F5F4F1`, paper `#FFFFFF`, stone `#8A8680`, line `#E6E3DC`.

**Type:** Geist. Display 64–88px desktop / 36–48px mobile. Body 17–19px, line-height 1.55. Eyebrows 12px uppercase, tracking 0.18em.

---

## 2. Public sitemap

| Path | Purpose |
| --- | --- |
| `/` | Hero, selected work, philosophy, contact CTA |
| `/work` | Full gallery, category filters |
| `/work/[slug]` | Project story + large photos |
| `/about` | The practice |
| `/contact` | Inquiry form |
| `/admin` | Private studio login and dashboard |

Nav: Work · About · Contact · Search. No cart.

---

## 3. Project model

- title, slug, location, year, category, description, featured
- photos: file, sort order, cover flag
- categories: `residence`, `kitchen`, `living`, `workplace`, `other`

Seed three sample projects (CSS architectural compositions until real photos are uploaded):

1. **House of Lime** — Pune, 2024, residence  
2. **Courtyard Kitchen** — Nagpur, 2023, kitchen  
3. **North Study** — Mumbai, 2025, workplace  

---

## 4. Admin

One account via env: `ADMIN_USERNAME`, `ADMIN_PASSWORD`. HttpOnly signed session cookie.

Capabilities:

- Create / edit / delete projects
- Upload, reorder, set cover, delete photos
- Toggle featured
- Read contact inquiries

---

## 5. API

Public:

- `GET /api/health`
- `GET /api/projects` (`?featured=1`, `?category=`)
- `GET /api/projects/{slug}`
- `GET /api/search?q=`
- `POST /api/inquiries` `{ name, email, phone?, message }`

Auth:

- `POST /api/admin/login` `{ username, password }`
- `POST /api/admin/logout`
- `GET /api/admin/me`

Admin (cookie required):

- `GET/POST /api/admin/projects`
- `GET/PATCH/DELETE /api/admin/projects/{id}`
- `POST /api/admin/projects/{id}/photos` (multipart)
- `PATCH /api/admin/photos/{id}` (cover / sort)
- `DELETE /api/admin/photos/{id}`
- `GET /api/admin/inquiries`

Files: `GET /uploads/...`

---

## 6. Contact placeholders

Until the studio provides real details:

- Email: studio@kotalwar.example
- Phone: +91 00000 00000
- City: India

---

## 7. Motion and a11y

Framer Motion reveals, restrained. `prefers-reduced-motion`: fade only. Skip link, focus-visible gold ring, lazy images, unique titles per route.

---

## 8. Out of scope

Payments, public accounts, Instagram, WhatsApp API, Apple branding.
