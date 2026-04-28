// app/api/faq/[id]/route.ts
// Тодорхой нэг асуултыг id-аар хайж буцаана

// ECMAScript 6: import
import { FAQ_DATA } from "@/lib/faq-data"
import { NextRequest, NextResponse } from "next/server"

// GET /api/faq/faq-1  → тухайн id-тай асуултыг буцаана
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = FAQ_DATA.find((f) => f.id === id)

  if (!item) {
    return NextResponse.json(
      { error: `'${id}' id-тай асуулт олдсонгүй` },
      { status: 404 }
    )
  }

  return NextResponse.json(item)
}
