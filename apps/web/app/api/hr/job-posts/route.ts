import { NextResponse } from "next/server"

import { createRecruitExeJobPost, getJobPostSetupData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

type JobPostPayload = {
  title: string
  department?: string
  location?: string
  openings?: number
  employmentType?: string
  summary?: string
  skills?: string[]
  status?: "draft" | "published"
}

function readTextField(body: Record<string, unknown>, field: string, fallback: string | undefined, maxLength: number) {
  const value = body[field]

  if (value === undefined || value === null) {
    return fallback
  }

  if (typeof value !== "string") {
    return { error: `${field} must be a string.` }
  }

  const cleanValue = value.trim()

  if (cleanValue.length > maxLength) {
    return { error: `${field} is too long.` }
  }

  return cleanValue || fallback
}

function validateJobPostPayload(value: unknown): { payload?: JobPostPayload; error?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Job post payload must be an object." }
  }

  const record = value as Record<string, unknown>
  const fields = {
    title: readTextField(record, "title", undefined, 160),
    department: readTextField(record, "department", "Recruitment", 120),
    location: readTextField(record, "location", "Remote", 120),
    employmentType: readTextField(record, "employmentType", "Full-time", 80),
    summary: readTextField(record, "summary", "Role created from RecruitExe job post workflow.", 800),
  }

  for (const fieldValue of Object.values(fields)) {
    if (typeof fieldValue === "object" && fieldValue?.error) {
      return { error: fieldValue.error }
    }
  }

  if (!fields.title) {
    return { error: "Job title is required." }
  }

  if (record.openings !== undefined && (!Number.isInteger(record.openings) || Number(record.openings) < 1 || Number(record.openings) > 250)) {
    return { error: "Openings must be an integer between 1 and 250." }
  }

  if (record.status !== undefined && record.status !== "draft" && record.status !== "published") {
    return { error: "Job status must be draft or published." }
  }

  if (record.skills !== undefined && !Array.isArray(record.skills)) {
    return { error: "Skills must be an array." }
  }

  const skills = Array.isArray(record.skills)
    ? record.skills.map((skill) => {
      if (typeof skill !== "string") {
        return null
      }

      return skill.trim().slice(0, 64)
    }).filter((skill): skill is string => Boolean(skill)).slice(0, 12)
    : []

  if (Array.isArray(record.skills) && record.skills.some((skill) => typeof skill !== "string")) {
    return { error: "Each skill must be a string." }
  }

  return {
    payload: {
      title: fields.title,
      department: fields.department,
      location: fields.location,
      openings: typeof record.openings === "number" ? record.openings : undefined,
      employmentType: fields.employmentType,
      summary: fields.summary,
      skills,
      status: record.status === "draft" ? "draft" : "published",
    },
  }
}

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
    const body = await request.json().catch(() => null)
    const { payload, error } = validateJobPostPayload(body)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(await createRecruitExeJobPost(payload!), { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job post" },
      { status: 400 },
    )
  }
}
