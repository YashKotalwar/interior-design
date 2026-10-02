# Kotalwar Interiors

Studio website for **Kotalwar Interiors** — an interior design practice. Visitors browse projects; the studio uploads work from a private admin. Visual craft takes cues from quiet, large-image product sites (spacing, type, photography), not from any third-party brand.

Specification: [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md)

## Stack

- **Backend:** FastAPI, SQLite, local photo uploads
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion

## Run locally

Two terminals.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000 --app-dir . --reload-exclude 'data/*' --reload-exclude 'uploads/*'
```

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default login (change in `backend/.env`):

- Username: `kotalwar`
- Password: `kotalwar-studio`

## Deploy for free (Vercel + Render)

Public site and `/admin` go live at no cost. Render’s free disk is temporary: after the API sleeps or redeploys, the SQLite database and uploaded photos can reset to the sample projects.

### 1. Push this repo to GitHub

Create a GitHub repository and push `main`.

### 2. API on [Render](https://render.com)

1. Sign in with GitHub → **New** → **Blueprint**.
2. Select this repo (`render.yaml` is at the root).
3. When prompted, set:
   - **ADMIN_PASSWORD** — a strong password (not `kotalwar-studio`)
   - **CORS_ORIGINS** — leave a placeholder like `https://example.com` for now; you will paste the Vercel URL in step 4
4. Apply. Copy the service URL, e.g. `https://kotalwar-api.onrender.com`.

Manual setup (if you skip Blueprint): Web Service, root directory `backend`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Same env vars as `render.yaml`.

### 3. Site on [Vercel](https://vercel.com)

1. **Add New** → **Project** → import the same GitHub repo.
2. **Root Directory** → `frontend` (Edit, not the repo root).
3. Environment variable:
   - **Name:** `API_URL`
   - **Value:** the Render URL from step 2 (no trailing slash)
4. Deploy.

`API_URL` is baked into Next.js rewrites at **build** time. If you change the Render URL later, update `API_URL` and **Redeploy**.

### 4. Point CORS at the live site

In Render → Environment, set `CORS_ORIGINS` to your Vercel URL, e.g. `https://kotalwar.vercel.app` (no trailing slash). Save — the API restarts.

### 5. Open the site

- Public: `https://YOUR-PROJECT.vercel.app`
- Admin: `https://YOUR-PROJECT.vercel.app/admin`
- Username: `kotalwar` (unless you changed `ADMIN_USERNAME`)
- Password: the value you set on Render

The first request after idle can take ~30 seconds while Render wakes the API.

Photos are compressed in the browser so they fit Vercel’s 4.5 MB upload limit.

## Public routes

`/`, `/work`, `/work/[slug]`, `/about`, `/contact`
