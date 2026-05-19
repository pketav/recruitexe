"use client"

import Link from "next/link"
import { BadgeCheck, Briefcase, CalendarClock, FileText, UserRound } from "lucide-react"
import { useState } from "react"

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="text-2xl font-bold text-indigo-700">Fincoopers HRMS</Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <Link href="/candidate/dashboard">Dashboard</Link>
            <Link href="/candidate/login">Profile</Link>
            <Link href="/hr/login">HR Portal</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">Candidate Portal</p>
            <h1 className="text-3xl font-bold">Welcome, {data.candidateName}</h1>
            <p className="mt-1 text-sm text-slate-500">Supabase-backed candidate workspace</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
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
            <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-indigo-600" />
              <p className="mt-4 text-sm text-slate-500">{label as string}</p>
              <p className="text-2xl font-bold">{value as string}</p>
            </div>
          ))}
        </div>

        {notice ? (
          <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {notice}
          </p>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Open Roles</h2>
            <div className="space-y-3">
              {jobs.map(({ title, department, location, action, applicants }) => (
                <div key={title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-slate-500">{department} · {location} · {applicants} applicants</p>
                  </div>
                  <button
                    onClick={() => action === "Apply" && handleApply(title)}
                    disabled={action === "Applied"}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${action === "Applied" ? "bg-slate-100 text-slate-600" : "bg-indigo-950 text-white"}`}
                  >
                    {action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <UserRound className="h-7 w-7 text-indigo-600" />
            <h2 className="mt-4 text-xl font-bold">Next Steps</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Complete address and education details.</p>
              <p>Upload updated resume and ID proof.</p>
              <p>Wait for HR interview schedule confirmation.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
