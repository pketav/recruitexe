"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock, Lock, User } from "lucide-react"

export default function HrLoginPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.24),transparent_28%),linear-gradient(135deg,#7c3aed,#3b2b8f_55%,#172554)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-[620px] items-center justify-center lg:flex">
          <div className="absolute left-2 top-12 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur">
            <Clock className="mb-2 h-5 w-5" />
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm text-violet-100">Always Active</p>
          </div>

          <div className="relative flex h-[390px] w-[390px] items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-violet-500 to-cyan-400 p-4 shadow-2xl">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-4">
              <Image
                src="/re001.png"
                alt="RecruitExe representative"
                width={300}
                height={300}
                className="h-[300px] w-[300px] rounded-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="absolute bottom-16 right-10 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-slate-900 shadow-2xl">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Demo Admin</p>
              <p className="text-sm text-slate-500">Employee Id: DEMO001</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[430px] rounded-3xl border border-white/15 bg-[#3b197d]/55 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="text-3xl font-bold">Welcome to</p>
            <h1 className="mt-2 bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text text-4xl font-bold text-transparent">
              RecruitExe HR
            </h1>
            <p className="mt-3 text-sm text-violet-100">Sign in to manage recruitment operations</p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-violet-100">Username</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-violet-300/20 bg-violet-950/35 px-4">
                <User className="h-5 w-5 text-violet-200" />
                <input
                  defaultValue="demo"
                  className="w-full bg-transparent text-white outline-none placeholder:text-violet-200"
                  placeholder="Enter your username"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-violet-100">Password</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-violet-300/20 bg-violet-950/35 px-4">
                <Lock className="h-5 w-5 text-violet-200" />
                <input
                  defaultValue="demo123"
                  type="password"
                  className="w-full bg-transparent text-white outline-none placeholder:text-violet-200"
                  placeholder="Enter your password"
                />
              </div>
            </label>

            <button
              onClick={() => router.push("/hr/dashboard")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-pink-500 font-semibold shadow-lg shadow-pink-950/30 transition hover:translate-y-[-1px]"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-violet-100">
            Preview mode. Real login will move to Supabase Auth.
          </p>
          <div className="mt-5 text-center">
            <Link href="/" className="text-sm font-medium text-cyan-200 hover:text-white">
              Back to public website
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
