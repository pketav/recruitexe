"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, FileUp, Lock, Mail, Phone, User } from "lucide-react"

export default function CandidateLoginPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="flex h-20 items-center justify-between bg-indigo-950 px-6 text-white">
        <Link href="/" className="text-3xl font-bold tracking-tight text-violet-300">F+</Link>
        <div className="flex items-center gap-8 text-sm font-semibold">
          <span className="border-b-2 border-white pb-2">Access Account</span>
          <Link href="/candidate/dashboard" className="text-indigo-200 hover:text-white">Careers</Link>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-white/70 px-5 py-2">Login</button>
          <button className="rounded-lg bg-white px-5 py-2 text-indigo-950">Sign Up</button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">SIGN UP</h1>
            <p className="mt-2 text-sm text-slate-500">Create your account to get started</p>
          </div>

          <div className="space-y-4">
            {[
              ["Email Address", Mail],
              ["Mobile Number", Phone],
              ["Full Name", User],
              ["Password", Lock],
              ["Confirm Password", Lock],
            ].map(([label, Icon]) => (
              <label key={label as string} className="flex h-14 items-center gap-3 rounded-lg border border-slate-200 px-4">
                <Icon className="h-5 w-5 text-slate-400" />
                <input
                  type={(label as string).includes("Password") ? "password" : "text"}
                  placeholder={`${label} *`}
                  className="w-full bg-transparent outline-none"
                />
              </label>
            ))}

            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Upload Resume</p>
                  <p className="text-sm text-slate-500">PDF, DOC, DOCX files only</p>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" />
              I agree to the privacy policy & terms
            </label>

            <button
              onClick={() => router.push("/candidate/dashboard")}
              className="h-12 w-full rounded-lg bg-indigo-950 font-semibold text-white"
            >
              Sign Up
            </button>
          </div>
        </div>

        <aside className="rounded-lg bg-gradient-to-br from-indigo-950 to-violet-800 p-8 text-white shadow-lg">
          <Briefcase className="h-10 w-10 text-violet-200" />
          <h2 className="mt-5 text-3xl font-bold">Candidate Career Portal</h2>
          <p className="mt-3 max-w-md text-indigo-100">
            One place for profile completion, job discovery, applications, interview updates, and document requests.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Open jobs", "Profile strength", "Applied jobs", "Interview updates"].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
