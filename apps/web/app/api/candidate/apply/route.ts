import { NextResponse } from "next/server"

import { applyToJobPostForDemoCandidate } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : ""

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 })
    }

    const application = await applyToJobPostForDemoCandidate(jobTitle)

    return NextResponse.json({ application })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
