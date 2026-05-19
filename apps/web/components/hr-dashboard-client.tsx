"use client"

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
import { useState } from "react"

type HrDashboardData = {
  organization: { name: string }
  metrics: Array<{ label: string; value: string; note: string }>
  departmentBreakdown: Array<{ name: string; value: number }>
  pipeline: Array<{ code: string; name: string; position: string; status: string; aiScore: string }>
  hotPositions: Array<{ title: string; applicants: number }>
}

const metricStyles = [
  { tone: "bg-sky-100 text-sky-800", icon: Users },
  { tone: "bg-fuchsia-100 text-fuchsia-800", icon: UserRoundCheck },
  { tone: "bg-rose-100 text-rose-800", icon: XCircle },
  { tone: "bg-lime-100 text-lime-800", icon: CheckCircle2 },
  { tone: "bg-blue-100 text-blue-800", icon: BarChart3 },
  { tone: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  { tone: "bg-red-100 text-red-800", icon: XCircle },
  { tone: "bg-pink-100 text-pink-800", icon: CalendarDays },
]

const departmentStyles = [
  "bg-sky-100 text-sky-800",
  "bg-purple-100 text-purple-800",
  "bg-indigo-100 text-indigo-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
]

const tabs = ["Dashboard", "Candidates", "Map"] as const

export function HrDashboardClient({ data }: { data: HrDashboardData }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Dashboard")

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
              <p className="mt-1 text-sm text-slate-500">{data.organization.name} · Supabase live data</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">Live</span>
              <Link href="/hr/login" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-white">
                Demo Admin
              </Link>
            </div>
          </header>

          <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-fuchsia-600 p-1 text-white">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-3 font-semibold ${activeTab === tab ? "bg-white text-sky-700" : "text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Dashboard" ? <DashboardView data={data} /> : null}
          {activeTab === "Candidates" ? <CandidatesView data={data} /> : null}
          {activeTab === "Map" ? <MapView data={data} /> : null}
        </div>
      </section>
    </main>
  )
}

function DashboardView({ data }: { data: HrDashboardData }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map(({ label, value, note }, index) => {
          const { tone, icon: Icon } = metricStyles[index % metricStyles.length]

          return (
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
          )
        })}
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <BriefcaseBusiness className="h-5 w-5 text-sky-600" />
          <h2 className="text-xl font-bold">Department Breakdown</h2>
          <span className="rounded bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">Live</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {data.departmentBreakdown.map((dept, index) => (
            <div key={dept.name} className={`rounded-lg p-5 ${departmentStyles[index % departmentStyles.length]}`}>
              <p className="text-sm font-semibold opacity-80">{dept.name}</p>
              <p className="mt-2 text-3xl font-bold">{dept.value}</p>
              <p className="text-sm opacity-75">Applications</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Hot Positions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {data.hotPositions.map((position) => (
            <div key={position.title} className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 p-4">
              <div>
                <p className="font-semibold">{position.title}</p>
                <p className="text-sm text-slate-500">Published role</p>
              </div>
              <p className="font-bold text-orange-700">{position.applicants} applicants</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function CandidatesView({ data }: { data: HrDashboardData }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
            {data.pipeline.map((candidate) => (
              <tr key={`${candidate.code}-${candidate.position}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{candidate.code}</td>
                <td className="px-4 py-3">{candidate.name}</td>
                <td className="px-4 py-3">{candidate.position}</td>
                <td className="px-4 py-3 capitalize">{candidate.status}</td>
                <td className="px-4 py-3">{candidate.aiScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MapView({ data }: { data: HrDashboardData }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-fuchsia-600" />
        <h2 className="text-xl font-bold">Hiring Map</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {data.hotPositions.map((position, index) => (
          <div key={position.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">Zone {index + 1}</p>
            <p className="mt-2 text-lg font-bold">{position.title}</p>
            <p className="text-sm text-slate-600">{position.applicants} active applicants</p>
          </div>
        ))}
      </div>
    </section>
  )
}
