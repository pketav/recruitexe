import { NextResponse } from "next/server"

import { applyToJobPostFromPublicLink } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

function readTextField(body: Record<string, unknown>, field: string, maxLength: number) {
  const value = body[field]

  if (value === undefined || value === null) {
    return undefined
  }

  if (typeof value !== "string") {
    return { error: `${field} must be a string.` }
  }

  const cleanValue = value.trim()

  if (cleanValue.length > maxLength) {
    return { error: `${field} is too long.` }
  }

  return cleanValue || undefined
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Valid JSON payload is required." }, { status: 400 })
    }

    const record = body as Record<string, unknown>
    const fields = {
      organizationSlug: readTextField(record, "organizationSlug", 80),
      jobTitle: readTextField(record, "jobTitle", 160),
      fullName: readTextField(record, "fullName", 140),
      email: readTextField(record, "email", 180),
      phone: readTextField(record, "phone", 40),
      currentLocation: readTextField(record, "currentLocation", 120),
      resumeUrl: readTextField(record, "resumeUrl", 500),
    }

    for (const value of Object.values(fields)) {
      if (typeof value === "object" && value?.error) {
        return NextResponse.json({ error: value.error }, { status: 400 })
      }
    }

    const organizationSlug = fields.organizationSlug as string | undefined
    const jobTitle = (fields.jobTitle as string | undefined) ?? ""
    const fullName = fields.fullName as string | undefined
    const email = (fields.email as string | undefined)?.toLowerCase()
    const phone = fields.phone as string | undefined
    const currentLocation = fields.currentLocation as string | undefined
    const resumeUrl = fields.resumeUrl as string | undefined

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 })
    }

    if (organizationSlug && !fullName) {
      return NextResponse.json({ error: "Full name is required for public applications." }, { status: 400 })
    }

    if (organizationSlug && !email) {
      return NextResponse.json({ error: "Email is required for public applications." }, { status: 400 })
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 })
    }

    if (resumeUrl && !isHttpUrl(resumeUrl)) {
      return NextResponse.json({ error: "Resume link must be a valid http or https URL." }, { status: 400 })
    }

    const application = await applyToJobPostFromPublicLink({
      organizationSlug,
      jobTitle,
      fullName,
      email,
      phone,
      currentLocation,
      resumeUrl,
      source: fullName || email ? "Public careers link" : "Candidate dashboard",
    })

    return NextResponse.json({ application })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit application."
    const status = message === "Published job not found" ? 404 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
