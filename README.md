# Fincoopers HRMS Clean

Single repository workspace for the Fincoopers HRMS rebuild.

The original downloaded HRMS folder is left untouched. This workspace keeps the old code organized as a reference while the product moves into one clean app backed by Supabase.

## Current Decision

- One product, one Git repository.
- `apps/web` is the primary app.
- Run the full preview on `http://localhost:4030`.
- HR routes live under `/hr/*`.
- Candidate routes live under `/candidate/*`.
- `apps/hr-portal` and `apps/candidate-portal` are legacy reference folders for now, not separate products to keep building.
- The old Express/Mongo API is not committed because it contained hardcoded third-party secrets. The original downloaded source remains untouched.

## Run

```bash
npm run dev
```

Preview routes:

- Public website: `http://localhost:4030`
- HR login: `http://localhost:4030/hr/login`
- HR dashboard: `http://localhost:4030/hr/dashboard`
- Candidate login: `http://localhost:4030/candidate/login`
- Candidate dashboard: `http://localhost:4030/candidate/dashboard`

## Verify And Release

Before pushing a production release:

```bash
npm run verify:predeploy
```

After Vercel deploys production:

```bash
npm run verify:live
```

Verification commands:

- `npm run verify:security` scans the active app for hardcoded JWTs, Postgres URLs, Supabase project URLs, password literals, and service-role/token literals.
- `npm run verify:audit` fails on high/critical production dependency advisories and reports non-blocking lower advisories.
- `npm run verify:smoke` checks core HR, candidate, careers, API, legacy redirect, and invalid-payload API contract routes. Use `SMOKE_BASE_URL=https://fincoopers-hrms-clean.vercel.app npm run verify:smoke` for production.
- `npm run verify:live` runs security plus production smoke against `https://fincoopers-hrms-clean.vercel.app`.

Currently verified live flows include Job Post dashboard/create handoff, customer career links, public candidate apply, AI screening, automation rules, LinkedIn/Gemini draft setup, candidate portal modules, legacy redirects, and API bad-payload handling.

## Structure

```text
apps/
  web/                Primary product app: website + HR + candidate
  hr-portal/          Legacy HR/admin portal reference
  candidate-portal/   Legacy candidate portal reference
server/
  README.md           Why the old API is excluded from this clean repo
supabase/
  migrations/         PostgreSQL schema migrations
  seed/               Seed data
  functions/          Supabase Edge Functions, if needed
packages/
  ui/                 Shared UI components
  config/             Shared app config
  utils/              Shared utilities
docs/
  current-audit.md    What exists today
  supabase-plan.md    Migration plan
  domain-routing.md   Domain and redirect rules
  supabase-first-audit.md  What to connect before cleanup
  full-supabase-migration.md  Full app Supabase direction
```

## First Migration Priority

1. Keep production work inside `apps/web` unless explicitly migrating a legacy reference.
2. Keep Supabase as the backend source of truth and keep `.env` secrets out of Git.
3. Continue moving secondary legacy modules into `apps/web` one by one.
4. Add Supabase Auth plus organization roles when auth hardening begins.
5. Add document upload through Supabase Storage.
