# Domain and Redirect Rules

## Goal

The product should behave as one HRMS, even if multiple domains or old subdomains still exist.

## Current Local Routing

- Public website: `/`
- HR login: `/hr/login`
- HR dashboard: `/hr/dashboard`
- Candidate login: `/candidate/login`
- Candidate dashboard: `/candidate/dashboard`

## Rule

Do not hardcode production domains inside UI buttons or app navigation.

Use internal paths for product navigation:

- HR links go to `/hr/*`
- Candidate links go to `/candidate/*`
- Website links stay under `/`, `/contact`, `/interview`, `/blog`

Use `NEXT_PUBLIC_SITE_URL` only for public absolute URLs such as sitemap, canonical URLs, and deployment metadata.

## Production Direction

Preferred setup:

- Main domain serves `apps/web`.
- Old HR/candidate domains redirect into the matching paths on the main domain.
- Old API domain remains legacy-only until Supabase replaces it.

Examples:

- `hr.recruitexe.in/login` -> `/hr/login`
- `candidate.recruitexe.in/login` -> `/candidate/login`
- `www.recruitexe.in` -> `/`

Final production domains should be confirmed before deployment, then stored in env/config instead of being scattered through code.
