"use client"

import { Bell, MessageSquareText, NotebookTabs, Share2, UserRoundCheck, type LucideIcon } from "lucide-react"

import { legacyTheme } from "@/lib/legacy-theme"

type PipelineRow = {
  applicationId: string
  code: string
  name: string
  position: string
  status: string
  aiScore: string
  aiSummary?: string
  location?: string
}

type UtilitiesWorkspaceProps = {
  pipeline: PipelineRow[]
  variant: "notes" | "chats"
}

type StatCard = [string, number, LucideIcon, string]

function buildNotes(pipeline: PipelineRow[]) {
  return pipeline.slice(0, 6).map((row, index) => ({
    id: row.applicationId,
    title: `${row.name} · ${row.position}`,
    board: row.status === "approved" ? "Shortlist" : row.status === "review" ? "HR Review" : "Screening",
    content: row.aiSummary ?? `Candidate ${row.code} is currently ${row.status} for ${row.position}.`,
    reminder: index % 2 === 0 ? "Today" : "Tomorrow",
    sharedWith: index % 2 === 0 ? "Recruiter Desk" : "Hiring Manager",
  }))
}

function buildChats(pipeline: PipelineRow[]) {
  return pipeline.slice(0, 6).map((row, index) => ({
    id: row.applicationId,
    channel: index % 2 === 0 ? "HR Review" : "Recruiter Follow-up",
    candidate: row.name,
    message:
      row.status === "approved"
        ? `Please schedule next round for ${row.name}.`
        : `Need update on ${row.name} for ${row.position}.`,
    status: row.status === "approved" ? "Action ready" : "Waiting",
    owner: index % 2 === 0 ? "Senior HR" : "Recruiter",
  }))
}

export function UtilitiesWorkspace({ pipeline, variant }: UtilitiesWorkspaceProps) {
  const notes = buildNotes(pipeline)
  const chats = buildChats(pipeline)

  if (variant === "chats") {
    return (
      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          {([
            ["Channels", 2, MessageSquareText, legacyTheme.primary],
            ["Active Threads", chats.length, UserRoundCheck, legacyTheme.info],
            ["Action Ready", chats.filter((chat) => chat.status === "Action ready").length, Bell, legacyTheme.success],
            ["Owners", new Set(chats.map((chat) => chat.owner)).size, Share2, legacyTheme.warning],
          ] satisfies StatCard[]).map(([label, value, Icon, color]) => (
            <article key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
              <Icon className="h-5 w-5" style={{ color }} />
              <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
            </article>
          ))}
        </div>

        <section className="rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Internal Chat Queue</h2>
          </div>
          <div className="divide-y" style={{ borderColor: legacyTheme.divider }}>
            {chats.map((chat) => (
              <article key={chat.id} className="grid gap-3 p-5 md:grid-cols-[0.35fr_1fr_0.25fr]">
                <div>
                  <p className="font-bold" style={{ color: legacyTheme.text }}>{chat.channel}</p>
                  <p className="text-sm" style={{ color: legacyTheme.textSoft }}>{chat.owner}</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: legacyTheme.text }}>{chat.candidate}</p>
                  <p className="mt-1 text-sm" style={{ color: legacyTheme.textSoft }}>{chat.message}</p>
                </div>
                <span className="h-fit rounded-full px-3 py-1 text-xs font-bold" style={{ background: legacyTheme.selected, color: legacyTheme.primary }}>
                  {chat.status}
                </span>
              </article>
            ))}
          </div>
        </section>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {([
          ["Notes", notes.length, NotebookTabs, legacyTheme.primary],
          ["Boards", new Set(notes.map((note) => note.board)).size, Share2, legacyTheme.info],
          ["Reminders", notes.filter((note) => note.reminder).length, Bell, legacyTheme.warning],
          ["Shared", notes.length, UserRoundCheck, legacyTheme.success],
        ] satisfies StatCard[]).map(([label, value, Icon, color]) => (
          <article key={label} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <Icon className="h-5 w-5" style={{ color }} />
            <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label}</p>
            <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase" style={{ color: legacyTheme.primary }}>{note.board}</p>
                <h2 className="mt-2 font-bold" style={{ color: legacyTheme.text }}>{note.title}</h2>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(255, 159, 67, 0.14)", color: "#B85F00" }}>{note.reminder}</span>
            </div>
            <p className="mt-4 text-sm leading-6" style={{ color: legacyTheme.textSoft }}>{note.content}</p>
            <p className="mt-4 text-xs font-semibold" style={{ color: legacyTheme.textMuted }}>Shared with {note.sharedWith}</p>
          </article>
        ))}
      </section>
    </section>
  )
}
