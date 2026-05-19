export type WorkspaceModule = {
  title: string
  href: string
  description: string
  source: "supabase-live" | "supabase-ready"
  dataKey:
    | "dashboard"
    | "jobs"
    | "candidates"
    | "applications"
    | "interviews"
    | "departments"
    | "locations"
    | "documents"
    | "settings"
    | "workflow"
}

export type WorkspaceGroup = {
  title: string
  modules: WorkspaceModule[]
}

export const hrNavigation: WorkspaceGroup[] = [
  {
    title: "Home",
    modules: [
      {
        title: "Dashboard",
        href: "/hr/dashboard",
        description: "Hiring analytics, pipeline numbers, hot roles, and department split.",
        source: "supabase-live",
        dataKey: "dashboard",
      },
    ],
  },
  {
    title: "Talent Acquisition",
    modules: [
      {
        title: "Job Post Dashboard",
        href: "/hr/modules/recruitment/job-posts",
        description: "Published jobs, applicant counts, role status, and opening health.",
        source: "supabase-live",
        dataKey: "jobs",
      },
      {
        title: "Recruiter Analytics",
        href: "/hr/modules/recruitment/recruiter-analytics",
        description: "Recruiter activity, conversion, pending workload, and sourcing health.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Create Post",
        href: "/hr/modules/recruitment/create-post",
        description: "Job creation workflow with department, location, openings, and content fields.",
        source: "supabase-ready",
        dataKey: "jobs",
      },
      {
        title: "LinkedIn Dashboard",
        href: "/hr/modules/integrations/linkedin-dashboard",
        description: "LinkedIn campaign overview, publish status, drafts, and scheduled posts.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "LinkedIn Create Post",
        href: "/hr/modules/integrations/linkedin-create-post",
        description: "Social post composer route mapped from the legacy LinkedIn posting module.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Application Dashboard",
        href: "/hr/modules/applications/dashboard",
        description: "Candidate applications, stages, AI scores, and decision status.",
        source: "supabase-live",
        dataKey: "applications",
      },
      {
        title: "Candidates",
        href: "/hr/modules/applications/candidates",
        description: "Candidate list with current role, status, score, and source details.",
        source: "supabase-live",
        dataKey: "candidates",
      },
      {
        title: "Candidate Map",
        href: "/hr/modules/applications/map",
        description: "Location-based hiring overview mapped from the old Job Applications Map tab.",
        source: "supabase-live",
        dataKey: "locations",
      },
      {
        title: "Interviews",
        href: "/hr/modules/interviews/monitor",
        description: "Scheduled and pending interview workflow.",
        source: "supabase-ready",
        dataKey: "interviews",
      },
      {
        title: "Call Logs",
        href: "/hr/modules/interviews/call-logs",
        description: "Telephonic interview and agent call history route.",
        source: "supabase-ready",
        dataKey: "interviews",
      },
    ],
  },
  {
    title: "Operations",
    modules: [
      {
        title: "Expenses",
        href: "/hr/modules/expenses/dashboard",
        description: "Expense dashboard route from the legacy finance workflow.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Agency",
        href: "/hr/modules/setup/agency",
        description: "Agency setup and partner configuration.",
        source: "supabase-ready",
        dataKey: "settings",
      },
      {
        title: "Settings",
        href: "/hr/modules/setup/settings",
        description: "Employee setup, departments, roles, branches, and organization configuration.",
        source: "supabase-live",
        dataKey: "departments",
      },
      {
        title: "Admin Dashboard",
        href: "/hr/modules/admin/dashboard",
        description: "Admin management route for product owners and internal administrators.",
        source: "supabase-ready",
        dataKey: "settings",
      },
      {
        title: "Plan & Usage",
        href: "/hr/modules/admin/plan-usage",
        description: "Subscription, quota, and usage route.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
    ],
  },
  {
    title: "CommandExe",
    modules: [
      {
        title: "CommandExe Dashboard",
        href: "/hr/modules/commandexe/dashboard",
        description: "Verification and case command center.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Add Case",
        href: "/hr/modules/commandexe/add-case",
        description: "Case creation workflow mapped from the old Add Case route.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Backoffice",
        href: "/hr/modules/commandexe/backoffice",
        description: "Initiated cases and back-office processing queue.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "Invoice",
        href: "/hr/modules/commandexe/invoice",
        description: "Invoice route for CommandExe billing records.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
    ],
  },
  {
    title: "Utilities",
    modules: [
      {
        title: "Notes",
        href: "/hr/modules/utilities/notes",
        description: "Notes workspace route from the old utilities menu.",
        source: "supabase-ready",
        dataKey: "documents",
      },
      {
        title: "Chats",
        href: "/hr/modules/utilities/chats",
        description: "Internal chat route from the old utilities menu.",
        source: "supabase-ready",
        dataKey: "workflow",
      },
      {
        title: "File Manager",
        href: "/hr/modules/utilities/file-manager",
        description: "Document and file manager route using Supabase document records.",
        source: "supabase-live",
        dataKey: "documents",
      },
    ],
  },
]

export const candidateNavigation: WorkspaceGroup[] = [
  {
    title: "Candidate",
    modules: [
      {
        title: "Dashboard",
        href: "/candidate/dashboard",
        description: "Candidate status, applications, documents, interviews, and open roles.",
        source: "supabase-live",
        dataKey: "dashboard",
      },
      {
        title: "Profile",
        href: "/candidate/modules/profile",
        description: "Profile completion, contact details, resume, and personal information.",
        source: "supabase-live",
        dataKey: "settings",
      },
      {
        title: "Careers",
        href: "/candidate/modules/careers",
        description: "Open roles available to the candidate.",
        source: "supabase-live",
        dataKey: "jobs",
      },
      {
        title: "Applications",
        href: "/candidate/modules/applications",
        description: "Applied jobs and current application status.",
        source: "supabase-live",
        dataKey: "applications",
      },
      {
        title: "Interviews",
        href: "/candidate/modules/interviews",
        description: "Upcoming interview and pending scheduling status.",
        source: "supabase-ready",
        dataKey: "interviews",
      },
      {
        title: "Documents",
        href: "/candidate/modules/documents",
        description: "Uploaded resume, identity proof, and education documents.",
        source: "supabase-live",
        dataKey: "documents",
      },
    ],
  },
]

export function getAllHrModules() {
  return hrNavigation.flatMap((group) => group.modules)
}

export function getAllCandidateModules() {
  return candidateNavigation.flatMap((group) => group.modules)
}

export function findHrModule(slug: string[]) {
  const href = `/hr/modules/${slug.join("/")}`
  return getAllHrModules().find((module) => module.href === href)
}

export function findCandidateModule(slug: string[]) {
  const href = `/candidate/modules/${slug.join("/")}`
  return getAllCandidateModules().find((module) => module.href === href)
}
