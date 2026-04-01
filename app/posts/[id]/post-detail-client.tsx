"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppStore } from "@/lib/store/app-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PostDetailClient({ id }: { id: string }) {
  const { posts, verifyFoundAnswer, getUserById } = useAppStore()
  const post = posts.find((p) => p.id === id)
  const [answer, setAnswer] = React.useState("")
  const [verified, setVerified] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  if (!post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">Зар олдсонгүй.</p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 inline-flex")}>
          Нүүр рүү буцах
        </Link>
      </div>
    )
  }

  const author = getUserById(post.authorId)

  function normalizeAnswer(s: string) {
    return s.trim().toLowerCase().replace(/\s+/g, " ")
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!post) return
    if (!post.correctAnswer?.trim()) {
      setMsg("Баталгаажуулах зөв хариулт тохируулаагүй байна.")
      return
    }

    if (post.type === "found") {
      const r = verifyFoundAnswer(id, answer)
      if (!r.ok) {
        setMsg(r.message ?? "Алдаа")
        return
      }
      setVerified(true)
      setMsg("Зөв! Доорх холбоо барих мэдээллийг харна уу.")
      return
    }

    if (normalizeAnswer(answer) !== normalizeAnswer(post.correctAnswer)) {
      setMsg("Хариулт таарахгүй байна.")
      return
    }
    setVerified(true)
    setMsg("Зөв! Доорх холбоо барих мэдээллийг харна уу.")
  }

  const showContact = verified && post.correctAnswer && author

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Нүүр хуудас
      </Link>

      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-black/5">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 720px"
          priority
        />
        <Badge
          className="absolute left-3 top-3 bg-white/90 text-foreground"
          variant={post.type === "lost" ? "destructive" : "default"}
        >
          {post.type === "lost" ? "Хаясан" : "Олсон"}
        </Badge>
      </div>

      {post.status === "pending_payment" && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Энэ зар төлбөр хүлээн авсны дараа нийтлэгдэнэ.
        </p>
      )}

      <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {post.location} · {post.date} · {post.category}
      </p>
      <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed">
        {post.description}
      </p>

      {post.type === "lost" && post.rewardAmount ? (
        <p className="mt-4 text-lg font-semibold text-rose-600">
          Шагнал: {post.rewardAmount.toLocaleString()} ₮
        </p>
      ) : null}

      {post.verificationQuestion && (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Баталгаажуулалт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Эзэмшигч болохын тулд асуултад зөв хариулна уу.
            </p>
            <p className="font-medium">{post.verificationQuestion}</p>
            {post.correctAnswer && (
              <p className="text-sm text-emerald-700">
                Temporary зөв хариулт:{" "}
                <span className="font-semibold">{post.correctAnswer}</span>
              </p>
            )}
            {!verified ? (
              <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleVerify}>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="va">Таны хариулт</Label>
                  <Input
                    id="va"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Илгээх</Button>
              </form>
            ) : null}
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          </CardContent>
        </Card>
      )}

      {showContact && (
        <ContactCard
          phone={author.phone}
          sisiId={author.sisiId}
          email={author.email}
        />
      )}
    </article>
  )
}

function ContactCard({
  phone,
  sisiId,
  email,
}: {
  phone: string
  sisiId: string
  email: string
}) {
  return (
    <Card className="mt-6 border-emerald-200 bg-emerald-50/50">
      <CardHeader>
        <CardTitle className="text-emerald-900">Холбоо барих</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Утас: </span>
          <a className="text-primary underline" href={`tel:${phone}`}>
            {phone}
          </a>
        </p>
        <p>
          <span className="font-medium">SISI ID: </span>
          {sisiId}
        </p>
        <p>
          <span className="font-medium">Имэйл: </span>
          <a className="text-primary underline" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
