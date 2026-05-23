import { NextResponse } from "next/server"

import { getAutomationRulesData, saveAutomationRules, type AutomationRule } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

const automationRuleIds = new Set<AutomationRule["id"]>([
  "auto-approve-high-match",
  "review-mid-match",
  "reject-low-match",
  "candidate-followup",
])

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
    const rules = Array.isArray(body.rules) ? body.rules : null

    if (!rules) {
      return NextResponse.json({ error: "Rules array is required." }, { status: 400 })
    }

    for (const rule of rules) {
      const id = typeof rule?.id === "string" ? rule.id : ""

      if (!automationRuleIds.has(id as AutomationRule["id"])) {
        return NextResponse.json({ error: `Unknown automation rule: ${id || "missing id"}.` }, { status: 400 })
      }

      if (typeof rule.enabled !== "boolean") {
        return NextResponse.json({ error: `Enabled must be boolean for ${id}.` }, { status: 400 })
      }
    }

    return NextResponse.json(await saveAutomationRules(rules))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save automation rules."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
