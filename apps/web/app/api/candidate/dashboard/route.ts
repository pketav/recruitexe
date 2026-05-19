import { NextResponse } from "next/server"

import { getCandidateDashboardData } from "@/lib/demo/recruitexe-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(await getCandidateDashboardData())
}
