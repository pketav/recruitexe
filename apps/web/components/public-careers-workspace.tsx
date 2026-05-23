"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BriefcaseBusiness, CheckCircle2, MapPin, Search, Send, Sparkles, Users } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type PublicCareerJob = {
  title: string
  department: string
  location: string
  openings: number
  applicants: number
  summary: string
  skills: string[]
}

type PublicCareersWorkspaceProps = {
  organization: {
    name: string
    slug: string
    industry: string | null
    organization_type: string | null
  }
  jobs: PublicCareerJob[]
  departments: string[]
  locations: string[]
}

export function PublicCareersWorkspace({ organization, jobs, departments, locations }: PublicCareersWorkspaceProps) {
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState("all")
  const [location, setLocation] = useState("all")
  const [selectedJob, setSelectedJob] = useState("")
  const [applicant, setApplicant] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentLocation: "",
    resumeUrl: "",
  })
  const [applyingJob, setApplyingJob] = useState("")
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role")

    if (role) {
      setQuery(role)
    }
  }, [])

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesQuery = `${job.title} ${job.summary} ${job.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())
        const matchesDepartment = department === "all" || job.department === department
        const matchesLocation = location === "all" || job.location === location

        return matchesQuery && matchesDepartment && matchesLocation
      }),
    [department, jobs, location, query],
  )

  async function applyToJob(jobTitle: string) {
    setApplyingJob(jobTitle)
    setNotice("")
    setError("")

    try {
      const response = await fetch("/api/candidate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationSlug: organization.slug,
          jobTitle,
          ...applicant,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? "Application submit failed.")
      }

      setAppliedJobs((current) => new Set(current).add(jobTitle))
      const applicationState = result.application?.isNewApplication ? "Application submitted" : "Application updated"
      const nextStep = result.application?.nextStep ? ` Next: ${result.application.nextStep}.` : ""
      setNotice(`${applicationState} for ${result.application?.candidateName ?? "Candidate"} on ${jobTitle}. AI match: ${result.application?.aiScore ?? "Pending"}.${nextStep}`)
      setSelectedJob("")
      setApplicant({ fullName: "", email: "", phone: "", currentLocation: "", resumeUrl: "" })
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Application submit failed.")
    } finally {
      setApplyingJob("")
    }
  }

  return (
    <main className="min-h-screen" style={{ background: legacyTheme.body, color: legacyTheme.text }}>
      <nav className="border-b bg-white px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/vector.svg" alt="RecruitExe" className="h-8 w-8" />
            <img src="/VectorName.svg" alt="" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>
            <span>{organization.name}</span>
            <span className="rounded-full px-3 py-1 text-xs" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
              {organization.organization_type ?? "workspace"}
            </span>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <p className="text-sm font-semibold" style={{ color: legacyTheme.primary }}>Careers Workspace</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight" style={{ color: legacyTheme.text }}>{organization.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6" style={{ color: legacyTheme.textSoft }}>
              Open roles, AI assisted application intake, and agency/company hiring pipeline powered by RecruitExe.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" style={{ color: legacyTheme.primary }} />
              <p className="font-bold">Live openings</p>
            </div>
            <p className="mt-3 text-3xl font-bold">{jobs.length}</p>
            <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{organization.industry ?? "Recruitment"} hiring board</p>
          </div>
        </div>

        <section className="mt-6 rounded-lg border bg-white p-4 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="grid gap-3 md:grid-cols-[1fr_0.25fr_0.25fr]">
            <label className="flex h-11 items-center gap-3 rounded-md border px-3" style={{ borderColor: legacyTheme.divider }}>
              <Search className="h-4 w-4" style={{ color: legacyTheme.textMuted }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search role, skill, summary"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <select value={department} onChange={(event) => setDepartment(event.target.value)} className="h-11 rounded-md border bg-white px-3 text-sm outline-none" style={{ borderColor: legacyTheme.divider }}>
              <option value="all">All departments</option>
              {departments.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-11 rounded-md border bg-white px-3 text-sm outline-none" style={{ borderColor: legacyTheme.divider }}>
              <option value="all">All locations</option>
              {locations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </section>

        {notice ? (
          <p className="mt-5 rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: "rgba(40, 199, 111, 0.24)", background: "rgba(40, 199, 111, 0.08)", color: legacyTheme.success }}>
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <section className="mt-6 grid gap-4">
          {filteredJobs.map((job) => {
            const applied = appliedJobs.has(job.title)

            return (
              <article key={job.title} className="rounded-lg border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: legacyTheme.divider }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>{job.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(0, 186, 209, 0.1)", color: "#007987" }}>
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(255, 159, 67, 0.14)", color: "#B85F00" }}>
                        <Users className="h-3.5 w-3.5" />
                        {job.applicants} applicants
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{job.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span key={skill} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: legacyTheme.selected, color: legacyTheme.textSoft }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob((current) => current === job.title ? "" : job.title)}
                    disabled={applied}
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:shadow-none"
                    style={{ background: applied ? "rgba(115, 103, 240, 0.12)" : legacyTheme.primary, color: applied ? legacyTheme.primary : "#fff" }}
                  >
                    {applied ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    {applied ? "Applied" : selectedJob === job.title ? "Close" : "Apply"}
                  </button>
                </div>
                {selectedJob === job.title && !applied ? (
                  <form
                    className="mt-5 grid gap-3 border-t pt-5 md:grid-cols-2"
                    style={{ borderColor: legacyTheme.divider }}
                    onSubmit={(event) => {
                      event.preventDefault()
                      applyToJob(job.title)
                    }}
                  >
                    <input
                      required
                      value={applicant.fullName}
                      onChange={(event) => setApplicant((current) => ({ ...current, fullName: event.target.value }))}
                      placeholder="Full name"
                      className="h-11 rounded-md border px-3 text-sm outline-none focus:border-[#7367F0]"
                      style={{ borderColor: legacyTheme.divider }}
                    />
                    <input
                      required
                      type="email"
                      value={applicant.email}
                      onChange={(event) => setApplicant((current) => ({ ...current, email: event.target.value }))}
                      placeholder="Email"
                      className="h-11 rounded-md border px-3 text-sm outline-none focus:border-[#7367F0]"
                      style={{ borderColor: legacyTheme.divider }}
                    />
                    <input
                      value={applicant.phone}
                      onChange={(event) => setApplicant((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="Phone"
                      className="h-11 rounded-md border px-3 text-sm outline-none focus:border-[#7367F0]"
                      style={{ borderColor: legacyTheme.divider }}
                    />
                    <input
                      value={applicant.currentLocation}
                      onChange={(event) => setApplicant((current) => ({ ...current, currentLocation: event.target.value }))}
                      placeholder="Current location"
                      className="h-11 rounded-md border px-3 text-sm outline-none focus:border-[#7367F0]"
                      style={{ borderColor: legacyTheme.divider }}
                    />
                    <input
                      value={applicant.resumeUrl}
                      onChange={(event) => setApplicant((current) => ({ ...current, resumeUrl: event.target.value }))}
                      placeholder="Resume link"
                      className="h-11 rounded-md border px-3 text-sm outline-none focus:border-[#7367F0] md:col-span-2"
                      style={{ borderColor: legacyTheme.divider }}
                    />
                    <button
                      disabled={applyingJob === job.title}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:bg-slate-400 md:col-span-2"
                      style={{ background: applyingJob === job.title ? undefined : legacyTheme.primary }}
                    >
                      <Send className="h-4 w-4" />
                      {applyingJob === job.title ? "Submitting..." : "Submit application"}
                    </button>
                  </form>
                ) : null}
              </article>
            )
          })}
        </section>
      </section>
    </main>
  )
}
