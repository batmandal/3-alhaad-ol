"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAppStore } from "@/lib/store/app-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfilePageClient() {
  const {
    currentUser,
    posts,
    rewardEligibilities,
    submitWithdrawal,
    updateCurrentUserProfile,
  } = useAppStore()

  const [withdrawPostId, setWithdrawPostId] = React.useState<string | null>(null)
  const [withdrawAmount, setWithdrawAmount] = React.useState(0)
  const [bankName, setBankName] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [isEditing, setIsEditing] = React.useState(false)
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [sisiId, setSisiId] = React.useState("")
  const [profileError, setProfileError] = React.useState<string | null>(null)
  const [profileOk, setProfileOk] = React.useState<string | null>(null)

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">Профайл харахын тулд нэвтэрнэ үү.</p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 inline-flex")}>
          Нүүр рүү
        </Link>
      </div>
    )
  }

  const mine = posts.filter((p) => p.authorId === currentUser.id)
  const eligible = rewardEligibilities[currentUser.id] ?? []

  React.useEffect(() => {
    setName(currentUser.name)
    setPhone(currentUser.phone)
    setEmail(currentUser.email)
    setSisiId(currentUser.sisiId)
  }, [currentUser])

  function openWithdraw(postId: string, amount: number) {
    setWithdrawPostId(postId)
    setWithdrawAmount(amount)
    setBankName("")
    setAccountNumber("")
  }

  function handleWithdrawSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!withdrawPostId) return
    submitWithdrawal({
      postId: withdrawPostId,
      amount: withdrawAmount,
      bankName,
      accountNumber,
    })
    setWithdrawPostId(null)
  }

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileError(null)
    setProfileOk(null)
    const r = updateCurrentUserProfile({ name, phone, email, sisiId })
    if (!r.ok) {
      setProfileError(r.message ?? "Профайл шинэчлэхэд алдаа гарлаа.")
      return
    }
    setIsEditing(false)
    setProfileOk("Профайл амжилттай шинэчлэгдлээ.")
  }

  function handleProfileCancel() {
    if (!currentUser) return
    setName(currentUser.name)
    setPhone(currentUser.phone)
    setEmail(currentUser.email)
    setSisiId(currentUser.sisiId)
    setProfileError(null)
    setProfileOk(null)
    setIsEditing(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Нүүр
      </Link>

      <h1 className="text-2xl font-bold">Профайл</h1>
      <p className="mt-1 text-muted-foreground">
        {currentUser.name} · SISI {currentUser.sisiId}
      </p>

      <Card className="mt-6 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-lg">Хувийн мэдээлэл</CardTitle>
          {!isEditing ? (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Засах
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleProfileSave}>
            <div className="grid gap-2">
              <Label htmlFor="p-name">Нэр</Label>
              <Input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="p-phone">Утас</Label>
                <Input
                  id="p-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-sisi">SISI ID</Label>
                <Input
                  id="p-sisi"
                  value={sisiId}
                  onChange={(e) => setSisiId(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-email">Имэйл</Label>
              <Input
                id="p-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>

            {profileError && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {profileError}
              </p>
            )}
            {profileOk && (
              <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {profileOk}
              </p>
            )}

            {isEditing ? (
              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={handleProfileCancel}>
                  Болих
                </Button>
                <Button type="submit">Хадгалах</Button>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {eligible.length > 0 && (
        <Card className="mt-8 border-emerald-200 bg-emerald-50/40">
          <CardHeader>
            <CardTitle className="text-lg">Шагнал авах боломж</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligible.map((e) => (
              <div
                key={e.postId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-100 bg-white/80 px-4 py-3"
              >
                <span className="text-sm">
                  Зар #{e.postId} — {e.amount.toLocaleString()} ₮
                </span>
                <Button size="sm" onClick={() => openWithdraw(e.postId, e.amount)}>
                  Шагнал авах
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <h2 className="mt-10 text-lg font-semibold">Миний зарууд</h2>
      <ul className="mt-4 space-y-4">
        {mine.map((p) => (
          <li key={p.id}>
            <Link
              href={`/posts/${p.id}`}
              className="flex gap-4 rounded-xl border border-border/60 bg-card p-3 transition hover:bg-muted/40"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={p.type === "lost" ? "destructive" : "default"}>
                    {p.type === "lost" ? "Хаясан" : "Олсон"}
                  </Badge>
                  {p.status === "pending_payment" && (
                    <Badge variant="outline">Төлбөр хүлээгдэж байна</Badge>
                  )}
                </div>
                <p className="mt-1 font-medium line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.date}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {mine.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">Танд зар алга.</p>
      )}

      <Dialog
        open={!!withdrawPostId}
        onOpenChange={(o) => {
          if (!o) setWithdrawPostId(null)
        }}
      >
        <DialogContent>
          <form onSubmit={handleWithdrawSubmit}>
            <DialogHeader>
              <DialogTitle>Шагнал авах хүсэлт</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Дүн: {withdrawAmount.toLocaleString()} ₮
            </p>
            <div className="grid gap-3 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bn">Банкны нэр</Label>
                <Input
                  id="bn"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Хаан банк"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="an">Дансны дугаар</Label>
                <Input
                  id="an"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setWithdrawPostId(null)}>
                Болих
              </Button>
              <Button type="submit">Илгээх</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
