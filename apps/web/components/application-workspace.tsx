"use client"

import { BarChart3, BriefcaseBusiness, CheckCircle2, MapPin, UserRoundCheck, Users, type LucideIcon } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type PipelineRow = {
  applicationId: string
  code: string
  name: string
  position: string
  status: string
  aiScore: string
  aiSummary?: string
  location?: string
}

type ApplicationWorkspaceProps = {
  pipeline: PipelineRow[]
  variant: "dashboard" | "candidates" | "map"
}

type StatCard = [string, number, LucideIcon, string]

function scoreTone(score: string) {
  const value = Number(score.replace("%", ""))

  if (Number.isNaN(value)) {
    return { background: legacyTheme.selected, color: legacyTheme.textSoft }
  }

  if (value >= 85) {
    return { background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }
  }

  if (value >= 74) {
    return { background: "rgba(255, 159, 67, 0.14)", color: "#B85F00" }
  }

  return { background: "rgba(255, 76, 81, 0.12)", color: legacyTheme.error }
}

function statusTone(status: string) {
  if (status === "approved") {
    return { background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }
  }

  if (status === "rejected") {
    return { background: "rgba(255, 76, 81, 0.12)", color: legacyTheme.error }
  }

  return { background: "rgba(255, 159, 67, 0.14)", color: "#B85F00" }
}

function nextAction(row: PipelineRow) {
  if (row.status === "approved") {
    return "Move to shortlist/interview"
  }

  if (row.status === "rejected") {
    return "Keep closed with audit trail"
  }

  if (row.status === "review") {
    return "HR review required"
  }

  if (row.aiScore === "Pending") {
    return "Run AI screening"
  }

  return "Run automation rules"
}

export function ApplicationWorkspace({ pipeline, variant }: ApplicationWorkspaceProps) {
  const approved = pipeline.filter((row) => row.status === "approved").length
  const review = pipeline.filter((row) => row.status === "review" || row.status === "pending").length
  const rejected = pipeline.filter((row) => row.status === "rejected").length
  const screened = pipeline.filter((row) => row.aiScore !== "Pending").length
  const locationGroups = Array.from(
    pipeline.reduce((groups, row) => {
      const location = row.location || "Remote"
      groups.set(location, (groups.get(location) ?? 0) + 1)
      return groups
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1])

  if (variant === "map") {
    return (
      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          {locationGroups.map(([location, count]) => (
            <article key={location} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "rgba(0, 186, 209, 0.1)", color: legacyTheme.info }}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: legacyTheme.text }}>{location}</h2>
                  <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{count} active candidates</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full" style={{ background: legacyTheme.selected }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(18, (count / Math.max(1, pipeline.length)) * 100)}%`, background: legacyTheme.info }} />
              </div>
            </article>
          ))}
        </div>

        <CandidateTable rows={pipeline} title="Location Candidate Map" />
      </section>
    )
  }

  if (variant === "candidates") {
    return (
      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {([
            ["Candidates", pipeline.length, Users, legacyTheme.primary],
            ["AI Screened", screened, BarChart3, legacyTheme.primary],
            ["Approved", approved, CheckCircle2, legacyTheme.primary],
            ["Needs Review", review, UserRoundCheck, legacyTheme.primary],
          ] satisfies StatCard[]).map(([label, value, Icon]) => (
            <article key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <Icon className="h-5 w-5" style={{ color: legacyTheme.primary }} />
              <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
            </article>
          ))}
        </div>

        <CandidateTable rows={pipeline} title="Candidate Management" />
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {([
          ["Total Applications", pipeline.length, BriefcaseBusiness, legacyTheme.primary],
          ["Approved", approved, CheckCircle2, legacyTheme.success],
          ["Review Queue", review, UserRoundCheck, legacyTheme.warning],
          ["Rejected", rejected, BarChart3, legacyTheme.error],
        ] satisfies StatCard[]).map(([label, value, Icon, color]) => (
          <article key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <Icon className="h-5 w-5" style={{ color }} />
            <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
          </article>
        ))}
      </div>

      <CandidateTable rows={pipeline} title="Application Dashboard" />
    </section>
  )
}

function CandidateTable({ rows, title }: { rows: PipelineRow[]; title: string }) {
  return (
    <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
      <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
        <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>{title}</h2>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead style={{ background: legacyTheme.body, color: legacyTheme.textSoft }}>
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">AI Match</th>
            <th className="px-4 py-3">Next Action</th>
            <th className="px-4 py-3">AI Summary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((candidate) => (
            <tr key={candidate.applicationId} className="border-t" style={{ borderColor: legacyTheme.divider }}>
              <td className="px-4 py-3">{candidate.code}</td>
              <td className="px-4 py-3 font-semibold" style={{ color: legacyTheme.text }}>{candidate.name}</td>
              <td className="px-4 py-3">{candidate.position}</td>
              <td className="px-4 py-3">{candidate.location ?? "Remote"}</td>
              <td className="px-4 py-3">
                <span className="rounded-full px-3 py-1 text-xs font-bold capitalize" style={statusTone(candidate.status)}>
                  {candidate.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full px-3 py-1 text-xs font-bold" style={scoreTone(candidate.aiScore)}>
                  {candidate.aiScore}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold" style={{ color: legacyTheme.primary }}>
                {nextAction(candidate)}
              </td>
              <td className="max-w-sm px-4 py-3" style={{ color: legacyTheme.textSoft }}>
                {candidate.aiSummary ?? "Awaiting AI screening"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  )
}
