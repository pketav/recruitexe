"use client"

import { FileCheck2, FileText, FolderOpen, ShieldCheck, UploadCloud } from "lucide-react"

import type { DocumentLibraryRow } from "@/lib/demo/recruitexe-data"
import { legacyTheme } from "@/lib/legacy-theme"

type FileManagerWorkspaceProps = {
  documents: DocumentLibraryRow[]
}

function documentTone(type: string) {
  if (type.includes("identity")) {
    return { background: "rgba(0, 186, 209, 0.1)", color: legacyTheme.info }
  }

  if (type.includes("education")) {
    return { background: "rgba(255, 159, 67, 0.14)", color: "#B85F00" }
  }

  return { background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }
}

export function FileManagerWorkspace({ documents }: FileManagerWorkspaceProps) {
  const activeDocuments = documents.filter((document) => document.status === "active").length
  const owners = new Set(documents.map((document) => document.owner)).size
  const identityDocs = documents.filter((document) => document.documentType.includes("identity")).length

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Documents", documents.length, FolderOpen, legacyTheme.primary],
          ["Active Files", activeDocuments, FileCheck2, legacyTheme.success],
          ["Owners", owners, ShieldCheck, legacyTheme.info],
          ["ID Proofs", identityDocs, FileText, legacyTheme.warning],
        ].map(([label, value, Icon, color]) => (
          <article key={label as string} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <Icon className="h-5 w-5" style={{ color: color as string }} />
            <p className="mt-3 text-sm" style={{ color: legacyTheme.textSoft }}>{label as string}</p>
            <p className="text-2xl font-bold" style={{ color: legacyTheme.text }}>{value as number}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.45fr]">
        <section className="overflow-hidden rounded-lg border bg-white shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
            <h2 className="text-lg font-bold" style={{ color: legacyTheme.text }}>Document Library</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead style={{ background: legacyTheme.body, color: legacyTheme.textSoft }}>
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id} className="border-t" style={{ borderColor: legacyTheme.divider }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: legacyTheme.text }}>{document.title}</td>
                  <td className="px-4 py-3">{document.owner}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-3 py-1 text-xs font-bold capitalize" style={documentTone(document.documentType)}>
                      {document.documentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{document.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <UploadCloud className="h-7 w-7" style={{ color: legacyTheme.primary }} />
          <h2 className="mt-4 text-lg font-bold" style={{ color: legacyTheme.text }}>Upload Queue</h2>
          <div className="mt-4 space-y-3 text-sm" style={{ color: legacyTheme.textSoft }}>
            <p>Resume, identity proof, and education files are grouped by candidate owner.</p>
            <p>Next production step: signed Supabase Storage uploads with file preview and expiry rules.</p>
            <p>Current pass keeps documents readable without exposing storage secrets.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
