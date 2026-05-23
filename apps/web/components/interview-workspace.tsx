"use client"

import { CalendarClock, CheckCircle2, Clock3, PhoneCall, UserRoundCheck, Video } from "lucide-react"

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

type InterviewWorkspaceProps = {
  pipeline: PipelineRow[]
  variant: "monitor" | "call-logs"
}

function scoreValue(score: string) {
  const value = Number(score.replace("%", ""))
  return Number.isNaN(value) ? 0 : value
}

function buildInterviewRows(pipeline: PipelineRow[]) {
  return pipeline
    .filter((row) => ["approved", "review", "pending"].includes(row.status))
    .map((row, index) => {
      const score = scoreValue(row.aiScore)
      const scheduledDay = index + 1

      return {
        ...row,
        interviewMode: score >= 85 ? "Video" : "Telephonic",
        interviewStatus: row.status === "approved" ? "scheduled" : "pending",
        scheduledFor: row.status === "approved" ? `Day ${scheduledDay} · 11:30 AM` : "Awaiting HR slot",
        interviewer: score >= 85 ? "Senior HR Panel" : "Recruiter Desk",
        callOutcome: row.status === "approved" ? "Connected" : row.status === "review" ? "Follow-up required" : "Pending call",
      }
    })
}

export function InterviewWorkspace({ pipeline, variant }: InterviewWorkspaceProps) {
  const rows = buildInterviewRows(pipeline)
  const scheduled = rows.filter((row) => row.interviewStatus === "scheduled").length
  const pending = rows.filter((row) => row.interviewStatus === "pending").length
  const telephonic = rows.filter((row) => row.interviewMode === "Telephonic").length
  const video = rows.filter((row) => row.interviewMode === "Video").length

  if (variant === "call-logs") {
    return (
      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Total Calls", rows.length, PhoneCall, legacyTheme.primary],
            ["Connected", scheduled, CheckCircle2, legacyTheme.success],
            ["Follow-up", pending, Clock3, legacyTheme.warning],
            ["Telephonic", telephonic, PhoneCall, legacyTheme.info],
          ].map(([label, value, Icon, color]) => (
            <article key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <Icon className="h-5 w-5" style={{ color: color as string }} />
              <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
              <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value as number}</p>
            </article>
          ))}
        </div>

        <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Telephonic Call Logs</h2>
          </div>
          <InterviewTable rows={rows} mode="calls" />
        </section>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Scheduled", scheduled, CalendarClock, legacyTheme.success],
          ["Pending Slots", pending, Clock3, legacyTheme.warning],
          ["Video Interviews", video, Video, legacyTheme.primary],
          ["HR Review Queue", rows.length, UserRoundCheck, legacyTheme.info],
        ].map(([label, value, Icon, color]) => (
          <article key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <Icon className="h-5 w-5" style={{ color: color as string }} />
            <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
            <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value as number}</p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
          <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Interview Monitor</h2>
        </div>
        <InterviewTable rows={rows} mode="monitor" />
      </section>
    </section>
  )
}

function InterviewTable({
  rows,
  mode,
}: {
  rows: ReturnType<typeof buildInterviewRows>
  mode: "monitor" | "calls"
}) {
  return (
    <table className="w-full text-left text-sm">
      <thead style={{ background: legacyTheme.body, color: legacyTheme.textSoft }}>
        <tr>
          <th className="px-4 py-3">Candidate</th>
          <th className="px-4 py-3">Role</th>
          <th className="px-4 py-3">{mode === "calls" ? "Call Type" : "Mode"}</th>
          <th className="px-4 py-3">{mode === "calls" ? "Outcome" : "Schedule"}</th>
          <th className="px-4 py-3">Owner</th>
          <th className="px-4 py-3">AI Match</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.applicationId} className="border-t" style={{ borderColor: legacyTheme.divider }}>
            <td className="px-4 py-3">
              <p className="font-semibold" style={{ color: legacyTheme.text }}>{row.name}</p>
              <p className="text-xs" style={{ color: legacyTheme.textMuted }}>{row.code} · {row.location ?? "Remote"}</p>
            </td>
            <td className="px-4 py-3">{row.position}</td>
            <td className="px-4 py-3">{row.interviewMode}</td>
            <td className="px-4 py-3">{mode === "calls" ? row.callOutcome : row.scheduledFor}</td>
            <td className="px-4 py-3">{row.interviewer}</td>
            <td className="px-4 py-3">
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>
                {row.aiScore}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
