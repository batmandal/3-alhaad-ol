"use client"

import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Хяналтын самбар",
  "/admin/users": "Хэрэглэгчийн удирдлага",
  "/admin/ads": "Зарын удирдлага",
  "/admin/review": "Хүсэлт хянах",
  "/admin/transactions": "Гүйлгээ & Escrow",
  "/admin/security": "Аюулгүй байдлын лог",
  "/admin/reports": "Тайлан & Аналитик",
  "/admin/settings": "Системийн тохиргоо",
}

export function AdminHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "Админ"

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{title}</h1>

      <div className="admin-header-actions">
        <div className="admin-header-search">
          <Search className="admin-header-search-icon" />
          <input
            type="text"
            placeholder="Хайх..."
            className="admin-header-search-input"
          />
        </div>

        <button className="admin-header-notif" aria-label="Мэдэгдэл">
          <Bell size={20} />
          <span className="admin-header-notif-dot" />
        </button>

        <div className="admin-header-avatar">
          <span>А</span>
        </div>
      </div>
    </header>
  )
}
