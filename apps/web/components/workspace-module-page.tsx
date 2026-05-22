import Link from "next/link"
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, ClipboardList, FileText, MapPin, Users } from "lucide-react"

import type { WorkspaceGroup, WorkspaceModule } from "@/lib/workspace-navigation"
import { legacyTheme } from "@/lib/legacy-theme"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { LinkedInAiWorkspace } from "@/components/linkedin-ai-workspace"
import { LegacyJobPostDashboard } from "@/components/legacy-job-post-dashboard"
import { HrAiScreeningWorkspace } from "@/components/hr-ai-screening-workspace"

type HrDashboardData = {
  organization: { name: string }
  metrics: Array<{ label: string; value: string; note: string }>
  departmentBreakdown: Array<{ name: string; value: number }>
  pipeline: Array<{ applicationId: string; code: string; name: string; position: string; status: string; aiScore: string; aiSummary?: string }>
  hotPositions: Array<{ title: string; applicants: number }>
}

type CandidateDashboardData = {
  candidateName: string
  profileCompletion: number
  appliedJobs: number
  interviews: number
  documents: number
  checks: string
  jobs: Array<{ title: string; department: string; location: string; action: "Apply" | "Applied"; applicants: number }>
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

  if (module.href === "/hr/modules/integrations/linkedin-create-post") {
    return <LinkedInAiWorkspace jobs={data.hotPositions} />
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
        <LinkedInAiWorkspace jobs={data.hotPositions} />
      </section>
    )
  }

  if (module.href === "/hr/modules/applications/ai-screening" || module.dataKey === "applications" || module.dataKey === "candidates") {
    return <HrAiScreeningWorkspace pipeline={data.pipeline} />
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
  if (module.dataKey === "jobs" || module.dataKey === "applications") {
    return (
      <section className="space-y-3">
        {data.jobs.map((job) => (
          <div key={job.title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div>
              <h2 className="font-bold" style={{ color: legacyTheme.text }}>{job.title}</h2>
              <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{job.department} · {job.location} · {job.applicants} applicants</p>
            </div>
            <span className="rounded-md px-3 py-2 text-sm font-semibold" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>{job.action}</span>
          </div>
        ))}
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
