"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusiness, Building2, ClipboardList, Command, Files, Home, ShieldCheck, UserRound } from "lucide-react"

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

  return (
    <aside className="bg-white shadow-[0_2px_10px_rgba(47,43,61,0.08)] lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r" style={{ borderColor: legacyTheme.divider }}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-5" style={{ borderColor: legacyTheme.divider }}>
          <Link href={homeHref} className="flex items-center gap-2">
            <img src="/Vector.svg" alt="RecruitExe" className="h-8 w-8" />
            <img src="/VectorName.svg" alt="" className="h-6 w-auto" />
          </Link>
          <span className="sr-only">{brand}</span>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
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
                        href={module.legacyHref ?? module.href}
                        className={`block rounded-md px-3 py-2.5 text-[13px] font-medium transition ${
                          active
                            ? "bg-[#F8F7FA] text-[#262E3D] shadow-[inset_3px_0_0_#7367F0]"
                            : "text-[#262E3D] hover:bg-[#F8F7FA] hover:text-[#262E3D]"
                        }`}
                      >
                        <span className="block leading-5">{module.title}</span>
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
  )
}
