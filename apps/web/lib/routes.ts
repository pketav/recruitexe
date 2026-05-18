export const appRoutes = {
  home: "/",
  hrLogin: "/hr/login",
  hrDashboard: "/hr/dashboard",
  candidateLogin: "/candidate/login",
  candidateDashboard: "/candidate/dashboard",
} as const

export function getSiteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:4030"
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

export function getAbsoluteUrl(path = "/") {
  const origin = getSiteOrigin().replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${origin}${normalizedPath}`
}
