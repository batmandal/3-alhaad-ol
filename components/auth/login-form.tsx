"use client"

import * as React from "react"
import { useAppStore } from "@/lib/store/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authSwitchLinkClassName,
} from "@/components/auth/auth-classes"

export function LoginForm({
  onSuccess,
  onSwitchSignup,
}: {
  onSuccess: () => void
  onSwitchSignup: () => void
}) {
  const { login } = useAppStore()
  const [phoneOrEmail, setPhoneOrEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const r = login(phoneOrEmail, password)
    if (!r.ok) setError(r.message ?? "Алдаа гарлаа")
    else onSuccess()
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <p className="rounded-xl border border-border/40 bg-muted/40 px-3.5 py-2.5 text-sm leading-relaxed text-muted-foreground">
        Жишээ: утас <span className="font-mono text-foreground/80">99110011</span>
        , нууц үг{" "}
        <span className="font-mono text-foreground/80">admin</span> (админ)
      </p>
      <div className="grid gap-2">
        <Label htmlFor="login-id" className={authLabelClassName}>
          Утасны дугаар эсвэл имэйл
        </Label>
        <Input
          id="login-id"
          className={authInputClassName}
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
          placeholder="88112233 эсвэл name@num.edu.mn"
          autoComplete="username"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-pw" className={authLabelClassName}>
          Нууц үг
        </Label>
        <Input
          id="login-pw"
          className={authInputClassName}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className={authPrimaryButtonClassName}>
        Нэвтрэх
      </Button>
      <button
        type="button"
        className={authSwitchLinkClassName}
        onClick={onSwitchSignup}
      >
        Бүртгэл байхгүй юу? Бүртгүүлэх
      </button>
    </form>
  )
}
