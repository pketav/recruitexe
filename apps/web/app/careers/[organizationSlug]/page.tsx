import { notFound } from "next/navigation"

import { PublicCareersWorkspace } from "@/components/public-careers-workspace"
import { getPublicCareersData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

type CareersPageProps = {
  params: Promise<{ organizationSlug: string }>
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { organizationSlug } = await params

  try {
    const data = await getPublicCareersData(organizationSlug)

    return (
      <PublicCareersWorkspace
        organization={data.organization}
        jobs={data.jobs}
        departments={data.departments}
        locations={data.locations}
      />
    )
  } catch {
    notFound()
  }
}
