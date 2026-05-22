"use client"

import { BadgeCheck, Briefcase, CalendarClock, FileText, UserRound } from "lucide-react"
import { useState } from "react"

import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { legacyTheme } from "@/lib/legacy-theme"
import { candidateNavigation } from "@/lib/workspace-navigation"

type CandidateDashboardData = {
  candidateName: string
  profileCompletion: number
  appliedJobs: number
  interviews: number
  documents: number
  checks: string
  jobs: Array<{
    title: string
    department: string
    location: string
    action: "Apply" | "Applied"
    applicants: number
  }>
}

export function CandidateDashboardClient({ data }: { data: CandidateDashboardData }) {
  const [jobs, setJobs] = useState(data.jobs)
  const [notice, setNotice] = useState("")
  const appliedCount = jobs.filter((job) => job.action === "Applied").length

  function handleApply(title: string) {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job.title === title ? { ...job, action: "Applied" } : job)),
    )
    setNotice(`${title} application marked as applied for this demo session.`)
  }

  return (
    <main className="min-h-screen" style={{ background: legacyTheme.body, color: legacyTheme.text }}>
      <WorkspaceSidebar brand="RecruitExe Candidate" groups={candidateNavigation} homeHref="/candidate/dashboard" />

      <section className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: legacyTheme.primary }}>Candidate Portal</p>
              <h1 className="text-3xl font-bold" style={{ color: legacyTheme.text }}>Welcome, {data.candidateName}</h1>
              <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>Supabase-backed candidate workspace</p>
            </div>
            <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }}>
              Profile {data.profileCompletion}% complete
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Applied Jobs", String(appliedCount || data.appliedJobs), Briefcase],
              ["Interviews", String(data.interviews), CalendarClock],
              ["Documents", String(data.documents), FileText],
              ["Profile Checks", data.checks, BadgeCheck],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
                <Icon className="h-6 w-6" style={{ color: legacyTheme.primary }} />
                <p className="mt-4 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
                <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value as string}</p>
              </div>
            ))}
          </div>

          {notice ? (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {notice}
            </p>
          ) : null}

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <h2 className="mb-4 text-xl font-bold" style={{ color: legacyTheme.text }}>Open Roles</h2>
              <div className="space-y-3">
                {jobs.map(({ title, department, location, action, applicants }) => (
                  <div key={title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4" style={{ borderColor: legacyTheme.divider }}>
                    <div>
                      <p className="font-semibold" style={{ color: legacyTheme.text }}>{title}</p>
                      <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{department} · {location} · {applicants} applicants</p>
                    </div>
                    <button
                      onClick={() => action === "Apply" && handleApply(title)}
                      disabled={action === "Applied"}
                      className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:text-[#7367F0]"
                      style={{ background: action === "Applied" ? "rgba(115, 103, 240, 0.12)" : legacyTheme.primary }}
                    >
                      {action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <UserRound className="h-7 w-7" style={{ color: legacyTheme.primary }} />
              <h2 className="mt-4 text-xl font-bold" style={{ color: legacyTheme.text }}>Next Steps</h2>
              <div className="mt-4 space-y-3 text-sm" style={{ color: legacyTheme.textSoft }}>
                <p>Complete address and education details.</p>
                <p>Upload updated resume and ID proof.</p>
                <p>Wait for HR interview schedule confirmation.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
