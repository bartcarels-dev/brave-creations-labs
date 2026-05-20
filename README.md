# Brave Creations Hub

A dark, modern projects hub for **Brave Creations Labs** — showcasing experimental apps and tools.

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

1. Add [Upstash Redis](https://vercel.com/marketplace/upstash) to your Vercel project.
2. Set `ADMIN_PASSWORD` in Vercel environment variables (same value you use to sign in).
3. Redeploy. Saves from `/admin` persist for all visitors.

Without Redis, the site serves `public/projects.json` from the last deploy.

## Build for production

```bash
npm run build
npm run preview
```

## Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
