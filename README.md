# Tinker Department Hub

A dark, modern projects hub for **Tinker Department** — showcasing experimental apps and tools.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Admin:** [http://localhost:5173/admin](http://localhost:5173/admin)  
Default local password: `dev-admin` (set in `.env.local` as `ADMIN_PASSWORD`).

## Admin

Manage projects without editing code:

| Field | Description |
|-------|-------------|
| **Title** | Project name on the card |
| **Tagline** | Accent-colored subtitle |
| **Description** | Body copy |
| **Phase** | Status badge (Prototype, In development, etc.) |
| **Visible** | Show or hide on the public hub |
| **Project URL** | “Open project” link |

### Local saves

`npm run dev` writes changes to `public/projects.json` via the built-in API.

### Production saves (Vercel)

Admin saves need persistent storage on Vercel. Pick **one** option:

**Option A — Vercel Blob (easiest)**

1. Vercel project → **Storage** → **Create Database** → **Blob**
2. Connect it to this project (`BLOB_READ_WRITE_TOKEN` is added automatically)
3. Set `ADMIN_PASSWORD` under **Settings → Environment Variables**
4. Redeploy

**Option B — Upstash Redis**

1. Vercel project → **Storage** → add **Upstash Redis**
2. Set `ADMIN_PASSWORD` in environment variables
3. Redeploy

Without storage, the site serves `public/projects.json` from the last deploy (read-only).

## Build for production

```bash
npm run build
npm run preview
```

## Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
