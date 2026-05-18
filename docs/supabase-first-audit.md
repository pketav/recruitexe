# Supabase-First Audit

## Decision

Yes, Supabase can be connected before the legacy cleanup, but only for a narrow foundation slice.

Do not migrate the full old backend at once. The current backend contains many unrelated modules in one Express/MongoDB service, so a full direct migration would slow the product down and recreate the same mess in PostgreSQL.

## Current Shape

Primary app:

- `apps/web`
- Routes: `/`, `/hr/*`, `/candidate/*`
- Local preview: `http://localhost:4030`

Legacy references:

- `apps/hr-portal`
- `apps/candidate-portal`
- Old Express/Mongo API source from Downloads, excluded from Git because it contains hardcoded third-party secrets

The legacy backend includes these broad areas:

- Auth, employees, roles, permissions
- Organization, company, branch, department, designation, work location
- Job descriptions, vacancy requests, job posts, job applications
- Candidate details, dynamic career forms, interview flows
- AI screening, AI interview, credits/plans
- Expense, trips, advances, vendors, workflows, reports
- File share, uploads, PDF/document templates
- Gmail, LinkedIn, social posting
- Verification suite, report generation, subscriptions

## Supabase First Scope

Build only this first:

1. Supabase client wiring in `apps/web`.
2. Auth for HR users and candidate users.
3. Organization-level data isolation.
4. Role and permission foundation.
5. Core master data:
   - companies
   - branches
   - departments
   - designations
   - work locations
6. Recruitment core:
   - job descriptions
   - vacancy requests
   - job posts
   - candidates
   - candidate profiles
   - job applications
   - application status history
   - interviews
7. Storage buckets:
   - resumes
   - candidate-documents
   - employee-documents

## Keep Frozen For Later

These should not block Supabase foundation:

- Expenses and purchase workflows
- Budgets and reports
- LinkedIn/social posting
- Gmail OAuth and mailbox sync
- AI interview/screening engines
- Verification suite
- Subscription/plan billing
- File manager
- Dynamic report generator

They can remain in the untouched Downloads source as reference until the core HR/recruitment product works end to end.

## Risks

- Legacy backend has duplicate or overlapping modules, especially file share, expense, reports, and templates.
- Some old code has hardcoded integrations and broad `origin: *` CORS.
- Mongo object IDs and nested documents need relational redesign, not one-to-one copying.
- Permissions must be rebuilt with Supabase Row Level Security, not ported as frontend-only checks.

## Suggested Order

1. Add Supabase packages and client helpers.
2. Create initial SQL migration for organization, profile, role, and permission tables.
3. Add recruitment SQL migration.
4. Add storage bucket policy migration.
5. Convert `/hr/login` and `/candidate/login` from demo navigation to Supabase auth.
6. Replace mock HR dashboard cards with Supabase reads.
7. Replace candidate open-role list with Supabase reads.
8. Clean unused legacy folders module by module after the new flow works.

## What I Need From Supabase

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`

Useful for migrations:

- Database password or Supabase CLI access
- Production domain decision for auth redirect URLs

## Working Rule

Supabase first is good. Cleanup comes after each new flow works.

The first real target should be:

HR login -> create job -> candidate applies -> HR sees application -> interview status updates.
