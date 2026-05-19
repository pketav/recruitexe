import { CandidateDashboardClient } from "@/components/candidate-dashboard-client"
import { getCandidateDashboardData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export default async function CandidateDashboardPage() {
  const data = await getCandidateDashboardData()

  return <CandidateDashboardClient data={data} />
}
