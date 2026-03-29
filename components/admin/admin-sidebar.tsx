"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Megaphone,
  ClipboardCheck,
  Wallet,
  ShieldAlert,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Хяналтын самбар", icon: LayoutDashboard },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: Users },
  { href: "/admin/ads", label: "Зарын удирдлага", icon: Megaphone },
  { href: "/admin/review", label: "Хүсэлт хянах", icon: ClipboardCheck },
  { href: "/admin/transactions", label: "Гүйлгээ & Escrow", icon: Wallet },
  { href: "/admin/security", label: "Аюулгүй байдал", icon: ShieldAlert },
  { href: "/admin/reports", label: "Тайлан & Аналитик", icon: BarChart3 },
  { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <span className="admin-sidebar-logo-icon">M</span>
        <span className="admin-sidebar-logo-text">MUIS Admin</span>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("admin-sidebar-link", isActive && "active")}
            >
              <item.icon className="admin-sidebar-link-icon" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-link">
          <ChevronLeft className="admin-sidebar-link-icon" />
          <span>Нүүр хуудас</span>
        </Link>
        <Link href="/admin/login" className="admin-sidebar-link">
          <LogOut className="admin-sidebar-link-icon" />
          <span>Гарах</span>
        </Link>
      </div>
    </aside>
  )
}
