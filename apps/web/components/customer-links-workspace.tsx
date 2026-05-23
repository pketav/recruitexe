"use client"

import { useEffect, useMemo, useState } from "react"
import { BriefcaseBusiness, Check, Copy, ExternalLink, Link2, ShieldCheck, Users } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type CustomerLinksWorkspaceProps = {
  slug: string
  organizationName: string
  jobs: Array<{ title: string; applicants: number }>
}

export function CustomerLinksWorkspace({ slug, organizationName, jobs }: CustomerLinksWorkspaceProps) {
  const [copied, setCopied] = useState("")
  const [origin, setOrigin] = useState("")
  const [copyStatus, setCopyStatus] = useState("")
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
  const links = useMemo(
    () => [
      {
        label: "Public careers link",
        href: `/careers/${slug}`,
        description: "Candidate-facing opening board for companies and agency clients.",
      },
      {
        label: "Legacy customer link",
        href: `/CareerPage/${slug}`,
        description: "Old shared links keep working and redirect into the clean route.",
      },
    ],
    [slug],
  )

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  function fullUrl(path: string) {
    return origin ? `${origin}${path}` : path
  }

  async function copyLink(path: string) {
    const value = fullUrl(path)

    try {
      await navigator.clipboard.writeText(value)
      setCopied(path)
      setCopyStatus("Link copied.")
    } catch {
      setCopyStatus(value)
    }

    window.setTimeout(() => {
      setCopied("")
      setCopyStatus("")
    }, 2200)
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
              <Link2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: legacyTheme.text }}>Customer Workspace Links</h2>
              <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>
                {organizationName} ke public hiring links, company aur recruitment agency dono ke liye.
              </p>
            </div>
          </div>
          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }}>
            {jobs.length} live roles
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Customer links", value: links.length, icon: Link2 },
          { label: "Live roles", value: jobs.length, icon: BriefcaseBusiness },
          { label: "Applicants visible", value: totalApplicants, icon: Users },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div>
              <p className="text-xs font-bold uppercase" style={{ color: legacyTheme.textMuted }}>{item.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: legacyTheme.text }}>{item.value}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "rgba(115, 103, 240, 0.1)", color: legacyTheme.primary }}>
              <item.icon className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <article key={link.href} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold" style={{ color: legacyTheme.text }}>{link.label}</h3>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{link.description}</p>
                <p className="mt-4 rounded-md px-3 py-2 text-sm font-semibold" style={{ background: legacyTheme.body, color: legacyTheme.primary }}>
                  {fullUrl(link.href)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(link.href)}
                  className="grid h-10 w-10 place-items-center rounded-md border bg-white"
                  style={{ borderColor: legacyTheme.divider, color: legacyTheme.primary }}
                  title="Copy link"
                >
                  {copied === link.href ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-md text-white"
                  style={{ background: legacyTheme.primary }}
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {copyStatus ? (
        <p className="rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: "rgba(115, 103, 240, 0.22)", background: "rgba(115, 103, 240, 0.08)", color: legacyTheme.primary }}>
          {copyStatus}
        </p>
      ) : null}

      <section className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" style={{ color: legacyTheme.success }} />
          <h3 className="font-bold" style={{ color: legacyTheme.text }}>Handoff Readiness</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Company and agency customers can use the same public board.",
            "Legacy shared links stay active through redirect compatibility.",
            "Candidate apply flow writes directly into Supabase pipeline.",
            "Role cards below are ready for LinkedIn or direct client sharing.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body, color: legacyTheme.textSoft }}>
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: legacyTheme.success }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: legacyTheme.primary }} />
          <h3 className="font-bold" style={{ color: legacyTheme.text }}>Published Roles</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.title} className="rounded-lg border p-4" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body }}>
              <p className="font-semibold" style={{ color: legacyTheme.text }}>{job.title}</p>
              <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{job.applicants} applicants</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => copyLink(`/careers/${slug}?role=${encodeURIComponent(job.title)}`)}
                  className="inline-flex h-9 items-center gap-2 rounded-md border bg-white px-3 text-xs font-bold"
                  style={{ borderColor: legacyTheme.divider, color: legacyTheme.primary }}
                >
                  {copied === `/careers/${slug}?role=${encodeURIComponent(job.title)}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy role link
                </button>
                <a
                  href={`/careers/${slug}?role=${encodeURIComponent(job.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-md text-white"
                  style={{ background: legacyTheme.primary }}
                  title="Open role link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
