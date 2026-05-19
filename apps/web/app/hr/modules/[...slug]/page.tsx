import { notFound } from "next/navigation"

import { WorkspaceModulePage } from "@/components/workspace-module-page"
import { getHrDashboardData } from "@/lib/demo/recruitexe-data"
import { findHrModule, hrNavigation } from "@/lib/workspace-navigation"

export const dynamic = "force-dynamic"

type HrModulePageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function HrModulePage({ params }: HrModulePageProps) {
  const { slug } = await params
  const module = findHrModule(slug)

  if (!module) {
    notFound()
  }

  const data = await getHrDashboardData()

  return (
    <WorkspaceModulePage
      brand="RecruitExe HR"
      homeHref="/hr/dashboard"
      backHref="/hr/dashboard"
      navigation={hrNavigation}
      module={module}
      mode="hr"
      data={data}
    />
  )
}
