import Link from "next/link"
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, ClipboardList, FileText, MapPin, Users } from "lucide-react"

import type { WorkspaceGroup, WorkspaceModule } from "@/lib/workspace-navigation"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { LinkedInAiWorkspace } from "@/components/linkedin-ai-workspace"
import { LegacyJobPostDashboard } from "@/components/legacy-job-post-dashboard"

type HrDashboardData = {
  organization: { name: string }
  metrics: Array<{ label: string; value: string; note: string }>
  departmentBreakdown: Array<{ name: string; value: number }>
  pipeline: Array<{ code: string; name: string; position: string; status: string; aiScore: string }>
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
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <WorkspaceSidebar brand={brand} groups={navigation} homeHref={homeHref} />
      <section className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href={backHref} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
              <p className="text-sm font-semibold text-emerald-700">{module.source === "supabase-live" ? "Supabase live" : "Supabase route ready"}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{module.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{module.description}</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
              {mode === "hr" ? "HR module" : "Candidate module"}
            </span>
          </header>

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
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{note}</p>
            </div>
          ))}
        </div>
        <LinkedInAiWorkspace jobs={data.hotPositions} />
      </section>
    )
  }

  if (module.dataKey === "jobs") {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {data.hotPositions.map((job) => (
          <div key={job.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <BriefcaseBusiness className="h-6 w-6 text-sky-700" />
            <h2 className="mt-4 text-lg font-bold">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{job.applicants} applicants from Supabase demo records</p>
            <button className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Open workflow</button>
          </div>
        ))}
      </section>
    )
  }

  if (module.dataKey === "applications" || module.dataKey === "candidates") {
    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold">Candidate Pipeline</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">AI Match</th>
            </tr>
          </thead>
          <tbody>
            {data.pipeline.map((candidate) => (
              <tr key={`${candidate.code}-${candidate.position}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{candidate.code}</td>
                <td className="px-4 py-3 font-semibold">{candidate.name}</td>
                <td className="px-4 py-3">{candidate.position}</td>
                <td className="px-4 py-3 capitalize">{candidate.status}</td>
                <td className="px-4 py-3">{candidate.aiScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )
  }

  if (module.dataKey === "departments" || module.dataKey === "locations") {
    return (
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {data.departmentBreakdown.map((department) => (
          <div key={department.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <MapPin className="h-6 w-6 text-fuchsia-700" />
            <h2 className="mt-4 text-lg font-bold">{department.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{department.value} linked applications</p>
          </div>
        ))}
      </section>
    )
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data.metrics.slice(0, 4).map((metric) => (
        <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <ClipboardList className="h-6 w-6 text-emerald-700" />
          <p className="mt-4 text-sm text-slate-500">{metric.label}</p>
          <p className="text-3xl font-bold">{metric.value}</p>
          <p className="mt-1 text-sm text-slate-500">{metric.note}</p>
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
          <div key={job.title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="font-bold">{job.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{job.department} · {job.location} · {job.applicants} applicants</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{job.action}</span>
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
        <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Icon className="h-6 w-6 text-indigo-700" />
          <p className="mt-4 text-sm text-slate-500">{label as string}</p>
          <p className="text-3xl font-bold">{value as string}</p>
        </div>
      ))}
    </section>
  )
}
