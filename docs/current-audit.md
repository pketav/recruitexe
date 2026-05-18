# Current Audit

## Source

Original source folder:

`/Users/ketavpipaliya/Downloads/HRMS SOFTWARE COMPLTE`

That folder is not modified.

## Imported Modules

| Clean path | Source | Role |
| --- | --- | --- |
| `apps/web` | `hrms_website-main` plus new unified routes | Primary product app |
| `apps/hr-portal` | `hrms_hr_portal-main.zip` | Legacy HR/admin reference |
| `apps/candidate-portal` | `hrms_candidate_prod-main.zip` | Legacy candidate reference |
| `server/README.md` | `hrms_server_prod-main` | Old API intentionally excluded from Git because it contained hardcoded third-party secrets |

## Unified Preview

The working preview is now one app on port `4030`:

- `/` public website
- `/hr/login`
- `/hr/dashboard`
- `/candidate/login`
- `/candidate/dashboard`

The old HR portal on `4031` and old candidate portal on `4032` were used only to inspect what existed. They should not be treated as separate products going forward.

## Existing Backend

The current backend is a Node.js Express API using MongoDB/Mongoose. It has many modules in one service:

- Auth, users, roles, permissions
- Organization, branch, company, department, designation, work location
- Job descriptions, vacancy requests, job posts, job applications
- Candidate management, AI screening, AI interviews
- Interview calendar and monitoring
- Leave type and calendar
- Expense, trips, advances, purchase requests, policies, vendors, merchants
- File sharing and document uploads
- PDF, email, document, and report templates
- Gmail/mail sending
- LinkedIn and social media posting
- Verification suite and report generation
- Subscription and plan management

## Immediate Cleanup Notes

- The old backend source remains in the original Downloads folder for reference, but it is not part of this clean Git repo.
- Existing `.env` files are not trusted as final config.
- The old backend remains useful as behavior reference, but Supabase should become the main data/auth/storage layer.
- The old frontend apps were separate Next.js apps. New development should happen in `apps/web` so the product behaves like one system.
