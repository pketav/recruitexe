import { NextResponse } from "next/server"

import { getAutomationRulesData, saveAutomationRules } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return NextResponse.json(await getAutomationRulesData())
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load automation rules."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rules = Array.isArray(body.rules) ? body.rules : []

    return NextResponse.json(await saveAutomationRules(rules))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save automation rules."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
