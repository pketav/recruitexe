"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BriefcaseBusiness, Building2, ClipboardList, Command, Files, Home, ShieldCheck, UserRound } from "lucide-react"

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
    <aside className="border-slate-200 bg-white shadow-[0_2px_10px_rgba(47,43,61,0.08)] lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <Link href={homeHref} className="grid h-10 w-10 place-items-center rounded-md bg-white text-sm font-bold text-white">
            <img src="/vector.svg" alt="RecruitExe" className="h-8 w-8" />
          </Link>
          <div>
            <p className="text-[15px] font-bold text-[#262E3D]">{brand}</p>
            <p className="text-xs font-medium text-[#6b7280]">Supabase workspace</p>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {groups.map((group, groupIndex) => {
            const GroupIcon = groupIcons[groupIndex % groupIcons.length]

            return (
              <section key={group.title}>
                <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-bold uppercase tracking-wide text-[#8a8d93]">
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
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-[#F8F9FA] text-[#262E3D] shadow-[inset_3px_0_0_#2196F3]"
                            : "text-[#262E3D] hover:bg-[#F1F3F4] hover:text-[#262E3D]"
                        }`}
                      >
                        <span className="block leading-5">{module.title}</span>
                        <span className={`mt-0.5 block text-xs font-medium ${active ? "text-[#1e88e5]" : "text-slate-400"}`}>
                          {module.source === "supabase-live" ? "Live data" : "Route ready"}
                        </span>
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
