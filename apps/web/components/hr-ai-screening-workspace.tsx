"use client"

import { useState } from "react"
import { BrainCircuit, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type PipelineRow = {
  applicationId: string
  code: string
  name: string
  position: string
  status: string
  aiScore: string
  aiSummary?: string
}

type ScreeningResult = {
  applicationId: string
  candidateName: string
  candidateCode: string
  jobTitle: string
  status: string
  aiScore: string
  aiSummary?: string
}

type HrAiScreeningWorkspaceProps = {
  pipeline: PipelineRow[]
}

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

export function HrAiScreeningWorkspace({ pipeline }: HrAiScreeningWorkspaceProps) {
  const [rows, setRows] = useState(pipeline)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function runScreening() {
    setLoading(true)
    setStatus("")
    setError("")

    try {
      const response = await fetch("/api/hr/ai-screening", { method: "POST" })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "AI screening failed.")
      }

      const screenedById = new Map<string, ScreeningResult>(
        (result.screened ?? []).map((screened: ScreeningResult) => [screened.applicationId, screened]),
      )

      setRows((currentRows) =>
        currentRows.map((row) => {
          const screened = screenedById.get(row.applicationId)

          if (!screened) {
            return row
          }

          return {
            ...row,
            status: screened.status,
            aiScore: screened.aiScore,
            aiSummary: screened.aiSummary,
          }
        }),
      )
      setStatus(
        result.screenedCount
          ? `${result.screenedCount} applications screened. Provider: ${result.provider}.`
          : "All visible applications already have final AI screening status.",
      )
    } catch (screeningError) {
      setError(screeningError instanceof Error ? screeningError.message : "AI screening failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr]">
        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>AI Screening Queue</h2>
                <p className="text-sm" style={{ color: legacyTheme.textSoft }}>Pending, applied, aur review candidates ko score karke HR decision status update karta hai.</p>
              </div>
            </div>
            <button
              onClick={runScreening}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:opacity-70"
              style={{ background: legacyTheme.primary }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Screening..." : "Run AI Screening"}
            </button>
          </div>

          {status ? (
            <p className="mt-4 rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: "rgba(40, 199, 111, 0.24)", background: "rgba(40, 199, 111, 0.08)", color: legacyTheme.success }}>
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" style={{ color: legacyTheme.primary }} />
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Screening Rules</h2>
          </div>
          <div className="space-y-3 text-sm" style={{ color: legacyTheme.textSoft }}>
            <p>Gemini key backend env me rahegi; frontend me secret expose nahi hota.</p>
            <p>Key absent ho to rules fallback score deta hai so live workflow broken nahi hota.</p>
            <p>Final statuses HR pipeline, metrics, and dashboard me refresh ke baad reflect hote hain.</p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
          <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Candidate Pipeline</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead style={{ background: legacyTheme.body, color: legacyTheme.textSoft }}>
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">AI Match</th>
              <th className="px-4 py-3">AI Summary</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((candidate) => (
              <tr key={candidate.applicationId} className="border-t" style={{ borderColor: legacyTheme.divider }}>
                <td className="px-4 py-3">{candidate.code}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: legacyTheme.text }}>{candidate.name}</td>
                <td className="px-4 py-3">{candidate.position}</td>
                <td className="px-4 py-3 capitalize">{candidate.status}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-3 py-1 text-xs font-bold" style={scoreTone(candidate.aiScore)}>
                    {candidate.aiScore}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: legacyTheme.textSoft }}>
                  {candidate.aiSummary ?? "Awaiting AI screening"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Screened", rows.filter((row) => row.aiScore !== "Pending").length],
          ["Recommended", rows.filter((row) => Number(row.aiScore.replace("%", "")) >= 85).length],
          ["Needs Review", rows.filter((row) => row.status === "review").length],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <CheckCircle2 className="h-5 w-5" style={{ color: legacyTheme.primary }} />
            <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
            <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value as number}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
