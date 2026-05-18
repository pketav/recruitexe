import Link from "next/link"
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  MapPin,
  Settings,
  UserRoundCheck,
  Users,
  XCircle,
} from "lucide-react"

const metrics = [
  { label: "Total Applications", value: "186", note: "All submissions", tone: "bg-sky-100 text-sky-800", icon: Users },
  { label: "Approved", value: "58", note: "Applicants approved", tone: "bg-fuchsia-100 text-fuchsia-800", icon: UserRoundCheck },
  { label: "Rejected", value: "31", note: "Applicants rejected", tone: "bg-rose-100 text-rose-800", icon: XCircle },
  { label: "Pending", value: "97", note: "Decision pending", tone: "bg-lime-100 text-lime-800", icon: CheckCircle2 },
  { label: "Total AI Screened", value: "142", note: "AI screened applicants", tone: "bg-blue-100 text-blue-800", icon: BarChart3 },
  { label: "AI Approved", value: "64", note: "Recommended by AI", tone: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  { label: "AI Rejected", value: "39", note: "Not recommended", tone: "bg-red-100 text-red-800", icon: XCircle },
  { label: "Screening Pending", value: "39", note: "Awaiting review", tone: "bg-pink-100 text-pink-800", icon: CalendarDays },
]

const departments = [
  { name: "Legal", value: 46, tone: "bg-sky-100 text-sky-800" },
  { name: "Finance", value: 38, tone: "bg-purple-100 text-purple-800" },
  { name: "Operations", value: 42, tone: "bg-indigo-100 text-indigo-800" },
  { name: "HR", value: 26, tone: "bg-orange-100 text-orange-800" },
  { name: "Sales", value: 34, tone: "bg-pink-100 text-pink-800" },
]

const candidates = [
  ["CAND001", "Rahul Sharma", "Credit Officer", "Approved", "86%"],
  ["CAND002", "Priya Mehta", "Legal Executive", "Pending", "79%"],
  ["CAND003", "Amit Jain", "Branch Manager", "Review", "72%"],
]

export default function HrDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-16 border-r border-slate-200 bg-white py-5 md:flex md:flex-col md:items-center md:justify-between">
        <div className="space-y-5">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-white">
            9
          </Link>
          {[Users, BriefcaseBusiness, FolderOpen, FileText, MapPin].map((Icon, index) => (
            <button key={index} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100">
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
        <Settings className="h-5 w-5 text-slate-500" />
      </aside>

      <section className="md:pl-16">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-600">Fincoopers HRMS</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Application Analytics</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">Live</span>
              <Link href="/hr/login" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-white">
                Demo Admin
              </Link>
            </div>
          </header>

          <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-fuchsia-600 p-1 text-white">
            <button className="rounded-md bg-white px-4 py-3 font-semibold text-sky-700">Dashboard</button>
            <button className="px-4 py-3 font-semibold">Candidates</button>
            <button className="px-4 py-3 font-semibold">Map</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, note, tone, icon: Icon }) => (
              <div key={label} className={`rounded-lg border border-white p-5 shadow-sm ${tone}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold opacity-75">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-sm opacity-75">{note}</p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/55">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-sky-600" />
              <h2 className="text-xl font-bold">Department Breakdown</h2>
              <span className="rounded bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">Live</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {departments.map((dept) => (
                <div key={dept.name} className={`rounded-lg p-5 ${dept.tone}`}>
                  <p className="text-sm font-semibold opacity-80">{dept.name}</p>
                  <p className="mt-2 text-3xl font-bold">{dept.value}</p>
                  <p className="text-sm opacity-75">Applications</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Candidate Pipeline</h2>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">AI Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((row) => (
                      <tr key={row[0]} className="border-t border-slate-100">
                        {row.map((cell) => (
                          <td key={cell} className="px-4 py-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Hot Positions</h2>
              {["Branch Manager", "Credit Officer", "Legal Executive"].map((position, index) => (
                <div key={position} className="mb-3 flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 p-4">
                  <div>
                    <p className="font-semibold">{position}</p>
                    <p className="text-sm text-slate-500">{["Operations", "Finance", "Legal"][index]}</p>
                  </div>
                  <p className="font-bold text-orange-700">{[34, 28, 22][index]} applicants</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
