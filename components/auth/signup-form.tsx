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

export function SignupForm({
  onSuccess,
  onSwitchLogin,
}: {
  onSuccess: () => void
  onSwitchLogin: () => void
}) {
  const { signup } = useAppStore()
  const [sisiId, setSisiId] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [facebook, setFacebook] = React.useState("")
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const r = signup({
      sisiId,
      phone,
      email,
      password,
      facebook: facebook || undefined,
      name,
    })
    if (!r.ok) setError(r.message ?? "Алдаа гарлаа")
    else onSuccess()
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="su-sisi" className={authLabelClassName}>
          SISI ID (Оюутны код)
        </Label>
        <Input
          id="su-sisi"
          className={authInputClassName}
          value={sisiId}
          onChange={(e) => setSisiId(e.target.value)}
          placeholder="B21190123"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-phone" className={authLabelClassName}>
          Утасны дугаар
        </Label>
        <Input
          id="su-phone"
          className={authInputClassName}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="99119911"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-email" className={authLabelClassName}>
          Имэйл (Gmail)
        </Label>
        <Input
          id="su-email"
          className={authInputClassName}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="oyutan@num.edu.mn"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-fb" className={authLabelClassName}>
          Facebook данс (заавал биш)
        </Label>
        <Input
          id="su-fb"
          className={authInputClassName}
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          placeholder="facebook.com/..."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-name" className={authLabelClassName}>
          Бүтэн нэр
        </Label>
        <Input
          id="su-name"
          className={authInputClassName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Таны нэр"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-pw" className={authLabelClassName}>
          Нууц үг
        </Label>
        <Input
          id="su-pw"
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
        Бүртгүүлэх
      </Button>
      <button
        type="button"
        className={authSwitchLinkClassName}
        onClick={onSwitchLogin}
      >
        Аль хэдийн бүртгэлтэй? Нэвтрэх
      </button>
    </form>
  )
}
