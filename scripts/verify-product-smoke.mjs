const baseUrl = normalizeBaseUrl(process.env.SMOKE_BASE_URL || "http://localhost:4030")

const pageChecks = [
  { path: "/", expectedStatus: 200 },
  { path: "/hr/dashboard", expectedStatus: 200 },
  { path: "/hr/modules/recruitment/job-posts", expectedStatus: 200 },
  { path: "/hr/modules/recruitment/create-post", expectedStatus: 200 },
  { path: "/hr/modules/applications/ai-screening", expectedStatus: 200 },
  { path: "/hr/modules/setup/customer-links", expectedStatus: 200 },
  { path: "/hr/modules/setup/automation-rules", expectedStatus: 200 },
  { path: "/hr/modules/integrations/linkedin-create-post", expectedStatus: 200 },
  { path: "/candidate/dashboard", expectedStatus: 200 },
  { path: "/candidate/modules/careers", expectedStatus: 200 },
  { path: "/candidate/modules/applications", expectedStatus: 200 },
  { path: "/careers/recruitexe-demo", expectedStatus: 200 },
  { path: "/robots.txt", expectedStatus: 200 },
  { path: "/sitemap.xml", expectedStatus: 200 },
]

const apiChecks = [
  { path: "/api/hr/dashboard", expectedStatus: 200, expectedText: "metrics" },
  { path: "/api/candidate/dashboard", expectedStatus: 200, expectedText: "jobs" },
]

const redirectChecks = [
  { path: "/CareerPage/recruitexe-demo?role=Branch%20Manager", expectedPath: "/careers/recruitexe-demo" },
  { path: "/JobApplications?stage=2", expectedPath: "/hr/modules/applications/candidates" },
  { path: "/jobpost/createNewPost", expectedPath: "/hr/modules/recruitment/create-post" },
  { path: "/completeProfile", expectedPath: "/candidate/modules/profile" },
]

const apiContractChecks = [
  {
    path: "/api/candidate/apply",
    expectedStatus: 400,
    payload: { organizationSlug: "recruitexe-demo", jobTitle: "Branch Manager", email: "smoke@example.com" },
    expectedText: "Full name is required",
  },
  {
    path: "/api/candidate/apply",
    expectedStatus: 400,
    payload: { organizationSlug: "recruitexe-demo", jobTitle: "Branch Manager", fullName: "Smoke Candidate", email: "bad-email" },
    expectedText: "Valid email is required",
  },
  {
    path: "/api/candidate/apply",
    expectedStatus: 400,
    payload: { organizationSlug: "recruitexe-demo", jobTitle: "Branch Manager", fullName: "Smoke Candidate", email: "smoke@example.com", resumeUrl: "javascript:alert(1)" },
    expectedText: "Resume link must be",
  },
  {
    path: "/api/candidate/apply",
    expectedStatus: 404,
    payload: { organizationSlug: "recruitexe-demo", jobTitle: "Definitely Missing Smoke Role", fullName: "Smoke Candidate", email: "smoke-missing-role@example.com" },
    expectedText: "Published job not found",
  },
  {
    path: "/api/hr/automation-rules",
    expectedStatus: 400,
    payload: { rules: [{ id: "unknown-rule", enabled: true }] },
    expectedText: "Unknown automation rule",
  },
  {
    path: "/api/hr/automation-rules",
    expectedStatus: 400,
    payload: [],
    expectedText: "payload must be an object",
  },
  {
    path: "/api/hr/automation-rules/run",
    expectedStatus: 400,
    payload: { mode: "dry-run" },
    expectedText: "Automation run mode",
  },
  {
    path: "/api/hr/automation-rules/run",
    expectedStatus: 400,
    payload: { mode: "apply-enabled-rules", limit: 0 },
    expectedText: "between 1 and 100",
  },
  {
    path: "/api/hr/linkedin-settings",
    expectedStatus: 400,
    payload: { organizationMode: "enterprise" },
    expectedText: "Organization mode",
  },
  {
    path: "/api/ai/linkedin-post",
    expectedStatus: 400,
    payload: { organizationMode: "enterprise", jobTitle: "Branch Manager" },
    expectedText: "Organization mode",
  },
  {
    path: "/api/ai/linkedin-post",
    expectedStatus: 400,
    payload: { organizationMode: "agency", companyName: "Fincoopers RecruitExe Demo" },
    expectedText: "Job title is required",
  },
  {
    path: "/api/hr/ai-screening",
    expectedStatus: 400,
    payload: { mode: "screen-all" },
    expectedText: "AI screening mode",
  },
  {
    path: "/api/hr/ai-screening",
    expectedStatus: 400,
    payload: { mode: "screen-pending", limit: 0 },
    expectedText: "between 1 and 50",
  },
]

const publicApplyChecks = [
  {
    path: "/api/candidate/apply",
    expectedStatus: 200,
    payload: {
      organizationSlug: "recruitexe-demo",
      jobTitle: "Branch Manager",
      fullName: "Smoke Candidate",
      email: `smoke+${Date.now()}@example.com`,
      phone: "+91 90000 00000",
      currentLocation: "Mumbai",
      resumeUrl: "https://example.com/resume.pdf",
    },
    expectedText: "applicationId",
  },
]

const linkedInDraftChecks = [
  {
    path: "/api/ai/linkedin-post",
    expectedStatus: 200,
    payload: {
      organizationMode: "agency",
      companyName: "Fincoopers RecruitExe Demo",
      clientName: "Smoke Client",
      jobTitle: "Branch Manager",
      location: "Mumbai",
      tone: "Professional",
      audience: "qualified BFSI candidates",
      notes: "Keep client details safe and push fast screening.",
    },
    expectedText: "drafts",
  },
]

const aiScreeningChecks = [
  {
    path: "/api/hr/ai-screening",
    expectedStatus: 200,
    payload: { mode: "screen-pending", limit: 5 },
    expectedText: "screenedCount",
  },
]

const automationRuleChecks = [
  {
    path: "/api/hr/automation-rules",
    expectedStatus: 200,
    payload: {
      rules: [
        { id: "auto-approve-high-match", enabled: true },
        { id: "review-mid-match", enabled: true },
        { id: "reject-low-match", enabled: true },
        { id: "candidate-followup", enabled: true },
      ],
    },
    expectedText: "rules",
  },
  {
    path: "/api/hr/automation-rules/run",
    expectedStatus: 200,
    payload: { mode: "apply-enabled-rules", limit: 20 },
    expectedText: "actionCount",
  },
]

function normalizeBaseUrl(value) {
  const withProtocol = value.startsWith("http") ? value : `https://${value}`

  return withProtocol.replace(/\/$/, "")
}

async function assertResponse({ path, expectedStatus, expectedText }) {
  const response = await fetch(`${baseUrl}${path}`)
  const text = await response.text()

  if (response.status !== expectedStatus) {
    throw new Error(`${path} expected ${expectedStatus}, got ${response.status}`)
  }

  if (expectedText && !text.includes(expectedText)) {
    throw new Error(`${path} did not include expected text: ${expectedText}`)
  }

  console.log(`${path} ${response.status}`)
}

async function assertRedirect({ path, expectedPath }) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" })
  const finalUrl = new URL(response.url)

  if (response.status !== 200) {
    throw new Error(`${path} redirected to status ${response.status}`)
  }

  if (finalUrl.pathname !== expectedPath) {
    throw new Error(`${path} expected final path ${expectedPath}, got ${finalUrl.pathname}`)
  }

  console.log(`${path} -> ${finalUrl.pathname}`)
}

async function assertPostContract({ path, expectedStatus, payload, expectedText }) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const text = await response.text()

  if (response.status !== expectedStatus) {
    throw new Error(`${path} expected ${expectedStatus}, got ${response.status}: ${text.slice(0, 180)}`)
  }

  if (expectedText && !text.includes(expectedText)) {
    throw new Error(`${path} did not include expected error text: ${expectedText}`)
  }

  console.log(`${path} POST ${response.status}`)
}

for (const check of [...pageChecks, ...apiChecks]) {
  await assertResponse(check)
}

for (const check of redirectChecks) {
  await assertRedirect(check)
}

for (const check of apiContractChecks) {
  await assertPostContract(check)
}

for (const check of publicApplyChecks) {
  await assertPostContract(check)
}

for (const check of linkedInDraftChecks) {
  await assertPostContract(check)
}

for (const check of aiScreeningChecks) {
  await assertPostContract(check)
}

for (const check of automationRuleChecks) {
  await assertPostContract(check)
}

console.log(`Product smoke passed for ${baseUrl}.`)
