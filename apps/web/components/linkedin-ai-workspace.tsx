"use client"

import { useMemo, useState } from "react"
import { Bot, Building2, CalendarClock, CheckCircle2, Linkedin, Send, ShieldCheck, Sparkles, Users } from "lucide-react"

type JobOption = {
  title: string
  applicants: number
}

type Draft = {
  title: string
  content: string
  cta: string
  hashtags: string[]
}

type LinkedInAiWorkspaceProps = {
  jobs: JobOption[]
}

const tones = ["Professional", "Energetic", "Premium", "Urgent hiring"]

export function LinkedInAiWorkspace({ jobs }: LinkedInAiWorkspaceProps) {
  const [organizationMode, setOrganizationMode] = useState<"company" | "agency">("company")
  const [companyName, setCompanyName] = useState("Fincoopers RecruitExe Demo")
  const [clientName, setClientName] = useState("Client BFSI Brand")
  const [selectedJob, setSelectedJob] = useState(jobs[0]?.title ?? "Credit Officer")
  const [tone, setTone] = useState(tones[0])
  const [notes, setNotes] = useState("Highlight fast screening, clear career growth, and quick HR response.")
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedJobData = useMemo(
    () => jobs.find((job) => job.title === selectedJob) ?? jobs[0],
    [jobs, selectedJob],
  )
  const selectedDraft = drafts[selectedDraftIndex]

  async function generateDrafts() {
    setLoading(true)
    setStatus("")

    try {
      const response = await fetch("/api/ai/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationMode,
          companyName,
          clientName,
          jobTitle: selectedJob,
          location: "India",
          tone,
          audience: "qualified candidates and hiring network",
          notes,
        }),
      })
      const result = await response.json()
      setDrafts(result.drafts ?? [])
      setSelectedDraftIndex(0)
      setStatus(result.provider === "gemini" ? "Gemini AI draft generated." : "Server fallback draft generated. Add Gemini key in backend env for live AI.")
    } catch {
      setStatus("Draft generation failed. Please retry after backend check.")
    } finally {
      setLoading(false)
    }
  }

  function markScheduled() {
    setStatus(
      organizationMode === "agency"
        ? "Draft moved to client approval queue. LinkedIn posting will run after approval and OAuth connection."
        : "Draft queued for LinkedIn scheduling. OAuth token stays backend-side.",
    )
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Linkedin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">LinkedIn AI Post Setup</h2>
              <p className="text-sm text-slate-500">Company aur agency dono ke liye dynamic workflow.</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {[
              ["company", Building2, "Company"],
              ["agency", Users, "Recruitment Agency"],
            ].map(([value, Icon, label]) => (
              <button
                key={value as string}
                onClick={() => setOrganizationMode(value as "company" | "agency")}
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${
                  organizationMode === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Workspace name</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Client name</span>
              <input
                value={clientName}
                disabled={organizationMode === "company"}
                onChange={(event) => setClientName(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 focus:border-slate-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Job</span>
              <select
                value={selectedJob}
                onChange={(event) => setSelectedJob(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              >
                {jobs.map((job) => (
                  <option key={job.title} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tone</span>
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
              >
                {tones.map((toneOption) => (
                  <option key={toneOption}>{toneOption}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">AI instructions</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={generateDrafts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:bg-slate-400"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate with backend AI"}
            </button>
            <button
              onClick={markScheduled}
              disabled={!selectedDraft}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:text-slate-300"
            >
              <CalendarClock className="h-4 w-4" />
              {organizationMode === "agency" ? "Send for approval" : "Queue schedule"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">System Setup</h2>
          <div className="space-y-3">
            {[
              ["Gemini key", "Backend env only", Bot],
              ["LinkedIn token", "OAuth token stored server-side, not pasted in browser", ShieldCheck],
              ["Mode", organizationMode === "agency" ? "Agency with client approval" : "Company direct posting", CheckCircle2],
              ["Selected job", `${selectedJobData?.title ?? selectedJob} · ${selectedJobData?.applicants ?? 0} applicants`, Send],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Icon className="mt-0.5 h-5 w-5 text-slate-700" />
                <div>
                  <p className="font-semibold">{label as string}</p>
                  <p className="text-sm text-slate-500">{value as string}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Connect LinkedIn button will open OAuth. Client secret aur access token backend mein rahenge; frontend sirf connected status dekhega.
          </div>
        </div>
      </div>

      {status ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {status}
        </p>
      ) : null}

      {drafts.length ? (
        <div className="grid gap-4 lg:grid-cols-[0.46fr_1fr]">
          <div className="space-y-2">
            {drafts.map((draft, index) => (
              <button
                key={`${draft.title}-${index}`}
                onClick={() => setSelectedDraftIndex(index)}
                className={`w-full rounded-lg border p-4 text-left ${
                  selectedDraftIndex === index ? "border-slate-950 bg-white" : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="font-bold">{draft.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{draft.content}</p>
              </button>
            ))}
          </div>

          {selectedDraft ? (
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{selectedDraft.title}</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">LinkedIn Draft</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{selectedDraft.content}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedDraft.hashtags.map((hashtag) => (
                  <span key={hashtag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {hashtag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm font-bold text-slate-950">CTA: {selectedDraft.cta}</p>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
