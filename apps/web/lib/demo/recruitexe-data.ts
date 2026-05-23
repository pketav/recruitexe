import "server-only"

import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export const organizationSlug = "recruitexe-demo"

type SupabaseAdmin = ReturnType<typeof getSupabaseAdminClient>

type DashboardMetric = {
  label: string
  value: string
  note: string
}

type CandidateRow = {
  applicationId: string
  code: string
  name: string
  position: string
  status: string
  aiScore: string
  aiSummary?: string
  location?: string
}

export type DocumentLibraryRow = {
  id: string
  title: string
  documentType: string
  status: string
  owner: string
}

type JobRow = {
  title: string
  department: string
  location: string
  action: "Apply" | "Applied"
  applicants: number
  status?: string
}

type PublicCareerJob = {
  title: string
  department: string
  location: string
  openings: number
  applicants: number
  summary: string
  skills: string[]
}

type PublicApplyPayload = {
  organizationSlug?: string
  jobTitle?: string
  fullName?: string
  email?: string
  phone?: string
  currentLocation?: string
  resumeUrl?: string
  source?: string
}

type ScreeningDecision = {
  score: number
  status: string
  summary: string
  provider: "gemini" | "rules-fallback"
}

export type JobPostSetupData = {
  organization: { id: string; name: string }
  departments: Array<{ id: string; name: string }>
  locations: Array<{ id: string; name: string }>
  recentJobs: Array<{ id: string; title: string; status: string; openings: number; department: string; location: string; applicants: number }>
}

export type AutomationRule = {
  id: "auto-approve-high-match" | "review-mid-match" | "reject-low-match" | "candidate-followup"
  title: string
  description: string
  enabled: boolean
  trigger: string
  condition: string
  action: string
}

export type LinkedInIntegrationSettings = {
  organizationMode: "company" | "agency"
  workspaceName: string
  defaultClientName: string
  defaultTone: string
  approvalRequired: boolean
  autoSchedule: boolean
  linkedinConnected: boolean
  linkedinAccountName: string
  linkedinTokenLastFour: string
  linkedinTokenUpdatedAt: string | null
  geminiConfigured: boolean
  geminiProvider: "gemini" | "rules-fallback"
}

const defaultAutomationRules: AutomationRule[] = [
  {
    id: "auto-approve-high-match",
    title: "Auto approve high AI match",
    description: "Candidates with strong AI match move directly to approved shortlist.",
    enabled: true,
    trigger: "AI screening completed",
    condition: "AI score >= 85",
    action: "Set application status to approved",
  },
  {
    id: "review-mid-match",
    title: "Send medium match to HR review",
    description: "Good profiles stay visible for recruiter review instead of final rejection.",
    enabled: true,
    trigger: "AI screening completed",
    condition: "AI score between 74 and 84",
    action: "Set application status to review",
  },
  {
    id: "reject-low-match",
    title: "Reject low match safely",
    description: "Weak profiles can be rejected after AI score is available.",
    enabled: true,
    trigger: "AI screening completed",
    condition: "AI score <= 72",
    action: "Set application status to rejected",
  },
  {
    id: "candidate-followup",
    title: "Candidate follow-up queue",
    description: "Newly applied candidates stay in a follow-up queue until screening completes.",
    enabled: true,
    trigger: "New application received",
    condition: "Status is applied and AI score is pending",
    action: "Keep status applied and mark follow-up task ready",
  },
]

const defaultLinkedInSettings: Omit<LinkedInIntegrationSettings, "geminiConfigured" | "geminiProvider"> = {
  organizationMode: "company",
  workspaceName: "Fincoopers RecruitExe Demo",
  defaultClientName: "Client BFSI Brand",
  defaultTone: "Professional",
  approvalRequired: true,
  autoSchedule: false,
  linkedinConnected: false,
  linkedinAccountName: "",
  linkedinTokenLastFour: "",
  linkedinTokenUpdatedAt: null,
}

const departments = [
  { name: "Legal", value: 46 },
  { name: "Finance", value: 38 },
  { name: "Operations", value: 42 },
  { name: "HR", value: 26 },
  { name: "Sales", value: 34 },
]

const demoJobs = [
  {
    title: "Credit Officer",
    slug: "credit-officer",
    department: "Finance",
    location: "Indore",
    openings: 4,
    applicants: 28,
    content: {
      summary: "Own credit file screening, document checks, and branch coordination.",
      skills: ["Credit analysis", "Documentation", "Customer verification"],
    },
  },
  {
    title: "Legal Executive",
    slug: "legal-executive",
    department: "Legal",
    location: "Bhopal",
    openings: 2,
    applicants: 22,
    content: {
      summary: "Manage legal verification, case documentation, and compliance follow-ups.",
      skills: ["Legal drafting", "Compliance", "Verification"],
    },
  },
  {
    title: "Branch Manager",
    slug: "branch-manager",
    department: "Operations",
    location: "Jaipur",
    openings: 3,
    applicants: 34,
    content: {
      summary: "Lead branch operations, team targets, and hiring coordination.",
      skills: ["Branch operations", "Team management", "Sales planning"],
    },
  },
]

const demoCandidates = [
  {
    candidate_code: "CAND001",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 90000 10001",
    current_location: "Indore",
    source: "RecruitExe",
  },
  {
    candidate_code: "CAND002",
    full_name: "Priya Mehta",
    email: "priya.mehta@example.com",
    phone: "+91 90000 10002",
    current_location: "Bhopal",
    source: "LinkedIn",
  },
  {
    candidate_code: "CAND003",
    full_name: "Amit Jain",
    email: "amit.jain@example.com",
    phone: "+91 90000 10003",
    current_location: "Jaipur",
    source: "Referral",
  },
]

async function getSingle<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  context: string,
) {
  const { data, error } = await query

  if (error) {
    throw new Error(`${context}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`${context}: no data returned`)
  }

  return data
}

async function ensureProduct(supabase: SupabaseAdmin) {
  return getSingle<{ id: string }>(
    supabase
      .from("products")
      .upsert(
        {
          code: "recruitexe",
          name: "RecruitExe",
          description: "AI-powered HRMS, ATS, recruitment, candidate, and workforce platform",
        },
        { onConflict: "code" },
      )
      .select("id")
      .single(),
    "ensure product",
  )
}

async function ensureOrganization(supabase: SupabaseAdmin) {
  const existing = await supabase
    .from("organizations")
    .select("id,name")
    .eq("slug", organizationSlug)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find organization: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; name: string }>(
    supabase
      .from("organizations")
      .insert({
        slug: organizationSlug,
        name: "Fincoopers RecruitExe Demo",
        legal_name: "Fincoopers Consulting Services",
        organization_type: "enterprise",
        industry: "Financial Services",
        website: "https://fincoopers.in",
        settings: {
          demo: true,
          product: "recruitexe",
          automationRules: defaultAutomationRules,
          linkedinIntegration: defaultLinkedInSettings,
        },
      })
      .select("id,name")
      .single(),
    "ensure organization",
  )
}

async function ensureProfile(
  supabase: SupabaseAdmin,
  organizationId: string,
  userType: "hr" | "candidate",
  email: string,
  fullName: string,
) {
  const existing = await supabase
    .from("profiles")
    .select("id,email,full_name,user_type")
    .eq("organization_id", organizationId)
    .eq("email", email)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find ${userType} profile: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; email: string; full_name: string | null; user_type: string }>(
    supabase
      .from("profiles")
      .insert({
        organization_id: organizationId,
        user_type: userType,
        full_name: fullName,
        email,
        status: "active",
        metadata: { demo: true },
      })
      .select("id,email,full_name,user_type")
      .single(),
    `create ${userType} profile`,
  )
}

async function ensureNamedRow(
  supabase: SupabaseAdmin,
  table: "departments" | "work_locations",
  organizationId: string,
  name: string,
  extra: Record<string, unknown> = {},
) {
  const existing = await supabase
    .from(table)
    .select("id,name")
    .eq("organization_id", organizationId)
    .eq("name", name)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find ${table} ${name}: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; name: string }>(
    supabase
      .from(table)
      .insert({
        organization_id: organizationId,
        name,
        status: "active",
        ...extra,
      })
      .select("id,name")
      .single(),
    `create ${table} ${name}`,
  )
}

async function ensureCandidate(
  supabase: SupabaseAdmin,
  organizationId: string,
  candidate: (typeof demoCandidates)[number],
  profileId?: string,
) {
  const existing = await supabase
    .from("candidates")
    .select("id,candidate_code,full_name,email,current_location")
    .eq("organization_id", organizationId)
    .eq("candidate_code", candidate.candidate_code)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find candidate ${candidate.candidate_code}: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; candidate_code: string; full_name: string; email: string | null; current_location: string | null }>(
    supabase
      .from("candidates")
      .insert({
        ...candidate,
        organization_id: organizationId,
        profile_id: profileId ?? null,
        profile_data: { profileCompletion: candidate.candidate_code === "CAND002" ? 78 : 64 },
        metadata: { demo: true },
      })
      .select("id,candidate_code,full_name,email,current_location")
      .single(),
    `create candidate ${candidate.candidate_code}`,
  )
}

async function ensureJobPost(
  supabase: SupabaseAdmin,
  organizationId: string,
  job: (typeof demoJobs)[number],
  departmentId?: string,
  locationId?: string,
) {
  return getSingle<{ id: string; title: string; slug: string; openings: number; content: Record<string, unknown> }>(
    supabase
      .from("job_posts")
      .upsert(
        {
          organization_id: organizationId,
          slug: job.slug,
          title: job.title,
          department_id: departmentId ?? null,
          work_location_id: locationId ?? null,
          employment_type: "Full-time",
          openings: job.openings,
          status: "published",
          published_at: new Date().toISOString(),
          content: job.content,
          metadata: { demo: true, applicants: job.applicants },
        },
        { onConflict: "organization_id,slug" },
      )
      .select("id,title,slug,openings,content")
      .single(),
    `ensure job ${job.slug}`,
  )
}

async function ensureApplication(
  supabase: SupabaseAdmin,
  organizationId: string,
  jobPostId: string,
  candidateId: string,
  status: string,
  aiScore: number,
) {
  const existing = await supabase
    .from("job_applications")
    .select("id,status,ai_score")
    .eq("organization_id", organizationId)
    .eq("job_post_id", jobPostId)
    .eq("candidate_id", candidateId)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find application: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; status: string; ai_score: number | null }>(
    supabase
      .from("job_applications")
      .insert({
        organization_id: organizationId,
        job_post_id: jobPostId,
        candidate_id: candidateId,
        status,
        ai_score: aiScore,
        ai_summary: aiScore >= 80 ? "Strong match for current role requirements." : "Needs HR review before next stage.",
        source: "RecruitExe demo",
        metadata: { demo: true },
      })
      .select("id,status,ai_score")
      .single(),
    "ensure application",
  )
}

function scoreCandidateMatch(candidateName: string, jobTitle: string, status: string) {
  const seed = `${candidateName}:${jobTitle}:${status}`
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0)
  const score = 68 + (seed % 27)

  if (score >= 85) {
    return {
      score,
      status: "approved",
      summary: "Strong match: profile signals align well with role requirements and hiring priority.",
    }
  }

  if (score >= 74) {
    return {
      score,
      status: "review",
      summary: "Good potential match: HR should review documents and confirm role-specific fit.",
    }
  }

  return {
    score,
    status: "rejected",
    summary: "Low match: profile needs stronger evidence against current role requirements.",
  }
}

function fallbackScreeningDecision(candidateName: string, jobTitle: string, status: string): ScreeningDecision {
  const result = scoreCandidateMatch(candidateName, jobTitle, status)

  return {
    ...result,
    provider: "rules-fallback",
  }
}

function parseGeminiScreeningText(text: string, fallback: ScreeningDecision): ScreeningDecision {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim()

  try {
    const parsed = JSON.parse(cleaned) as Partial<ScreeningDecision>
    const score = Math.max(0, Math.min(100, Number(parsed.score ?? fallback.score)))
    const status = ["approved", "review", "rejected"].includes(String(parsed.status)) ? String(parsed.status) : fallback.status
    const summary = typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim() : fallback.summary

    return {
      score,
      status,
      summary,
      provider: "gemini",
    }
  } catch {
    return fallback
  }
}

async function generateScreeningDecision(candidateName: string, jobTitle: string, status: string): Promise<ScreeningDecision> {
  const fallback = fallbackScreeningDecision(candidateName, jobTitle, status)
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return fallback
  }

  const prompt = `Score this candidate application as JSON only.
Schema: {"score":number,"status":"approved|review|rejected","summary":"string"}
Rules:
- approved means score >= 85 and strong role fit.
- review means score 74-84 or useful but needs HR review.
- rejected means score <= 73 or clear mismatch.
- Summary must be one concise HR-facing sentence.
Application:
- Candidate: ${candidateName}
- Role: ${jobTitle}
- Current status: ${status}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini screening failed with ${response.status}`)
    }

    const result = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? ""

    return parseGeminiScreeningText(text, fallback)
  } catch {
    return fallback
  }
}

function slugifyJobTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() ?? ""
}

function cleanSettingText(value: string | undefined, fallback: string, maxLength = 120) {
  const cleanValue = value?.trim()

  if (!cleanValue) {
    return fallback
  }

  return cleanValue.slice(0, maxLength)
}

function candidateCodeFromEmail(email: string) {
  const seed = email
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0)
    .toString(36)
    .toUpperCase()
  const prefix = email.split("@")[0]?.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "PUBLIC"

  return `PUB-${prefix}-${seed}`
}

async function ensureDocument(
  supabase: SupabaseAdmin,
  organizationId: string,
  candidateId: string,
  title: string,
  documentType: string,
) {
  const existing = await supabase
    .from("documents")
    .select("id,title")
    .eq("organization_id", organizationId)
    .eq("owner_candidate_id", candidateId)
    .eq("title", title)
    .maybeSingle()

  if (existing.error) {
    throw new Error(`find document ${title}: ${existing.error.message}`)
  }

  if (existing.data) {
    return existing.data
  }

  return getSingle<{ id: string; title: string }>(
    supabase
      .from("documents")
      .insert({
        organization_id: organizationId,
        owner_candidate_id: candidateId,
        title,
        document_type: documentType,
        status: "active",
        metadata: { demo: true },
      })
      .select("id,title")
      .single(),
    `create document ${title}`,
  )
}

export async function ensureRecruitExeDemoData() {
  const supabase = getSupabaseAdminClient()
  const [product, organization] = await Promise.all([ensureProduct(supabase), ensureOrganization(supabase)])

  await supabase
    .from("organization_products")
    .upsert(
      {
        organization_id: organization.id,
        product_id: product.id,
        status: "active",
        settings: { primary: true },
      },
      { onConflict: "organization_id,product_id" },
    )
    .throwOnError()

  const hrProfile = await ensureProfile(
    supabase,
    organization.id,
    "hr",
    "hr.demo@recruitexe.local",
    "Demo Admin",
  )

  const candidateProfile = await ensureProfile(
    supabase,
    organization.id,
    "candidate",
    "candidate.demo@recruitexe.local",
    "Priya Mehta",
  )

  const departmentRows = new Map<string, { id: string; name: string }>()
  for (const department of departments) {
    departmentRows.set(
      department.name,
      await ensureNamedRow(supabase, "departments", organization.id, department.name, {
        metadata: { demoApplications: department.value },
      }),
    )
  }

  const locationRows = new Map<string, { id: string; name: string }>()
  for (const job of demoJobs) {
    locationRows.set(job.location, await ensureNamedRow(supabase, "work_locations", organization.id, job.location))
  }

  const candidateRows = []
  for (const candidate of demoCandidates) {
    candidateRows.push(
      await ensureCandidate(
        supabase,
        organization.id,
        candidate,
        candidate.candidate_code === "CAND002" ? candidateProfile.id : undefined,
      ),
    )
  }

  const jobRows = []
  for (const job of demoJobs) {
    jobRows.push(
      await ensureJobPost(
        supabase,
        organization.id,
        job,
        departmentRows.get(job.department)?.id,
        locationRows.get(job.location)?.id,
      ),
    )
  }

  await ensureApplication(supabase, organization.id, jobRows[0].id, candidateRows[0].id, "approved", 86)
  await ensureApplication(supabase, organization.id, jobRows[1].id, candidateRows[1].id, "pending", 79)
  await ensureApplication(supabase, organization.id, jobRows[2].id, candidateRows[2].id, "review", 72)
  await ensureApplication(supabase, organization.id, jobRows[0].id, candidateRows[1].id, "applied", 83)

  await ensureDocument(supabase, organization.id, candidateRows[1].id, "Resume", "resume")
  await ensureDocument(supabase, organization.id, candidateRows[1].id, "Identity Proof", "identity")
  await ensureDocument(supabase, organization.id, candidateRows[1].id, "Education Certificate", "education")

  return {
    organization,
    hrProfile,
    candidateProfile,
  }
}

export async function getHrDashboardData() {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const [
    applicationsResult,
    candidatesResult,
    jobsResult,
    departmentsResult,
    documentsResult,
  ] = await Promise.all([
    supabase
      .from("job_applications")
      .select("id,status,ai_score,ai_summary,job_posts(title),candidates(candidate_code,full_name,current_location)")
      .eq("organization_id", organization.id)
      .order("applied_at", { ascending: false }),
    supabase
      .from("candidates")
      .select("id,candidate_code,full_name")
      .eq("organization_id", organization.id),
    supabase
      .from("job_posts")
      .select("id,title,metadata")
      .eq("organization_id", organization.id)
      .eq("status", "published"),
    supabase
      .from("departments")
      .select("name,metadata")
      .eq("organization_id", organization.id),
    supabase
      .from("documents")
      .select("id,title,document_type,status,owner_candidate_id")
      .eq("organization_id", organization.id),
  ])

  for (const result of [applicationsResult, candidatesResult, jobsResult, departmentsResult, documentsResult]) {
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const applications = applicationsResult.data ?? []
  const candidates = candidatesResult.data ?? []
  const jobs = jobsResult.data ?? []
  const approved = applications.filter((app) => app.status === "approved").length
  const rejected = applications.filter((app) => app.status === "rejected").length
  const pending = applications.filter((app) => !["approved", "rejected"].includes(app.status)).length
  const aiScreened = applications.filter((app) => typeof app.ai_score === "number").length
  const aiApproved = applications.filter((app) => Number(app.ai_score ?? 0) >= 80).length
  const aiRejected = applications.filter((app) => app.status === "rejected" || Number(app.ai_score ?? 0) < 70).length

  const metrics: DashboardMetric[] = [
    { label: "Total Applications", value: String(applications.length), note: "Supabase submissions" },
    { label: "Approved", value: String(approved), note: "Applicants approved" },
    { label: "Rejected", value: String(rejected), note: "Applicants rejected" },
    { label: "Pending", value: String(pending), note: "Decision pending" },
    { label: "Total AI Screened", value: String(aiScreened), note: "AI screened applicants" },
    { label: "AI Approved", value: String(aiApproved), note: "Recommended by AI" },
    { label: "AI Rejected", value: String(aiRejected), note: "Not recommended" },
    { label: "Open Roles", value: String(jobs.length), note: "Published jobs" },
  ]

  const pipeline: CandidateRow[] = applications.map((application) => {
    const candidate = Array.isArray(application.candidates) ? application.candidates[0] : application.candidates
    const job = Array.isArray(application.job_posts) ? application.job_posts[0] : application.job_posts

    return {
      applicationId: application.id,
      code: candidate?.candidate_code ?? "CAND",
      name: candidate?.full_name ?? "Candidate",
      position: job?.title ?? "Open role",
      status: application.status,
      aiScore: application.ai_score ? `${application.ai_score}%` : "Pending",
      aiSummary: application.ai_summary ?? undefined,
      location: candidate?.current_location ?? "Remote",
    }
  })

  const departmentBreakdown = (departmentsResult.data ?? []).map((department) => ({
    name: department.name,
    value: Number((department.metadata as { demoApplications?: number } | null)?.demoApplications ?? 0),
  }))

  const hotPositions = jobs.map((job) => ({
    title: job.title,
    applicants: Number((job.metadata as { applicants?: number } | null)?.applicants ?? 0),
  }))
  const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate.full_name]))
  const documentLibrary: DocumentLibraryRow[] = (documentsResult.data ?? []).map((document) => ({
    id: document.id,
    title: document.title,
    documentType: document.document_type ?? "document",
    status: document.status ?? "active",
    owner: candidateById.get(document.owner_candidate_id ?? "") ?? "Organization",
  }))
  const automationRules = await getAutomationRulesForOrganization(supabase, organization.id)
  const linkedinIntegration = await getLinkedInSettingsForOrganization(supabase, organization.id)
  const jobPostSetup = await getJobPostSetupData()

  return {
    organization,
    metrics,
    departmentBreakdown,
    pipeline,
    hotPositions,
    candidateCount: candidates.length,
    documentLibrary,
    automationRules,
    linkedinIntegration,
    jobPostSetup,
  }
}

export async function getJobPostSetupData(): Promise<JobPostSetupData> {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const [departmentsResult, locationsResult, jobsResult] = await Promise.all([
    supabase
      .from("departments")
      .select("id,name")
      .eq("organization_id", organization.id)
      .order("name", { ascending: true }),
    supabase
      .from("work_locations")
      .select("id,name")
      .eq("organization_id", organization.id)
      .order("name", { ascending: true }),
    supabase
      .from("job_posts")
      .select("id,title,status,openings,metadata,departments(name),work_locations(name)")
      .eq("organization_id", organization.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ])

  for (const result of [departmentsResult, locationsResult, jobsResult]) {
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  return {
    organization,
    departments: departmentsResult.data ?? [],
    locations: locationsResult.data ?? [],
    recentJobs: (jobsResult.data ?? []).map((job) => {
      const department = Array.isArray(job.departments) ? job.departments[0] : job.departments
      const location = Array.isArray(job.work_locations) ? job.work_locations[0] : job.work_locations

      return {
        id: job.id,
        title: job.title,
        status: job.status,
        openings: job.openings,
        department: department?.name ?? "Recruitment",
        location: location?.name ?? "Remote",
        applicants: Number((job.metadata as { applicants?: number } | null)?.applicants ?? 0),
      }
    }),
  }
}

export async function createRecruitExeJobPost(payload: {
  title?: string
  department?: string
  location?: string
  openings?: number
  employmentType?: string
  summary?: string
  skills?: string[]
  status?: "draft" | "published"
}) {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()
  const title = payload.title?.trim()

  if (!title) {
    throw new Error("Job title is required")
  }

  const openings = Math.max(1, Math.min(250, Number(payload.openings ?? 1) || 1))
  const departmentName = payload.department?.trim() || "Recruitment"
  const locationName = payload.location?.trim() || "Remote"
  const status = payload.status === "draft" ? "draft" : "published"
  const slugBase = slugifyJobTitle(title) || "job-post"
  const slug = `${slugBase}-${Date.now().toString(36)}`
  const department = await ensureNamedRow(supabase, "departments", organization.id, departmentName)
  const location = await ensureNamedRow(supabase, "work_locations", organization.id, locationName)
  const skills = (payload.skills ?? [])
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 12)

  const jobResult = await supabase
    .from("job_posts")
    .insert({
      organization_id: organization.id,
      slug,
      title,
      department_id: department.id,
      work_location_id: location.id,
      employment_type: payload.employmentType?.trim() || "Full-time",
      openings,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      content: {
        summary: payload.summary?.trim() || "Role created from RecruitExe job post workflow.",
        skills,
      },
      metadata: {
        product: "recruitexe",
        source: "job-post-workflow",
        applicants: 0,
      },
    })
    .select("id,title,slug,status,openings,employment_type,content,departments(name),work_locations(name)")
    .single()

  if (jobResult.error) {
    throw new Error(jobResult.error.message)
  }

  const job = jobResult.data
  const jobDepartment = Array.isArray(job.departments) ? job.departments[0] : job.departments
  const jobLocation = Array.isArray(job.work_locations) ? job.work_locations[0] : job.work_locations

  return {
    organization,
    job: {
      id: job.id,
      title: job.title,
      slug: job.slug,
      status: job.status,
      openings: job.openings,
      employmentType: job.employment_type,
      department: jobDepartment?.name ?? departmentName,
      location: jobLocation?.name ?? locationName,
    },
  }
}

export async function getCandidateDashboardData() {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const [jobsResult, candidateResult, documentsResult] = await Promise.all([
    supabase
      .from("job_posts")
      .select("id,title,openings,content,metadata,departments(name),work_locations(name)")
      .eq("organization_id", organization.id)
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase
      .from("candidates")
      .select("id,full_name,profile_data")
      .eq("organization_id", organization.id)
      .eq("candidate_code", "CAND002")
      .single(),
    supabase
      .from("documents")
      .select("id,title")
      .eq("organization_id", organization.id),
  ])

  for (const result of [jobsResult, candidateResult, documentsResult]) {
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const candidate = candidateResult.data
  if (!candidate) {
    throw new Error("Candidate profile not found")
  }

  const applicationsResult = await supabase
    .from("job_applications")
    .select("id,status,job_post_id")
    .eq("organization_id", organization.id)
    .eq("candidate_id", candidate.id)

  if (applicationsResult.error) {
    throw new Error(applicationsResult.error.message)
  }

  const applications = applicationsResult.data ?? []
  const appliedPostIds = new Set(applications.map((application) => application.job_post_id))
  const applicationByPostId = new Map(applications.map((application) => [application.job_post_id, application]))
  const jobs: JobRow[] = (jobsResult.data ?? []).map((job) => {
    const department = Array.isArray(job.departments) ? job.departments[0] : job.departments
    const location = Array.isArray(job.work_locations) ? job.work_locations[0] : job.work_locations
    const application = applicationByPostId.get(job.id)

    return {
      title: job.title,
      department: department?.name ?? "Recruitment",
      location: location?.name ?? "Remote",
      action: appliedPostIds.has(job.id) ? "Applied" : "Apply",
      applicants: Number((job.metadata as { applicants?: number } | null)?.applicants ?? 0),
      status: application?.status,
    }
  })

  return {
    candidateName: candidate.full_name,
    profileCompletion: Number((candidate.profile_data as { profileCompletion?: number } | null)?.profileCompletion ?? 0),
    appliedJobs: applications.length,
    interviews: applications.filter((application) => application.status === "pending").length,
    documents: documentsResult.data?.length ?? 0,
    checks: "Passed",
    jobs,
  }
}

export async function getPublicCareersData(slug: string) {
  const supabase = getSupabaseAdminClient()
  await ensureRecruitExeDemoData()

  const organizationResult = await supabase
    .from("organizations")
    .select("id,name,slug,industry,organization_type")
    .eq("slug", slug)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const jobsResult = await supabase
    .from("job_posts")
    .select("id,title,openings,content,metadata,departments(name),work_locations(name)")
    .eq("organization_id", organizationResult.data.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (jobsResult.error) {
    throw new Error(jobsResult.error.message)
  }

  const jobs: PublicCareerJob[] = (jobsResult.data ?? []).map((job) => {
    const department = Array.isArray(job.departments) ? job.departments[0] : job.departments
    const location = Array.isArray(job.work_locations) ? job.work_locations[0] : job.work_locations
    const content = job.content as { summary?: string; skills?: string[] } | null

    return {
      title: job.title,
      department: department?.name ?? "Recruitment",
      location: location?.name ?? "Remote",
      openings: Number(job.openings ?? 0),
      applicants: Number((job.metadata as { applicants?: number } | null)?.applicants ?? 0),
      summary: content?.summary ?? "Role details will be shared by the hiring team.",
      skills: Array.isArray(content?.skills) ? content.skills : [],
    }
  })

  return {
    organization: organizationResult.data,
    publicUrl: `/careers/${organizationResult.data.slug}`,
    legacyUrl: `/CareerPage/${organizationResult.data.slug}`,
    jobs,
    departments: [...new Set(jobs.map((job) => job.department))],
    locations: [...new Set(jobs.map((job) => job.location))],
  }
}

export async function applyToJobPostForDemoCandidate(jobTitle: string) {
  return applyToJobPostFromPublicLink({ jobTitle })
}

export async function applyToJobPostFromPublicLink(payload: PublicApplyPayload) {
  const supabase = getSupabaseAdminClient()
  await ensureRecruitExeDemoData()
  const jobTitle = payload.jobTitle?.trim()
  const email = normalizeEmail(payload.email)
  const fullName = payload.fullName?.trim()

  if (!jobTitle) {
    throw new Error("Job title is required")
  }

  if ((email || fullName) && (!fullName || !email)) {
    throw new Error("Candidate name and email are required for public applications")
  }

  const organizationResult = await supabase
    .from("organizations")
    .select("id,name,slug")
    .eq("slug", payload.organizationSlug?.trim() || organizationSlug)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const organization = organizationResult.data
  const jobResult = await supabase
    .from("job_posts")
    .select("id,title,metadata")
    .eq("organization_id", organization.id)
    .eq("title", jobTitle)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (jobResult.error) {
    throw new Error(jobResult.error.message)
  }

  if (!jobResult.data) {
    throw new Error("Published job not found")
  }

  const candidateResult = email
    ? await supabase
      .from("candidates")
      .select("id,full_name,email,current_location,metadata")
      .eq("organization_id", organization.id)
      .eq("email", email)
      .limit(1)
      .maybeSingle()
    : await supabase
      .from("candidates")
      .select("id,full_name,email,current_location,metadata")
      .eq("organization_id", organization.id)
      .eq("candidate_code", "CAND002")
      .single()

  if (candidateResult.error) {
    throw new Error(candidateResult.error.message)
  }

  let candidate = candidateResult.data

  if (!candidate && email && fullName) {
    const createdCandidate = await supabase
      .from("candidates")
      .insert({
        organization_id: organization.id,
        candidate_code: candidateCodeFromEmail(email),
        full_name: fullName,
        email,
        phone: payload.phone?.trim() || null,
        current_location: payload.currentLocation?.trim() || null,
        resume_url: payload.resumeUrl?.trim() || null,
        source: payload.source?.trim() || "Public careers link",
        profile_data: { profileCompletion: payload.resumeUrl ? 82 : 58 },
        metadata: {
          product: "recruitexe",
          intake: "public-careers",
          organizationSlug: organization.slug,
        },
      })
      .select("id,full_name,email,current_location,metadata")
      .single()

    if (createdCandidate.error) {
      throw new Error(createdCandidate.error.message)
    }

    candidate = createdCandidate.data
  } else if (candidate && email && fullName) {
    const updatedCandidate = await supabase
      .from("candidates")
      .update({
        full_name: fullName,
        phone: payload.phone?.trim() || null,
        current_location: payload.currentLocation?.trim() || candidate.current_location,
        resume_url: payload.resumeUrl?.trim() || null,
        source: payload.source?.trim() || "Public careers link",
        metadata: {
          ...((candidate.metadata as Record<string, unknown> | null) ?? {}),
          latestIntake: "public-careers",
          latestIntakeAt: new Date().toISOString(),
          organizationSlug: organization.slug,
        },
      })
      .eq("id", candidate.id)
      .select("id,full_name,email,current_location,metadata")
      .single()

    if (updatedCandidate.error) {
      throw new Error(updatedCandidate.error.message)
    }

    candidate = updatedCandidate.data
  }

  if (!candidate) {
    throw new Error("Candidate profile could not be created")
  }

  const existingApplication = await supabase
    .from("job_applications")
    .select("id,status,ai_score,metadata")
    .eq("organization_id", organization.id)
    .eq("job_post_id", jobResult.data.id)
    .eq("candidate_id", candidate.id)
    .maybeSingle()

  if (existingApplication.error) {
    throw new Error(existingApplication.error.message)
  }

  const aiScore = Math.max(70, Math.min(94, 72 + Math.round(`${candidate.full_name} ${jobTitle}`.length * 0.9)))
  const applicationPayload = {
    status: existingApplication.data?.status ?? "applied",
    ai_score: existingApplication.data?.ai_score ?? aiScore,
    ai_summary: aiScore >= 80 ? "Strong match for current role requirements." : "Needs HR review before next stage.",
    source: payload.source?.trim() || (email ? "Public careers link" : "RecruitExe demo"),
    answers: {
      fullName: candidate.full_name,
      email: candidate.email,
      phone: payload.phone?.trim() || null,
      currentLocation: payload.currentLocation?.trim() || candidate.current_location,
      resumeUrl: payload.resumeUrl?.trim() || null,
    },
    metadata: {
      ...((existingApplication.data?.metadata as Record<string, unknown> | null) ?? {}),
      product: "recruitexe",
      intake: email ? "public-careers" : "demo-candidate",
      organizationSlug: organization.slug,
      submittedAt: new Date().toISOString(),
    },
  }

  const applicationResult = existingApplication.data
    ? await supabase
      .from("job_applications")
      .update(applicationPayload)
      .eq("id", existingApplication.data.id)
      .select("id,status,ai_score")
      .single()
    : await supabase
      .from("job_applications")
      .insert({
        organization_id: organization.id,
        job_post_id: jobResult.data.id,
        candidate_id: candidate.id,
        ...applicationPayload,
      })
      .select("id,status,ai_score")
      .single()

  if (applicationResult.error) {
    throw new Error(applicationResult.error.message)
  }

  if (!existingApplication.data) {
    const existingApplicants = Number((jobResult.data.metadata as { applicants?: number } | null)?.applicants ?? 0)
    await supabase
      .from("job_posts")
      .update({
        metadata: {
          ...(jobResult.data.metadata as Record<string, unknown> | null),
          applicants: existingApplicants + 1,
        },
      })
      .eq("id", jobResult.data.id)
      .throwOnError()
  }

  return {
    applicationId: applicationResult.data.id,
    candidateName: candidate.full_name,
    jobTitle: jobResult.data.title,
    status: applicationResult.data.status,
    aiScore: applicationResult.data.ai_score ? `${applicationResult.data.ai_score}%` : "Pending",
    isNewApplication: !existingApplication.data,
    nextStep:
      applicationResult.data.status === "approved"
        ? "HR shortlist queue"
        : applicationResult.data.status === "rejected"
          ? "Closed by screening rules"
          : "AI screening and HR review",
  }
}

export async function runAiScreeningForDemoApplications(options: { limit?: number } = {}) {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const applicationsResult = await supabase
    .from("job_applications")
    .select("id,status,ai_score,metadata,candidates(full_name,candidate_code),job_posts(title)")
    .eq("organization_id", organization.id)

  if (applicationsResult.error) {
    throw new Error(applicationsResult.error.message)
  }

  const rows = applicationsResult.data ?? []
  const screenableRows = rows
    .filter((row) => ["applied", "pending"].includes(row.status))
    .slice(0, options.limit)
  const screened = []

  for (const row of screenableRows) {
    const candidate = Array.isArray(row.candidates) ? row.candidates[0] : row.candidates
    const job = Array.isArray(row.job_posts) ? row.job_posts[0] : row.job_posts
    const result = await generateScreeningDecision(candidate?.full_name ?? "Candidate", job?.title ?? "Open role", row.status)

    const updateResult = await supabase
      .from("job_applications")
      .update({
        status: result.status,
        ai_score: result.score,
        ai_summary: result.summary,
        metadata: {
          ...((row.metadata as Record<string, unknown> | null) ?? {}),
          aiScreening: {
            provider: result.provider,
            screenedAt: new Date().toISOString(),
            sourceStatus: row.status,
          },
        },
      })
      .eq("id", row.id)
      .select("id,status,ai_score,ai_summary")
      .single()

    if (updateResult.error) {
      throw new Error(updateResult.error.message)
    }

    screened.push({
      applicationId: updateResult.data.id,
      candidateName: candidate?.full_name ?? "Candidate",
      candidateCode: candidate?.candidate_code ?? "CAND",
      jobTitle: job?.title ?? "Open role",
      status: updateResult.data.status,
      aiScore: updateResult.data.ai_score ? `${updateResult.data.ai_score}%` : "Pending",
      aiSummary: updateResult.data.ai_summary,
    })
  }

  return {
    screened,
    screenedCount: screened.length,
    totalApplications: rows.length,
    provider: isGeminiConfigured() ? "gemini-ready" : "rules-fallback",
  }
}

function normalizeAutomationRules(value: unknown): AutomationRule[] {
  if (!Array.isArray(value)) {
    return defaultAutomationRules
  }

  return defaultAutomationRules.map((defaultRule) => {
    const savedRule = value.find((rule): rule is Partial<AutomationRule> => {
      return typeof rule === "object" && rule !== null && "id" in rule && rule.id === defaultRule.id
    })

    return {
      ...defaultRule,
      enabled: typeof savedRule?.enabled === "boolean" ? savedRule.enabled : defaultRule.enabled,
    }
  })
}

function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)
}

function normalizeLinkedInSettings(value: unknown): LinkedInIntegrationSettings {
  const saved = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {}
  const organizationMode = saved.organizationMode === "agency" ? "agency" : "company"
  const geminiConfigured = isGeminiConfigured()

  return {
    organizationMode,
    workspaceName: typeof saved.workspaceName === "string" && saved.workspaceName.trim() ? saved.workspaceName : defaultLinkedInSettings.workspaceName,
    defaultClientName: typeof saved.defaultClientName === "string" && saved.defaultClientName.trim() ? saved.defaultClientName : defaultLinkedInSettings.defaultClientName,
    defaultTone: typeof saved.defaultTone === "string" && saved.defaultTone.trim() ? saved.defaultTone : defaultLinkedInSettings.defaultTone,
    approvalRequired: typeof saved.approvalRequired === "boolean" ? saved.approvalRequired : defaultLinkedInSettings.approvalRequired,
    autoSchedule: typeof saved.autoSchedule === "boolean" ? saved.autoSchedule : defaultLinkedInSettings.autoSchedule,
    linkedinConnected: Boolean(saved.linkedinConnected),
    linkedinAccountName: typeof saved.linkedinAccountName === "string" ? saved.linkedinAccountName : "",
    linkedinTokenLastFour: typeof saved.linkedinTokenLastFour === "string" ? saved.linkedinTokenLastFour : "",
    linkedinTokenUpdatedAt: typeof saved.linkedinTokenUpdatedAt === "string" ? saved.linkedinTokenUpdatedAt : null,
    geminiConfigured,
    geminiProvider: geminiConfigured ? "gemini" : "rules-fallback",
  }
}

async function getAutomationRulesForOrganization(supabase: SupabaseAdmin, organizationId: string) {
  const organizationResult = await supabase
    .from("organizations")
    .select("settings")
    .eq("id", organizationId)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const settings = organizationResult.data.settings as { automationRules?: unknown } | null

  return normalizeAutomationRules(settings?.automationRules)
}

async function getLinkedInSettingsForOrganization(supabase: SupabaseAdmin, organizationId: string) {
  const organizationResult = await supabase
    .from("organizations")
    .select("settings")
    .eq("id", organizationId)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const settings = organizationResult.data.settings as { linkedinIntegration?: unknown } | null

  return normalizeLinkedInSettings(settings?.linkedinIntegration)
}

export async function getAutomationRulesData() {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const organizationResult = await supabase
    .from("organizations")
    .select("id,name,settings")
    .eq("id", organization.id)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const rules = normalizeAutomationRules((organizationResult.data.settings as { automationRules?: unknown } | null)?.automationRules)

  return {
    organization: {
      id: organizationResult.data.id,
      name: organizationResult.data.name,
    },
    rules,
  }
}

export async function getLinkedInIntegrationData() {
  const supabase = getSupabaseAdminClient()
  const { organization } = await ensureRecruitExeDemoData()

  const organizationResult = await supabase
    .from("organizations")
    .select("id,name,settings")
    .eq("id", organization.id)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const settings = organizationResult.data.settings as { linkedinIntegration?: unknown } | null

  return {
    organization: {
      id: organizationResult.data.id,
      name: organizationResult.data.name,
    },
    settings: normalizeLinkedInSettings(settings?.linkedinIntegration),
  }
}

export async function saveLinkedInIntegrationSettings(payload: {
  organizationMode?: "company" | "agency"
  workspaceName?: string
  defaultClientName?: string
  defaultTone?: string
  approvalRequired?: boolean
  autoSchedule?: boolean
  linkedinAccountName?: string
  linkedinAccessToken?: string
  clearLinkedinToken?: boolean
}) {
  const supabase = getSupabaseAdminClient()
  const { organization, settings: currentSettings } = await getLinkedInIntegrationData()

  const organizationResult = await supabase
    .from("organizations")
    .select("settings")
    .eq("id", organization.id)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  const existingSettings = (organizationResult.data.settings as Record<string, unknown> | null) ?? {}
  const existingLinkedIn = (existingSettings.linkedinIntegration as Record<string, unknown> | undefined) ?? {}
  const { serverAccessToken: _discardedLegacyToken, ...safeExistingLinkedIn } = existingLinkedIn
  const token = payload.linkedinAccessToken?.trim().slice(0, 4096)
  const shouldClearToken = Boolean(payload.clearLinkedinToken)
  const nextLinkedinConnected = shouldClearToken ? false : token ? true : currentSettings.linkedinConnected

  const nextSettings = {
    ...safeExistingLinkedIn,
    organizationMode: payload.organizationMode === "agency" ? "agency" : "company",
    workspaceName: cleanSettingText(payload.workspaceName, currentSettings.workspaceName),
    defaultClientName: cleanSettingText(payload.defaultClientName, currentSettings.defaultClientName),
    defaultTone: cleanSettingText(payload.defaultTone, currentSettings.defaultTone, 48),
    approvalRequired: typeof payload.approvalRequired === "boolean" ? payload.approvalRequired : currentSettings.approvalRequired,
    autoSchedule: typeof payload.autoSchedule === "boolean" ? payload.autoSchedule : currentSettings.autoSchedule,
    linkedinAccountName: cleanSettingText(payload.linkedinAccountName, currentSettings.linkedinAccountName),
    linkedinConnected: nextLinkedinConnected,
    linkedinTokenLastFour: shouldClearToken ? "" : token ? token.slice(-4) : currentSettings.linkedinTokenLastFour,
    linkedinTokenUpdatedAt: shouldClearToken ? null : token ? new Date().toISOString() : currentSettings.linkedinTokenUpdatedAt,
    linkedinTokenStorage: nextLinkedinConnected ? "metadata-only" : "not-connected",
  }

  await supabase
    .from("organizations")
    .update({
      settings: {
        ...existingSettings,
        linkedinIntegration: nextSettings,
      },
    })
    .eq("id", organization.id)
    .throwOnError()

  return {
    organization,
    settings: normalizeLinkedInSettings(nextSettings),
  }
}

export async function saveAutomationRules(rules: Array<Pick<AutomationRule, "id" | "enabled">>) {
  const supabase = getSupabaseAdminClient()
  const { organization, rules: currentRules } = await getAutomationRulesData()

  const incoming = new Map(rules.map((rule) => [rule.id, rule.enabled]))
  const nextRules = currentRules.map((rule) => ({
    ...rule,
    enabled: incoming.has(rule.id) ? Boolean(incoming.get(rule.id)) : rule.enabled,
  }))

  const organizationResult = await supabase
    .from("organizations")
    .select("settings")
    .eq("id", organization.id)
    .single()

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message)
  }

  await supabase
    .from("organizations")
    .update({
      settings: {
        ...((organizationResult.data.settings as Record<string, unknown> | null) ?? {}),
        automationRules: nextRules,
      },
    })
    .eq("id", organization.id)
    .throwOnError()

  return {
    organization,
    rules: nextRules,
  }
}

export async function runAutomationRulesForDemoApplications(options: { limit?: number } = {}) {
  const supabase = getSupabaseAdminClient()
  const { organization, rules } = await getAutomationRulesData()
  const enabledRules = new Set(rules.filter((rule) => rule.enabled).map((rule) => rule.id))

  const applicationsResult = await supabase
    .from("job_applications")
    .select("id,status,ai_score,metadata,candidates(full_name,candidate_code),job_posts(title)")
    .eq("organization_id", organization.id)

  if (applicationsResult.error) {
    throw new Error(applicationsResult.error.message)
  }

  const actions = []

  for (const application of (applicationsResult.data ?? []).slice(0, options.limit)) {
    const score = Number(application.ai_score ?? 0)
    const metadata = (application.metadata as Record<string, unknown> | null) ?? {}
    const automationMetadata = typeof metadata.automation === "object" && metadata.automation !== null
      ? metadata.automation as { ruleId?: string }
      : null
    let nextStatus = application.status
    let matchedRule: AutomationRule["id"] | null = null

    if (enabledRules.has("auto-approve-high-match") && score >= 85 && !["approved", "rejected"].includes(application.status)) {
      nextStatus = "approved"
      matchedRule = "auto-approve-high-match"
    } else if (
      enabledRules.has("review-mid-match") &&
      score >= 74 &&
      score <= 84 &&
      !["approved", "rejected", "review"].includes(application.status)
    ) {
      nextStatus = "review"
      matchedRule = "review-mid-match"
    } else if (enabledRules.has("reject-low-match") && score > 0 && score <= 72 && !["approved", "rejected"].includes(application.status)) {
      nextStatus = "rejected"
      matchedRule = "reject-low-match"
    } else if (
      enabledRules.has("candidate-followup") &&
      application.status === "applied" &&
      !application.ai_score &&
      automationMetadata?.ruleId !== "candidate-followup"
    ) {
      matchedRule = "candidate-followup"
    }

    if (!matchedRule) {
      continue
    }

    const candidate = Array.isArray(application.candidates) ? application.candidates[0] : application.candidates
    const job = Array.isArray(application.job_posts) ? application.job_posts[0] : application.job_posts

    if (nextStatus !== application.status || matchedRule === "candidate-followup") {
      await supabase
        .from("job_applications")
        .update({
          status: nextStatus,
          metadata: {
            ...metadata,
            automation: {
              ruleId: matchedRule,
              appliedAt: new Date().toISOString(),
              previousStatus: application.status,
              nextStatus,
            },
          },
        })
        .eq("id", application.id)
        .throwOnError()
    }

    actions.push({
      applicationId: application.id,
      candidateName: candidate?.full_name ?? "Candidate",
      candidateCode: candidate?.candidate_code ?? "CAND",
      jobTitle: job?.title ?? "Open role",
      ruleId: matchedRule,
      previousStatus: application.status,
      nextStatus,
      aiScore: application.ai_score ? `${application.ai_score}%` : "Pending",
    })
  }

  return {
    organization,
    actions,
    actionCount: actions.length,
    enabledCount: enabledRules.size,
    totalApplications: applicationsResult.data?.length ?? 0,
  }
}
