export const appRoutes = {
  home: "/",
  hrLogin: "/hr/login",
  hrDashboard: "/hr/dashboard",
  candidateLogin: "/candidate/login",
  candidateDashboard: "/candidate/dashboard",
} as const

function normalizeOrigin(origin?: string) {
  if (!origin) {
    return ""
  }

  const withProtocol = origin.startsWith("http") ? origin : `https://${origin}`
  return withProtocol.replace(/\/$/, "")
}

export function getSiteOrigin() {
  return normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_WEB_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL,
  ) || "http://localhost:4030"
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

export function getAbsoluteUrl(path = "/") {
  const origin = getSiteOrigin()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${origin}${normalizedPath}`
}
