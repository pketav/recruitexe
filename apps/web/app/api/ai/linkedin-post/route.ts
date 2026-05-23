import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type LinkedInPostPayload = {
  organizationMode?: "company" | "agency"
  companyName?: string
  clientName?: string
  jobTitle?: string
  location?: string
  tone?: string
  audience?: string
  notes?: string
}

type GeminiCandidate = {
  content?: {
    parts?: Array<{ text?: string }>
  }
}

type Draft = {
  title: string
  content: string
  cta: string
  hashtags: string[]
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

function validateAndNormalizePayload(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "LinkedIn draft payload must be an object." }
  }

  const record = value as Record<string, unknown>

  if (
    record.organizationMode !== undefined &&
    record.organizationMode !== "company" &&
    record.organizationMode !== "agency"
  ) {
    return { error: "Organization mode must be company or agency." }
  }

  const fields = {
    companyName: readTextField(record, "companyName", "RecruitExe Demo", 140),
    clientName: readTextField(record, "clientName", "", 140),
    jobTitle: readTextField(record, "jobTitle", undefined, 160),
    location: readTextField(record, "location", "India", 120),
    tone: readTextField(record, "tone", "professional", 60),
    audience: readTextField(record, "audience", "qualified candidates", 180),
    notes: readTextField(record, "notes", "", 700),
  }

  for (const fieldValue of Object.values(fields)) {
    if (typeof fieldValue === "object" && fieldValue?.error) {
      return { error: fieldValue.error }
    }
  }

  if (!fields.jobTitle) {
    return { error: "Job title is required for LinkedIn draft generation." }
  }

  return {
    payload: {
      organizationMode: record.organizationMode === "agency" ? "agency" : "company",
      companyName: fields.companyName,
      clientName: fields.clientName,
      jobTitle: fields.jobTitle,
      location: fields.location,
      tone: fields.tone,
      audience: fields.audience,
      notes: fields.notes,
    } satisfies LinkedInPostPayload,
  }
}

function cleanText(value: unknown, fallback: string, maxLength: number) {
  const text = typeof value === "string" ? value.trim() : ""

  return (text || fallback).slice(0, maxLength)
}

function sanitizeDrafts(value: unknown, fallbackPayload: LinkedInPostPayload): Draft[] {
  const source = Array.isArray(value) ? value : fallbackDraft(fallbackPayload)

  return source.slice(0, 3).map((draft, index) => {
    const record = typeof draft === "object" && draft !== null ? draft as Record<string, unknown> : {}
    const hashtags = Array.isArray(record.hashtags)
      ? record.hashtags
        .map((hashtag) => cleanText(hashtag, "", 32))
        .filter(Boolean)
        .slice(0, 6)
      : ["#Hiring", "#Recruitment", "#RecruitExe"]

    return {
      title: cleanText(record.title, `LinkedIn draft ${index + 1}`, 90),
      content: cleanText(record.content, fallbackDraft(fallbackPayload)[index]?.content ?? "Hiring post draft ready for review.", 900),
      cta: cleanText(record.cta, fallbackPayload.organizationMode === "agency" ? "Approve and schedule" : "Apply now", 80),
      hashtags,
    }
  })
}

function fallbackDraft(payload: LinkedInPostPayload) {
  const owner =
    payload.organizationMode === "agency" && payload.clientName
      ? `${payload.clientName} through ${payload.companyName || "our recruitment team"}`
      : payload.companyName || "our team"
  const role = payload.jobTitle || "an open role"
  const location = payload.location || "India"
  const tone = payload.tone || "professional"

  return [
    {
      title: `${tone} hiring announcement`,
      content: `${owner} is hiring ${role} in ${location}.\n\nWe are looking for candidates who can take ownership, communicate clearly, and deliver consistently. If this sounds like your next move, apply now and our recruitment automation team will review your profile quickly.\n\n#Hiring #Recruitment #${role.replaceAll(" ", "")}`,
      cta: "Apply now",
      hashtags: ["#Hiring", "#Recruitment", `#${role.replaceAll(" ", "")}`, "#RecruitExe"],
    },
    {
      title: "Short high-conversion version",
      content: `New opportunity: ${role}\nLocation: ${location}\n\nApply today. RecruitExe AI will screen relevant profiles and help the hiring team move faster.`,
      cta: "Send your profile",
      hashtags: ["#Jobs", "#HiringNow", "#Talent"],
    },
    {
      title: "Agency/client approval version",
      content: `${owner} has opened applications for ${role}.\n\nThis draft is ready for approval, scheduling, or direct LinkedIn publishing after account connection. RecruitExe will track status, reminders, and candidate response automatically.`,
      cta: "Approve and schedule",
      hashtags: ["#LinkedInHiring", "#RecruitmentAgency", "#Automation"],
    },
  ]
}

function parseGeminiText(text: string, payload: LinkedInPostPayload) {
  try {
    const parsed = JSON.parse(
      text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim(),
    )
    if (Array.isArray(parsed?.drafts)) {
      return sanitizeDrafts(parsed.drafts, payload)
    }
  } catch {
  }

  return sanitizeDrafts([
    {
      title: "Gemini generated draft",
      content: text.trim(),
      cta: payload.organizationMode === "agency" ? "Approve and schedule" : "Apply now",
      hashtags: ["#Hiring", "#Recruitment", "#RecruitExe"],
    },
  ], payload)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const validation = validateAndNormalizePayload(body)

  if ("error" in validation) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 })
  }

  const payload = validation.payload
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      provider: "fallback",
      warning: "Gemini key is not configured on the server. Returned deterministic draft.",
      drafts: sanitizeDrafts(fallbackDraft(payload), payload),
    })
  }

  const prompt = `Generate 3 LinkedIn hiring post drafts as JSON only.
Schema: {"drafts":[{"title":"string","content":"string","cta":"string","hashtags":["string"]}]}
Context:
- organizationMode: ${payload.organizationMode || "company"}
- companyName: ${payload.companyName || "RecruitExe Demo"}
- clientName: ${payload.clientName || ""}
- jobTitle: ${payload.jobTitle || "Open Role"}
- location: ${payload.location || "India"}
- tone: ${payload.tone || "professional"}
- audience: ${payload.audience || "qualified candidates"}
- notes: ${payload.notes || ""}
Rules:
- If agency mode, mention client approval readiness without exposing confidential details.
- Keep token, API key, and OAuth details out of the copy.
- Include practical hashtags and one clear CTA.
- Keep each post under 110 words.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`)
    }

    const result = (await response.json()) as { candidates?: GeminiCandidate[] }
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? ""

    return NextResponse.json({
      ok: true,
      provider: "gemini",
      drafts: parseGeminiText(text, payload),
    })
  } catch (error) {
    return NextResponse.json({
      ok: true,
      provider: "fallback",
      warning: error instanceof Error ? error.message : "Gemini generation failed. Returned fallback draft.",
      drafts: sanitizeDrafts(fallbackDraft(payload), payload),
    })
  }
}
