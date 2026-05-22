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
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed?.drafts)) {
      return parsed.drafts
    }
  } catch {
  }

  return [
    {
      title: "Gemini generated draft",
      content: text.trim(),
      cta: payload.organizationMode === "agency" ? "Approve and schedule" : "Apply now",
      hashtags: ["#Hiring", "#Recruitment", "#RecruitExe"],
    },
  ]
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as LinkedInPostPayload
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      provider: "fallback",
      warning: "Gemini key is not configured on the server. Returned deterministic draft.",
      drafts: fallbackDraft(payload),
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
      drafts: fallbackDraft(payload),
    })
  }
}
