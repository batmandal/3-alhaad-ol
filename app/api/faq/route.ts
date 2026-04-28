import { FAQ_DATA, FAQ_CATEGORIES } from "@/lib/faq-data"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const filtered =
    category && category !== "all"
      ? FAQ_DATA.filter((item) => item.category === category)
      : FAQ_DATA

  return NextResponse.json({
    total: filtered.length,
    categories: FAQ_CATEGORIES,
    data: filtered,
  })
}