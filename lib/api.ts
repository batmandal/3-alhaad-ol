import type { Post, PostStatus, User } from "@/lib/types"

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const TOKEN_KEY = "lostfound.token.v1"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

export interface ApiResult<T> {
  ok: boolean
  status?: number
  data?: T
  message?: string
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) || {}),
    }
    const token = getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
    const text = await res.text()
    const json = text ? JSON.parse(text) : {}

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: json.message || `Алдаа (${res.status})`,
      }
    }
    return { ok: true, status: res.status, data: json as T }
  } catch (err) {
    return {
      ok: false,
      message: (err as Error).message || "Сүлжээний алдаа",
    }
  }
}

/* ────────── auth ────────── */

export interface AuthResponse {
  token: string
  user: User
}

export function apiLogin(phoneOrEmail: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phoneOrEmail, password }),
  })
}

export function apiSignup(payload: {
  sisiId: string
  phone: string
  email: string
  password: string
  name: string
  facebook?: string
}) {
  return apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function apiMe() {
  return apiFetch<{ user: User }>("/api/auth/me")
}

/* ────────── posts ────────── */

export function apiListPosts(params?: {
  type?: string
  status?: string
  category?: string
  location?: string
  search?: string
}) {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "") as [
          string,
          string,
        ][]
      ).toString()
    : ""
  return apiFetch<{ data: Post[] }>(`/api/posts${qs}`)
}

export function apiCreatePost(payload: Partial<Post>) {
  return apiFetch<{ data: Post }>("/api/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function apiUpdatePostStatus(id: string, status: PostStatus) {
  return apiFetch<{ data: Post }>(`/api/posts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
