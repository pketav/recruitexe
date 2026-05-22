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
    <aside className="border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <Link href={homeHref} className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            RX
          </Link>
          <div>
            <p className="text-sm font-bold text-slate-950">{brand}</p>
            <p className="text-xs font-medium text-emerald-700">Supabase workspace</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {groups.map((group, groupIndex) => {
            const GroupIcon = groupIcons[groupIndex % groupIcons.length]

            return (
              <section key={group.title}>
                <div className="mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
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
                        className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-slate-950 text-white"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        <span className="block leading-5">{module.title}</span>
                        <span className={`mt-0.5 block text-xs font-medium ${active ? "text-slate-300" : "text-slate-400"}`}>
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
