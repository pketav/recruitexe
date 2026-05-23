import { NextResponse } from "next/server"

import { applyToJobPostFromPublicLink } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : ""
    const organizationSlug = typeof body.organizationSlug === "string" ? body.organizationSlug.trim() : undefined
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : undefined
    const email = typeof body.email === "string" ? body.email.trim() : undefined
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined
    const currentLocation = typeof body.currentLocation === "string" ? body.currentLocation.trim() : undefined
    const resumeUrl = typeof body.resumeUrl === "string" ? body.resumeUrl.trim() : undefined

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 })
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 })
    }

    const application = await applyToJobPostFromPublicLink({
      organizationSlug,
      jobTitle,
      fullName,
      email,
      phone,
      currentLocation,
      resumeUrl,
      source: fullName || email ? "Public careers link" : "Candidate dashboard",
    })

    return NextResponse.json({ application })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
