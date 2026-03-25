"use client"

import Link from "next/link"
import { useAppStore } from "@/lib/store/app-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function AdminPageClient() {
  const { currentUser, users, posts, withdrawals, completeWithdrawal, getUserById } =
    useAppStore()

  if (!currentUser?.isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">Энэ хуудас зөвхөн админд нээлттэй.</p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 inline-flex")}>
          Нүүр рүү
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Админ самбар</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Нүүр рүү
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">Хэрэглэгчид</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>SISI ID</TableHead>
                <TableHead>Утас</TableHead>
                <TableHead>Имэйл</TableHead>
                <TableHead>Эрх</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="font-mono text-xs">{u.sisiId}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{u.email}</TableCell>
                  <TableCell>
                    {u.isAdmin ? (
                      <Badge>Админ</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-semibold">Зарууд</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Төрөл</TableHead>
                <TableHead>Гарчиг</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead>Оруулсан</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => {
                const u = getUserById(p.authorId)
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell>{p.type === "lost" ? "Хаясан" : "Олсон"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{u?.name ?? p.authorId}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Мөнгө татах хүсэлт</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Хэрэглэгч</TableHead>
                <TableHead>Дүн</TableHead>
                <TableHead>Банк</TableHead>
                <TableHead>Данс</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Хүсэлт байхгүй.
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map((w) => {
                  const u = getUserById(w.userId)
                  return (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-xs">{w.id}</TableCell>
                      <TableCell>{u?.name ?? w.userId}</TableCell>
                      <TableCell>{w.amount.toLocaleString()} ₮</TableCell>
                      <TableCell>{w.bankName}</TableCell>
                      <TableCell className="font-mono text-xs">{w.accountNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={w.status === "completed" ? "default" : "secondary"}
                        >
                          {w.status === "completed" ? "Дууссан" : "Хүлээгдэж"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {w.status === "pending" && (
                          <Button size="sm" onClick={() => completeWithdrawal(w.id)}>
                            Батлах
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
