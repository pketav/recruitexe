"use client"

import { useMemo, useState } from "react"
import { Bot, Building2, CalendarClock, CheckCircle2, Linkedin, Send, ShieldCheck, Sparkles, Users } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"
import type { LinkedInIntegrationSettings } from "@/lib/demo/recruitexe-data"

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
  initialSettings?: LinkedInIntegrationSettings
}

const tones = ["Professional", "Energetic", "Premium", "Urgent hiring"]

export function LinkedInAiWorkspace({ jobs, initialSettings }: LinkedInAiWorkspaceProps) {
  const [organizationMode, setOrganizationMode] = useState<"company" | "agency">(initialSettings?.organizationMode ?? "company")
  const [companyName, setCompanyName] = useState(initialSettings?.workspaceName ?? "Fincoopers RecruitExe Demo")
  const [clientName, setClientName] = useState(initialSettings?.defaultClientName ?? "Client BFSI Brand")
  const [selectedJob, setSelectedJob] = useState(jobs[0]?.title ?? "Credit Officer")
  const [tone, setTone] = useState(initialSettings?.defaultTone ?? tones[0])
  const [notes, setNotes] = useState("Highlight fast screening, clear career growth, and quick HR response.")
  const [approvalRequired, setApprovalRequired] = useState(initialSettings?.approvalRequired ?? true)
  const [autoSchedule, setAutoSchedule] = useState(initialSettings?.autoSchedule ?? false)
  const [linkedinAccountName, setLinkedinAccountName] = useState(initialSettings?.linkedinAccountName ?? "")
  const [linkedinAccessToken, setLinkedinAccessToken] = useState("")
  const [settings, setSettings] = useState<LinkedInIntegrationSettings | undefined>(initialSettings)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  const selectedJobData = useMemo(
    () => jobs.find((job) => job.title === selectedJob) ?? jobs[0],
    [jobs, selectedJob],
  )
  const selectedDraft = drafts[selectedDraftIndex]

  async function saveSettings() {
    setSavingSettings(true)
    setStatus("")

    try {
      const response = await fetch("/api/hr/linkedin-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationMode,
          workspaceName: companyName,
          defaultClientName: clientName,
          defaultTone: tone,
          approvalRequired,
          autoSchedule,
          linkedinAccountName,
          linkedinAccessToken,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Settings save failed")
      }

      setSettings(result.settings)
      setLinkedinAccessToken("")
      setStatus("LinkedIn/Gemini setup Supabase organization settings me saved.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "LinkedIn setup save failed.")
    } finally {
      setSavingSettings(false)
    }
  }

  async function disconnectLinkedIn() {
    setSavingSettings(true)
    setStatus("")

    try {
      const response = await fetch("/api/hr/linkedin-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationMode,
          workspaceName: companyName,
          defaultClientName: clientName,
          defaultTone: tone,
          approvalRequired,
          autoSchedule,
          linkedinAccountName,
          clearLinkedinToken: true,
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Disconnect failed")
      }

      setSettings(result.settings)
      setStatus("LinkedIn token removed from Supabase settings.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "LinkedIn disconnect failed.")
    } finally {
      setSavingSettings(false)
    }
  }

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
      organizationMode === "agency" || approvalRequired
        ? "Draft moved to client approval queue. LinkedIn posting will run after approval and OAuth connection."
        : "Draft queued for LinkedIn scheduling. OAuth token stays backend-side.",
    )
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
              <Linkedin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>LinkedIn AI Post Setup</h2>
              <p className="text-sm" style={{ color: legacyTheme.textSoft }}>Company aur agency dono ke liye dynamic workflow.</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg p-1" style={{ background: legacyTheme.body }}>
            {[
              ["company", Building2, "Company"],
              ["agency", Users, "Recruitment Agency"],
            ].map(([value, Icon, label]) => (
              <button
                key={value as string}
                onClick={() => setOrganizationMode(value as "company" | "agency")}
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${
                  organizationMode === value ? "bg-white text-[#7367F0] shadow-sm" : "text-[#6b6578]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Workspace name</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Client name</span>
              <input
                value={clientName}
                disabled={organizationMode === "company"}
                onChange={(event) => setClientName(event.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none disabled:bg-[#F8F7FA] disabled:text-slate-400 focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Job</span>
              <select
                value={selectedJob}
                onChange={(event) => setSelectedJob(event.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              >
                {jobs.map((job) => (
                  <option key={job.title} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>Tone</span>
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              >
                {tones.map((toneOption) => (
                  <option key={toneOption}>{toneOption}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>AI instructions</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
              style={{ borderColor: legacyTheme.divider }}
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={generateDrafts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-[0_2px_6px_rgba(115,103,240,0.35)] disabled:bg-slate-400"
              style={{ background: loading ? undefined : legacyTheme.primary }}
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate with backend AI"}
            </button>
            <button
              onClick={markScheduled}
              disabled={!selectedDraft}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-bold disabled:text-slate-300"
              style={{ borderColor: legacyTheme.divider, color: selectedDraft ? legacyTheme.primary : undefined }}
            >
              <CalendarClock className="h-4 w-4" />
              {organizationMode === "agency" ? "Send for approval" : "Queue schedule"}
            </button>
            <button
              onClick={saveSettings}
              disabled={savingSettings}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-bold disabled:text-slate-300"
              style={{ borderColor: legacyTheme.divider, color: savingSettings ? undefined : legacyTheme.primary }}
            >
              <ShieldCheck className="h-4 w-4" />
              {savingSettings ? "Saving..." : "Save setup"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <h2 className="mb-4 text-xl font-bold" style={{ color: legacyTheme.text }}>System Setup</h2>
          <div className="space-y-3">
            {[
              ["Gemini key", settings?.geminiConfigured ? "Configured in backend env" : "Missing backend env, fallback draft active", Bot],
              [
                "LinkedIn token",
                settings?.linkedinConnected
                  ? `Connected${settings.linkedinTokenLastFour ? ` · token ends ${settings.linkedinTokenLastFour}` : ""}`
                  : "Not connected yet. Paste token once; UI will not show it again.",
                ShieldCheck,
              ],
              ["Mode", organizationMode === "agency" ? "Agency with client approval" : "Company direct posting", CheckCircle2],
              ["Selected job", `${selectedJobData?.title ?? selectedJob} · ${selectedJobData?.applicants ?? 0} applicants`, Send],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="flex gap-3 rounded-lg border p-3" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body }}>
                <Icon className="mt-0.5 h-5 w-5" style={{ color: legacyTheme.primary }} />
                <div>
                  <p className="font-semibold" style={{ color: legacyTheme.text }}>{label as string}</p>
                  <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{value as string}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border p-4 text-sm" style={{ borderColor: "rgba(0, 186, 209, 0.24)", background: "rgba(0, 186, 209, 0.08)", color: "#006B78" }}>
            OAuth vault connect hote hi posting live hogi. Temporary token input raw value ko UI ya Git me expose nahi karta; system sirf connected metadata dikhata hai.
          </div>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>LinkedIn account name</span>
              <input
                value={linkedinAccountName}
                onChange={(event) => setLinkedinAccountName(event.target.value)}
                placeholder="Company page or profile name"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold" style={{ color: legacyTheme.textSoft }}>LinkedIn access token</span>
              <input
                value={linkedinAccessToken}
                onChange={(event) => setLinkedinAccessToken(event.target.value)}
                placeholder="Paste once to mark connection metadata"
                type="password"
                autoComplete="off"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#7367F0]"
                style={{ borderColor: legacyTheme.divider }}
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg border bg-white p-3 text-sm font-semibold" style={{ borderColor: legacyTheme.divider, color: legacyTheme.text }}>
                <input type="checkbox" checked={approvalRequired} onChange={(event) => setApprovalRequired(event.target.checked)} />
                Client approval required
              </label>
              <label className="flex items-center gap-2 rounded-lg border bg-white p-3 text-sm font-semibold" style={{ borderColor: legacyTheme.divider, color: legacyTheme.text }}>
                <input type="checkbox" checked={autoSchedule} onChange={(event) => setAutoSchedule(event.target.checked)} />
                Auto schedule after approval
              </label>
            </div>
            {settings?.linkedinConnected ? (
              <button
                onClick={disconnectLinkedIn}
                disabled={savingSettings}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-bold disabled:text-slate-300"
                style={{ borderColor: legacyTheme.divider, color: legacyTheme.error }}
              >
                <ShieldCheck className="h-4 w-4" />
                Disconnect LinkedIn token
              </button>
            ) : null}
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
                  selectedDraftIndex === index ? "border-[#7367F0] bg-white" : "bg-[#F8F7FA]"
                }`}
                style={{ borderColor: selectedDraftIndex === index ? legacyTheme.primary : legacyTheme.divider }}
              >
                <p className="font-bold" style={{ color: legacyTheme.text }}>{draft.title}</p>
                <p className="mt-1 line-clamp-2 text-sm" style={{ color: legacyTheme.textSoft }}>{draft.content}</p>
              </button>
            ))}
          </div>

          {selectedDraft ? (
            <article className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>{selectedDraft.title}</h2>
                <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>LinkedIn Draft</span>
              </div>
              <p className="whitespace-pre-line text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{selectedDraft.content}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedDraft.hashtags.map((hashtag) => (
                  <span key={hashtag} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>
                    {hashtag}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm font-bold" style={{ color: legacyTheme.text }}>CTA: {selectedDraft.cta}</p>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
