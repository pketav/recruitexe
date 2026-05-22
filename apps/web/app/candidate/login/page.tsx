"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, FileUp, Lock, Mail, Phone, User } from "lucide-react"
import { useState } from "react"

import { legacyTheme } from "@/lib/legacy-theme"

export default function CandidateLoginPage() {
  const router = useRouter()
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState("")

  async function handleCandidateAccess() {
    setIsSigningUp(true)
    setError("")

    try {
      const response = await fetch("/api/demo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "candidate" }),
      })

      if (!response.ok) {
        throw new Error("Unable to start candidate session")
      }

      const data = await response.json()
      router.push(data.redirectTo || "/candidate/dashboard")
    } catch (accessError) {
      setError(accessError instanceof Error ? accessError.message : "Unable to start candidate session")
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: legacyTheme.body, color: legacyTheme.text }}>
      <nav className="flex h-20 items-center justify-between px-6 text-white" style={{ background: `linear-gradient(45deg, ${legacyTheme.primary} 30%, ${legacyTheme.info} 90%)` }}>
        <Link href="/" className="flex items-center gap-2">
          <img src="/vector.svg" alt="RecruitExe" className="h-8 w-8" />
          <img src="/VectorName.svg" alt="" className="h-6 w-auto brightness-0 invert" />
        </Link>
        <div className="flex items-center gap-8 text-sm font-semibold">
          <span className="border-b-2 border-white pb-2">Access Account</span>
          <Link href="/candidate/dashboard" className="text-white/80 hover:text-white">Careers</Link>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-white/70 px-5 py-2">Login</button>
          <button className="rounded-md bg-white px-5 py-2" style={{ color: legacyTheme.primary }}>Sign Up</button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border bg-white p-6 shadow-sm" style={{ borderColor: legacyTheme.divider }}>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold" style={{ color: legacyTheme.text }}>SIGN UP</h1>
            <p className="mt-2 text-sm" style={{ color: legacyTheme.textSoft }}>Create your account to get started</p>
          </div>

          <div className="space-y-4">
            {[
              ["Email Address", Mail],
              ["Mobile Number", Phone],
              ["Full Name", User],
              ["Password", Lock],
              ["Confirm Password", Lock],
            ].map(([label, Icon]) => (
              <label key={label as string} className="flex h-14 items-center gap-3 rounded-md border px-4" style={{ borderColor: legacyTheme.divider }}>
                <Icon className="h-5 w-5" style={{ color: legacyTheme.textMuted }} />
                <input
                  type={(label as string).includes("Password") ? "password" : "text"}
                  placeholder={`${label} *`}
                  className="w-full bg-transparent outline-none"
                />
              </label>
            ))}

            <div className="rounded-lg border border-dashed p-5" style={{ borderColor: legacyTheme.divider, background: legacyTheme.body }}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "rgba(115, 103, 240, 0.12)", color: legacyTheme.primary }}>
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Upload Resume</p>
                  <p className="text-sm" style={{ color: legacyTheme.textSoft }}>PDF, DOC, DOCX files only</p>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm" style={{ color: legacyTheme.textSoft }}>
              <input type="checkbox" />
              I agree to the privacy policy & terms
            </label>

            <button
              onClick={handleCandidateAccess}
              disabled={isSigningUp}
              className="h-12 w-full rounded-md font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: legacyTheme.primary }}
            >
              {isSigningUp ? "Connecting Supabase..." : "Sign Up"}
            </button>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="rounded-lg p-8 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${legacyTheme.primaryDark}, ${legacyTheme.primary} 58%, ${legacyTheme.info})` }}>
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
