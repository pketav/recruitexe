"use client"

import { BadgeIndianRupee, Building2, ClipboardList, CreditCard, FileText, Landmark, ShieldCheck, Users } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type Metric = { label: string; value: string; note: string }
type PipelineRow = { applicationId: string; code: string; name: string; position: string; status: string; aiScore: string; location?: string }
type JobRow = { title: string; applicants: number }

type OperationsWorkspaceProps = {
  variant: "expenses" | "agency" | "admin" | "plan" | "command-dashboard" | "command-add-case" | "command-backoffice" | "command-invoice"
  organizationName: string
  metrics: Metric[]
  pipeline: PipelineRow[]
  jobs: JobRow[]
}

function metricValue(metrics: Metric[], label: string) {
  return metrics.find((metric) => metric.label === label)?.value ?? "0"
}

function summaryCards(items: Array<[string, string | number, typeof ClipboardList, string]>) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map(([label, value, Icon, color]) => (
        <article key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <Icon className="h-5 w-5" style={{ color }} />
          <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
        </article>
      ))}
    </div>
  )
}

export function OperationsWorkspace({ variant, organizationName, metrics, pipeline, jobs }: OperationsWorkspaceProps) {
  const applications = Number(metricValue(metrics, "Total Applications"))
  const approved = Number(metricValue(metrics, "Approved"))
  const pending = Number(metricValue(metrics, "Pending"))
  const openRoles = Number(metricValue(metrics, "Open Roles"))
  const commandCases = pipeline.filter((row) => row.status !== "rejected")

  if (variant === "expenses") {
    const estimatedSpend = jobs.reduce((sum, job) => sum + Math.max(1, Math.ceil(job.applicants / 8)) * 1800, 0)
    return (
      <section className="space-y-5">
        {summaryCards([
          ["Claims", applications, BadgeIndianRupee, legacyTheme.primary],
          ["Approved", approved, ShieldCheck, legacyTheme.success],
          ["Pending", pending, ClipboardList, legacyTheme.warning],
          ["Budget Used", `₹${estimatedSpend.toLocaleString("en-IN")}`, CreditCard, legacyTheme.info],
        ])}
        <WorkflowTable title="Expense Approval Queue" rows={jobs.map((job, index) => ({ id: job.title, primary: job.title, secondary: `${job.applicants} applicant-linked expense signals`, status: index % 2 ? "Pending approval" : "Approved", owner: index % 2 ? "Approver Desk" : "Finance" }))} />
      </section>
    )
  }

  if (variant === "agency") {
    return (
      <section className="space-y-5">
        {summaryCards([
          ["Workspace", organizationName, Building2, legacyTheme.primary],
          ["Client Links", jobs.length, FileText, legacyTheme.info],
          ["Active Roles", openRoles, ClipboardList, legacyTheme.success],
          ["Candidate Pool", applications, Users, legacyTheme.warning],
        ])}
        <WorkflowTable title="Agency Client Workspaces" rows={jobs.map((job) => ({ id: job.title, primary: job.title, secondary: "Public career link and approval flow ready", status: "Live", owner: "Agency Admin" }))} />
      </section>
    )
  }

  if (variant === "admin") {
    return (
      <section className="space-y-5">
        {summaryCards([
          ["Admins", 3, ShieldCheck, legacyTheme.primary],
          ["Recruiters", 6, Users, legacyTheme.info],
          ["Published Roles", openRoles, ClipboardList, legacyTheme.success],
          ["Audit Items", pending, FileText, legacyTheme.warning],
        ])}
        <WorkflowTable title="Admin Control Center" rows={[
          { id: "roles", primary: "Role permissions", secondary: "Recruiter, hiring manager, agency admin", status: "Configured", owner: "Product Owner" },
          { id: "domains", primary: "Legacy route compatibility", secondary: "Old links redirect into clean workspace", status: "Active", owner: "System" },
          { id: "secrets", primary: "Secret handling", secondary: "Supabase/Gemini/LinkedIn stay backend-side", status: "Protected", owner: "Backend" },
        ]} />
      </section>
    )
  }

  if (variant === "plan") {
    return (
      <section className="space-y-5">
        {summaryCards([
          ["Plan", "Growth", CreditCard, legacyTheme.primary],
          ["AI Screenings", applications, ShieldCheck, legacyTheme.success],
          ["Job Slots", `${openRoles}/50`, ClipboardList, legacyTheme.info],
          ["Storage Files", "3", FileText, legacyTheme.warning],
        ])}
        <WorkflowTable title="Usage Breakdown" rows={[
          { id: "ai", primary: "AI screening", secondary: "Gemini-ready with fallback scoring", status: "Within quota", owner: "RecruitExe" },
          { id: "linkedin", primary: "LinkedIn drafts", secondary: "Backend AI + OAuth setup flow", status: "Ready", owner: "Integrations" },
          { id: "careers", primary: "Customer career links", secondary: "Company and agency public apply pages", status: "Live", owner: "Workspace" },
        ]} />
      </section>
    )
  }

  if (variant === "command-add-case") {
    return <CommandCaseForm jobs={jobs} />
  }

  if (variant === "command-invoice") {
    return (
      <section className="space-y-5">
        {summaryCards([
          ["Invoices", jobs.length, FileText, legacyTheme.primary],
          ["Billable Cases", commandCases.length, ClipboardList, legacyTheme.info],
          ["Approved", approved, ShieldCheck, legacyTheme.success],
          ["Pending", pending, BadgeIndianRupee, legacyTheme.warning],
        ])}
        <WorkflowTable title="CommandExe Invoice Queue" rows={jobs.map((job, index) => ({ id: job.title, primary: `INV-${String(index + 1).padStart(4, "0")}`, secondary: job.title, status: index % 2 ? "Draft" : "Ready", owner: "Billing Desk" }))} />
      </section>
    )
  }

  const title = variant === "command-backoffice" ? "Backoffice Case Queue" : "CommandExe Case Dashboard"
  return (
    <section className="space-y-5">
      {summaryCards([
        ["Cases", commandCases.length, Landmark, legacyTheme.primary],
        ["Ready", approved, ShieldCheck, legacyTheme.success],
        ["Processing", pending, ClipboardList, legacyTheme.warning],
        ["Locations", new Set(pipeline.map((row) => row.location ?? "Remote")).size, Building2, legacyTheme.info],
      ])}
      <WorkflowTable title={title} rows={commandCases.map((row) => ({ id: row.applicationId, primary: row.name, secondary: `${row.position} · ${row.location ?? "Remote"}`, status: row.status, owner: "Verification Desk" }))} />
    </section>
  )
}

function CommandCaseForm({ jobs }: { jobs: JobRow[] }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_0.7fr]">
      <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Add Verification Case</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {["Candidate name", "Client name", "Case type", "Priority"].map((label) => (
            <label key={label} className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>{label}</span>
              <input className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} placeholder={label} />
            </label>
          ))}
        </div>
        <button className="mt-5 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)]" style={{ background: legacyTheme.primary }}>Create Case Draft</button>
      </article>
      <WorkflowTable title="Case Templates" rows={jobs.slice(0, 4).map((job) => ({ id: job.title, primary: job.title, secondary: "Employment, address, document verification", status: "Template ready", owner: "CommandExe" }))} />
    </section>
  )
}

function WorkflowTable({ title, rows }: { title: string; rows: Array<{ id: string; primary: string; secondary: string; status: string; owner: string }> }) {
  return (
    <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
      <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
        <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>{title}</h2>
      </div>
      <div className="divide-y" style={{ borderColor: legacyTheme.divider }}>
        {rows.map((row) => (
          <article key={row.id} className="grid gap-3 p-5 md:grid-cols-[0.4fr_1fr_0.25fr]">
            <p className="font-bold" style={{ color: legacyTheme.text }}>{row.primary}</p>
            <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{row.secondary}</p>
            <div className="text-right">
              <span className="rounded-full px-3 py-1 text-xs font-bold capitalize" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>{row.status}</span>
              <p className="mt-2 text-xs" style={{ color: legacyTheme.textMuted }}>{row.owner}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
