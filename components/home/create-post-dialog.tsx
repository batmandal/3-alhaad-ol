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
import { HelpCircle, ImagePlus } from "lucide-react"

type Step = "form" | "payment" | "success"

const PAYMENT_AMOUNT = 1000
const QPAY_QR_SRC = "/payment/qpay-qr.png"

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
  const { currentUser, addPost } = useAppStore()

  const [step, setStep] = React.useState<Step>("form")
  const [error, setError] = React.useState<string | null>(null)

  const [type, setType] = React.useState<PostType>("lost")
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<string>(MOCK_CATEGORIES[0])
  const [location, setLocation] = React.useState<string>(MOCK_LOCATIONS[0])
  const [date, setDate] = React.useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [verificationQuestion, setVerificationQuestion] = React.useState("")
  const [correctAnswer, setCorrectAnswer] = React.useState("")

  const [selectedImage, setSelectedImage] = React.useState("")
  const [imageError, setImageError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return

    setStep("form")
    setError(null)
    setImageError(null)

    if (initialType) {
      setType(initialType)
    }
  }, [open, initialType])

  function resetFields() {
    setTitle("")
    setDescription("")
    setCategory(MOCK_CATEGORIES[0])
    setLocation(MOCK_LOCATIONS[0])
    setDate(new Date().toISOString().slice(0, 10))
    setVerificationQuestion("")
    setCorrectAnswer("")
    setSelectedImage("")
    setImageError(null)
    setError(null)
  }

  function handleClose(next: boolean) {
    if (!next) {
      resetFields()
    }

    onOpenChange(next)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setSelectedImage("")
      setImageError("Зөвхөн зураг файл оруулна уу.")
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setSelectedImage("")
      setImageError("Зураг 3MB-аас бага байх ёстой.")
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
      setImageError(null)
    }

    reader.readAsDataURL(file)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError(null)
    setImageError(null)

    if (!currentUser) {
      onRequireAuth?.()
      setError("Зар оруулахын тулд нэвтэрнэ үү.")
      return
    }

    if (!title.trim() || !description.trim()) {
      setError("Гарчиг болон тайлбар заавал бөглөнө үү.")
      return
    }

    if (!selectedImage) {
      setImageError("Зар оруулахын тулд зураг сонгоно уу.")
      return
    }

    if (!verificationQuestion.trim() || !correctAnswer.trim()) {
      setError("Баталгаажуулах асуулт, зөв хариулт заавал.")
      return
    }

    addPost({
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      date,
      imageUrl: selectedImage,
      authorId: currentUser.id,
      verificationQuestion: verificationQuestion.trim(),
      correctAnswer: correctAnswer.trim(),
      status: "pending_payment",
    })

    setStep("payment")
  }

  function submitPaymentRequest() {
    setStep("success")
  }

  function finishSuccess() {
    resetFields()
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={postDialogContentClassName}>
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className={postDialogTitleClassName}>
                Шинэ зар оруулах
              </DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Зураг болон баталгаажуулах асуулт заавал бөглөнө үү.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={onSubmit}>
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
                  <SelectContent>
                    <SelectItem value="lost">Хаясан</SelectItem>
                    <SelectItem value="found">Олсон</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className={postLabelClassName}>Гарчиг</Label>
                <Input
                  className={postInputClassName}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className={postLabelClassName}>Тайлбар</Label>
                <Textarea
                  className={postTextareaClassName}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <ImagePlus className="size-5 text-muted-foreground" />
                  <Label className={postLabelClassName}>Зураг *</Label>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  className={postInputClassName}
                  onChange={handleImageChange}
                />

                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP зэрэг зураг оруулж болно. Хэмжээ 3MB-аас бага
                  байна.
                </p>

                {imageError && (
                  <p className="text-sm text-destructive">{imageError}</p>
                )}

                {selectedImage && (
                  <div className="overflow-hidden rounded-2xl border border-border bg-background">
                    <img
                      src={selectedImage}
                      alt="Сонгосон зураг"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Ангилал</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => v && setCategory(v)}
                  >
                    <SelectTrigger className={postSelectTriggerClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label className={postLabelClassName}>Байршил</Label>
                  <Select
                    value={location}
                    onValueChange={(v) => v && setLocation(v)}
                  >
                    <SelectTrigger className={postSelectTriggerClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className={postLabelClassName}>Огноо</Label>
                <Input
                  type="date"
                  className={postInputClassName}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
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
                      {type === "found" ? "Эзнийг" : "Олсон хүнийг"} тогтоох
                      асуулт заавал оруулна.
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

              <DialogFooter
                className={cn(postDialogFooterClassName, "mx-0! mb-0!")}
              >
                <Button
                  type="button"
                  variant="outline"
                  className={postCancelButtonClassName}
                  onClick={() => handleClose(false)}
                >
                  Болих
                </Button>

                <Button
                  type="submit"
                  className={
                    type === "lost" ? postSubmitButtonLost : postSubmitButtonFound
                  }
                >
                  Нийтлэх
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : step === "payment" ? (
          <>
            <DialogHeader>
              <DialogTitle className={postDialogTitleClassName}>
                Төлбөр төлөх
              </DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Доорх QR кодоор төлбөрөө шилжүүлээд “Би төлбөрөө төлсөн” товчийг
                дарна уу.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">Төлөх дүн</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {PAYMENT_AMOUNT.toLocaleString()}₮
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                  <img
                    src={QPAY_QR_SRC}
                    alt="QPay QR"
                    className="h-56 w-56 rounded-xl border border-border bg-white object-contain p-2"
                  />

                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      QPay / банкны QR
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Өөрийн банкны апп-аар QR кодыг уншуулж төлнө.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Анхааруулга</p>
                <p className="mt-1">
                  Төлбөр хийсний дараа таны зар шууд нийтлэгдэхгүй. Admin
                  төлбөрийг шалгаж баталгаажуулсны дараа нийтлэгдэнэ.
                </p>
              </div>
            </div>

            <DialogFooter
              className={cn(postDialogFooterClassName, "mx-0! mb-0!")}
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
                onClick={submitPaymentRequest}
              >
                Би төлбөрөө төлсөн
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className={postDialogTitleClassName}>
                Зар амжилттай орууллаа
              </DialogTitle>
              <DialogDescription className={postDialogDescriptionClassName}>
                Таны зар admin шалгах хэсэг рүү илгээгдлээ.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-900">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
                ✓
              </div>

              <p className="text-base font-semibold">
                Зар амжилттай бүртгэгдлээ
              </p>

              <p className="mt-2 text-sm">
                Admin төлбөрийг шалгаж баталгаажуулсны дараа таны зар нийтэд
                харагдах болно.
              </p>
            </div>

            <DialogFooter
              className={cn(postDialogFooterClassName, "mx-0! mb-0!")}
            >
              <Button className={postSubmitButtonFound} onClick={finishSuccess}>
                Дуусгах
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}