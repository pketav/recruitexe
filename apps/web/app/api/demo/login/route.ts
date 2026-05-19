import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ensureRecruitExeDemoData } from "@/lib/demo/recruitexe-data"
import { appRoutes } from "@/lib/routes"

export const dynamic = "force-dynamic"

type LoginPayload = {
  role?: "hr" | "candidate"
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as LoginPayload
  const role = payload.role === "candidate" ? "candidate" : "hr"
  const demoData = await ensureRecruitExeDemoData()
  const cookieStore = await cookies()

  cookieStore.set("recruitexe_demo_role", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return NextResponse.json({
    ok: true,
    role,
    redirectTo: role === "candidate" ? appRoutes.candidateDashboard : appRoutes.hrDashboard,
    profile: role === "candidate" ? demoData.candidateProfile : demoData.hrProfile,
  })
}
