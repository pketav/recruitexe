import Link from "next/link"
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, CalendarClock, ClipboardList, FileText, MapPin, UserRound, Users } from "lucide-react"

import type { WorkspaceGroup, WorkspaceModule } from "@/lib/workspace-navigation"
import { legacyTheme } from "@/lib/legacy-theme"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { LinkedInAiWorkspace } from "@/components/linkedin-ai-workspace"
import { LegacyJobPostDashboard } from "@/components/legacy-job-post-dashboard"
import { HrAiScreeningWorkspace } from "@/components/hr-ai-screening-workspace"
import { CustomerLinksWorkspace } from "@/components/customer-links-workspace"
import { AutomationRulesWorkspace } from "@/components/automation-rules-workspace"
import { JobPostCreateWorkspace } from "@/components/job-post-create-workspace"
import { ApplicationWorkspace } from "@/components/application-workspace"
import { InterviewWorkspace } from "@/components/interview-workspace"
import { FileManagerWorkspace } from "@/components/file-manager-workspace"
import { UtilitiesWorkspace } from "@/components/utilities-workspace"
import { OperationsWorkspace } from "@/components/operations-workspace"
import { CandidateCareersWorkspace } from "@/components/candidate-careers-workspace"
import { organizationSlug, type AutomationRule, type DocumentLibraryRow, type JobPostSetupData, type LinkedInIntegrationSettings } from "@/lib/demo/recruitexe-data"

type HrDashboardData = {
  organization: { name: string }
  metrics: Array<{ label: string; value: string; note: string }>
  departmentBreakdown: Array<{ name: string; value: number }>
  pipeline: Array<{ applicationId: string; code: string; name: string; position: string; status: string; aiScore: string; aiSummary?: string; location?: string }>
  hotPositions: Array<{ title: string; applicants: number }>
  documentLibrary?: DocumentLibraryRow[]
  automationRules?: AutomationRule[]
  linkedinIntegration?: LinkedInIntegrationSettings
  jobPostSetup?: JobPostSetupData
}

type CandidateDashboardData = {
  candidateName: string
  profileCompletion: number
  appliedJobs: number
  interviews: number
  documents: number
  checks: string
  jobs: Array<{ title: string; department: string; location: string; action: "Apply" | "Applied"; applicants: number; status?: string }>
}

type WorkspaceModulePageProps = {
  brand: string
  homeHref: string
  backHref: string
  navigation: WorkspaceGroup[]
  module: WorkspaceModule
  mode: "hr" | "candidate"
  data: HrDashboardData | CandidateDashboardData
}

export function WorkspaceModulePage({ brand, homeHref, backHref, navigation, module, mode, data }: WorkspaceModulePageProps) {
  const isLegacyFullBleed = module.href === "/hr/modules/recruitment/job-posts"

  return (
    <main className="min-h-screen" style={{ background: legacyTheme.body, color: legacyTheme.text }}>
      <WorkspaceSidebar brand={brand} groups={navigation} homeHref={homeHref} />
      <section className="lg:pl-72">
        <div className={`mx-auto max-w-7xl px-5 ${isLegacyFullBleed ? "py-5" : "py-6"}`}>
          {!isLegacyFullBleed ? (
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href={backHref} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#7367F0]" style={{ color: legacyTheme.textSoft }}>
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
              <p className="text-sm font-semibold" style={{ color: module.source === "supabase-live" ? legacyTheme.success : legacyTheme.primary }}>
                {module.source === "supabase-live" ? "Live workspace" : "Workspace module"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight" style={{ color: legacyTheme.text }}>{module.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{module.description}</p>
            </div>
            <span className="rounded-full border bg-white px-3 py-1 text-sm font-semibold" style={{ borderColor: legacyTheme.divider, color: legacyTheme.textSoft }}>
              {mode === "hr" ? "HR module" : "Candidate module"}
            </span>
          </header>
          ) : null}

          <ModuleContent module={module} mode={mode} data={data} />
        </div>
      </section>
    </main>
  )
}

function ModuleContent({ module, mode, data }: { module: WorkspaceModule; mode: "hr" | "candidate"; data: HrDashboardData | CandidateDashboardData }) {
  if (mode === "candidate") {
    return <CandidateModuleContent module={module} data={data as CandidateDashboardData} />
  }

  return <HrModuleContent module={module} data={data as HrDashboardData} />
}

function HrModuleContent({ module, data }: { module: WorkspaceModule; data: HrDashboardData }) {
  if (module.href === "/hr/modules/recruitment/job-posts") {
    return <LegacyJobPostDashboard data={data} />
  }

  if (module.href === "/hr/modules/recruitment/create-post" && data.jobPostSetup) {
    return <JobPostCreateWorkspace initialData={data.jobPostSetup} />
  }

  if (module.href === "/hr/modules/integrations/linkedin-create-post") {
    return <LinkedInAiWorkspace jobs={data.hotPositions} initialSettings={data.linkedinIntegration} />
  }

  if (module.href === "/hr/modules/integrations/linkedin-dashboard") {
    return (
      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Drafts", "3", "AI generated and editable"],
            ["Pending Approval", "1", "Agency client review"],
            ["Scheduled", "2", "Ready for LinkedIn posting"],
            ["Posted", "0", "Awaiting OAuth connection"],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <p className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>{label}</p>
              <p className="mt-2 text-3xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
              <p className="mt-1 text-sm" style={{ color: legacyTheme.textMuted }}>{note}</p>
            </div>
          ))}
        </div>
        <LinkedInAiWorkspace jobs={data.hotPositions} initialSettings={data.linkedinIntegration} />
      </section>
    )
  }

  if (module.href === "/hr/modules/applications/ai-screening") {
    return <HrAiScreeningWorkspace pipeline={data.pipeline} />
  }

  if (module.href === "/hr/modules/applications/dashboard") {
    return <ApplicationWorkspace pipeline={data.pipeline} variant="dashboard" />
  }

  if (module.href === "/hr/modules/applications/candidates") {
    return <ApplicationWorkspace pipeline={data.pipeline} variant="candidates" />
  }

  if (module.href === "/hr/modules/applications/map") {
    return <ApplicationWorkspace pipeline={data.pipeline} variant="map" />
  }

  if (module.href === "/hr/modules/interviews/monitor") {
    return <InterviewWorkspace pipeline={data.pipeline} variant="monitor" />
  }

  if (module.href === "/hr/modules/interviews/call-logs") {
    return <InterviewWorkspace pipeline={data.pipeline} variant="call-logs" />
  }

  if (module.href === "/hr/modules/utilities/file-manager") {
    return <FileManagerWorkspace documents={data.documentLibrary ?? []} />
  }

  if (module.href === "/hr/modules/utilities/notes") {
    return <UtilitiesWorkspace pipeline={data.pipeline} variant="notes" />
  }

  if (module.href === "/hr/modules/utilities/chats") {
    return <UtilitiesWorkspace pipeline={data.pipeline} variant="chats" />
  }

  const operationsVariantByHref = {
    "/hr/modules/expenses/dashboard": "expenses",
    "/hr/modules/setup/agency": "agency",
    "/hr/modules/admin/dashboard": "admin",
    "/hr/modules/admin/plan-usage": "plan",
    "/hr/modules/commandexe/dashboard": "command-dashboard",
    "/hr/modules/commandexe/add-case": "command-add-case",
    "/hr/modules/commandexe/backoffice": "command-backoffice",
    "/hr/modules/commandexe/invoice": "command-invoice",
  } as const
  const operationsVariant = operationsVariantByHref[module.href as keyof typeof operationsVariantByHref]

  if (operationsVariant) {
    return (
      <OperationsWorkspace
        variant={operationsVariant}
        organizationName={data.organization.name}
        metrics={data.metrics}
        pipeline={data.pipeline}
        jobs={data.hotPositions}
      />
    )
  }

  if (module.href === "/hr/modules/setup/customer-links") {
    return <CustomerLinksWorkspace slug={organizationSlug} organizationName={data.organization.name} jobs={data.hotPositions} />
  }

  if (module.href === "/hr/modules/setup/automation-rules") {
    return <AutomationRulesWorkspace organizationName={data.organization.name} initialRules={data.automationRules ?? []} />
  }

  if (module.dataKey === "jobs") {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {data.hotPositions.map((job) => (
          <div key={job.title} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <BriefcaseBusiness className="h-6 w-6" style={{ color: legacyTheme.primary }} />
            <h2 className="mt-4 text-lg font-bold" style={{ color: legacyTheme.text }}>{job.title}</h2>
            <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{job.applicants} applicants from Supabase demo records</p>
            <button className="mt-5 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)]" style={{ background: legacyTheme.primary }}>Open workflow</button>
          </div>
        ))}
      </section>
    )
  }

  if (module.dataKey === "departments" || module.dataKey === "locations") {
    return (
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {data.departmentBreakdown.map((department) => (
          <div key={department.name} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <MapPin className="h-6 w-6" style={{ color: legacyTheme.info }} />
            <h2 className="mt-4 text-lg font-bold" style={{ color: legacyTheme.text }}>{department.name}</h2>
            <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{department.value} linked applications</p>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data.metrics.slice(0, 4).map((metric) => (
        <div key={metric.label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <ClipboardList className="h-6 w-6" style={{ color: legacyTheme.success }} />
          <p className="mt-4 text-sm" style={{ color: legacyTheme.textSoft }}>{metric.label}</p>
          <p className="text-3xl font-bold" style={{ color: legacyTheme.text }}>{metric.value}</p>
          <p className="mt-1 text-sm" style={{ color: legacyTheme.textMuted }}>{metric.note}</p>
        </div>
      ))}
    </section>
  )
}

function CandidateModuleContent({ module, data }: { module: WorkspaceModule; data: CandidateDashboardData }) {
  if (module.href === "/candidate/modules/careers") {
    return <CandidateCareersWorkspace jobs={data.jobs} />
  }

  if (module.href === "/candidate/modules/applications") {
    const appliedJobs = data.jobs.filter((job) => job.action === "Applied")

    return (
      <section className="space-y-4">
        {appliedJobs.map((job) => (
          <article key={job.title} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold" style={{ color: legacyTheme.text }}>{job.title}</h2>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{job.department} · {job.location}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-bold capitalize" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>{job.status ?? "applied"}</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["Application", "Submitted"],
                ["AI Screening", job.status === "applied" ? "Pending" : "Completed"],
                ["HR Review", job.status === "approved" ? "Shortlisted" : "In progress"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: legacyTheme.body }}>
                  <p className="text-xs font-semibold" style={{ color: legacyTheme.textMuted }}>{label}</p>
                  <p className="mt-1 font-bold" style={{ color: legacyTheme.text }}>{value}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    )
  }

  if (module.href === "/candidate/modules/profile") {
    return (
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1fr]">
        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <UserRound className="h-7 w-7" style={{ color: legacyTheme.primary }} />
          <h2 className="mt-4 text-xl font-bold" style={{ color: legacyTheme.text }}>{data.candidateName}</h2>
          <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>Candidate profile synced from Supabase.</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full" style={{ background: legacyTheme.selected }}>
            <div className="h-full rounded-full" style={{ width: `${data.profileCompletion}%`, background: legacyTheme.primary }} />
          </div>
          <p className="mt-2 text-sm font-semibold" style={{ color: legacyTheme.primary }}>{data.profileCompletion}% complete</p>
        </article>
        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Profile Checklist</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ["Basic details", "Completed"],
              ["Resume", data.documents ? "Uploaded" : "Pending"],
              ["Identity proof", data.documents > 1 ? "Uploaded" : "Pending"],
              ["Interview readiness", data.interviews ? "Scheduled" : "Awaiting HR"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border p-3" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body }}>
                <p className="text-sm font-semibold" style={{ color: legacyTheme.text }}>{label}</p>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    )
  }

  if (module.href === "/candidate/modules/documents") {
    const documents = ["Resume", "Identity Proof", "Education Certificate"].slice(0, Math.max(1, data.documents))

    return (
      <section className="grid gap-4 md:grid-cols-3">
        {documents.map((documentTitle) => (
          <article key={documentTitle} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <FileText className="h-6 w-6" style={{ color: legacyTheme.primary }} />
            <h2 className="mt-4 font-bold" style={{ color: legacyTheme.text }}>{documentTitle}</h2>
            <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>Uploaded and available for HR verification.</p>
            <span className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }}>Active</span>
          </article>
        ))}
      </section>
    )
  }

  if (module.href === "/candidate/modules/interviews") {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <CalendarClock className="h-6 w-6" style={{ color: legacyTheme.primary }} />
          <h2 className="mt-4 text-lg font-bold" style={{ color: legacyTheme.text }}>Interview Status</h2>
          <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{data.interviews ? "HR review is active. Interview confirmation is pending." : "No interview scheduled yet."}</p>
        </article>
        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <BadgeCheck className="h-6 w-6" style={{ color: legacyTheme.success }} />
          <h2 className="mt-4 text-lg font-bold" style={{ color: legacyTheme.text }}>Readiness</h2>
          <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>Resume, documents, and application status stay linked to the candidate workspace.</p>
        </article>
      </section>
    )
  }

  const summary = [
    ["Profile Completion", `${data.profileCompletion}%`, Users],
    ["Applied Jobs", String(data.appliedJobs), BriefcaseBusiness],
    ["Interviews", String(data.interviews), BadgeCheck],
    ["Documents", String(data.documents), FileText],
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.map(([label, value, Icon]) => (
        <div key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <Icon className="h-6 w-6" style={{ color: legacyTheme.primary }} />
          <p className="mt-4 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
          <p className="text-3xl font-bold" style={{ color: legacyTheme.text }}>{value as string}</p>
        </div>
      ))}
    </section>
  )
}
