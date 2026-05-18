# Supabase Migration Plan

## Goal

Move from scattered product repositories and a MongoDB backend into one Git repository with `apps/web` as the primary product app and Supabase as the core backend.

## Architecture

- Supabase Auth for login and identity.
- PostgreSQL tables for HRMS data.
- Row Level Security for role and organization-level access.
- Supabase Storage for resumes, documents, offer letters, and verification files.
- The Next.js app calls Supabase directly for normal CRUD where safe.
- Server-side routes or Supabase Edge Functions handle privileged actions, integrations, and report generation.

## Phase 1: Foundation

1. Create Supabase project and connect environment variables.
2. Define organization and user role model.
3. Create initial schema:
   - organizations
   - profiles
   - roles
   - permissions
   - user_roles
   - branches
   - departments
   - designations
   - work_locations
4. Add RLS policies for organization isolation.
5. Wire `/hr/login` and `/candidate/login` to Supabase Auth.

## Phase 2: Recruitment Core

1. Create job tables:
   - job_posts
   - job_descriptions
   - vacancy_requests
   - candidates
   - candidate_profiles
   - job_applications
   - application_status_history
2. Create candidate auth and profile flow.
3. Connect career pages to active job posts.
4. Add HR candidate management screens inside `apps/web`.

## Phase 3: Interview and Documents

1. Interview tables:
   - interviews
   - interview_feedback
   - interview_panels
2. Storage buckets:
   - resumes
   - candidate-documents
   - employee-documents
   - generated-documents
3. Document upload policies.
4. Offer/document template flow.

## Phase 4: Secondary Modules

Move these only after core recruitment works:

- Expenses and approvals
- File manager
- Tasks and notes
- AI screening/interview
- Email/Gmail
- LinkedIn/social posting
- Verification suite
- Subscription/plans

## Working Rule

Do not migrate everything blindly. For each module:

1. Identify real user workflow.
2. Design Supabase tables and policies.
3. Connect one screen end to end.
4. Remove or quarantine unused old code.
