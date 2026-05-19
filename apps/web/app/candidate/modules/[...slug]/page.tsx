import { notFound } from "next/navigation"

import { WorkspaceModulePage } from "@/components/workspace-module-page"
import { getCandidateDashboardData } from "@/lib/demo/recruitexe-data"
import { candidateNavigation, findCandidateModule } from "@/lib/workspace-navigation"

export const dynamic = "force-dynamic"

type CandidateModulePageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function CandidateModulePage({ params }: CandidateModulePageProps) {
  const { slug } = await params
  const module = findCandidateModule(slug)

  if (!module) {
    notFound()
  }

  const data = await getCandidateDashboardData()

  return (
    <WorkspaceModulePage
      brand="RecruitExe Candidate"
      homeHref="/candidate/dashboard"
      backHref="/candidate/dashboard"
      navigation={candidateNavigation}
      module={module}
      mode="candidate"
      data={data}
    />
  )
}
