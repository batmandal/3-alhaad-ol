"use client"

import * as React from "react"
import type { PostType } from "@/lib/types"
import { useAppStore } from "@/lib/store/app-store"
import { MOCK_CATEGORIES, MOCK_LOCATIONS } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HelpCircle, CircleDollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  postCancelButtonClassName,
  postDialogContentClassName,
  postDialogDescriptionClassName,
  postDialogFooterClassName,
  postDialogTitleClassName,
  postInputClassName,
  postLabelClassName,
  postSelectTriggerClassName,
  postSubmitButtonFound,
  postSubmitButtonLost,
  postTextareaClassName,
} from "@/components/home/create-post-dialog-classes"

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

type Step = "form" | "payment"

export function CreatePostDialog({
  open,
  onOpenChange,
  initialType,
  onRequireAuth,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialType: PostType | null
  /** Нэвтэрээгүй үед зар илгээх/нийтлэх оролдлогын үед дуудагдана */
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
  const [date, setDate] = React.useState(() =>
    new Date().toISOString().slice(0, 10)
  )
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80"
  )
  const [rewardAmount, setRewardAmount] = React.useState("")
  const [verificationQuestion, setVerificationQuestion] = React.useState("")
  const [correctAnswer, setCorrectAnswer] = React.useState("")
  const [finderReward, setFinderReward] = React.useState("")
  const [fbShare, setFbShare] = React.useState(false)
  const [escrow, setEscrow] = React.useState(false)
  const [hasReward, setHasReward] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [paymentAuthError, setPaymentAuthError] = React.useState<string | null>(
    null
  )

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
    if (currentUser) {
      setError(null)
      setPaymentAuthError(null)
    }
  }, [currentUser])

  function resetFields() {
    setTitle("")
    setDescription("")
    setCategory(MOCK_CATEGORIES[0])
    setLocation(MOCK_LOCATIONS[0])
    setDate(new Date().toISOString().slice(0, 10))
    setRewardAmount("")
    setVerificationQuestion("")
    setCorrectAnswer("")
    setFinderReward("")
    setFbShare(false)
  }

  function handleClose(next: boolean) {
    if (!next) resetFields()
    onOpenChange(next)
  }

  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!currentUser) {
      onRequireAuth?.()
      setError("Зар нийтлэхийн тулд эхлээд нэвтэрнэ үү.")
      return
    }
    if (type === "found") {
      if (!verificationQuestion.trim() || !correctAnswer.trim()) {
        setError("Олсон зарт баталгаажуулах асуулт, зөв хариулт заавал.")
        return
      }
    }

    const rewardNum =
      type === "lost" && rewardAmount.trim()
        ? Number(rewardAmount.replace(/\D/g, ""))
        : undefined
    const finderRewardNum =
      type === "found" && finderReward.trim()
        ? Number(finderReward.replace(/\D/g, ""))
        : undefined

    const needsPayment =
      (type === "lost" && rewardNum !== undefined && rewardNum > 0) || fbShare

    const postBase = {
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUrl: imageUrl.trim() || MOCK_IMAGE,
      authorId: currentUser.id,
      rewardAmount:
        type === "lost" && rewardNum && rewardNum > 0 ? rewardNum : undefined,
      fbShare: fbShare || undefined,
      verificationQuestion:
        type === "found" ? verificationQuestion.trim() : undefined,
      correctAnswer: type === "found" ? correctAnswer.trim() : undefined,
      finderRewardAmount:
        type === "found" && finderRewardNum && finderRewardNum > 0
          ? finderRewardNum
          : undefined,
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
    if (!currentUser) {
      onRequireAuth?.()
      setPaymentAuthError("Төлбөрийг батлахын өмнө нэвтэрнэ үү.")
      return
    }
    if (pendingId) updatePostStatus(pendingId, "published")
    resetFields()
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={postDialogContentClassName}>
        {step === "form" && (
          <>
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className={postDialogTitleClassName}>
                Шинэ зар оруулах
              </DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Мэдээллээ үнэн зөв бөглөнө үү. Төлбөр шаардлагатай тохиолдолд
                дараагийн алхамд QPay-ээр төлнө.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-5 py-1" onSubmit={handleSubmitForm}>
              <div className="grid gap-2">
                <Label className={postLabelClassName}>Төрөл</Label>
                <Select
                  value={type}
                  onValueChange={(v) => v && setType(v as PostType)}
                  disabled={!!initialType}
                >
                  <SelectTrigger className={postSelectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="lost">Хаясан</SelectItem>
                    <SelectItem value="found">Олсон</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="pt" className={postLabelClassName}>
                    Гарчиг
                  </Label>
                  <Input
                    id="pt"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Жишээ: Түрүүвчээ гээлээ"
                    className={postInputClassName}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Огноо</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={postInputClassName}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pd" className={postLabelClassName}>
                  Тайлбар
                </Label>
                <Textarea
                  id="pd"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Дэлгэрэнгүй мэдээлэл..."
                  className={postTextareaClassName}
                  required
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Ангилал</Label>
                  <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MOCK_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Байршил</Label>
                  <Select value={location} onValueChange={(v) => v && setLocation(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {MOCK_LOCATIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Verification Section */}
              {type === "found" && (
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
                        Эд зүйлийн жинхэнэ эзнийг тогтоох асуулт (заавал)
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:pl-12">
                    <div className="grid gap-2">
                      <Label htmlFor="vq" className={postLabelClassName}>
                        Асуулт *
                      </Label>
                      <Input
                        id="vq"
                        value={verificationQuestion}
                        onChange={(e) => setVerificationQuestion(e.target.value)}
                        placeholder="Жишээ: Цүнхэнд ямар өнгийн үзэг байсан бэ?"
                        className={postInputClassName}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="va" className={postLabelClassName}>
                        Хариулт (нууцлагдана) *
                      </Label>
                      <Input
                        id="va"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder="Жишээ: Улаан"
                        className={postInputClassName}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reward Section */}
              <div className="space-y-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-4 shadow-sm ring-1 ring-amber-500/10 transition-all dark:border-amber-900/40 dark:from-amber-950/25 dark:to-orange-950/15 dark:ring-amber-500/5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex items-center gap-2.5">
                    <Checkbox
                      id="hasReward"
                      checked={hasReward}
                      onCheckedChange={(c) => setHasReward(!!c)}
                      className="size-5 border-amber-400 data-[state=checked]:border-amber-600 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-600"
                    />
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-500/25">
                      <CircleDollarSign className="size-5" />
                    </div>
                  </div>
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => setHasReward(!hasReward)}
                  >
                    <h4 className="text-sm font-bold text-foreground">
                      Шагнал санал болгох
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Эд зүйлээ олсон хүнд шагнал өгөх
                    </p>
                  </div>
                </div>

                {hasReward && (
                  <div className="grid animate-in gap-3 duration-200 fade-in slide-in-from-top-2 sm:pl-12">
                    <div className="grid gap-2">
                      <Label className={postLabelClassName}>
                        Шагналын хэмжээ (₮)
                      </Label>
                      <Input
                        inputMode="numeric"
                        placeholder="50,000"
                        value={
                          type === "lost" ? rewardAmount : finderReward
                        }
                        onChange={(e) =>
                          type === "lost"
                            ? setRewardAmount(e.target.value)
                            : setFinderReward(e.target.value)
                        }
                        className={postInputClassName}
                      />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/40 bg-background/60 p-3 ring-1 ring-black/[0.04] transition-colors hover:bg-muted/40">
                      <Checkbox
                        checked={escrow}
                        onCheckedChange={(c) => setEscrow(!!c)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-xs font-bold leading-snug">
                          QPay-ээр Escrow-д төлбөр байршуулах
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          Мөнгийг системд түр байршуулж, эд зүйл олдсоны дараа
                          автоматаар шилжүүлнэ
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Facebook Share Section */}
              <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/60 to-blue-50/30 p-4 shadow-sm ring-1 ring-sky-500/10 dark:border-sky-900/40 dark:from-sky-950/25 dark:to-blue-950/15">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={fbShare}
                    onCheckedChange={(c) => setFbShare(!!c)}
                    className="mt-1 size-5 border-sky-400 data-[state=checked]:bg-sky-600"
                  />
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md shadow-sky-500/30">
                      <FacebookIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Facebook групп руу автоматаар түгээх
                      </h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        МУИС-ийн 5 группт зарыг түгээнэ (5,000₮)
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <DialogFooter
                className={cn(postDialogFooterClassName, "!mx-0 !mb-0 mt-4")}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  className={postCancelButtonClassName}
                >
                  Болих
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    type === "lost" ? postSubmitButtonLost : postSubmitButtonFound,
                  )}
                >
                  Нийтлэх
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className={postDialogTitleClassName}>
                Төлбөр төлөх
              </DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Данс руу шилжүүлсэн эсвэл QR уншуулсны дараа доорх товчийг дарна
                уу.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5">
              {paymentAuthError && (
                <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-center text-sm text-destructive">
                  {paymentAuthError}
                </p>
              )}
              <div className="mx-auto flex aspect-square w-52 max-w-full items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 text-center text-sm font-medium text-muted-foreground shadow-inner ring-4 ring-emerald-500/10 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/30 dark:ring-emerald-500/5">
                <span>
                  QPay
                  <br />
                  <span className="text-xs font-normal opacity-80">
                    (жишээ QR)
                  </span>
                </span>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/40 p-4 text-sm shadow-sm ring-1 ring-black/[0.04]">
                <p className="font-semibold text-foreground">Дансны мэдээлэл</p>
                <p className="mt-1 text-muted-foreground">
                  Хүлээн авагч: МУИС Lost&amp;Found
                </p>
                <p className="mt-2 font-mono text-base tracking-tight text-foreground">
                  MN12 3456 7890 1234 5678
                </p>
              </div>
            </div>
            <DialogFooter
              className={cn(postDialogFooterClassName, "!mx-0 !mb-0 mt-2")}
            >
              <Button
                variant="outline"
                className={postCancelButtonClassName}
                onClick={() => handleClose(false)}
              >
                Хаах
              </Button>
              <Button
                className={postSubmitButtonFound}
                onClick={handleVerifyPayment}
              >
                Төлбөр шалгах
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const MOCK_IMAGE =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80"
