import "server-only"

import { getSupabaseAdminClient } from "@/lib/supabase/admin"

const organizationSlug = "recruitexe-demo"

type SupabaseAdmin = ReturnType<typeof getSupabaseAdminClient>

type DashboardMetric = {
  label: string
  value: string
  note: string
}

type CandidateRow = {
  code: string
  name: string
  position: string
  status: string
  aiScore: string
}

type JobRow = {
  title: string
  department: string
  location: string
  action: "Apply" | "Applied"
  applicants: number
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
  return getSingle<{ id: string; name: string }>(
    supabase
      .from("organizations")
      .upsert(
        {
          slug: organizationSlug,
          name: "Fincoopers RecruitExe Demo",
          legal_name: "Fincoopers Consulting Services",
          organization_type: "enterprise",
          industry: "Financial Services",
          website: "https://fincoopers.in",
          settings: { demo: true, product: "recruitexe" },
        },
        { onConflict: "slug" },
      )
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
  return getSingle<{ id: string; status: string; ai_score: number | null }>(
    supabase
      .from("job_applications")
      .upsert(
        {
          organization_id: organizationId,
          job_post_id: jobPostId,
          candidate_id: candidateId,
          status,
          ai_score: aiScore,
          ai_summary: aiScore >= 80 ? "Strong match for current role requirements." : "Needs HR review before next stage.",
          source: "RecruitExe demo",
          metadata: { demo: true },
        },
        { onConflict: "job_post_id,candidate_id" },
      )
      .select("id,status,ai_score")
      .single(),
    "ensure application",
  )
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
  ] = await Promise.all([
    supabase
      .from("job_applications")
      .select("status,ai_score,job_posts(title),candidates(candidate_code,full_name)")
      .eq("organization_id", organization.id),
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
  ])

  for (const result of [applicationsResult, candidatesResult, jobsResult, departmentsResult]) {
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
  const aiRejected = applications.filter((app) => Number(app.ai_score ?? 0) < 70).length

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

  const pipeline: CandidateRow[] = applications.slice(0, 6).map((application) => {
    const candidate = Array.isArray(application.candidates) ? application.candidates[0] : application.candidates
    const job = Array.isArray(application.job_posts) ? application.job_posts[0] : application.job_posts

    return {
      code: candidate?.candidate_code ?? "CAND",
      name: candidate?.full_name ?? "Candidate",
      position: job?.title ?? "Open role",
      status: application.status,
      aiScore: application.ai_score ? `${application.ai_score}%` : "Pending",
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

  return {
    organization,
    metrics,
    departmentBreakdown,
    pipeline,
    hotPositions,
    candidateCount: candidates.length,
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
  const jobs: JobRow[] = (jobsResult.data ?? []).map((job) => {
    const department = Array.isArray(job.departments) ? job.departments[0] : job.departments
    const location = Array.isArray(job.work_locations) ? job.work_locations[0] : job.work_locations

    return {
      title: job.title,
      department: department?.name ?? "Recruitment",
      location: location?.name ?? "Remote",
      action: appliedPostIds.has(job.id) ? "Applied" : "Apply",
      applicants: Number((job.metadata as { applicants?: number } | null)?.applicants ?? 0),
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
