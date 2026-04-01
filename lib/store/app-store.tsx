"use client"

import * as React from "react"
import {
  INITIAL_POSTS,
  INITIAL_USERS,
  INITIAL_WITHDRAWALS,
} from "@/lib/mock-data"
import type { Claim, ClaimStatus, Post, PostStatus, RewardEligibility, User, VerificationQuestion, WithdrawalRequest } from "@/lib/types"

function normalizeAnswer(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ")
}

interface AppState {
  users: User[]
  posts: Post[]
  claims: Claim[]
  withdrawals: WithdrawalRequest[]
  currentUser: User | null
  rewardEligibilities: Record<string, RewardEligibility[]>
}

interface AppContextValue extends AppState {
  login: (phoneOrEmail: string, password: string) => { ok: boolean; message?: string }
  signup: (payload: {
    sisiId: string
    phone: string
    email: string
    password: string
    facebook?: string
    name: string
  }) => { ok: boolean; message?: string }
  logout: () => void
  addPost: (post: Omit<Post, "id" | "status"> & { status?: PostStatus }) => Post
  updatePostStatus: (id: string, status: PostStatus) => void
  /** "found" зарын хуучин verify (backward compat) */
  verifyFoundAnswer: (postId: string, answer: string) => { ok: boolean; message?: string }
  /** "lost" болон "found" зарт claim (1-3 асуулт) илгээх */
  submitClaim: (postId: string, answers: string[]) => { ok: boolean; message?: string; claimId?: string }
  approveClaim: (claimId: string) => void
  rejectClaim: (claimId: string) => void
  getClaimsForPost: (postId: string) => Claim[]
  getMyClaims: () => Claim[]
  submitWithdrawal: (payload: {
    postId: string
    amount: number
    bankName: string
    accountNumber: string
  }) => void
  completeWithdrawal: (id: string) => void
  getUserById: (id: string) => User | undefined
}

const AppContext = React.createContext<AppContextValue | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = React.useState<User[]>(INITIAL_USERS)
  const [posts, setPosts] = React.useState<Post[]>(INITIAL_POSTS)
  const [claims, setClaims] = React.useState<Claim[]>([])
  const [withdrawals, setWithdrawals] = React.useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS)
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [rewardEligibilities, setRewardEligibilities] = React.useState<Record<string, RewardEligibility[]>>({})

  const login = React.useCallback(
    (phoneOrEmail: string, password: string) => {
      const q = phoneOrEmail.trim().toLowerCase()
      const u = users.find(
        (x) => x.phone === phoneOrEmail.trim() || x.email.toLowerCase() === q
      )
      if (!u || (u.password && u.password !== password)) {
        return { ok: false, message: "Утас эсвэл имэйл, нууц үг буруу байна." }
      }
      setCurrentUser(u)
      return { ok: true }
    },
    [users]
  )

  const signup = React.useCallback(
    (payload: { sisiId: string; phone: string; email: string; password: string; facebook?: string; name: string }) => {
      if (users.some((u) => u.sisiId === payload.sisiId.trim())) {
        return { ok: false, message: "Энэ SISI ID аль хэдийн бүртгэлтэй." }
      }
      if (users.some((u) => u.phone === payload.phone.trim())) {
        return { ok: false, message: "Энэ утасны дугаар аль хэдийн бүртгэлтэй." }
      }
      const nu: User = {
        id: `u-${Date.now()}`,
        sisiId: payload.sisiId.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        facebook: payload.facebook?.trim(),
        name: payload.name.trim(),
        password: payload.password,
      }
      setUsers((prev) => [...prev, nu])
      setCurrentUser(nu)
      return { ok: true }
    },
    [users]
  )

  const logout = React.useCallback(() => setCurrentUser(null), [])

  const addPost = React.useCallback(
    (post: Omit<Post, "id" | "status"> & { status?: PostStatus }) => {
      const p: Post = { ...post, id: `p-${Date.now()}`, status: post.status ?? "published" }
      setPosts((prev) => [p, ...prev])
      return p
    },
    []
  )

  const updatePostStatus = React.useCallback((id: string, status: PostStatus) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }, [])

  /** Хуучин found verify — backward compat */
  const verifyFoundAnswer = React.useCallback(
    (postId: string, answer: string) => {
      const post = posts.find((p) => p.id === postId)
      if (!post || post.type !== "found") return { ok: false, message: "Зар олдсонгүй." }
      const expected = post.correctAnswer
      if (!expected) return { ok: false, message: "Баталгаажуулалт тохируулаагүй." }
      if (normalizeAnswer(answer) !== normalizeAnswer(expected)) {
        return { ok: false, message: "Хариулт таарахгүй байна." }
      }
      if (currentUser && post.finderRewardAmount && post.finderRewardAmount > 0) {
        setRewardEligibilities((prev) => {
          const uid = currentUser.id
          const list = prev[uid] ?? []
          if (list.some((e) => e.postId === postId)) return prev
          return { ...prev, [uid]: [...list, { postId, amount: post.finderRewardAmount! }] }
        })
      }
      return { ok: true }
    },
    [posts, currentUser]
  )

  /** Шинэ claim submit: lost болон found зарт */
  const submitClaim = React.useCallback(
    (postId: string, answers: string[]) => {
      if (!currentUser) return { ok: false, message: "Эхлээд нэвтэрнэ үү." }
      const post = posts.find((p) => p.id === postId)
      if (!post) return { ok: false, message: "Зар олдсонгүй." }
      if (post.authorId === currentUser.id) return { ok: false, message: "Өөрийн зарт хүсэлт илгээх боломжгүй." }

      // Аль хэдийн pending эсвэл approved claim байгаа эсэх
      const existing = claims.find(
        (c) => c.postId === postId && c.claimantId === currentUser.id && (c.status === "pending" || c.status === "approved")
      )
      if (existing) return { ok: false, message: "Та аль хэдийн хүсэлт илгээсэн байна." }

      // Асуултууд авах
      const questions: VerificationQuestion[] = post.verificationQuestions?.length
        ? post.verificationQuestions
        : post.verificationQuestion && post.correctAnswer
        ? [{ question: post.verificationQuestion, answer: post.correctAnswer }]
        : []

      if (!questions.length) return { ok: false, message: "Баталгаажуулах асуулт тохируулаагүй байна." }

      const answersCorrect = questions.map((q, i) =>
        normalizeAnswer(answers[i] ?? "") === normalizeAnswer(q.answer)
      )

      const claim: Claim = {
        id: `cl-${Date.now()}`,
        postId,
        postTitle: post.title,
        postType: post.type,
        claimantId: currentUser.id,
        claimantName: currentUser.name,
        claimantEmail: currentUser.email,
        claimantPhone: currentUser.phone,
        answers,
        answersCorrect,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      setClaims((prev) => [claim, ...prev])
      return { ok: true, claimId: claim.id }
    },
    [currentUser, posts, claims]
  )

  const approveClaim = React.useCallback((claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) return { ...c, status: "approved" as ClaimStatus }
        // Нэг постын бусад pending claim-ийг reject хийнэ
        const approved = prev.find((x) => x.id === claimId)
        if (approved && c.postId === approved.postId && c.status === "pending") {
          return { ...c, status: "rejected" as ClaimStatus }
        }
        return c
      })
    )
    // Reward eligibility нэмэх
    setClaims((prev) => {
      const claim = prev.find((c) => c.id === claimId)
      if (!claim) return prev
      return prev
    })
    // separate effect for reward
    setClaims((prev) => {
      const claim = prev.find((c) => c.id === claimId)
      if (!claim) return prev
      setPosts((pp) => {
        const post = pp.find((p) => p.id === claim.postId)
        if (post) {
          const rewardAmt = post.type === "lost" ? post.rewardAmount : post.finderRewardAmount
          if (rewardAmt && rewardAmt > 0) {
            setRewardEligibilities((re) => {
              const uid = claim.claimantId
              const list = re[uid] ?? []
              if (list.some((e) => e.postId === claim.postId)) return re
              return { ...re, [uid]: [...list, { postId: claim.postId, amount: rewardAmt }] }
            })
          }
        }
        return pp
      })
      return prev
    })
  }, [])

  const rejectClaim = React.useCallback((claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "rejected" as ClaimStatus } : c))
    )
  }, [])

  const getClaimsForPost = React.useCallback(
    (postId: string) => claims.filter((c) => c.postId === postId),
    [claims]
  )

  const getMyClaims = React.useCallback(
    () => (currentUser ? claims.filter((c) => c.claimantId === currentUser.id) : []),
    [claims, currentUser]
  )

  const submitWithdrawal = React.useCallback(
    (payload: { postId: string; amount: number; bankName: string; accountNumber: string }) => {
      if (!currentUser) return
      const row: WithdrawalRequest = {
        id: `w-${Date.now()}`,
        userId: currentUser.id,
        postId: payload.postId,
        amount: payload.amount,
        bankName: payload.bankName.trim(),
        accountNumber: payload.accountNumber.trim(),
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setWithdrawals((prev) => [...prev, row])
      setRewardEligibilities((prev) => {
        const list = prev[currentUser.id] ?? []
        return { ...prev, [currentUser.id]: list.filter((e) => e.postId !== payload.postId) }
      })
    },
    [currentUser]
  )

  const completeWithdrawal = React.useCallback((id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "completed" as const } : w))
    )
  }, [])

  const getUserById = React.useCallback((id: string) => users.find((u) => u.id === id), [users])

  const value = React.useMemo<AppContextValue>(
    () => ({
      users, posts, claims, withdrawals, currentUser, rewardEligibilities,
      login, signup, logout, addPost, updatePostStatus,
      verifyFoundAnswer, submitClaim, approveClaim, rejectClaim,
      getClaimsForPost, getMyClaims,
      submitWithdrawal, completeWithdrawal, getUserById,
    }),
    [users, posts, claims, withdrawals, currentUser, rewardEligibilities, login, signup, logout, addPost, updatePostStatus, verifyFoundAnswer, submitClaim, approveClaim, rejectClaim, getClaimsForPost, getMyClaims, submitWithdrawal, completeWithdrawal, getUserById]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
