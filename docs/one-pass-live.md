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
4. Run `npm run verify:predeploy`.
5. Confirm `vercel.json` still points at `apps/web`.
6. Push to GitHub.
7. Deploy with `vercel deploy --prod` until GitHub auto-deploy is connected.
8. Run `npm run verify:live` against the production alias.

## Verification Commands

- `npm run verify:security`: active app hardcoded-secret scan.
- `npm run verify:audit`: production dependency audit that fails on high/critical and reports moderate/low advisories.
- `npm run verify:smoke`: core route, API, legacy redirect, and bad-payload API contract smoke check. Defaults to `http://localhost:4030`.
- `npm run verify:live`: security plus production smoke for `https://fincoopers-hrms-clean.vercel.app`.
- `npm run verify:predeploy`: security plus audit plus production build.

Current audit status: `0 critical`, `0 high`, `2 moderate`, `0 low`. The moderate advisories are from Next/PostCSS and currently suggest an unsafe major downgrade, so they are tracked but not release-blocking.

## Live-Verified Product Areas

- HR sidebar and legacy route compatibility for recruitment, applications, setup, utilities, and candidate routes.
- Job Post dashboard tabs, create-post handoff, public share links, and public careers board.
- Public candidate apply pipeline writes into Supabase and rejects invalid public application payloads.
- AI screening run flow and automation rules save/run flow.
- Automation rules API rejects unknown rule IDs and non-boolean toggles.
- LinkedIn/Gemini settings save, draft generation fallback/Gemini flow, approval/schedule action, and invalid integration payload rejection.
- Candidate dashboard, careers, applications, profile, documents, interviews, plus empty-state handling.

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
