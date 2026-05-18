# Full Supabase Migration

## Decision

The full product data model will move to Supabase first. Cleanup happens after the new database becomes the source of truth.

This avoids keeping four products alive while still preventing a messy one-to-one copy of the old Mongo backend.

## New Source Of Truth

- `apps/web` is the single app.
- `supabase/migrations` owns the database.
- The old Express/Mongo API stays outside Git because it contained hardcoded third-party secrets.
- Old HR and candidate apps stay as reference only.

## Platform Grouping

This Supabase project is structured for multiple products, not only RecruitExe.

- `products` stores product-level records such as `recruitexe`.
- `product_modules` groups features inside each product.
- `organization_products` links tenants to products.
- `plans` and `permissions` are product-aware.
- Shared auth/profile tables stay common across products.

RecruitExe currently owns these modules:

- organization
- recruitment
- candidate
- employee
- expense
- documents
- integrations
- verification
- reports
- admin

## Migration Coverage

The first migration covers these product areas:

- Organization, profile, employee, role, permission
- Company, branch, department, designation, work location
- Candidate, job description, vacancy request, job post, job application
- Application status history, interviews, AI screening
- Documents, dynamic forms, templates
- Expenses, policies, submissions
- Tasks, notes, file items
- Integration accounts, email messages, social posts
- Verification cases, plans, subscriptions
- Reports and audit logs

## Build Order

1. Apply Supabase schema.
2. Wire auth in `/hr/login` and `/candidate/login`.
3. Replace HR dashboard mock cards with Supabase data.
4. Replace candidate open roles with Supabase data.
5. Add create job and apply flow.
6. Add documents/resume storage.
7. Move secondary modules into `apps/web` one by one.
8. Delete old module code only after its Supabase version works.

## Non-Negotiable Rule

Do not clean first. Do not keep building three apps.

Supabase schema first, one app first, then cleanup.
