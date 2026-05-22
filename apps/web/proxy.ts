import { NextResponse, type NextRequest } from "next/server"

const legacyPathMap = new Map<string, string>([
  ["/home", "/hr/dashboard"],
  ["/jobpost", "/hr/modules/recruitment/job-posts"],
  ["/RecruiterPerformance", "/hr/modules/recruitment/recruiter-analytics"],
  ["/jobpost/createNewPost", "/hr/modules/recruitment/create-post"],
  ["/LinkedinPosting/dashboard", "/hr/modules/integrations/linkedin-dashboard"],
  ["/LinkedinPosting", "/hr/modules/integrations/linkedin-create-post"],
  ["/JobApplications", "/hr/modules/applications/dashboard"],
  ["/JobApplications/CandidateManagement", "/hr/modules/applications/candidates"],
  ["/JobApplications/CandidateMap", "/hr/modules/applications/map"],
  ["/JobApplications/aiScreening", "/hr/modules/applications/dashboard"],
  ["/InterviewMonitor", "/hr/modules/interviews/monitor"],
  ["/InterviewMonitor/TelePhonic", "/hr/modules/interviews/call-logs"],
  ["/components/dashboard", "/hr/modules/expenses/dashboard"],
  ["/components/expensesdetails", "/hr/modules/expenses/dashboard"],
  ["/components/approverScreen", "/hr/modules/expenses/dashboard"],
  ["/components/remiter", "/hr/modules/expenses/dashboard"],
  ["/employeeSetup/NewVendorForm", "/hr/modules/expenses/dashboard"],
  ["/components/policy", "/hr/modules/expenses/dashboard"],
  ["/components/configurationList", "/hr/modules/expenses/dashboard"],
  ["/components/categorySettings", "/hr/modules/expenses/dashboard"],
  ["/expenseTypeSettings", "/hr/modules/expenses/dashboard"],
  ["/components/roleAndPermission", "/hr/modules/expenses/dashboard"],
  ["/AgencySetup", "/hr/modules/setup/agency"],
  ["/employeeSetup", "/hr/modules/setup/settings"],
  ["/adminManagement", "/hr/modules/admin/dashboard"],
  ["/planUsage", "/hr/modules/admin/plan-usage"],
  ["/commandexe/home", "/hr/modules/commandexe/dashboard"],
  ["/commandexe/caseList/addCases", "/hr/modules/commandexe/add-case"],
  ["/commandexe/caseList/initiateCases", "/hr/modules/commandexe/backoffice"],
  ["/commandexe/invoice", "/hr/modules/commandexe/invoice"],
  ["/notes", "/hr/modules/utilities/notes"],
  ["/sameNewChat", "/hr/modules/utilities/chats"],
  ["/FileManagerNew", "/hr/modules/utilities/file-manager"],
  ["/completeProfile", "/candidate/modules/profile"],
  ["/viewProfile", "/candidate/modules/profile"],
  ["/Careers", "/candidate/modules/careers"],
  ["/Careers/jobPostDashboard", "/candidate/modules/careers"],
  ["/Careers/jobDescription", "/candidate/modules/careers"],
  ["/applications", "/candidate/modules/applications"],
  ["/myAppliedJobs", "/candidate/modules/applications"],
  ["/interviews", "/candidate/modules/interviews"],
])

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  let destination = legacyPathMap.get(url.pathname)

  if (url.pathname === "/JobApplications") {
    const stage = url.searchParams.get("stage")
    if (stage === "2") {
      destination = "/hr/modules/applications/candidates"
    }
    if (stage === "3") {
      destination = "/hr/modules/applications/map"
    }
  }

  if (!destination) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = destination
  redirectUrl.search = ""

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/home",
    "/jobpost/:path*",
    "/RecruiterPerformance",
    "/LinkedinPosting/:path*",
    "/JobApplications/:path*",
    "/InterviewMonitor/:path*",
    "/components/:path*",
    "/expenseTypeSettings",
    "/AgencySetup",
    "/employeeSetup/:path*",
    "/adminManagement",
    "/planUsage",
    "/commandexe/:path*",
    "/notes",
    "/sameNewChat",
    "/FileManagerNew/:path*",
    "/completeProfile",
    "/viewProfile",
    "/Careers/:path*",
    "/applications",
    "/myAppliedJobs",
    "/interviews",
  ],
}
