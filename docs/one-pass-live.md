# One-Pass Live Notes

## Production Shape

- `apps/web` is the only deployable product app right now.
- `apps/hr-portal` and `apps/candidate-portal` are legacy references only.
- `server/api` is intentionally not in this clean repo because the old backend carried hardcoded third-party secrets.
- Supabase is the target source of truth for auth, tenant data, product grouping, files, and workflow data.

## Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind, Radix UI, lucide icons.
- Supabase JS client in `apps/web/lib/supabase`.
- Vercel production deploy from repo root, but `vercel.json` installs and builds only `apps/web`.
- Production URL currently: `https://fincoopers-hrms-clean.vercel.app`.

## Deployment Contract

Before any live push:

1. Work only inside `apps/web` for product behavior unless migrating a legacy module for reference.
2. Keep public URLs behind `getSiteOrigin()` and API URLs behind `getApiBaseUrl()`.
3. Do not hardcode production domains, localhost API hosts, JWTs, or service keys in UI code.
4. Run `npm run build`.
5. Confirm `vercel.json` still points at `apps/web`.
6. Push to GitHub.
7. Deploy with `vercel deploy --prod` until GitHub auto-deploy is connected.
8. Smoke check `/`, `/hr/login`, `/contact`, `/robots.txt`, and `/sitemap.xml`.

## Required Vercel Production Env

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WEB_URL`

## Current Live Caveat

The Vercel project is deployed manually. GitHub auto-deploy is not linked because the Vercel account needs a GitHub login connection. Until that is fixed, every production release should run manual Vercel deploy after pushing.

## Migration Order

1. Supabase auth for `/hr/login` and `/candidate/login`.
2. HR dashboard data from Supabase.
3. Candidate dashboard/open roles from Supabase.
4. Job create/apply flow.
5. Documents/resume storage.
6. Move secondary modules from legacy references into `apps/web` one by one.
7. Remove legacy code only after replacement is live and verified.
