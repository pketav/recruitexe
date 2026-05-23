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

for (const check of [...pageChecks, ...apiChecks]) {
  await assertResponse(check)
}

for (const check of redirectChecks) {
  await assertRedirect(check)
}

console.log(`Product smoke passed for ${baseUrl}.`)
