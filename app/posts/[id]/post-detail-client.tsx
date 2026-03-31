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
  const { posts, verifyFoundAnswer, getUserById, currentUser } = useAppStore()
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

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const r = verifyFoundAnswer(id, answer)
    if (!r.ok) setMsg(r.message ?? "Алдаа")
    else {
      setVerified(true)
      setMsg("Зөв! Доорх холбоо барих мэдээллийг харна уу.")
    }
  }

  const isAuthor = currentUser?.id === post.authorId
  const showContact =
    author &&
    (isAuthor || !post.verificationQuestion || verified)

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

      {!isAuthor && post.verificationQuestion && !verified && (
        <Card className="mt-10 overflow-hidden border-teal-100 bg-gradient-to-br from-white to-teal-50/30 shadow-md transition-all dark:border-teal-900/40 dark:from-background dark:to-teal-950/20">
          <CardHeader className="border-b border-teal-100/50 bg-teal-50/50 py-4 dark:border-teal-900/30 dark:bg-teal-950/30">
            <CardTitle className="text-lg font-bold text-teal-900 dark:text-teal-400">
              Холбоо барих мэдээлэл харах
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground/80">
                {post.type === "found" ? "Эзэмшигч" : "Олсон хүн"} болохыгоо баталгаажуулж, холбоо барих мэдээллийг харахын тулд доорх асуултад зөв хариулна уу.
              </p>
              <p className="rounded-xl bg-muted/50 p-4 text-base font-semibold text-foreground ring-1 ring-black/[0.03]">
                {post.verificationQuestion}
              </p>
            </div>

            <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleVerify}>
              <div className="grid flex-1 gap-2.5">
                <Label htmlFor="va" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Таны хариулт
                </Label>
                <Input
                  id="va"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Хариултаа энд бичнэ үү..."
                  className="h-11 rounded-xl border-border/60 bg-background/50 focus:ring-teal-500/20"
                  required
                />
              </div>
              <Button type="submit" className="h-11 rounded-xl bg-teal-600 px-8 font-bold hover:bg-teal-700">
                Баталгаажуулах
              </Button>
            </form>
            {msg && (
              <p className="animate-in fade-in slide-in-from-top-1 text-sm font-medium text-rose-500">
                {msg}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {showContact && (
        <ContactCard
          phone={author.phone}
          sisiId={author.sisiId}
          email={author.email}
          verified={!isAuthor && !!post.verificationQuestion && verified}
        />
      )}
    </article>
  )
}

function ContactCard({
  phone,
  sisiId,
  email,
  verified,
}: {
  phone: string
  sisiId: string
  email: string
  verified?: boolean
}) {
  return (
    <Card className={cn("mt-10 overflow-hidden transition-all", verified ? "animate-in slide-in-from-bottom-2 fade-in duration-300 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/20 shadow-md dark:border-emerald-900/40 dark:from-background dark:to-emerald-950/20" : "border-border/50")}>
      <CardHeader className={cn(verified ? "border-b border-emerald-100/50 bg-emerald-50/50 py-4 dark:border-emerald-900/30 dark:bg-emerald-950/30" : "")}>
        <div className="flex items-center gap-3">
          <CardTitle className={cn(verified ? "text-lg font-bold text-emerald-900 dark:text-emerald-400" : "")}>Холбоо барих</CardTitle>
          {verified && (
            <Badge variant="outline" className="border-emerald-300 bg-emerald-100/50 px-2 py-0.5 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1 lucide lucide-check"><path d="M20 6L9 17l-5-5"/></svg>
              Баталгаажсан
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-3 p-6 text-sm", !verified ? "pt-6" : "")}>
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-muted-foreground">Утас: </span>
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href={`tel:${phone}`}>
            {phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-muted-foreground">SISI ID: </span>
          <span className="font-semibold">{sisiId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-muted-foreground">Имэйл: </span>
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
