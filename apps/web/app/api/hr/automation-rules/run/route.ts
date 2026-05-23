import { NextResponse } from "next/server"

import { runAutomationRulesForDemoApplications } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

type AutomationRunRequest = {
  mode?: "apply-enabled-rules"
  limit?: number
}

async function readAutomationRunRequest(request: Request): Promise<{ payload?: AutomationRunRequest; error?: string }> {
  const text = await request.text()

  if (!text.trim()) {
    return { payload: {} }
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    return { error: "Valid JSON payload is required." }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { error: "Automation run payload must be an object." }
  }

  const record = parsed as Record<string, unknown>

  if (record.mode !== undefined && record.mode !== "apply-enabled-rules") {
    return { error: "Automation run mode must be apply-enabled-rules." }
  }

  if (record.limit !== undefined) {
    if (typeof record.limit !== "number" || !Number.isInteger(record.limit)) {
      return { error: "Automation run limit must be an integer." }
    }

    if (record.limit < 1 || record.limit > 100) {
      return { error: "Automation run limit must be between 1 and 100." }
    }
  }

  return {
    payload: {
      mode: "apply-enabled-rules",
      limit: typeof record.limit === "number" ? record.limit : undefined,
    },
  }
}

export async function POST(request: Request) {
  try {
    const { payload, error } = await readAutomationRunRequest(request)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(await runAutomationRulesForDemoApplications({ limit: payload?.limit }))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run automation rules."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
