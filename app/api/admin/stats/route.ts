// app/api/admin/stats/route.ts
// Aman - Lab 6: Admin dashboard ерөнхий статистик API
// Жич: Static JSON, DB ашиглахгүй

import { ADMIN_STATS } from "@/lib/admin-mock-data"
import { NextResponse } from "next/server"

// GET /api/admin/stats
// Админ хуудасны ерөнхий тоонуудыг буцаана
export async function GET() {
  return NextResponse.json({
    success: true,
    data: ADMIN_STATS,
  })
}
