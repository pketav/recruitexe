import { NextResponse } from "next/server"

import { getLinkedInIntegrationData, saveLinkedInIntegrationSettings } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await getLinkedInIntegrationData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load LinkedIn integration settings" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))
    const data = await saveLinkedInIntegrationSettings(payload)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save LinkedIn integration settings" },
      { status: 500 },
    )
  }
}
