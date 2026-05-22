"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, Copy, ExternalLink, Link2, Users } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type CustomerLinksWorkspaceProps = {
  slug: string
  organizationName: string
  jobs: Array<{ title: string; applicants: number }>
}

export function CustomerLinksWorkspace({ slug, organizationName, jobs }: CustomerLinksWorkspaceProps) {
  const [copied, setCopied] = useState("")
  const [origin, setOrigin] = useState("")
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

  async function copyLink(path: string) {
    const value = `${origin}${path}`
    await navigator.clipboard.writeText(value)
    setCopied(path)
    window.setTimeout(() => setCopied(""), 1600)
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

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <article key={link.href} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold" style={{ color: legacyTheme.text }}>{link.label}</h3>
                <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{link.description}</p>
                <p className="mt-4 rounded-md px-3 py-2 text-sm font-semibold" style={{ background: legacyTheme.body, color: legacyTheme.primary }}>
                  {origin}{link.href}
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
                <Link
                  href={link.href}
                  className="grid h-10 w-10 place-items-center rounded-md text-white"
                  style={{ background: legacyTheme.primary }}
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

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
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
