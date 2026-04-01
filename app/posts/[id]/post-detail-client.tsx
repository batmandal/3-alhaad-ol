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
import type { Claim, VerificationQuestion } from "@/lib/types"
import { CheckCircle, XCircle, Clock, Phone, Mail, User, AlertCircle } from "lucide-react"

export function PostDetailClient({ id }: { id: string }) {
<<<<<<< HEAD
  const { posts, verifyFoundAnswer, getUserById, currentUser } = useAppStore()
=======
  const {
    posts, currentUser, getUserById,
    submitClaim, approveClaim, rejectClaim, getClaimsForPost, getMyClaims,
    verifyFoundAnswer,
  } = useAppStore()

>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
  const post = posts.find((p) => p.id === id)

  // Claim form state
  const [answers, setAnswers] = React.useState<string[]>([])
  const [claimSubmitted, setClaimSubmitted] = React.useState(false)
  const [claimMsg, setClaimMsg] = React.useState<string | null>(null)
  const [claimError, setClaimError] = React.useState<string | null>(null)

  // Хуучин found verify state (backward compat for posts without verificationQuestions)
  const [legacyAnswer, setLegacyAnswer] = React.useState("")
  const [legacyVerified, setLegacyVerified] = React.useState(false)
  const [legacyMsg, setLegacyMsg] = React.useState<string | null>(null)

  // QPay escrow modal
  const [showQpay, setShowQpay] = React.useState(false)
  const [qpayTimer, setQpayTimer] = React.useState(299)

  React.useEffect(() => {
    if (!showQpay) return
    setQpayTimer(299)
    const iv = setInterval(() => setQpayTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(iv)
  }, [showQpay])

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
  const isOwner = currentUser?.id === post.authorId
  const postClaims = getClaimsForPost(post.id)
  const myClaims = getMyClaims()
  const myClaim = myClaims.find((c) => c.postId === post.id)

  // Асуултуудыг авах
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions: VerificationQuestion[] = post.verificationQuestions?.length
    ? post.verificationQuestions
    : post.verificationQuestion && post.correctAnswer
    ? [{ question: post.verificationQuestion, answer: post.correctAnswer }]
    : []

  const hasNewQuestions = (post.verificationQuestions?.length ?? 0) > 0
  const hasLegacyQuestion = !hasNewQuestions && !!post.verificationQuestion

  // Answers init
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setAnswers(questions.map(() => ""))
  }, [post.id, questions])

  function handleSubmitClaim(e: React.FormEvent) {
    e.preventDefault()
    setClaimError(null)
    if (!currentUser) { setClaimError("Эхлээд нэвтэрнэ үү."); return }
    const result = submitClaim(post!.id, answers)
    if (!result.ok) { setClaimError(result.message ?? "Алдаа гарлаа."); return }
    setClaimSubmitted(true)
    setClaimMsg("Таны хүсэлт илгээгдлээ. Зарын эзэн хянаж шийдвэрлэнэ.")
  }

<<<<<<< HEAD
  const isAuthor = currentUser?.id === post.authorId
  const showContact = author && (isAuthor || verified)
=======
  function handleLegacyVerify(e: React.FormEvent) {
    e.preventDefault()
    setLegacyMsg(null)
    const r = verifyFoundAnswer(id, legacyAnswer)
    if (!r.ok) setLegacyMsg(r.message ?? "Алдаа")
    else { setLegacyVerified(true); setLegacyMsg("Зөв! Доорх холбоо барих мэдээллийг харна уу.") }
  }

  // Owner approved claim → contact haraaluulah
  const approvedClaim = postClaims.find((c) => c.status === "approved")
  const approvedClaimant = approvedClaim ? getUserById(approvedClaim.claimantId) : null
  const myApprovedClaim = myClaim?.status === "approved"
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="mb-6 inline-block text-sm text-primary underline-offset-4 hover:underline">
        ← Нүүр хуудас
      </Link>

      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-black/5">
        <Image src={post.imageUrl} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 720px" priority />
        <Badge className="absolute left-3 top-3 bg-white/90 text-foreground" variant={post.type === "lost" ? "destructive" : "default"}>
          {post.type === "lost" ? "Хаясан" : "Олсон"}
        </Badge>
      </div>

      {post.status === "pending_payment" && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Энэ зар төлбөр хүлээн авсны дараа нийтлэгдэнэ.
        </p>
      )}

      <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-muted-foreground">{post.location} · {post.date} · {post.category}</p>
      <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed">{post.description}</p>

      {/* Reward */}
      {post.type === "lost" && post.rewardAmount ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">Шагнал: {post.rewardAmount.toLocaleString()} ₮</p>
            {post.escrow && <p className="text-xs text-amber-700 mt-0.5">QPay Escrow-д байршуулсан — эд зүйл олдсоны дараа автоматаар шилжинэ</p>}
          </div>
        </div>
      ) : null}

<<<<<<< HEAD
      {!isAuthor && !verified && (
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
                {post.verificationQuestion?.trim() ||
                  "Энэ зарт баталгаажуулах асуулт тохируулагдаагүй байна. Зарын эзэнтэй админ-аар холбогдоно уу."}
              </p>
              {post.correctAnswer?.trim() && (
                <p className="rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Mock зөв хариулт: <span className="font-semibold">{post.correctAnswer}</span>
                </p>
              )}
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
              <Button
                type="submit"
                className="h-11 rounded-xl bg-teal-600 px-8 font-bold hover:bg-teal-700"
                disabled={!post.verificationQuestion?.trim()}
              >
                Баталгаажуулах
              </Button>
            </form>
            {msg && (
              <p className="animate-in fade-in slide-in-from-top-1 text-sm font-medium text-rose-500">
                {msg}
              </p>
=======
      {/* ══════════════════════════════════════════
          OWNER VIEW: Pending claims management
      ══════════════════════════════════════════ */}
      {isOwner && (
        <OwnerClaimsPanel
          claims={postClaims}
          onApprove={approveClaim}
          onReject={rejectClaim}
        />
      )}

      {/* ══════════════════════════════════════════
          OWNER: Approved — show claimant contact
      ══════════════════════════════════════════ */}
      {isOwner && approvedClaim && approvedClaimant && (
        <Card className="mt-6 border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <CheckCircle className="size-5" /> Зөвшөөрөгдсөн — Олсон хүний мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ContactRow icon={<User className="size-4" />} label="Нэр" value={approvedClaimant.name} />
            <ContactRow icon={<Phone className="size-4" />} label="Утас" value={approvedClaimant.phone} href={`tel:${approvedClaimant.phone}`} />
            <ContactRow icon={<Mail className="size-4" />} label="Имэйл" value={approvedClaimant.email} href={`mailto:${approvedClaimant.email}`} />
            {approvedClaimant.facebook && (
              <ContactRow icon={<span className="text-xs font-bold">f</span>} label="Facebook" value={approvedClaimant.facebook} />
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
            )}
          </CardContent>
        </Card>
      )}

<<<<<<< HEAD
      {showContact && (
        <ContactCard
          phone={author.phone}
          sisiId={author.sisiId}
          email={author.email}
          verified={!isAuthor && !!post.verificationQuestion && verified}
        />
=======
      {/* ══════════════════════════════════════════
          NON-OWNER: Claim/Verify section
      ══════════════════════════════════════════ */}
      {!isOwner && (
        <>
          {/* My approved claim → show owner contact */}
          {myApprovedClaim && author && (
            <Card className="mt-8 border-emerald-200 bg-emerald-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle className="size-5" /> Таны хүсэлт зөвшөөрөгдлөө!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground mb-3">Зарын эзэнтэй холбогдоорой:</p>
                <ContactRow icon={<User className="size-4" />} label="Нэр" value={author.name} />
                <ContactRow icon={<Phone className="size-4" />} label="Утас" value={author.phone} href={`tel:${author.phone}`} />
                <ContactRow icon={<Mail className="size-4" />} label="Имэйл" value={author.email} href={`mailto:${author.email}`} />
                {author.facebook && (
                  <ContactRow icon={<span className="text-xs font-bold">f</span>} label="Facebook" value={author.facebook} />
                )}
                {/* Reward receive */}
                {(post.rewardAmount || post.finderRewardAmount) ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="font-semibold text-amber-900 mb-2">
                      🏆 Шагнал: {(post.rewardAmount || post.finderRewardAmount)?.toLocaleString()} ₮
                    </p>
                    {!showQpay ? (
                      <Button onClick={() => setShowQpay(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        QPay-ээр шагнал авах
                      </Button>
                    ) : (
                      <QpayPanel
                        amount={(post.rewardAmount || post.finderRewardAmount)!}
                        timer={qpayTimer}
                        label="Шагнал хүлээн авах"
                        onClose={() => setShowQpay(false)}
                      />
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* My rejected claim */}
          {myClaim?.status === "rejected" && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <XCircle className="size-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Хүсэлт татгалзагдсан</p>
                <p className="text-sm text-red-700 mt-1">Таны хариулт зөв биш байсан тул эзэмшигч татгалзлаа. Дахин оролдох боломжгүй.</p>
              </div>
            </div>
          )}

          {/* My pending claim */}
          {myClaim?.status === "pending" && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Clock className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">Хүсэлт хянагдаж байна</p>
                <p className="text-sm text-amber-700 mt-1">Зарын эзэн таны хариултыг шалгаж байна. Шийдвэр гарсны дараа мэдэгдэнэ.</p>
              </div>
            </div>
          )}

          {/* Claim form — only if no existing claim */}
          {!myClaim && questions.length > 0 && (
            <Card className="mt-10">
              <CardHeader>
                <CardTitle>
                  {post.type === "lost" ? "✋ Энэ эд зүйлийг олсон уу?" : "✋ Энэ таны эд зүйл үү?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {post.type === "lost"
                    ? "Асуултад зөв хариулснаар эзэмшигчтэй холбогдох боломж нээгдэнэ."
                    : "Асуултад зөв хариулснаар олсон хүнтэй холбогдох боломж нээгдэнэ."}
                </p>
                {!claimSubmitted ? (
                  <form className="space-y-4" onSubmit={handleSubmitClaim}>
                    {questions.map((q, i) => (
                      <div key={i} className="grid gap-2">
                        <Label htmlFor={`q-${i}`} className="font-medium">
                          {questions.length > 1 ? `${i + 1}. ` : ""}{q.question}
                        </Label>
                        <Input
                          id={`q-${i}`}
                          value={answers[i] ?? ""}
                          onChange={(e) => {
                            const next = [...answers]
                            next[i] = e.target.value
                            setAnswers(next)
                          }}
                          placeholder="Хариулт..."
                          required
                        />
                      </div>
                    ))}
                    {claimError && (
                      <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <AlertCircle className="size-4 shrink-0" /> {claimError}
                      </p>
                    )}
                    <Button type="submit" className="w-full">
                      {post.type === "lost" ? "📬 Олсон гэж мэдэгдэх" : "📬 Хүсэлт илгээх"}
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle className="size-5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-emerald-800">{claimMsg}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legacy found verify (posts without verificationQuestions) */}
          {!myClaim && hasLegacyQuestion && post.type === "found" && (
            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Баталгаажуулалт</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Эзэмшигч болохын тулд асуултад зөв хариулна уу.</p>
                <p className="font-medium">{post.verificationQuestion}</p>
                {!legacyVerified ? (
                  <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleLegacyVerify}>
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="va">Таны хариулт</Label>
                      <Input id="va" value={legacyAnswer} onChange={(e) => setLegacyAnswer(e.target.value)} required />
                    </div>
                    <Button type="submit">Илгээх</Button>
                  </form>
                ) : null}
                {legacyMsg && <p className="text-sm text-muted-foreground">{legacyMsg}</p>}
              </CardContent>
            </Card>
          )}

          {/* Legacy contact after verify */}
          {legacyVerified && author && (
            <ContactCard phone={author.phone} sisiId={author.sisiId} email={author.email} />
          )}
        </>
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
      )}
    </article>
  )
}

<<<<<<< HEAD
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
=======
// ── Owner claims panel ────────────────────────────────
function OwnerClaimsPanel({
  claims,
  onApprove,
  onReject,
}: {
  claims: Claim[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
}) {
  const pending = claims.filter((c) => c.status === "pending")
  const all = claims

  if (!all.length) return null

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-bold">📬 Хүсэлтүүд ({all.length})</h2>
      {pending.length === 0 && all.length > 0 && (
        <p className="text-sm text-muted-foreground">Хянагдаагүй хүсэлт байхгүй байна.</p>
      )}
      {all.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  )
}

function ClaimCard({
  claim,
  onApprove,
  onReject,
}: {
  claim: Claim
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const allCorrect = claim.answersCorrect.every(Boolean)
  const someCorrect = claim.answersCorrect.some(Boolean)

  return (
    <Card className={cn(
      "border",
      claim.status === "approved" && "border-emerald-200 bg-emerald-50/40",
      claim.status === "rejected" && "border-red-200 bg-red-50/30 opacity-70",
      claim.status === "pending" && "border-border"
    )}>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold">{claim.claimantName}</p>
            <p className="text-sm text-muted-foreground">{claim.claimantEmail} · {claim.claimantPhone}</p>
          </div>
          <ClaimStatusBadge status={claim.status} />
        </div>

        {/* Хариултууд */}
        <div className="space-y-2">
          {claim.answers.map((ans, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {claim.answersCorrect[i]
                ? <CheckCircle className="size-4 text-emerald-600 shrink-0" />
                : <XCircle className="size-4 text-red-500 shrink-0" />
              }
              <span className="text-muted-foreground">{i + 1}.</span>
              <span className={cn("font-medium", claim.answersCorrect[i] ? "text-emerald-800" : "text-red-700")}>
                &quot;{ans}&quot;
              </span>
            </div>
          ))}
        </div>

        {!allCorrect && claim.status === "pending" && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
            <AlertCircle className="size-3.5 shrink-0" />
            {someCorrect ? "Зарим хариулт буруу байна — зөвшөөрөх эсэхийг шийднэ үү" : "Бүх хариулт буруу байна"}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {new Date(claim.createdAt).toLocaleString("mn-MN")}
        </p>

        {claim.status === "pending" && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onApprove(claim.id)}>
              <CheckCircle className="size-4 mr-1" /> Зөвшөөрөх
            </Button>
            <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => onReject(claim.id)}>
              <XCircle className="size-4 mr-1" /> Татгалзах
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ClaimStatusBadge({ status }: { status: string }) {
  if (status === "approved") return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">✅ Зөвшөөрөгдсөн</Badge>
  if (status === "rejected") return <Badge variant="destructive">✕ Татгалзсан</Badge>
  return <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">⏳ Хүлээгдэж байна</Badge>
}

// ── QPay panel ────────────────────────────────────────
function QpayPanel({ amount, timer, label, onClose }: { amount: number; timer: number; label: string; onClose: () => void }) {
  const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">{label}</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
      </div>
      <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-center text-sm font-medium text-muted-foreground">
        QPay<br /><span className="text-xs opacity-70">(жишээ QR)</span>
      </div>
      <p className="text-center font-mono text-2xl font-bold text-red-600">{fmtTimer(timer)}</p>
      <p className="text-center text-2xl font-bold text-amber-900">{amount.toLocaleString()} ₮</p>
      <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <p className="font-semibold">Хүлээн авагч: МУИС Lost&amp;Found</p>
        <p className="font-mono mt-1">MN12 3456 7890 1234 5678</p>
      </div>
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
        ✅ Төлбөр хийлээ (Demo)
      </Button>
    </div>
  )
}

// ── Helper components ─────────────────────────────────
function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <p className="flex items-center gap-2">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="font-medium shrink-0">{label}:</span>
      {href ? (
        <a className="text-primary underline underline-offset-4" href={href}>{value}</a>
      ) : (
        <span>{value}</span>
      )}
    </p>
  )
}

function ContactCard({ phone, sisiId, email }: { phone: string; sisiId: string; email: string }) {
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
<<<<<<< HEAD
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
=======
      <CardContent className="space-y-2 text-sm">
        <p><span className="font-medium">Утас: </span><a className="text-primary underline" href={`tel:${phone}`}>{phone}</a></p>
        <p><span className="font-medium">SISI ID: </span>{sisiId}</p>
        <p><span className="font-medium">Имэйл: </span><a className="text-primary underline" href={`mailto:${email}`}>{email}</a></p>
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
      </CardContent>
    </Card>
  )
}


