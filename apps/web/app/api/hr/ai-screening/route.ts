import { NextResponse } from "next/server"

import { runAiScreeningForDemoApplications } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const result = await runAiScreeningForDemoApplications()

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run AI screening."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
