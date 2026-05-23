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
    const validationError = validateLinkedInSettingsPayload(payload)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const data = await saveLinkedInIntegrationSettings(payload)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save LinkedIn integration settings" },
      { status: 500 },
    )
  }
}

function validateLinkedInSettingsPayload(payload: unknown) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return "LinkedIn settings payload must be an object."
  }

  const record = payload as Record<string, unknown>

  if (
    record.organizationMode !== undefined &&
    record.organizationMode !== "company" &&
    record.organizationMode !== "agency"
  ) {
    return "Organization mode must be company or agency."
  }

  for (const key of ["workspaceName", "defaultClientName", "defaultTone", "linkedinAccountName"]) {
    if (record[key] !== undefined && typeof record[key] !== "string") {
      return `${key} must be a string.`
    }
  }

  for (const key of ["approvalRequired", "autoSchedule", "clearLinkedinToken"]) {
    if (record[key] !== undefined && typeof record[key] !== "boolean") {
      return `${key} must be boolean.`
    }
  }

  if (record.linkedinAccessToken !== undefined) {
    if (typeof record.linkedinAccessToken !== "string") {
      return "linkedinAccessToken must be a string."
    }

    if (record.linkedinAccessToken.trim().length > 4096) {
      return "linkedinAccessToken is too long."
    }
  }

  return null
}
