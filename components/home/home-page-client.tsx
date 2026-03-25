"use client"

import * as React from "react"
import type { PostType } from "@/lib/types"
import { HeroSection } from "@/components/home/hero-section"
import { FeedSection } from "@/components/home/feed-section"
import { CreatePostDialog } from "@/components/home/create-post-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import {
  authDialogContentClassName,
  authDialogTitleClassName,
} from "@/components/auth/auth-classes"
import { cn } from "@/lib/utils"

export function HomePageClient() {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [createType, setCreateType] = React.useState<PostType | null>(null)
  const [gateOpen, setGateOpen] = React.useState(false)
  const [gateMode, setGateMode] = React.useState<"login" | "signup">("login")

  function openCreate(type: PostType) {
    setCreateType(type)
    setCreateOpen(true)
  }

  function requireAuthForPost() {
    setGateMode("login")
    setGateOpen(true)
  }

  function onAuthedForPost() {
    setGateOpen(false)
  }

  return (
    <>
      <HeroSection onLost={() => openCreate("lost")} onFound={() => openCreate("found")} />
      <FeedSection />
      <CreatePostDialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o)
          if (!o) setCreateType(null)
        }}
        initialType={createType}
        onRequireAuth={requireAuthForPost}
      />
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className={cn("z-[60]", authDialogContentClassName)}>
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className={authDialogTitleClassName}>
              {gateMode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
            </DialogTitle>
          </DialogHeader>
          <p className="rounded-xl border border-border/40 bg-muted/35 px-3.5 py-2.5 text-sm leading-relaxed text-muted-foreground">
            Зар нийтлэхийн тулд нэвтэрнэ үү. Нэвтэрсний дараа зарын цонхонд дахин
            &quot;Нийтлэх&quot; эсвэл &quot;Төлбөр шалгах&quot; товчийг дарна уу.
          </p>
          {gateMode === "login" ? (
            <LoginForm
              onSuccess={onAuthedForPost}
              onSwitchSignup={() => setGateMode("signup")}
            />
          ) : (
            <SignupForm
              onSuccess={onAuthedForPost}
              onSwitchLogin={() => setGateMode("login")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
