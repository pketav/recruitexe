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

1. Keep shaping the unified UI inside `apps/web`.
2. Connect Supabase project and environment variables.
3. Add Supabase Auth plus organization roles.
4. Add company, branch, department, designation setup.
5. Add jobs, candidates, applications, and interview scheduling.
6. Add document upload through Supabase Storage.
