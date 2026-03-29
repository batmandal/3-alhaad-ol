"use client"

import { useState } from "react"
import { Shield, UserCog, Smartphone, Settings2 } from "lucide-react"

export default function SettingsPage() {
  const [mandatory2fa, setMandatory2fa] = useState(true)
  const [totpEnabled, setTotpEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)
  const [scanFrequency, setScanFrequency] = useState(30)

  return (
    <div className="admin-settings-page">
      {/* Roles Section */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <UserCog size={20} className="admin-settings-section-icon" />
          <h2 className="admin-settings-section-title">Эрхийн удирдлага</h2>
        </div>
        <div className="admin-settings-cards">
          <div className="admin-settings-role-card">
            <div className="admin-settings-role-badge admin-settings-role-badge--super">
              SA
            </div>
            <div>
              <h3 className="admin-settings-role-name">Super Admin</h3>
              <p className="admin-settings-role-desc">
                Бүх эрх, системийн тохиргоо, хэрэглэгч удирдлага
              </p>
            </div>
          </div>
          <div className="admin-settings-role-card">
            <div className="admin-settings-role-badge admin-settings-role-badge--mod">
              MD
            </div>
            <div>
              <h3 className="admin-settings-role-name">Moderator</h3>
              <p className="admin-settings-role-desc">
                Зар хянах, хэрэглэгч идэвхгүйжүүлэх
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2FA Section */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <Shield size={20} className="admin-settings-section-icon" />
          <h2 className="admin-settings-section-title">2FA тохиргоо</h2>
        </div>
        <div className="admin-settings-toggles">
          <label className="admin-toggle-row">
            <div>
              <span className="admin-toggle-label">Заавал 2FA</span>
              <span className="admin-toggle-desc">Бүх админд 2FA шаардах</span>
            </div>
            <button
              className={`admin-toggle ${mandatory2fa ? "admin-toggle--on" : ""}`}
              onClick={() => setMandatory2fa(!mandatory2fa)}
              role="switch"
              aria-checked={mandatory2fa}
            >
              <span className="admin-toggle-thumb" />
            </button>
          </label>
          <label className="admin-toggle-row">
            <div>
              <span className="admin-toggle-label">TOTP (Google Auth)</span>
              <span className="admin-toggle-desc">Google Authenticator-ээр код үүсгэх</span>
            </div>
            <button
              className={`admin-toggle ${totpEnabled ? "admin-toggle--on" : ""}`}
              onClick={() => setTotpEnabled(!totpEnabled)}
              role="switch"
              aria-checked={totpEnabled}
            >
              <span className="admin-toggle-thumb" />
            </button>
          </label>
          <label className="admin-toggle-row">
            <div>
              <span className="admin-toggle-label">SMS код</span>
              <span className="admin-toggle-desc">SMS-ээр нэг удаагийн код илгээх</span>
            </div>
            <button
              className={`admin-toggle ${smsEnabled ? "admin-toggle--on" : ""}`}
              onClick={() => setSmsEnabled(!smsEnabled)}
              role="switch"
              aria-checked={smsEnabled}
            >
              <span className="admin-toggle-thumb" />
            </button>
          </label>
        </div>
      </section>

      {/* System Config */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <Settings2 size={20} className="admin-settings-section-icon" />
          <h2 className="admin-settings-section-title">Системийн тохиргоо</h2>
        </div>
        <div className="admin-settings-toggles">
          <div className="admin-slider-row">
            <div>
              <span className="admin-toggle-label">Скан давтамж</span>
              <span className="admin-toggle-desc">Автомат скан хийх давтамж (минут)</span>
            </div>
            <div className="admin-slider-wrap">
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={scanFrequency}
                onChange={(e) => setScanFrequency(Number(e.target.value))}
                className="admin-slider"
              />
              <span className="admin-slider-value">{scanFrequency} мин</span>
            </div>
          </div>
          <label className="admin-toggle-row">
            <div>
              <span className="admin-toggle-label">Шинэ хэрэглэгч авто-зөвшөөрөл</span>
              <span className="admin-toggle-desc">Шинэ бүртгэлийг автоматаар идэвхжүүлэх</span>
            </div>
            <button
              className={`admin-toggle ${autoApprove ? "admin-toggle--on" : ""}`}
              onClick={() => setAutoApprove(!autoApprove)}
              role="switch"
              aria-checked={autoApprove}
            >
              <span className="admin-toggle-thumb" />
            </button>
          </label>
        </div>
      </section>
    </div>
  )
}
