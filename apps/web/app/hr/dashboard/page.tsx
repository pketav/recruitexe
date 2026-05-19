import { HrDashboardClient } from "@/components/hr-dashboard-client"
import { getHrDashboardData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export default async function HrDashboardPage() {
  const data = await getHrDashboardData()

  return <HrDashboardClient data={data} />
}
