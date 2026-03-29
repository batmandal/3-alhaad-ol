"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code2fa, setCode2fa] = useState("")
  const [error, setError] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError("Имэйл болон нууц үг оруулна уу.")
      return
    }
    // Mock login
    router.push("/admin/dashboard")
  }

  return (
    <div className="admin-login-page">
      <form onSubmit={handleLogin} className="admin-login-card">
        <div className="admin-login-logo">M</div>
        <h1 className="admin-login-title">Админ нэвтрэх</h1>
        <p className="admin-login-subtitle">МУИС Lost & Found системийн удирдлага</p>

        {error && <div className="admin-login-error">{error}</div>}

        <div className="admin-login-field">
          <label className="admin-login-label">
            <Mail size={16} />
            Имэйл
          </label>
          <input
            type="email"
            placeholder="admin@muis.edu.mn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-login-input"
          />
        </div>

        <div className="admin-login-field">
          <label className="admin-login-label">
            <Lock size={16} />
            Нууц үг
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
          />
        </div>

        <div className="admin-login-field">
          <label className="admin-login-label">
            <ShieldCheck size={16} />
            2FA Код
          </label>
          <input
            type="text"
            placeholder="6 оронтой код"
            maxLength={6}
            value={code2fa}
            onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, ""))}
            className="admin-login-input admin-login-input--mono"
          />
        </div>

        <button type="submit" className="admin-login-btn">
          Нэвтрэх
        </button>
      </form>
    </div>
  )
}
