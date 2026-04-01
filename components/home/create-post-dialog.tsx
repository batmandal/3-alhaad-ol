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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

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
  onRequireAuth?: () => void
}) {
  const { currentUser, addPost, updatePostStatus } = useAppStore()
  const [step, setStep] = React.useState<Step>("form")
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [type, setType] = React.useState<PostType>("lost")
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<string>(MOCK_CATEGORIES[0])
  const [location, setLocation] = React.useState<string>(MOCK_LOCATIONS[0])
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [verificationQuestion, setVerificationQuestion] = React.useState("")
  const [correctAnswer, setCorrectAnswer] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setStep("form")
    setPendingId(null)
    setError(null)
    if (initialType) setType(initialType)
  }, [open, initialType])

  function resetFields() {
    setTitle("")
    setDescription("")
    setCategory(MOCK_CATEGORIES[0])
    setLocation(MOCK_LOCATIONS[0])
    setDate(new Date().toISOString().slice(0, 10))
    setVerificationQuestion("")
    setCorrectAnswer("")
  }

  function handleClose(next: boolean) {
    if (!next) resetFields()
    onOpenChange(next)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!currentUser) {
      onRequireAuth?.()
      setError("Зар оруулахын тулд нэвтэрнэ үү.")
      return
    }
    if (!verificationQuestion.trim() || !correctAnswer.trim()) {
      setError("Баталгаажуулах асуулт, зөв хариулт заавал.")
      return
    }

    const created = addPost({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUrl: MOCK_IMAGE,
      authorId: currentUser.id,
      verificationQuestion: verificationQuestion.trim(),
      correctAnswer: correctAnswer.trim(),
      status: "pending_payment",
    })
    setPendingId(created.id)
    setStep("payment")
  }

  function verifyPayment() {
    if (pendingId) updatePostStatus(pendingId, "published")
    resetFields()
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={postDialogContentClassName}>
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className={postDialogTitleClassName}>Шинэ зар оруулах</DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Баталгаажуулах асуулт заавал бөглөнө үү.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label className={postLabelClassName}>Төрөл</Label>
                <Select value={type} onValueChange={(v) => v && setType(v as PostType)} disabled={!!initialType}>
                  <SelectTrigger className={postSelectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Хаясан</SelectItem>
                    <SelectItem value="found">Олсон</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className={postLabelClassName}>Гарчиг</Label>
                <Input className={postInputClassName} value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label className={postLabelClassName}>Тайлбар</Label>
                <Textarea className={postTextareaClassName} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Ангилал</Label>
                  <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}><SelectValue /></SelectTrigger>
                    <SelectContent>{MOCK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Байршил</Label>
                  <Select value={location} onValueChange={(v) => v && setLocation(v)}>
                    <SelectTrigger className={postSelectTriggerClassName}><SelectValue /></SelectTrigger>
                    <SelectContent>{MOCK_LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Огноо</Label>
                  <Input type="date" className={postInputClassName} value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
              </div>
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
                </div>

                <div className="grid gap-3 sm:pl-12">
                  <div className="grid gap-2">
                    <Label className={postLabelClassName}>Асуулт *</Label>
                    <Input
                      className={postInputClassName}
                      value={verificationQuestion}
                      onChange={(e) => setVerificationQuestion(e.target.value)}
                      placeholder="Жишээ: Device нэр нь юу вэ?"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className={postLabelClassName}>Зөв хариулт *</Label>
                    <Input
                      className={postInputClassName}
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Жишээ: Boldiin AirPods"
                      required
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter className={cn(postDialogFooterClassName, "mx-0! mb-0!")}>
                <Button type="button" variant="outline" className={postCancelButtonClassName} onClick={() => handleClose(false)}>
                  Болих
                </Button>
                <Button type="submit" className={type === "lost" ? postSubmitButtonLost : postSubmitButtonFound}>
                  Нийтлэх
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className={postDialogTitleClassName}>Төлбөр төлөх</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">QPay төлбөр хийсний дараа нийтлэгдэнэ.</p>
            <DialogFooter className={cn(postDialogFooterClassName, "mx-0! mb-0!")}>
              <Button variant="outline" className={postCancelButtonClassName} onClick={() => handleClose(false)}>
                Хаах
              </Button>
              <Button className={postSubmitButtonFound} onClick={verifyPayment}>
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
