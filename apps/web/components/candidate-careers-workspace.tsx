"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type CandidateJob = {
  title: string
  department: string
  location: string
  action: "Apply" | "Applied"
  applicants: number
  status?: string
}

export function CandidateCareersWorkspace({ jobs: initialJobs }: { jobs: CandidateJob[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [submittingJob, setSubmittingJob] = useState("")

  async function applyToJob(title: string) {
    setSubmittingJob(title)
    setNotice("")
    setError("")

    try {
      const response = await fetch("/api/candidate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: title }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Application submit failed.")
      }

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.title === title
            ? {
                ...job,
                action: "Applied",
                status: result.application?.status ?? "applied",
                applicants: job.action === "Applied" ? job.applicants : job.applicants + 1,
              }
            : job,
        ),
      )

      const applicationState = result.application?.isNewApplication ? "submitted" : "updated"
      const nextStep = result.application?.nextStep ? ` Next: ${result.application.nextStep}.` : ""
      setNotice(`${title} application ${applicationState}. AI match: ${result.application?.aiScore ?? "Pending"}.${nextStep}`)
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Application submit failed.")
    } finally {
      setSubmittingJob("")
    }
  }

  return (
    <section className="space-y-4">
      {notice ? (
        <p className="rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: "rgba(40, 199, 111, 0.24)", background: "rgba(40, 199, 111, 0.08)", color: legacyTheme.success }}>
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {jobs.map((job) => {
          const applied = job.action === "Applied"
          const submitting = submittingJob === job.title

          return (
            <div key={job.title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <div>
                <h2 className="font-bold" style={{ color: legacyTheme.text }}>{job.title}</h2>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>
                  {job.department} · {job.location} · {job.applicants} applicants{job.status ? ` · ${job.status}` : ""}
                </p>
              </div>
              <button
                onClick={() => !applied && applyToJob(job.title)}
                disabled={applied || submitting}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:shadow-none"
                style={{ background: applied ? "rgba(115, 103, 240, 0.12)" : legacyTheme.primary, color: applied ? legacyTheme.primary : "#fff" }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting..." : applied ? "Applied" : "Apply"}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
