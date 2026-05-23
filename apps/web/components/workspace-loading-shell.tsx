import { legacyTheme } from "@/lib/legacy-theme"

type WorkspaceLoadingShellProps = {
  brand: string
  mode: "hr" | "candidate"
}

export function WorkspaceLoadingShell({ brand, mode }: WorkspaceLoadingShellProps) {
  const sections = mode === "hr" ? ["Home", "Talent Acquisition", "Operations", "Utilities"] : ["Candidate"]

  return (
    <main className="min-h-screen" style={{ background: legacyTheme.body, color: legacyTheme.text }}>
      <aside className="hidden bg-white shadow-[0_2px_10px_rgba(47,43,61,0.08)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-72 lg:border-r" style={{ borderColor: legacyTheme.divider }}>
        <div className="h-16 border-b px-5 py-4" style={{ borderColor: legacyTheme.divider }}>
          <div className="h-7 w-36 animate-pulse rounded-md" style={{ background: legacyTheme.selected }} />
          <span className="sr-only">{brand}</span>
        </div>
        <nav className="space-y-6 px-4 py-5">
          {sections.map((section) => (
            <section key={section}>
              <div className="mb-3 h-3 w-28 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
              <div className="space-y-2">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-10 animate-pulse rounded-md" style={{ background: item === 0 ? "#F8F7FA" : legacyTheme.body }} />
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>

      <section className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
              <div className="h-9 w-72 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
              <div className="h-4 w-[min(36rem,80vw)] animate-pulse rounded" style={{ background: legacyTheme.selected }} />
            </div>
            <div className="h-8 w-28 animate-pulse rounded-full bg-white" />
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
                <div className="h-6 w-6 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
                <div className="mt-5 h-4 w-28 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
                <div className="mt-3 h-8 w-20 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
                <div className="mt-3 h-3 w-36 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
              </div>
            ))}
          </section>

          <section className="mt-5 rounded-lg border bg-white p-5 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
            <div className="h-5 w-48 animate-pulse rounded" style={{ background: legacyTheme.selected }} />
            <div className="mt-5 space-y-3">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-12 animate-pulse rounded" style={{ background: legacyTheme.body }} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
