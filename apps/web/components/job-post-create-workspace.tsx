"use client"

import { useEffect, useMemo, useState } from "react"
import { BriefcaseBusiness, CheckCircle2, Copy, ExternalLink, Loader2, MapPin, Send, Sparkles } from "lucide-react"

import type { JobPostSetupData } from "@/lib/demo/recruitexe-data"
import { legacyTheme } from "@/lib/legacy-theme"

type JobPostCreateWorkspaceProps = {
  initialData: JobPostSetupData
}

type CreatedJob = {
  id: string
  title: string
  status: string
  openings: number
  department: string
  location: string
}

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"]

export function JobPostCreateWorkspace({ initialData }: JobPostCreateWorkspaceProps) {
  const [title, setTitle] = useState("Relationship Manager")
  const [department, setDepartment] = useState(initialData.departments[0]?.name ?? "Recruitment")
  const [location, setLocation] = useState(initialData.locations[0]?.name ?? "Mumbai")
  const [employmentType, setEmploymentType] = useState(employmentTypes[0])
  const [openings, setOpenings] = useState(3)
  const [summary, setSummary] = useState("Own hiring conversations, coordinate screening, and move qualified candidates quickly through RecruitExe automation.")
  const [skills, setSkills] = useState("Communication, BFSI hiring, CRM follow-up")
  const [status, setStatus] = useState<"draft" | "published">("published")
  const [recentJobs, setRecentJobs] = useState(initialData.recentJobs)
  const [createdJob, setCreatedJob] = useState<CreatedJob | null>(null)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [origin, setOrigin] = useState("")

  const previewSkills = useMemo(
    () => skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 8),
    [skills],
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  function publicRolePath(jobTitle: string) {
    return `/careers/recruitexe-demo?role=${encodeURIComponent(jobTitle)}`
  }

  function publicRoleUrl(jobTitle: string) {
    const path = publicRolePath(jobTitle)
    return origin ? `${origin}${path}` : path
  }

  async function copyPublicLink(jobTitle: string) {
    try {
      await navigator.clipboard.writeText(publicRoleUrl(jobTitle))
    } catch {
      // Some embedded browsers block clipboard access; the URL is visible for manual copy.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function createJob() {
    setSaving(true)
    setMessage("")
    setError("")
    setCreatedJob(null)
    setCopied(false)

    try {
      const response = await fetch("/api/hr/job-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department,
          location,
          employmentType,
          openings,
          summary,
          skills: previewSkills,
          status,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Job post create failed")
      }

      const nextJob: CreatedJob = {
        id: result.job.id,
        title: result.job.title,
        status: result.job.status,
        openings: result.job.openings,
        department: result.job.department,
        location: result.job.location,
      }

      setRecentJobs((currentJobs) => [
        { ...nextJob, applicants: 0 },
        ...currentJobs.slice(0, 7),
      ])
      setCreatedJob(nextJob)
      setMessage(`${result.job.title} ${result.job.status === "published" ? "published" : "saved as draft"} in Supabase.`)
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Job post create failed.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.95fr_0.75fr]">
      <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>Create Job Post</h2>
            <p className="text-sm" style={{ color: legacyTheme.textSoft }}>Company aur agency dono ke liye Supabase live job workflow.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Job title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Department</span>
            <input list="job-departments" value={department} onChange={(event) => setDepartment(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
            <datalist id="job-departments">
              {initialData.departments.map((option) => <option key={option.id} value={option.name} />)}
            </datalist>
          </label>
          <label className="block">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Location</span>
            <input list="job-locations" value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
            <datalist id="job-locations">
              {initialData.locations.map((option) => <option key={option.id} value={option.name} />)}
            </datalist>
          </label>
          <label className="block">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Employment type</span>
            <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }}>
              {employmentTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Openings</span>
            <input type="number" min={1} max={250} value={openings} onChange={(event) => setOpenings(Number(event.target.value))} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Role summary</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} className="mt-1 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Skills</span>
            <input value={skills} onChange={(event) => setSkills(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]" style={{ borderColor: legacyTheme.divider }} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg p-1" style={{ background: legacyTheme.body }}>
            {(["published", "draft"] as const).map((option) => (
              <button key={option} onClick={() => setStatus(option)} className={`rounded-md px-3 py-2 text-sm font-bold ${status === option ? "bg-white text-[#7367F0] shadow-sm" : "text-[#6b6578]"}`}>
                {option === "published" ? "Publish now" : "Save draft"}
              </button>
            ))}
          </div>
          <button onClick={createJob} disabled={saving || !title.trim()} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:bg-slate-400" style={{ background: saving ? undefined : legacyTheme.primary }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {saving ? "Saving..." : "Create Job"}
          </button>
        </div>

        {message ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{message}</p> : null}
        {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}

        {createdJob ? (
          <div className="mt-4 rounded-lg border bg-white p-4" style={{ borderColor: "rgba(40, 199, 111, 0.28)" }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold" style={{ color: legacyTheme.success }}>Supabase job ready</p>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>
                  {createdJob.title} {createdJob.status === "published" ? "public careers page pe share ke liye ready hai." : "draft me save hua hai; publish karoge tab public board pe dikhega."}
                </p>
                <p className="mt-3 rounded-md px-3 py-2 text-xs font-bold" style={{ background: legacyTheme.body, color: legacyTheme.primary }}>
                  {publicRoleUrl(createdJob.title)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyPublicLink(createdJob.title)}
                  className="inline-flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm font-bold"
                  style={{ borderColor: legacyTheme.divider, color: legacyTheme.primary }}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </button>
                <a
                  href={publicRolePath(createdJob.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-white"
                  style={{ background: legacyTheme.primary }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-5">
        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: legacyTheme.primary }} />
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Live Preview</h2>
          </div>
          <h3 className="text-xl font-bold" style={{ color: legacyTheme.text }}>{title || "Untitled role"}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: legacyTheme.textSoft }}><MapPin className="h-4 w-4" /> {department} · {location} · {openings || 1} openings</p>
          <p className="mt-4 text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {previewSkills.map((skill) => <span key={skill} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>{skill}</span>)}
          </div>
        </article>

        <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" style={{ color: legacyTheme.success }} />
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Recent Jobs</h2>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="rounded-lg border p-3" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold" style={{ color: legacyTheme.text }}>{job.title}</p>
                    <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{job.department} · {job.location}</p>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: job.status === "published" ? "rgba(40, 199, 111, 0.12)" : "rgba(255, 159, 67, 0.12)", color: job.status === "published" ? legacyTheme.success : legacyTheme.warning }}>{job.status}</span>
                </div>
                <p className="mt-2 text-xs font-semibold" style={{ color: legacyTheme.textMuted }}>{job.openings} openings · {job.applicants} applicants</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
