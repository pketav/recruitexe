import { NextResponse } from "next/server"

import { runAutomationRulesForDemoApplications } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    return NextResponse.json(await runAutomationRulesForDemoApplications())
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run automation rules."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
