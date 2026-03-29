"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/shell/site-header"
import { SiteFooter } from "@/components/shell/site-footer"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  )
}
