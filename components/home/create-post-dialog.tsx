"use client"

import * as React from "react"
import type { PostType, VerificationQuestion } from "@/lib/types"
import { useAppStore } from "@/lib/store/app-store"
import { MOCK_CATEGORIES, MOCK_LOCATIONS } from "@/lib/mock-data"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, CircleDollarSign, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  postCancelButtonClassName, postDialogContentClassName, postDialogDescriptionClassName,
  postDialogFooterClassName, postDialogTitleClassName, postInputClassName, postLabelClassName,
  postSelectTriggerClassName, postSubmitButtonFound, postSubmitButtonLost, postTextareaClassName,
} from "@/components/home/create-post-dialog-classes"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

type Step = "form" | "payment"

export function CreatePostDialog({
  open, onOpenChange, initialType, onRequireAuth,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialType: PostType | null
  onRequireAuth?: () => void
}) {
  const { currentUser, addPost, updatePostStatus } = useAppStore()
  const [step, setStep] = React.useState<Step>("form")
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const [type, setType] = React.useState<PostType>("lost")
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<string>(MOCK_CATEGORIES[0])
  const [location, setLocation] = React.useState<string>(MOCK_LOCATIONS[0])
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [imageUrl] = React.useState("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80")
  const [rewardAmount, setRewardAmount] = React.useState("")
  const [finderReward, setFinderReward] = React.useState("")
  const [fbShare, setFbShare] = React.useState(false)
  const [escrow, setEscrow] = React.useState(false)
  const [hasReward, setHasReward] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [paymentAuthError, setPaymentAuthError] = React.useState<string | null>(null)

  // 1-3 verification questions
  const [questions, setQuestions] = React.useState<VerificationQuestion[]>([{ question: "", answer: "" }])

  React.useEffect(() => {
    if (open) {
      setStep("form")
      setPendingId(null)
      setError(null)
      setPaymentAuthError(null)
      if (initialType) setType(initialType)
    }
  }, [open, initialType])

  React.useEffect(() => {
    if (currentUser) { setError(null); setPaymentAuthError(null) }
  }, [currentUser])

  function addQuestion() {
    if (questions.length < 3) setQuestions((prev) => [...prev, { question: "", answer: "" }])
  }

  function removeQuestion(i: number) {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateQuestion(i: number, field: "question" | "answer", value: string) {
    setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q))
  }

  function resetFields() {
    setTitle(""); setDescription(""); setCategory(MOCK_CATEGORIES[0]); setLocation(MOCK_LOCATIONS[0])
    setDate(new Date().toISOString().slice(0, 10)); setRewardAmount(""); setFinderReward("")
    setFbShare(false); setHasReward(false); setEscrow(false)
    setQuestions([{ question: "", answer: "" }])
  }

  function handleClose(next: boolean) {
    if (!next) resetFields()
    onOpenChange(next)
  }

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!currentUser) { onRequireAuth?.(); setError("Зар нийтлэхийн тулд эхлээд нэвтэрнэ үү."); return }

    // Validate questions (both lost and found require at least 1)
    const validQs = questions.filter((q) => q.question.trim() && q.answer.trim())
    if (validQs.length === 0) {
      setError("Баталгаажуулах асуулт болон хариулт заавал оруулна уу.")
      return
    }
<<<<<<< HEAD
    if (!verificationQuestion.trim() || !correctAnswer.trim()) {
      setError("Баталгаажуулах асуулт, зөв хариулт заавал.");
      return
    }
=======
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860

    const rewardNum = type === "lost" && rewardAmount.trim() ? Number(rewardAmount.replace(/\D/g, "")) : undefined
    const finderRewardNum = type === "found" && finderReward.trim() ? Number(finderReward.replace(/\D/g, "")) : undefined
    const needsPayment = (type === "lost" && rewardNum !== undefined && rewardNum > 0) || fbShare

    const postBase = {
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUrl: imageUrl.trim() || MOCK_IMAGE,
      authorId: currentUser.id,
      rewardAmount: type === "lost" && rewardNum && rewardNum > 0 ? rewardNum : undefined,
      fbShare: fbShare || undefined,
<<<<<<< HEAD
      verificationQuestion: verificationQuestion.trim(),
      correctAnswer: correctAnswer.trim(),
      finderRewardAmount:
        type === "found" && finderRewardNum && finderRewardNum > 0
          ? finderRewardNum
          : undefined,
=======
      // New multi-question field
      verificationQuestions: validQs,
      // Keep legacy fields for backward compat
      verificationQuestion: validQs[0]?.question,
      correctAnswer: validQs[0]?.answer,
      finderRewardAmount: type === "found" && finderRewardNum && finderRewardNum > 0 ? finderRewardNum : undefined,
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
      escrow: escrow || undefined,
    }

    if (needsPayment) {
      const p = addPost({ ...postBase, status: "pending_payment" })
      setPendingId(p.id)
      setStep("payment")
      return
    }

    addPost({ ...postBase, status: "published" })
    resetFields()
    handleClose(false)
  }

  function handleVerifyPayment() {
    if (!currentUser) { onRequireAuth?.(); setPaymentAuthError("Төлбөрийг батлахын өмнө нэвтэрнэ үү."); return }
    if (pendingId) updatePostStatus(pendingId, "published")
    resetFields()
    handleClose(false)
  }

  const rewardNum = type === "lost" && rewardAmount.trim() ? Number(rewardAmount.replace(/\D/g, "")) : 0
  const totalPayment = (rewardNum > 0 ? rewardNum : 0) + (fbShare ? 5000 : 0)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={postDialogContentClassName}>
        {step === "form" && (
          <>
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className={postDialogTitleClassName}>Шинэ зар оруулах</DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Мэдээллээ үнэн зөв бөглөнө үү. Төлбөр шаардлагатай тохиолдолд дараагийн алхамд QPay-ээр төлнө.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-5 py-1" onSubmit={handleSubmitForm}>
              {/* Type */}
              <div className="grid gap-2">
                <Label className={postLabelClassName}>Төрөл</Label>
                <Select value={type} onValueChange={(v) => v && setType(v as PostType)} disabled={!!initialType}>
                  <SelectTrigger className={postSelectTriggerClassName}><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="lost">Хаясан</SelectItem>
                    <SelectItem value="found">Олсон</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title + Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="pt" className={postLabelClassName}>Гарчиг</Label>
                  <Input id="pt" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Жишээ: Түрүүвчээ гээлээ" className={postInputClassName} required />
                </div>
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Огноо</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={postInputClassName} required />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="pd" className={postLabelClassName}>Тайлбар</Label>
                <Textarea id="pd" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Дэлгэрэнгүй мэдээлэл..." className={postTextareaClassName} required rows={4} />
              </div>

              {/* Category + Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Ангилал</Label>
                  <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{MOCK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Байршил</Label>
                  <Select value={location} onValueChange={(v) => v && setLocation(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{MOCK_LOCATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

<<<<<<< HEAD
              {/* Verification Section */}
              <div className="space-y-4 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 p-4 shadow-sm ring-1 ring-teal-500/10 dark:border-teal-900/50 dark:from-teal-950/30 dark:to-emerald-950/20 dark:ring-teal-500/5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white shadow-md shadow-teal-500/25">
                      <HelpCircle className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Баталгаажуулах асуулт *
                      </h4>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {type === "found" ? "Эзнийг" : "Олсон хүнийг"} тогтоох асуулт (заавал)
                      </p>
                    </div>
=======
              {/* ── Verification Questions (both lost & found) ── */}
              <div className="space-y-4 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 p-4 shadow-sm ring-1 ring-teal-500/10">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white shadow-md shadow-teal-500/25">
                    <HelpCircle className="size-5" />
>>>>>>> d763aebc7df36e8675f386ca84342fa128d94860
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Баталгаажуулах асуулт{questions.length > 1 ? "ууд" : ""} *
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {type === "lost"
                        ? "Эд зүйлийг олсон хүн хариулах асуулт (1-3). Зөвхөн жинхэнэ эзэн мэдэх зүйлийг асуугаарай."
                        : "Эд зүйлийн жинхэнэ эзнийг тогтоох асуулт (1-3)."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:pl-12">
                  {questions.map((q, i) => (
                    <div key={i} className="rounded-xl border border-teal-200/50 bg-white/60 p-3 space-y-2 relative">
                      {questions.length > 1 && (
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-teal-700">{i + 1}-р асуулт</span>
                          <button type="button" onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label className={postLabelClassName}>Асуулт *</Label>
                        <Input
                          value={q.question}
                          onChange={(e) => updateQuestion(i, "question", e.target.value)}
                          placeholder={type === "lost" ? "Жишээ: Цүнхэнд ямар өнгийн үзэг байсан бэ?" : "Жишээ: Түрийвчин дотор ямар карт байсан бэ?"}
                          className={postInputClassName}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className={postLabelClassName}>Зөв хариулт (нууцлагдана) *</Label>
                        <Input
                          value={q.answer}
                          onChange={(e) => updateQuestion(i, "answer", e.target.value)}
                          placeholder="Жишээ: Улаан"
                          className={postInputClassName}
                        />
                      </div>
                    </div>
                  ))}

                  {questions.length < 3 && (
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors py-1"
                    >
                      <Plus className="size-4" /> Асуулт нэмэх ({questions.length}/3)
                    </button>
                  )}
                </div>
              </div>

              {/* ── Reward ── */}
              <div className="space-y-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-4 shadow-sm ring-1 ring-amber-500/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex items-center gap-2.5">
                    <Checkbox id="hasReward" checked={hasReward} onCheckedChange={(c) => setHasReward(!!c)} className="size-5 border-amber-400 data-[state=checked]:border-amber-600 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-600" />
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-500/25">
                      <CircleDollarSign className="size-5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setHasReward(!hasReward)}>
                    <h4 className="text-sm font-bold text-foreground">Шагнал санал болгох</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">Эд зүйлээ олсон / буцааж өгсөн хүнд шагнал өгөх</p>
                  </div>
                </div>

                {hasReward && (
                  <div className="grid animate-in gap-3 duration-200 fade-in slide-in-from-top-2 sm:pl-12">
                    <div className="grid gap-2">
                      <Label className={postLabelClassName}>Шагналын хэмжээ (₮)</Label>
                      <Input
                        inputMode="numeric"
                        placeholder="50,000"
                        value={type === "lost" ? rewardAmount : finderReward}
                        onChange={(e) => type === "lost" ? setRewardAmount(e.target.value) : setFinderReward(e.target.value)}
                        className={postInputClassName}
                      />
                    </div>
                    {type === "lost" && rewardNum > 0 && (
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-background/60 p-3 ring-1 ring-black/[0.04] transition-colors hover:bg-muted/40">
                        <Checkbox checked={escrow} onCheckedChange={(c) => setEscrow(!!c)} className="mt-0.5" />
                        <div>
                          <p className="text-xs font-bold leading-snug">QPay-ээр Escrow-д төлбөр байршуулах</p>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Мөнгийг системд түр байршуулж, эд зүйл олдсоны дараа автоматаар шилжүүлнэ</p>
                        </div>
                      </label>
                    )}
                    {rewardNum > 0 && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                        💳 Нийт төлбөр: <strong>{rewardNum.toLocaleString()} ₮</strong>{fbShare ? ` + 5,000 ₮ (Facebook)` : ""} = <strong>{totalPayment.toLocaleString()} ₮</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Facebook Share */}
              <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/60 to-blue-50/30 p-4 shadow-sm ring-1 ring-sky-500/10">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox checked={fbShare} onCheckedChange={(c) => setFbShare(!!c)} className="mt-1 size-5 border-sky-400 data-[state=checked]:bg-sky-600" />
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md shadow-sky-500/30">
                      <FacebookIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Facebook групп руу автоматаар түгээх</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">МУИС-ийн 5 группт зарыг түгээнэ (5,000₮)</p>
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm font-medium text-destructive">{error}</p>
              )}

              <DialogFooter className={cn(postDialogFooterClassName, "!mx-0 !mb-0 mt-4")}>
                <Button type="button" variant="outline" onClick={() => handleClose(false)} className={postCancelButtonClassName}>Болих</Button>
                <Button type="submit" className={cn(type === "lost" ? postSubmitButtonLost : postSubmitButtonFound)}>Нийтлэх</Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className={postDialogTitleClassName}>Төлбөр төлөх — QPay</DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Данс руу шилжүүлсэн эсвэл QR уншуулсны дараа доорх товчийг дарна уу.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5">
              {paymentAuthError && (
                <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-center text-sm text-destructive">{paymentAuthError}</p>
              )}
              <div className="mx-auto flex aspect-square w-52 max-w-full items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 text-center text-sm font-medium text-muted-foreground shadow-inner ring-4 ring-emerald-500/10">
                <span>QPay<br /><span className="text-xs font-normal opacity-80">(жишээ QR)</span></span>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/40 p-4 text-sm shadow-sm ring-1 ring-black/[0.04]">
                <p className="font-semibold text-foreground">Дансны мэдээлэл</p>
                <p className="mt-1 text-muted-foreground">Хүлээн авагч: МУИС Lost&amp;Found</p>
                <p className="mt-2 font-mono text-base tracking-tight text-foreground">MN12 3456 7890 1234 5678</p>
                {totalPayment > 0 && (
                  <p className="mt-2 font-bold text-amber-900">Нийт дүн: {totalPayment.toLocaleString()} ₮</p>
                )}
              </div>
            </div>
            <DialogFooter className={cn(postDialogFooterClassName, "!mx-0 !mb-0 mt-2")}>
              <Button variant="outline" className={postCancelButtonClassName} onClick={() => handleClose(false)}>Хаах</Button>
              <Button className={postSubmitButtonFound} onClick={handleVerifyPayment}>Төлбөр шалгах</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const MOCK_IMAGE = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80"
