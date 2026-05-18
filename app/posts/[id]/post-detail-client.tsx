"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppStore } from "@/lib/store/app-store"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PostDetailClient({ id }: { id: string }) {
  const { posts, verifyFoundAnswer, getUserById } = useAppStore()
  const post = posts.find((p) => p.id === id)
  const [answer, setAnswer] = React.useState("")
  const [verified, setVerified] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  if (!post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-muted-foreground">Зар олдсонгүй.</p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 inline-flex")}>
          Нүүр рүү буцах
        </Link>
      </div>
    )
  }

  const author = getUserById(post.authorId)

  function normalizeAnswer(s: string) {
    return s.trim().toLowerCase().replace(/\s+/g, " ")
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!post) return
    if (!post.correctAnswer?.trim()) {
      setMsg("Баталгаажуулах зөв хариулт тохируулаагүй байна.")
      return
    }

    // Try backend verification first (if available)
    const verifyWithBackend = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/${id}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer }),
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.ok) {
            setVerified(true)
            setMsg("Зөв хариулт! Постын эзэнтэй холбогдох мэдээлэл доор харагдаж байна.")
            if (post.type === "found") {
              verifyFoundAnswer(id, answer)
            }
            return true
          }
        }
      } catch (error) {
        console.warn("Backend verification failed, using local verification")
      }
      return false
    }

    // Fallback to local verification
    if (post.type === "found") {
      verifyWithBackend().then((success) => {
        if (!success) {
          const r = verifyFoundAnswer(id, answer)
          if (!r.ok) {
            setMsg("Буруу хариулт байна. Дахин оролдоно уу.")
            return
          }
          setVerified(true)
          setMsg("Зөв хариулт! Постын эзэнтэй холбогдох мэдээлэл доор харагдаж байна.")
        }
      })
      return
    }

    verifyWithBackend().then((success) => {
      if (!success) {
        // FIX: Add null/undefined check before calling normalizeAnswer
        if (!post.correctAnswer || normalizeAnswer(answer) !== normalizeAnswer(post.correctAnswer)) {
          setMsg("Буруу хариулт байна. Дахин оролдоно уу.")
          return
        }
        setVerified(true)
        setMsg("Зөв хариулт! Постын эзэнтэй холбогдох мэдээлэл доор харагдаж байна.")
      }
    })
  }

  const showContact = verified && post.correctAnswer && author

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        ← Нүүр хуудас
      </Link>

      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-black/5">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 720px"
          priority
        />
      </div>
      {/* Rest of your component JSX */}
    </article>
  )
}