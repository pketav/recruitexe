"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusiness, Building2, Command, Files, Home, Menu, ShieldCheck, UserRound, X } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"
import type { WorkspaceGroup } from "@/lib/workspace-navigation"

type WorkspaceSidebarProps = {
  brand: string
  groups: WorkspaceGroup[]
  homeHref: string
}

const groupIcons = [Home, BriefcaseBusiness, Building2, Command, Files, ShieldCheck, UserRound]

export function WorkspaceSidebar({ brand, groups, homeHref }: WorkspaceSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-[0_2px_10px_rgba(47,43,61,0.08)] lg:hidden" style={{ borderColor: legacyTheme.divider }}>
        <div className="flex items-center justify-between gap-3">
          <Link href={homeHref} className="flex items-center gap-2">
            <img src="/vector.svg" alt="RecruitExe" className="h-8 w-8" />
            <img src="/VectorName.svg" alt="" className="h-6 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-md border bg-white"
            style={{ borderColor: legacyTheme.divider, color: legacyTheme.text }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <aside
        className={`bg-white shadow-[0_2px_10px_rgba(47,43,61,0.08)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-72 lg:border-r ${
          mobileOpen ? "fixed inset-x-3 top-16 z-40 max-h-[calc(100vh-5rem)] overflow-hidden rounded-lg border" : "hidden"
        }`}
        style={{ borderColor: legacyTheme.divider }}
      >
        <div className="flex h-full flex-col">
          <div className="hidden h-16 items-center gap-3 border-b px-5 lg:flex" style={{ borderColor: legacyTheme.divider }}>
            <Link href={homeHref} className="flex items-center gap-2">
              <img src="/vector.svg" alt="RecruitExe" className="h-8 w-8" />
              <img src="/VectorName.svg" alt="" className="h-6 w-auto" />
            </Link>
            <span className="sr-only">{brand}</span>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5" aria-label={`${brand} navigation`}>
            {groups.map((group, groupIndex) => {
              const GroupIcon = groupIcons[groupIndex % groupIcons.length]

              return (
                <section key={group.title}>
                  <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: legacyTheme.textMuted }}>
                    <GroupIcon className="h-4 w-4" />
                    <span>{group.title}</span>
                  </div>
                  <div className="space-y-1">
                    {group.modules.map((module) => {
                      const active = pathname === module.href

                      return (
                        <Link
                          key={module.href}
                          href={module.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition ${
                            active
                              ? "bg-[#F8F7FA] text-[#262E3D] shadow-[inset_3px_0_0_#7367F0]"
                              : "text-[#262E3D] hover:bg-[#F8F7FA] hover:text-[#262E3D]"
                          }`}
                        >
                          <span className="min-w-0 flex-1 leading-5">{module.title}</span>
                          {module.source === "supabase-live" ? (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(40, 199, 111, 0.12)", color: legacyTheme.success }}>
                              Live
                            </span>
                          ) : null}
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
