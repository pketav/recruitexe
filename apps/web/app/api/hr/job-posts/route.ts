import { NextResponse } from "next/server"

import { createRecruitExeJobPost, getJobPostSetupData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return NextResponse.json(await getJobPostSetupData())
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load job post setup" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))
    return NextResponse.json(await createRecruitExeJobPost(payload), { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job post" },
      { status: 400 },
    )
  }
}
