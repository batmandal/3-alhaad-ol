// app/api/admin/analytics/route.ts
// Aman - Lab 6: Өдөр тутмын аналитик API
// Зар, шинэ хэрэглэгч, байршлын статистик

import {
  DAILY_AD_POSTINGS,
  DAILY_NEW_USERS,
  LOCATION_STATS,
} from "@/lib/admin-mock-data"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/analytics              → бүгдийг буцаах
// GET /api/admin/analytics?type=ads     → зөвхөн зарын статистик
// GET /api/admin/analytics?type=users   → зөвхөн хэрэглэгчийн статистик
// GET /api/admin/analytics?type=locations → зөвхөн байршлын статистик
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  // Зөвхөн зарын статистик
  if (type === "ads") {
    return NextResponse.json({
      data: DAILY_AD_POSTINGS,
      total: DAILY_AD_POSTINGS.reduce((sum, d) => sum + d.count, 0),
    })
  }

  // Зөвхөн шинэ хэрэглэгчийн статистик
  if (type === "users") {
    return NextResponse.json({
      data: DAILY_NEW_USERS,
      total: DAILY_NEW_USERS.reduce((sum, d) => sum + d.count, 0),
    })
  }

  // Зөвхөн байршлын статистик
  if (type === "locations") {
    return NextResponse.json({
      data: LOCATION_STATS,
    })
  }

  // Default: бүгдийг буцаах
  return NextResponse.json({
    dailyAds: DAILY_AD_POSTINGS,
    dailyUsers: DAILY_NEW_USERS,
    locations: LOCATION_STATS,
  })
}
