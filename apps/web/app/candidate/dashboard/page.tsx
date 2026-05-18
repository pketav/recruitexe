import Link from "next/link"
import { BadgeCheck, Briefcase, CalendarClock, FileText, UserRound } from "lucide-react"

const jobs = [
  ["Credit Officer", "Finance", "Indore", "Apply"],
  ["Legal Executive", "Legal", "Bhopal", "Applied"],
  ["Branch Manager", "Operations", "Jaipur", "Apply"],
]

export default function CandidateDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="text-2xl font-bold text-indigo-700">Fincoopers HRMS</Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <Link href="/candidate/dashboard">Dashboard</Link>
            <Link href="/candidate/login">Profile</Link>
            <Link href="/hr/login">HR Portal</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">Candidate Portal</p>
            <h1 className="text-3xl font-bold">Welcome, Demo Candidate</h1>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Profile 78% complete
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Applied Jobs", "2", Briefcase],
            ["Interviews", "1", CalendarClock],
            ["Documents", "3", FileText],
            ["Profile Checks", "Passed", BadgeCheck],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-indigo-600" />
              <p className="mt-4 text-sm text-slate-500">{label as string}</p>
              <p className="text-2xl font-bold">{value as string}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Open Roles</h2>
            <div className="space-y-3">
              {jobs.map(([title, dept, location, action]) => (
                <div key={title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-slate-500">{dept} · {location}</p>
                  </div>
                  <button className={`rounded-lg px-4 py-2 text-sm font-semibold ${action === "Applied" ? "bg-slate-100 text-slate-600" : "bg-indigo-950 text-white"}`}>
                    {action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <UserRound className="h-7 w-7 text-indigo-600" />
            <h2 className="mt-4 text-xl font-bold">Next Steps</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Complete address and education details.</p>
              <p>Upload updated resume and ID proof.</p>
              <p>Wait for HR interview schedule confirmation.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
