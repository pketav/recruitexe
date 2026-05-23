import { NextResponse } from "next/server"

import { runAiScreeningForDemoApplications } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

type ScreeningRequest = {
  mode?: "screen-pending"
  limit?: number
}

async function readScreeningRequest(request: Request): Promise<{ payload?: ScreeningRequest; error?: string }> {
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
    return { error: "AI screening payload must be an object." }
  }

  const record = parsed as Record<string, unknown>

  if (record.mode !== undefined && record.mode !== "screen-pending") {
    return { error: "AI screening mode must be screen-pending." }
  }

  if (record.limit !== undefined) {
    if (typeof record.limit !== "number" || !Number.isInteger(record.limit)) {
      return { error: "AI screening limit must be an integer." }
    }

    if (record.limit < 1 || record.limit > 50) {
      return { error: "AI screening limit must be between 1 and 50." }
    }
  }

  return {
    payload: {
      mode: "screen-pending",
      limit: typeof record.limit === "number" ? record.limit : undefined,
    },
  }
}

export async function POST(request: Request) {
  try {
    const { payload, error } = await readScreeningRequest(request)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    const result = await runAiScreeningForDemoApplications({ limit: payload?.limit })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run AI screening."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
